from datetime import datetime
from typing import Type

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User, Status, Comment, BusyTime
from src.users.schemas import UserIn, TeammateOut
from src.users.utils import create_teammates


async def get_team(session: AsyncSession) -> list[TeammateOut]:
    try:
        query = (select(User, Status, Comment)
                 .select_from(User)
                 .outerjoin(Status, Status.id == User.status_id)
                 .outerjoin(Comment, Comment.id == User.comment_id)
                 .order_by(User.status_id.asc(), User.updated_at.desc()))

        result = await session.execute(query)
        rows = result.fetchall()

        users = create_teammates(rows)
        return users
    except SQLAlchemyError as e:
        print(str(e))
        return []


async def update_user(user_update: UserIn, session: AsyncSession, user: Type[User], deadline: datetime) -> Type[User]:
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
                user.status_id = value
        else:
            setattr(user, key, value)

    await session.commit()
    await session.refresh(user)
    return user
