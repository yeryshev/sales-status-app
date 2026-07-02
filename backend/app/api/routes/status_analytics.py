from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.auth_config import current_superuser
from app.core.db import get_async_session
from app.models import Status, StatusHistory, User
from app.schemas import (
    StatusAnalyticsRequest,
    StatusAnalyticsResponse,
    StatusHistoryRead,
)
from app.status_history_utils import (
    StatusHistorySlice,
    deduplicate_status_history_records,
)

router = APIRouter()


def parse_query_params(
    user_id: int | None = Query(None, description="ID пользователя"),
    start_date: str | None = Query(None, description="Начальная дата"),
    end_date: str | None = Query(None, description="Конечная дата"),
    limit: int = Query(100, description="Лимит записей"),
    department_id: str | None = Query(None, description="ID отдела"),
) -> dict[str, int | datetime | str | None]:
    """Парсинг query параметров с валидацией дат"""
    parsed_start_date = None
    parsed_end_date = None

    if start_date:
        try:
            # Если дата уже содержит время, используем как есть
            if "T" in start_date or " " in start_date:
                parsed_start_date = datetime.fromisoformat(start_date)
            else:
                # Если только дата, добавляем начало дня
                parsed_start_date = datetime.fromisoformat(start_date + "T00:00:00")
        except ValueError:
            raise HTTPException(
                status_code=400, detail=f"Неверный формат даты: {start_date}"
            )

    if end_date:
        try:
            # Если дата уже содержит время, используем как есть
            if "T" in end_date or " " in end_date:
                parsed_end_date = datetime.fromisoformat(end_date)
            else:
                # Если только дата, добавляем конец дня
                parsed_end_date = datetime.fromisoformat(end_date + "T23:59:59.999999")
        except ValueError:
            raise HTTPException(
                status_code=400, detail=f"Неверный формат даты: {end_date}"
            )

    return {
        "user_id": user_id,
        "start_date": parsed_start_date,
        "end_date": parsed_end_date,
        "limit": limit,
        "department_id": department_id,
    }


@router.get("/status-history", response_model=list[StatusHistoryRead])
async def get_status_history(
    query_params: dict = Depends(parse_query_params),
    session: AsyncSession = Depends(get_async_session),
    _current_user: User = Depends(current_superuser),
):
    """Получить историю изменений статусов (только для суперпользователей)"""
    try:
        query = (
            select(StatusHistory)
            .options(
                selectinload(StatusHistory.user),
                selectinload(StatusHistory.old_status),
                selectinload(StatusHistory.new_status),
            )
            .order_by(StatusHistory.start_time.desc())
            .limit(query_params["limit"])
        )

        if query_params["user_id"]:
            query = query.where(StatusHistory.user_id == query_params["user_id"])
        if query_params["start_date"]:
            query = query.where(StatusHistory.start_time >= query_params["start_date"])
        if query_params["end_date"]:
            query = query.where(StatusHistory.start_time <= query_params["end_date"])

        # Фильтрация по отделу
        # По умолчанию показываем только пользователей с флагами отделов
        # Если указан конкретный отдел, фильтруем по нему
        department_filter = None
        if query_params["department_id"]:
            # Фильтрация по конкретному отделу
            if query_params["department_id"] == "managers":
                department_filter = User.is_manager.is_(True)
            elif query_params["department_id"] == "account_managers":
                department_filter = User.is_account_manager.is_(True)
            elif query_params["department_id"] == "customer_care":
                department_filter = User.is_cc_manager.is_(True)
        else:
            # По умолчанию - все пользователи с хотя бы одним флагом отдела
            department_filter = or_(
                User.is_manager.is_(True),
                User.is_account_manager.is_(True),
                User.is_cc_manager.is_(True),
            )

        if department_filter is not None:
            department_users_query = select(User.id).where(department_filter)
            department_users_result = await session.execute(department_users_query)
            department_user_ids = list(department_users_result.scalars().all())

            if department_user_ids:
                query = query.where(StatusHistory.user_id.in_(department_user_ids))
            else:
                # Если нет пользователей в отделе, возвращаем пустой результат
                return []

        result = await session.execute(query)
        history_records = deduplicate_status_history_records(
            list(result.scalars().all())
        )

        return [
            StatusHistoryRead(
                id=record.id,
                user_id=record.user_id,
                old_status_id=record.old_status_id,
                new_status_id=record.new_status_id,
                start_time=record.start_time,
                end_time=record.end_time,
                duration_seconds=record.duration_seconds,
                created_at=record.created_at,
            )
            for record in history_records
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Ошибка получения истории: {str(e)}"
        )


