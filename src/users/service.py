from typing import Type

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User, Status, Comment
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


async def update_user(user_update: UserIn, session: AsyncSession, user: Type[User]) -> Type[User]:
    update_data = user_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(user, key, value)

    await session.commit()
    await session.refresh(user)
    return user
