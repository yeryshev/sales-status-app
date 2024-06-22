import json
from datetime import datetime

import pytz
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.models import User
from src.config import settings
from src.database import get_async_session
from src.users.schemas import UserUpdate
from src.users.service import update_user
from src.websockets.router import manager

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
        raise HTTPException(status_code=403, detail="Неверный секретный ключ. Пожалуйста, обновите страницу.")

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

    update_data = {'status_id': request.status}
    user_update = UserUpdate(**update_data)
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
