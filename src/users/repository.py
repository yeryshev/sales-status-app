from datetime import datetime
from typing import Type, Sequence

from sqlalchemy import select, desc, func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.models import User, Status, BusyTime
from .schemas import UserUpdate


class UserRepository:
    @classmethod
    async def get_user_by_id(
            cls,
            user_id: int,
            session: AsyncSession
    ) -> Type[User] | None:
        try:
            query = (select(User)
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
            cls,
            username: str,
            session: AsyncSession
    ) -> Type[User] | None:
        try:
            query = (select(User)
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
    async def get_all_users(cls, session: AsyncSession) -> Sequence[User]:
        try:
            query = (select(User)
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
            user: Type[User],
            deadline: datetime
    ) -> Type[User]:
        update_data = user_update.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            if key == 'status_id':
                status = await session.get(Status, value)
                if status.is_deadline_required:
                    current_busy_time = await session.execute(select(BusyTime).where(BusyTime.user_id == user.id))
                    current_busy_time_record = current_busy_time.scalars().first()

                    if current_busy_time_record:
                        current_busy_time_record.end_time = deadline
                        if value is not None:
                            current_busy_time_record.status_id = value
                    else:
                        new_busy_time = BusyTime(
                            user_id=user.id,
                            status_id=value,
                            end_time=deadline
                        )
                        session.add(new_busy_time)

                user.status_id = value
            else:
                setattr(user, key, value)

        await session.commit()
        await session.refresh(user)
        return user