@router.post("/status-analytics", response_model=list[StatusAnalyticsResponse])
async def get_status_analytics(
    request: StatusAnalyticsRequest,
    session: AsyncSession = Depends(get_async_session),
    _current_user: User = Depends(current_superuser),
):
    """Получить аналитику по статусам (только для суперпользователей)"""
    try:
        # Логируем полученные параметры запроса
        # Исправляем end_date, если он имеет время 00:00:00
        if (
            request.end_date.hour == 0
            and request.end_date.minute == 0
            and request.end_date.second == 0
        ):
            request.end_date = request.end_date.replace(
                hour=23, minute=59, second=59, microsecond=999999
            )

        # Получаем текущее время для расчета активных статусов (без timezone, так как в БД используется TIMESTAMP WITHOUT TIME ZONE)
        current_time = datetime.now(UTC).replace(tzinfo=None)

        # Базовый запрос для получения данных - показываем каждую запись истории отдельно
        # Включаем записи, которые:
        # 1. Начались в выбранном периоде ИЛИ
        # 2. Начались до периода, но не закончились (продолжаются в период) ИЛИ
        # 3. Начались до периода, но закончились в период или позже
        query = (
            select(
                StatusHistory.id,
                StatusHistory.user_id,
                StatusHistory.new_status_id,
                StatusHistory.start_time,
                StatusHistory.end_time,
                func.coalesce(
                    StatusHistory.duration_seconds,
                    func.extract("epoch", current_time - StatusHistory.start_time),
                ).label("duration_seconds"),
            )
            .where(
                # Записи, которые пересекаются с выбранным периодом
                or_(
                    and_(
                        StatusHistory.start_time >= request.start_date,
                        StatusHistory.start_time <= request.end_date,
                    ),
                    and_(
                        StatusHistory.start_time < request.start_date,
                        or_(
                            StatusHistory.end_time.is_(None),  # Активные статусы
                            StatusHistory.end_time
                            >= request.start_date,  # Завершенные, но пересекающиеся
                        ),
                    ),
                )
            )
            .order_by(StatusHistory.start_time.desc(), StatusHistory.user_id)
        )

        if request.user_id:
            query = query.where(StatusHistory.user_id == request.user_id)
        if request.status_id:
            query = query.where(StatusHistory.new_status_id == request.status_id)

        # Фильтрация по отделу
        # По умолчанию показываем только пользователей с флагами отделов
        # Если указан конкретный отдел, фильтруем по нему
        department_filter = None
        if request.department_id:
            # Фильтрация по конкретному отделу
            if request.department_id == "managers":
                department_filter = User.is_manager.is_(True)
            elif request.department_id == "account_managers":
                department_filter = User.is_account_manager.is_(True)
            elif request.department_id == "customer_care":
                department_filter = User.is_cc_manager.is_(True)
        else:
            # По умолчанию - все пользователи с хотя бы одним флагом отдела
            department_filter = or_(
                User.is_manager.is_(True),
                User.is_account_manager.is_(True),
                User.is_cc_manager.is_(True),
            )

        if department_filter is not None:
            department_users_query = select(User.id).where(department_filter)
            department_users_result = await session.execute(department_users_query)
            department_user_ids = list(department_users_result.scalars().all())

            if department_user_ids:
                query = query.where(StatusHistory.user_id.in_(department_user_ids))
            else:
                # Если нет пользователей в отделе, возвращаем пустой результат
                return []

        result = await session.execute(query)
        rows = result.all()
        deduped_ids = {
            row.id
            for row in deduplicate_status_history_records(
                [
                    StatusHistorySlice(
                        id=row.id,
                        user_id=row.user_id,
                        new_status_id=row.new_status_id,
                        start_time=row.start_time,
                        end_time=row.end_time,
                        duration_seconds=(
                            int(row.duration_seconds)
                            if row.duration_seconds is not None
                            else None
                        ),
                    )
                    for row in rows
                ]
            )
        }
        analytics_data = [row for row in rows if row.id in deduped_ids]

        # Получаем информацию о пользователях и статусах
        user_ids = list({row.user_id for row in analytics_data})
        status_ids = list({row.new_status_id for row in analytics_data})

        users_query = select(User).where(User.id.in_(user_ids))
        users_result = await session.execute(users_query)
        users = {user.id: user for user in users_result.scalars().all()}

        statuses_query = select(Status).where(Status.id.in_(status_ids))
        statuses_result = await session.execute(statuses_query)
        statuses = {status.id: status for status in statuses_result.scalars().all()}

        # Формируем ответ - каждая запись истории статусов становится отдельной записью в таблице
        responses = []
        for row in analytics_data:
            user = users.get(row.user_id)
            status = statuses.get(row.new_status_id)

            if not user or not status:
                continue

            duration_seconds = int(row.duration_seconds or 0)
            duration_hours = round(duration_seconds / 3600, 2)
            duration_minutes = round(duration_seconds / 60, 2)

            # Определяем, является ли статус активным
            # is_active = row.end_time is None  # Пока не используется
            status_title = status.title

            # Для отдельных записей не нужны периоды
            periods = []

            responses.append(
                StatusAnalyticsResponse(
                    user_id=row.user_id,
                    user_name=f"{user.first_name or ''} {user.second_name or ''}".strip(),
                    status_id=row.new_status_id,
                    status_title=status_title,
                    start_time=row.start_time.replace(tzinfo=UTC),  # Явно указываем UTC
                    end_time=(
                        row.end_time.replace(tzinfo=UTC) if row.end_time else None
                    ),  # Явно указываем UTC
                    total_duration_seconds=duration_seconds,
                    total_duration_minutes=duration_minutes,
                    total_duration_hours=duration_hours,
                    percentage=0,  # Не рассчитываем процент для отдельных записей
                    periods=periods,
                )
            )

        # Данные уже отсортированы в запросе к БД (самые новые сначала)
        return responses

    except Exception as e:
        # В случае ошибки, делаем rollback
        try:
            await session.rollback()
        except Exception:
            pass
        # Логируем полную информацию об ошибке для отладки
        import traceback

        error_traceback = traceback.format_exc()
        print(f"Ошибка получения аналитики: {str(e)}")
        print(f"Traceback: {error_traceback}")
        raise HTTPException(
            status_code=500, detail=f"Ошибка получения аналитики: {str(e)}"
        )


