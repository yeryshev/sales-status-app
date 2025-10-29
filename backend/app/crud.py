from collections.abc import Sequence
from datetime import datetime

from sqlalchemy import desc, func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import BusyTime, Status, StatusHistory, User
from app.schemas import UserUpdate


class BusyTimeRepository:
    @classmethod
    async def get_busy_time_record(cls, user: type[User], session: AsyncSession):
        current_busy_time = await session.execute(
            select(BusyTime).where(BusyTime.user_id == user.id)
        )
        return current_busy_time.scalars().first()

    @classmethod
    async def add_busy_time(
        cls, session: AsyncSession, user: type[User], value: int, deadline: datetime
    ):
        try:
            new_busy_time = BusyTime(
                user_id=user.id, status_id=value, end_time=deadline
            )
            session.add(new_busy_time)

        except SQLAlchemyError as e:
            print(str(e))

    @classmethod
    def update_busy_time_record(
        cls, current_busy_time_record: BusyTime, value: int, deadline: datetime
    ):
        current_busy_time_record.end_time = deadline
        if value is not None:
            current_busy_time_record.status_id = value


async def handle_busy_time(
    session: AsyncSession, user: type[User], value: int, deadline: datetime
):
    current_busy_time_record = await BusyTimeRepository.get_busy_time_record(
        user, session
    )
    if current_busy_time_record:
        BusyTimeRepository.update_busy_time_record(
            current_busy_time_record, value, deadline
        )
    else:
        await BusyTimeRepository.add_busy_time(session, user, value, deadline)


class UserRepository:
    @classmethod
    async def get_user_by_id(
        cls, user_id: int, session: AsyncSession
    ) -> type[User] | None:
        try:
            query = (
                select(User)
                .where(User.id == user_id)
                .options(selectinload(User.status), selectinload(User.busy_time))
            )
            result = await session.execute(query)
            user = result.scalars().first()
            return user

        except SQLAlchemyError as e:
            print(str(e))
            return None

    @classmethod
    async def get_user_by_telegram(
        cls, username: str, session: AsyncSession
    ) -> type[User] | None:
        try:
            query = (
                select(User)
                .where(func.lower(User.telegram) == username.lower())
                .options(selectinload(User.status), selectinload(User.busy_time))
            )
            result = await session.execute(query)
            user = result.scalar_one_or_none()
            return user

        except SQLAlchemyError as e:
            print(str(e))
            return None

    @classmethod
    async def get_user_by_email(
        cls, email: str, session: AsyncSession
    ) -> type[User] | None:
        try:
            # Нормализуем email - приводим к нижнему регистру
            normalized_email = email.lower().strip()

            # Сначала пытаемся найти точное совпадение
            query = (
                select(User)
                .where(func.lower(User.email) == normalized_email)
                .options(selectinload(User.status), selectinload(User.busy_time))
            )
            result = await session.execute(query)
            user = result.scalar_one_or_none()

            if user:
                print(f"Found exact match: {user.email}")
                return user

            # Если точного совпадения нет, пробуем альтернативный домен
            if "@" in normalized_email:
                username, domain = normalized_email.split("@")
                print(
                    f"Trying to find user with username: {username}, original domain: {domain}"
                )

                # Определяем альтернативный домен
                # Если домен заканчивается на .ru, пробуем .com
                # Если домен заканчивается на .com, пробуем .ru
                if domain.endswith(".ru"):
                    alternative_domain = domain.replace(".ru", ".com")
                elif domain.endswith(".com"):
                    alternative_domain = domain.replace(".com", ".ru")
                else:
                    # Для других доменов не ищем альтернативы
                    return None

                alternative_email = f"{username}@{alternative_domain}"
                print(f"Trying alternative email: {alternative_email}")

                # Ищем пользователя с альтернативным доменом
                query = (
                    select(User)
                    .where(func.lower(User.email) == alternative_email)
                    .options(selectinload(User.status), selectinload(User.busy_time))
                )
                result = await session.execute(query)
                user = result.scalar_one_or_none()

                if user:
                    print(f"Found user with alternative domain: {user.email}")
                    return user

            return None

        except SQLAlchemyError as e:
            print(str(e))
            return None

    @classmethod
    async def get_all_users(cls, session: AsyncSession) -> Sequence[User]:
        try:
            query = (
                select(User)
                .join(User.status)
                .options(selectinload(User.status), selectinload(User.busy_time))
                .order_by(desc(Status.priority), desc(User.updated_at))
            )

            result = await session.execute(query)
            return result.scalars().all()

        except SQLAlchemyError as e:
            print(str(e))
            return []

    @classmethod
    async def update_user(
        cls,
        user_update: UserUpdate,
        session: AsyncSession,
        user: type[User],
        deadline: datetime,
    ) -> type[User]:
        update_data = user_update.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            if key == "status_id":
                old_status_id = user.status_id
                status = await session.get(Status, value)
                if status.is_deadline_required and status.id != user.status_id:
                    await handle_busy_time(session, user, value, deadline)

                # Записываем изменение статуса в историю
                if old_status_id != value:
                    # Закрываем предыдущий статус, если он был
                    if old_status_id is not None:
                        await StatusHistoryRepository.update_last_status_end_time(
                            session, user.id, datetime.utcnow()
                        )

                    # Добавляем новый статус в историю
                    await StatusHistoryRepository.add_status_change(
                        session,
                        user_id=user.id,
                        old_status_id=old_status_id,
                        new_status_id=value,
                        start_time=datetime.utcnow(),
                    )

                user.status_id = value
            else:
                setattr(user, key, value)

        await session.commit()
        await session.refresh(user)
        return user


