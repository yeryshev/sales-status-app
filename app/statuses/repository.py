from typing import Type

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Status


async def get_statuses(session: AsyncSession) -> list[Status]:
    try:
        query = select(Status).order_by(Status.priority.desc())
        result = await session.execute(query)
        statuses = result.scalars().all()
        return list(statuses)
    except SQLAlchemyError as e:
        print(str(e))
        return []


async def add_status_to_db(
        session: AsyncSession,
        status: Status) -> Status:
    try:
        session.add(status)
        await session.commit()
        return status
    except SQLAlchemyError as e:
        print(str(e))


async def delete_status_from_db(
        status: Type[Status],
        session: AsyncSession
):
    try:
        await session.delete(status)
        await session.commit()
        return status
    except SQLAlchemyError as e:
        print(str(e))
