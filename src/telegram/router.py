from datetime import datetime

import pytz
import requests
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.config import settings
from src.database import get_async_session
from src.models import User
from src.users.router import app_statuses, mango_statuses
from src.users.schemas import UserUpdate
from src.users.service import update_user
from src.websockets.utils import send_ws_after_user_update

router = APIRouter(prefix="/telegram", tags=["Telegram"])

secret_key = settings.TELEGRAM_BOT_SECRET


class GetUserStatus(BaseModel):
    name: str
    status: int
    title: str
    is_deadline_required: bool


class UpdateTelegramRequest(BaseModel):
    username: str
    status: int
    secret: str


@router.get("/", response_model=GetUserStatus)
async def get_first_name(
        username: str,
        session: AsyncSession = Depends(get_async_session)
):
    query = select(User).where(func.lower(User.telegram) == username.lower()).options(selectinload(User.status))
    result = await session.execute(query)
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404,
                            detail="Пользователь не найден. Убедись, что верно указал(а) свой телеграм-логин в "
                                   "профиле приложения ДРБ Статус.")
    return {'name': user.first_name, 'status': user.status_id, 'title': user.status.title,
            'is_deadline_required': user.status.is_deadline_required}


@router.patch("/")
async def update_telegram(
        request: UpdateTelegramRequest,
        deadline: str = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S"),
        session: AsyncSession = Depends(get_async_session)
):
    if request.secret != secret_key:
        raise HTTPException(status_code=403, detail="Invalid secret key")

    query = select(User).where(func.lower(User.telegram) == request.username.lower())
    result = await session.execute(query)
    user_id = result.scalar_one_or_none().id

    user = await session.get(User, user_id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        deadline_dt = datetime.fromisoformat(deadline).astimezone(pytz.UTC).replace(tzinfo=None)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid datetime format: {str(e)}")

    update_data = {'statusId': request.status}
    user_update = UserUpdate(**update_data)

    old_status_id = user.status_id
    new_status_id = user_update.status_id if user_update.status_id is not None else old_status_id

    if new_status_id in app_statuses['work']:
        mango_status_id = mango_statuses['online']
    elif new_status_id in app_statuses['lunch/away']:
        mango_status_id = mango_statuses['dont_disturb']
    elif new_status_id in app_statuses['busy/meeting']:
        mango_status_id = mango_statuses['dont_disturb']
    elif new_status_id in app_statuses['offline']:
        mango_status_id = mango_statuses['offline']
    else:
        mango_status_id = mango_statuses['online']

    if old_status_id != new_status_id and user.mango_user_id is not None:
        api_url = settings.MANGO_SET_STATUS
        payload = {
            'abonent_id': user.mango_user_id,
            'status': mango_status_id
        }
        headers = {'Content-Type': 'application/json'}
        response = requests.post(api_url, json=payload, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to notify mango API")

    updated_user = await update_user(user_update, session, user, deadline_dt)

    query = (select(User)
             .where(User.id == updated_user.id)
             .options(selectinload(User.status), selectinload(User.comment), selectinload(User.busy_time))
             )
    result = await session.execute(query)
    updated_user = result.scalars().first()

    await send_ws_after_user_update(updated_user)

    return updated_user
