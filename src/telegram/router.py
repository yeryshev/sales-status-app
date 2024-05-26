import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User
from src.config import settings
from src.database import get_async_session
from src.websockets.router import manager

router = APIRouter(prefix="/telegram", tags=["Telegram"])

secret_key = settings.TELEGRAM_BOT_SECRET


class UpdateTelegramRequest(BaseModel):
    username: str
    status: int
    secret: str


@router.get("/")
async def get_first_name(
        username: str,
        session: AsyncSession = Depends(get_async_session)
):
    query = select(User).where(func.lower(User.telegram) == username.lower())
    result = await session.execute(query)
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404,
                            detail="Пользователь не найден. Убедись, что верно указал(а) свой телеграм-логин в "
                                   "профиле приложения ДРБ Статус.")
    return {'name': user.first_name, 'status': user.status_id}


@router.patch("/")
async def update_telegram(
        request: UpdateTelegramRequest,
        session: AsyncSession = Depends(get_async_session)
):
    if request.secret != secret_key:
        raise HTTPException(status_code=403, detail="Неверный секретный ключ. Пожалуйста, обновите страницу.")
    query = select(User).where(func.lower(User.telegram) == request.username.lower())
    result = await session.execute(query)
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = {'status_id': request.status}

    for key, value in update_data.items():
        setattr(user, key, value)

    await session.commit()
    await session.refresh(user)
    await manager.broadcast(json.dumps({
        "userId": user.id,
        "statusId": user.status_id,
        "commentId": user.comment_id,
        "isWorkingRemotely": user.is_working_remotely
    }))
    return user