async def _get_periods_data(
    session: AsyncSession,
    user_id: int,
    status_id: int,
    start_date: datetime,
    end_date: datetime,
    period_type: str,
) -> list[dict[str, str | int]]:
    """Получить данные по периодам для детализации"""
    try:
        # Валидируем и нормализуем period_type для PostgreSQL
        valid_period_types = {"day": "day", "week": "week", "month": "month"}

        if period_type not in valid_period_types:
            period_type = "day"

        # Используем валидный period_type для PostgreSQL
        postgres_period_type = valid_period_types[period_type]

        # Получаем текущее время для расчета активных статусов (без timezone, так как в БД используется TIMESTAMP WITHOUT TIME ZONE)
        current_time = datetime.now(UTC).replace(tzinfo=None)

        query = (
            select(
                func.date_trunc(postgres_period_type, StatusHistory.start_time).label(
                    "period"
                ),
                func.sum(
                    func.coalesce(
                        StatusHistory.duration_seconds,
                        func.extract("epoch", current_time - StatusHistory.start_time),
                    )
                ).label("duration"),
                func.count(StatusHistory.id).label("changes"),
            )
            .where(
                StatusHistory.user_id == user_id,
                StatusHistory.new_status_id == status_id,
                # Записи, которые пересекаются с выбранным периодом
                (
                    (StatusHistory.start_time >= start_date)
                    & (StatusHistory.start_time <= end_date)
                )
                | (
                    (StatusHistory.start_time < start_date)
                    & (
                        StatusHistory.end_time.is_(None)  # Активные статусы
                        | (
                            StatusHistory.end_time >= start_date
                        )  # Завершенные, но пересекающиеся
                    )
                ),
            )
            .group_by(
                func.date_trunc(postgres_period_type, StatusHistory.start_time),
                StatusHistory.start_time,  # Добавляем start_time в GROUP BY
            )
            .order_by(func.date_trunc(postgres_period_type, StatusHistory.start_time))
        )

        result = await session.execute(query)
        periods_data = result.all()

        return [
            {
                "period": period.period.isoformat() if period.period else None,
                "duration_seconds": int(period.duration or 0),
                "duration_minutes": round((period.duration or 0) / 60, 2),
                "duration_hours": round((period.duration or 0) / 3600, 2),
                "changes_count": period.changes or 0,
            }
            for period in periods_data
        ]
    except Exception as e:
        print(f"Error getting periods data: {str(e)}")
        # В случае ошибки транзакции, делаем rollback и возвращаем пустой список
        try:
            await session.rollback()
        except Exception:
            pass
        return []