class StatusHistoryRepository:
    @classmethod
    async def add_status_change(
        cls,
        session: AsyncSession,
        user_id: int,
        old_status_id: int | None,
        new_status_id: int,
        start_time: datetime,
        end_time: datetime | None = None,
    ) -> StatusHistory:
        """Добавляет запись об изменении статуса в историю"""
        try:
            # Вычисляем продолжительность в секундах, если есть end_time
            duration_seconds = None
            if end_time and start_time:
                duration_seconds = int((end_time - start_time).total_seconds())

            new_history_record = StatusHistory(
                user_id=user_id,
                old_status_id=old_status_id,
                new_status_id=new_status_id,
                start_time=start_time,
                end_time=end_time,
                duration_seconds=duration_seconds,
            )
            session.add(new_history_record)
            await session.commit()
            await session.refresh(new_history_record)
            return new_history_record
        except SQLAlchemyError as e:
            print(f"Error adding status history: {str(e)}")
            await session.rollback()
            raise

    @classmethod
    async def update_last_status_end_time(
        cls,
        session: AsyncSession,
        user_id: int,
        end_time: datetime,
    ) -> bool:
        """Обновляет время окончания последнего статуса пользователя"""
        try:
            # Находим последнюю запись для пользователя без end_time
            query = (
                select(StatusHistory)
                .where(
                    StatusHistory.user_id == user_id, StatusHistory.end_time.is_(None)
                )
                .order_by(StatusHistory.start_time.desc())
                .limit(1)
            )
            result = await session.execute(query)
            last_record = result.scalars().first()

            if last_record:
                last_record.end_time = end_time
                # Пересчитываем продолжительность
                if last_record.start_time:
                    last_record.duration_seconds = int(
                        (end_time - last_record.start_time).total_seconds()
                    )
                await session.commit()
                return True
            return False
        except SQLAlchemyError as e:
            print(f"Error updating status history: {str(e)}")
            await session.rollback()
            return False

    @classmethod
    async def get_user_status_history(
        cls,
        session: AsyncSession,
        user_id: int,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> list[StatusHistory]:
        """Получает историю статусов пользователя за период"""
        try:
            query = (
                select(StatusHistory)
                .where(StatusHistory.user_id == user_id)
                .options(
                    selectinload(StatusHistory.old_status),
                    selectinload(StatusHistory.new_status),
                )
                .order_by(StatusHistory.start_time.desc())
            )

            if start_date:
                query = query.where(StatusHistory.start_time >= start_date)
            if end_date:
                query = query.where(StatusHistory.start_time <= end_date)

            result = await session.execute(query)
            return result.scalars().all()
        except SQLAlchemyError as e:
            print(f"Error getting status history: {str(e)}")
            return []
