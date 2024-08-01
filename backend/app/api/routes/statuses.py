from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth_config import current_superuser
from app.core.db import get_async_session
from app.models import Message, Status
from app.schemas import StatusCreate, StatusGet, StatusUpdate

router = APIRouter()


@router.get("/", response_model=list[StatusGet], description="Get all statuses.")
async def read_statuses(session: AsyncSession = Depends(get_async_session)) -> Any:
    statement = select(Status).order_by(Status.priority.desc())
    result = await session.execute(statement)
    statuses = result.scalars().all()

    return statuses


@router.get("/{status_id}", response_model=StatusGet, description="Get status by ID.")
async def read_status(
    status_id: int, session: AsyncSession = Depends(get_async_session)
) -> Any:
    status = await session.get(Status, status_id)
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")
    return status


@router.post(
    "/",
    response_model=StatusGet,
    dependencies=[Depends(current_superuser)],
    description="Create new status.",
)
async def create_status(
    status_in: StatusCreate,
    session: AsyncSession = Depends(get_async_session),
):
    status_dict = status_in.model_dump()
    status = Status(**status_dict)
    session.add(status)
    await session.commit()
    await session.refresh(status)
    return status


@router.patch(
    "/{status_id}",
    response_model=StatusGet,
    dependencies=[Depends(current_superuser)],
    description="Update an status.",
)
async def update_status(
    status_id: int,
    status_in: StatusUpdate,
    session: AsyncSession = Depends(get_async_session),
) -> Any:
    status = await session.get(Status, status_id)
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")
    update_dict = status_in.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(status, key, value)
    await session.commit()
    await session.refresh(status)
    return status


@router.delete(
    "/{status_id}",
    dependencies=[Depends(current_superuser)],
    description="Delete an status.",
)
async def delete_status(
    status_id: int,
    session: AsyncSession = Depends(get_async_session),
) -> Message:
    status = await session.get(Status, status_id)
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")
    await session.delete(status)
    await session.commit()
    return Message(message="Status deleted successfully")
