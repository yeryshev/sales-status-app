from typing import Type

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from src.comments.models import Comment


async def get_comments(session: AsyncSession, user: int) -> list[Comment]:
    try:
        if not user:
            query = select(Comment).order_by(Comment.created_at.desc())
        else:
            query = select(Comment).filter(Comment.owner_id == user).order_by(Comment.created_at.desc())
        result = await session.execute(query)
        comments = result.scalars().all()
        return list(comments)
    except SQLAlchemyError as e:
        print(str(e))
        return []


async def add_comment_to_db(
        session: AsyncSession,
        comment: Comment) -> Comment:
    try:
        session.add(comment)
        await session.commit()
        return comment
    except SQLAlchemyError as e:
        print(str(e))


async def delete_comment_from_db(
        comment: Type[Comment],
        session: AsyncSession
):
    try:
        await session.delete(comment)
        await session.commit()
        return comment
    except SQLAlchemyError as e:
        print(str(e))
