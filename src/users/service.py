from typing import Type

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.models import User
from src.statuses.models import Status
from src.users.schemas import UserUpdate, Teammate
from src.users.utils import create_teammates
from src.comments.models import Comment


async def get_team(session: AsyncSession) -> list[Teammate]:
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


async def update_user(user_update: UserUpdate, session: AsyncSession, user: Type[User]) -> Type[User]:
    update_data = user_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(user, key, value)

    await session.commit()
    await session.refresh(user)
    return user