@router.get("/users", response_model=list[dict[str, str | int | bool]])
async def get_users_for_analytics(
    session: AsyncSession = Depends(get_async_session),
    _current_user: User = Depends(current_superuser),
):
    """Получить список пользователей для фильтрации аналитики (только для суперпользователей)
    Возвращает только пользователей с хотя бы одним флагом отдела (isManager, isAccountManager, isCcManager)
    """
    try:
        query = (
            select(
                User.id,
                User.first_name,
                User.second_name,
                User.email,
                User.is_manager,
                User.is_account_manager,
                User.is_cc_manager,
            )
            .where(
                # Фильтруем только пользователей, у которых хотя бы один флаг отдела = True
                (User.is_manager.is_(True))
                | (User.is_account_manager.is_(True))
                | (User.is_cc_manager.is_(True))
            )
            .order_by(User.first_name, User.second_name)
        )
        result = await session.execute(query)
        users = result.all()

        return [
            {
                "id": user.id,
                "name": f"{user.first_name or ''} {user.second_name or ''}".strip(),
                "email": user.email,
                "isManager": user.is_manager or False,
                "isAccountManager": user.is_account_manager or False,
                "isCcManager": user.is_cc_manager or False,
            }
            for user in users
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Ошибка получения пользователей: {str(e)}"
        )


@router.get("/statuses", response_model=list[dict[str, str | int]])
async def get_statuses_for_analytics(
    session: AsyncSession = Depends(get_async_session),
    _current_user: User = Depends(current_superuser),
):
    """Получить список статусов для фильтрации аналитики (только для суперпользователей)"""
    try:
        query = select(Status.id, Status.title).order_by(
            Status.priority.desc(), Status.title
        )
        result = await session.execute(query)
        statuses = result.all()

        return [
            {
                "id": status.id,
                "title": status.title,
            }
            for status in statuses
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Ошибка получения статусов: {str(e)}"
        )


@router.get("/date-range", response_model=dict)
async def get_date_range(
    session: AsyncSession = Depends(get_async_session),
    _current_user: User = Depends(current_superuser),
):
    """Получить минимальную и максимальную даты из истории статусов (только для суперпользователей)"""
    try:
        query = select(
            func.min(StatusHistory.start_time).label("min_date"),
            func.max(StatusHistory.start_time).label("max_date"),
        )
        result = await session.execute(query)
        date_range = result.first()

        return {
            "minDate": date_range.min_date.isoformat() if date_range.min_date else None,
            "maxDate": date_range.max_date.isoformat() if date_range.max_date else None,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Ошибка получения диапазона дат: {str(e)}"
        )
