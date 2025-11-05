import json
import logging
from datetime import datetime

import pytz
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.auth_config import current_superuser, current_user, fastapi_users
from app.api.routes.websockets import manager
from app.core.config import settings
from app.core.db import get_async_session
from app.crud import UserRepository
from app.models import Message, User
from app.schemas import (
    ExternalUserDataRequest,
    ExternalUserDataResponse,
    GetUserStatus,
    UpdateTelegramRequest,
    UserGet,
    UserRead,
    UserUpdate,
)
from app.tasks import offline_status_id
from app.utils import (
    change_mango_status,
    get_new_mango_status_id,
    mango_statuses,
    send_ws_after_user_update,
)

logger = logging.getLogger(__name__)

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
        await change_mango_status(user, mango_status_id)

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


@users_router.post(
    "/set-all-offline",
    dependencies=[Depends(current_superuser)],
    summary="Set All Users Offline",
)
async def set_all_offline(session: AsyncSession = Depends(get_async_session)):
    from datetime import datetime

    from app.crud import StatusHistoryRepository

    statement = select(User)
    result = await session.execute(statement)
    users = result.scalars().all()

    current_time = datetime.utcnow()

    for user in users:
        # Проверяем, нужно ли менять статус
        if user.status_id != offline_status_id:
            old_status_id = user.status_id

            # Закрываем предыдущий статус, если он был
            if old_status_id is not None:
                await StatusHistoryRepository.update_last_status_end_time(
                    session, user.id, current_time
                )

            # Добавляем новый статус в историю
            await StatusHistoryRepository.add_status_change(
                session,
                user_id=user.id,
                old_status_id=old_status_id,
                new_status_id=offline_status_id,
                start_time=current_time,
            )

            # Обновляем статус пользователя
            user.status_id = offline_status_id
            await change_mango_status(user, mango_statuses["offline"])

    await session.commit()
    return Message(message="All users set to offline")


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
        await change_mango_status(db_user, mango_status_id)

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


@users_router.post("/external-user-data", status_code=200)
async def receive_external_user_data(
    data: ExternalUserDataRequest,
    x_api_key: str | None = Header(None, alias="X-API-Key"),
) -> dict[str, str]:
    """
    Принимает данные о пользователе от внешнего сервиса через POST запрос
    и транслирует их всем подключенным WebSocket клиентам.

    Требуется API ключ в заголовке X-API-Key для авторизации.
    """
    # Проверка API ключа (если настроен в конфигурации)
    if hasattr(settings, "EXTERNAL_API_KEY") and settings.EXTERNAL_API_KEY:
        if not x_api_key or x_api_key != settings.EXTERNAL_API_KEY:
            logger.warning("Unauthorized external data request")
            raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        # Преобразуем данные в формат для отправки на фронтенд
        response_data = ExternalUserDataResponse(
            id_amo_crm=data.id_amo_crm,
            id_inside=data.id_inside,
            id_chatwoot=data.id_chatwoot,
            qlik=data.qlik,
            budget=data.budget,
            deals=data.deals,
            overdue_tasks=data.overdue_tasks,
            conversations=data.conversations,
            tickets=data.tickets,
            avatar=data.avatar,
            is_birthday=False,  # Можно добавить логику определения дня рождения
            absence=data.absence,
            mango_state=data.mango_state,
            leads=data.leads,
            last_week=data.last_week,
        )

        # Формируем сообщение для WebSocket
        ws_message = {
            "type": "externalUserData",
            "data": response_data.model_dump(by_alias=True),
        }

        logger.info(
            f"Broadcasting external user data for idInside={data.id_inside} to {len(manager.active_connections)} clients"
        )
        logger.debug(f"WebSocket message: {ws_message}")

        # Транслируем данные всем подключенным клиентам
        await manager.broadcast(json.dumps(ws_message))

        logger.info(
            f"External user data received and broadcasted for user idInside={data.id_inside}"
        )

        return {"status": "success", "message": "Data received and broadcasted"}

    except Exception as e:
        logger.error(f"Error processing external user data: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
