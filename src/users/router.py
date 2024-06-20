import json
from datetime import datetime

import pytz
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.auth.base_config import current_user, current_superuser
from src.database import get_async_session
from src.models import User
from src.users.schemas import UserGet, UserUpdate
from src.users.service import update_user, get_all_users
from src.websockets.router import manager

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserGet)
async def check_user(
        user: UserGet = Depends(current_user),
        session: AsyncSession = Depends(get_async_session)
):
    query = (select(User)
             .where(User.id == user.id)
             .options(selectinload(User.status), selectinload(User.comment), selectinload(User.busy_time))
             )
    result = await session.execute(query)
    user_data = result.scalars().first()

    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return user_data


@router.patch("/me", response_model=UserGet, response_model_by_alias=True)
async def update_user_router(
        user_update: UserUpdate,
        deadline: str = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S"),
        session: AsyncSession = Depends(get_async_session),
        session_user: User = Depends(current_user)
):
    user = await session.get(User, session_user.id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if session_user.id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    try:
        deadline_dt = datetime.fromisoformat(deadline).astimezone(pytz.UTC).replace(tzinfo=None)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid datetime format: {str(e)}")

    updated_user = await update_user(user_update, session, user, deadline_dt)

    query = (select(User)
             .where(User.id == updated_user.id)
             .options(selectinload(User.status), selectinload(User.comment), selectinload(User.busy_time))
             )
    result = await session.execute(query)
    updated_user = result.scalars().first()

    await manager.broadcast(json.dumps({
        "userId": updated_user.id,
        "statusId": updated_user.status_id,
        "status": updated_user.status.to_dict(),
        "comment": updated_user.comment.to_dict() if updated_user.comment else None,
        "busyTime": updated_user.busy_time.to_dict() if updated_user.busy_time else None,
        "commentId": updated_user.comment_id if updated_user.comment else None,
        "isWorkingRemotely": updated_user.is_working_remotely,
        "updatedAt": updated_user.updated_at.isoformat(),
    }))

    return updated_user


@router.delete("/{user_id}", dependencies=[Depends(current_superuser)])
async def delete_user_router(
        user_id: int,
        session: AsyncSession = Depends(get_async_session),
):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        await session.delete(user)
        await session.commit()
    except Exception:
        raise HTTPException(status_code=500, detail="Could not delete user")


@router.get("/team",
            response_model=list[UserGet],
            response_model_by_alias=True,
            dependencies=[Depends(current_user)])
async def get_users_router(
        session: AsyncSession = Depends(get_async_session)):
    try:
        all_users = await get_all_users(session)
        return all_users
    except Exception:
        raise HTTPException(status_code=404, detail="Users not found")
