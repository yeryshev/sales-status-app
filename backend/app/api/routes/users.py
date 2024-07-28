from datetime import datetime

import pytz
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.auth_config import current_user, fastapi_users
from app.core.config import settings
from app.core.db import get_async_session
from app.crud import UserRepository
from app.models import User
from app.schemas import (
    GetUserStatus,
    UpdateTelegramRequest,
    UserGet,
    UserRead,
    UserUpdate,
)
from app.utils import get_new_mango_status_id, send_ws_after_user_update

users_router = APIRouter()
telegram_router = APIRouter()
fastapi_users_router = APIRouter()

fastapi_users_router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate)
)


@users_router.get(
    "/",
    response_model=list[UserGet],
    response_model_by_alias=True,
    dependencies=[Depends(current_user)],
    summary="Get All Users",
)
async def get_users_router(session: AsyncSession = Depends(get_async_session)):
    try:
        all_users = await UserRepository.get_all_users(session)
        return all_users
    except Exception:
        raise HTTPException(status_code=404, detail="Users not found")


@users_router.get("/me", response_model=UserGet, summary="Get Current User")
async def check_user(
    user=Depends(current_user), session: AsyncSession = Depends(get_async_session)
):
    db_user = await UserRepository.get_user_by_id(user.id, session)

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user


@users_router.patch(
    "/me",
    response_model=UserGet,
    response_model_by_alias=True,
    summary="Patch Current User",
)
async def update_user_router(
    user_update: UserUpdate,
    deadline: str = datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
    session: AsyncSession = Depends(get_async_session),
    session_user: User = Depends(current_user),
):
    user = await session.get(User, session_user.id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if session_user.id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    try:
        deadline_dt = (
            datetime.fromisoformat(deadline).astimezone(pytz.UTC).replace(tzinfo=None)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400, detail=f"Invalid datetime format: {str(e)}"
        )

    old_status_id = user.status_id
    new_status_id = (
        user_update.status_id if user_update.status_id is not None else old_status_id
    )

    mango_status_id = get_new_mango_status_id(new_status_id)

    if old_status_id != new_status_id and user.mango_user_id is not None:
        api_url = settings.MANGO_SET_STATUS
        payload = {"abonent_id": user.mango_user_id, "status": mango_status_id}
        headers = {"Content-Type": "application/json"}
        response = requests.post(api_url, json=payload, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to notify mango API")

    updated_user = await UserRepository.update_user(
        user_update, session, user, deadline_dt
    )

    query = (
        select(User)
        .where(User.id == updated_user.id)
        .options(selectinload(User.status), selectinload(User.busy_time))
    )
    result = await session.execute(query)
    updated_user = result.scalars().first()

    await send_ws_after_user_update(updated_user)

    return updated_user


@telegram_router.get("/", response_model=GetUserStatus)
async def get_first_name(
    username: str, session: AsyncSession = Depends(get_async_session)
):
    query = (
        select(User)
        .where(func.lower(User.telegram) == username.lower())
        .options(selectinload(User.status))
    )
    result = await session.execute(query)
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found. Make sure you have correctly entered your Telegram username in the application "
            "profile of Sales Status.",
        )
    return {
        "name": user.first_name,
        "status": user.status_id,
        "title": user.status.title,
        "is_deadline_required": user.status.is_deadline_required,
    }


@telegram_router.patch("/")
async def update_telegram(
    request: UpdateTelegramRequest,
    deadline: str = datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
    session: AsyncSession = Depends(get_async_session),
):
    if request.secret != settings.TELEGRAM_BOT_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret key")

    telegram_user = await UserRepository.get_user_by_telegram(request.username, session)
    telegram_user_id = telegram_user.id
    db_user = await session.get(User, telegram_user_id)

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        deadline_dt = (
            datetime.fromisoformat(deadline).astimezone(pytz.UTC).replace(tzinfo=None)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400, detail=f"Invalid datetime format: {str(e)}"
        )

    update_data = {"statusId": request.status}
    user_update = UserUpdate(**update_data)

    old_status_id = db_user.status_id
    new_status_id = (
        user_update.status_id if user_update.status_id is not None else old_status_id
    )

    mango_status_id = get_new_mango_status_id(new_status_id)

    if old_status_id != new_status_id and db_user.mango_user_id is not None:
        api_url = settings.MANGO_SET_STATUS
        payload = {"abonent_id": db_user.mango_user_id, "status": mango_status_id}
        headers = {"Content-Type": "application/json"}
        response = requests.post(api_url, json=payload, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to notify mango API")

    updated_user = await UserRepository.update_user(
        user_update, session, db_user, deadline_dt
    )

    query = (
        select(User)
        .where(User.id == updated_user.id)
        .options(selectinload(User.status), selectinload(User.busy_time))
    )
    result = await session.execute(query)
    updated_user = result.scalars().first()

    await send_ws_after_user_update(updated_user)

    return updated_user
