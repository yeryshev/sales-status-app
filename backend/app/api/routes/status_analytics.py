from datetime import datetime, timedelta
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.auth_config import current_superuser
from app.core.db import get_async_session
from app.crud import StatusHistoryRepository
from app.models import Status, StatusHistory, User
from app.schemas import StatusAnalyticsRequest, StatusAnalyticsResponse, StatusHistoryRead, StatusHistoryQuery

router = APIRouter()


def parse_query_params(
    user_id: int | None = Query(None, description="ID пользователя"),
    start_date: str | None = Query(None, description="Начальная дата"),
    end_date: str | None = Query(None, description="Конечная дата"),
    limit: int = Query(100, description="Лимит записей"),
):
    """Парсинг query параметров с валидацией дат"""
    parsed_start_date = None
    parsed_end_date = None
    
    if start_date:
        try:
            # Если дата уже содержит время, используем как есть
            if 'T' in start_date or ' ' in start_date:
                parsed_start_date = datetime.fromisoformat(start_date)
            else:
                # Если только дата, добавляем начало дня
                parsed_start_date = datetime.fromisoformat(start_date + 'T00:00:00')
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Неверный формат даты: {start_date}")
    
    if end_date:
        try:
            # Если дата уже содержит время, используем как есть
            if 'T' in end_date or ' ' in end_date:
                parsed_end_date = datetime.fromisoformat(end_date)
            else:
                # Если только дата, добавляем конец дня
                parsed_end_date = datetime.fromisoformat(end_date + 'T23:59:59.999999')
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Неверный формат даты: {end_date}")
    
    return {
        "user_id": user_id,
        "start_date": parsed_start_date,
        "end_date": parsed_end_date,
        "limit": limit
    }


@router.get("/status-history", response_model=List[StatusHistoryRead])
async def get_status_history(
    query_params: dict = Depends(parse_query_params),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_superuser),
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

        result = await session.execute(query)
        history_records = result.scalars().all()

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
        raise HTTPException(status_code=500, detail=f"Ошибка получения истории: {str(e)}")


@router.post("/status-analytics", response_model=List[StatusAnalyticsResponse])
async def get_status_analytics(
    request: StatusAnalyticsRequest,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_superuser),
):
    """Получить аналитику по статусам (только для суперпользователей)"""
    try:
        # Исправляем end_date, если он имеет время 00:00:00
        if request.end_date.hour == 0 and request.end_date.minute == 0 and request.end_date.second == 0:
            request.end_date = request.end_date.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        # Базовый запрос для получения данных
        query = (
            select(
                StatusHistory.user_id,
                StatusHistory.new_status_id,
                func.sum(
                    func.coalesce(
                        StatusHistory.duration_seconds,
                        func.extract('epoch', request.end_date - StatusHistory.start_time)
                    )
                ).label("total_duration"),
                func.count(StatusHistory.id).label("status_changes"),
            )
            .where(
                StatusHistory.start_time >= request.start_date,
                StatusHistory.start_time <= request.end_date,
            )
            .group_by(StatusHistory.user_id, StatusHistory.new_status_id)
        )

        if request.user_id:
            query = query.where(StatusHistory.user_id == request.user_id)
        if request.status_id:
            query = query.where(StatusHistory.new_status_id == request.status_id)

        result = await session.execute(query)
        analytics_data = result.all()

        # Получаем информацию о пользователях и статусах
        user_ids = list(set([row.user_id for row in analytics_data]))
        status_ids = list(set([row.new_status_id for row in analytics_data]))

        users_query = select(User).where(User.id.in_(user_ids))
        users_result = await session.execute(users_query)
        users = {user.id: user for user in users_result.scalars().all()}

        statuses_query = select(Status).where(Status.id.in_(status_ids))
        statuses_result = await session.execute(statuses_query)
        statuses = {status.id: status for status in statuses_result.scalars().all()}

        # Вычисляем общее время для каждого пользователя
        user_total_times = {}
        for row in analytics_data:
            if row.user_id not in user_total_times:
                user_total_times[row.user_id] = 0
            user_total_times[row.user_id] += row.total_duration or 0

        # Формируем ответ
        responses = []
        for row in analytics_data:
            user = users.get(row.user_id)
            status = statuses.get(row.new_status_id)
            
            if not user or not status:
                continue

            total_duration_seconds = int(row.total_duration or 0)
            total_duration_minutes = round(total_duration_seconds / 60, 2)
            total_duration_hours = round(total_duration_seconds / 3600, 2)
            user_total_time = user_total_times.get(row.user_id, 1)  # Избегаем деления на 0
            percentage = round((total_duration_seconds / user_total_time) * 100, 2)

            # Группируем по периодам в зависимости от period_type
            periods = await _get_periods_data(
                session, row.user_id, row.new_status_id, 
                request.start_date, request.end_date, request.period_type
            )

            responses.append(
                StatusAnalyticsResponse(
                    user_id=row.user_id,
                    user_name=f"{user.first_name or ''} {user.second_name or ''}".strip(),
                    status_id=row.new_status_id,
                    status_title=status.title,
                    total_duration_seconds=total_duration_seconds,
                    total_duration_minutes=total_duration_minutes,
                    total_duration_hours=total_duration_hours,
                    percentage=percentage,
                    periods=periods,
                )
            )

        return responses

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения аналитики: {str(e)}")


async def _get_periods_data(
    session: AsyncSession,
    user_id: int,
    status_id: int,
    start_date: datetime,
    end_date: datetime,
    period_type: str,
) -> List[dict]:
    """Получить данные по периодам для детализации"""
    try:
        # Определяем группировку по периоду
        if period_type == "day":
            date_format = "%Y-%m-%d"
        elif period_type == "week":
            date_format = "%Y-%u"  # Год-неделя
        elif period_type == "month":
            date_format = "%Y-%m"
        else:
            date_format = "%Y-%m-%d"

        query = (
            select(
                func.date_trunc(period_type, StatusHistory.start_time).label("period"),
                func.sum(
                    func.coalesce(
                        StatusHistory.duration_seconds,
                        func.extract('epoch', end_date - StatusHistory.start_time)
                    )
                ).label("duration"),
                func.count(StatusHistory.id).label("changes"),
            )
            .where(
                StatusHistory.user_id == user_id,
                StatusHistory.new_status_id == status_id,
                StatusHistory.start_time >= start_date,
                StatusHistory.start_time <= end_date,
            )
            .group_by(func.date_trunc(period_type, StatusHistory.start_time))
            .order_by(func.date_trunc(period_type, StatusHistory.start_time))
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
        return []


@router.get("/users", response_model=List[dict])
async def get_users_for_analytics(
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_superuser),
):
    """Получить список пользователей для фильтрации аналитики (только для суперпользователей)"""
    try:
        query = select(User.id, User.first_name, User.second_name, User.email).order_by(
            User.first_name, User.second_name
        )
        result = await session.execute(query)
        users = result.all()

        return [
            {
                "id": user.id,
                "name": f"{user.first_name or ''} {user.second_name or ''}".strip(),
                "email": user.email,
            }
            for user in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения пользователей: {str(e)}")


@router.get("/statuses", response_model=List[dict])
async def get_statuses_for_analytics(
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_superuser),
):
    """Получить список статусов для фильтрации аналитики (только для суперпользователей)"""
    try:
        query = select(Status.id, Status.title).order_by(Status.priority.desc(), Status.title)
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
        raise HTTPException(status_code=500, detail=f"Ошибка получения статусов: {str(e)}")


@router.get("/date-range", response_model=dict)
async def get_date_range(
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_superuser),
):
    """Получить минимальную и максимальную даты из истории статусов (только для суперпользователей)"""
    try:
        query = select(
            func.min(StatusHistory.start_time).label("min_date"),
            func.max(StatusHistory.start_time).label("max_date")
        )
        result = await session.execute(query)
        date_range = result.first()

        return {
            "minDate": date_range.min_date.isoformat() if date_range.min_date else None,
            "maxDate": date_range.max_date.isoformat() if date_range.max_date else None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения диапазона дат: {str(e)}")
