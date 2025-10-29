from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.db import async_session_maker
from app.crud import StatusHistoryRepository
from app.models import Status, User
from app.utils import (
    app_statuses,
    change_mango_status,
    mango_statuses,
    send_ws_with_all_users,
)

offline_status_id = app_statuses["offline"][0]


async def set_offline_users():
    session = async_session_maker()
    try:
        query = select(User).options(
            selectinload(User.status), selectinload(User.busy_time)
        )
        result = await session.execute(query)
        users = result.scalars().all()

        offline_status_object = await session.get(Status, offline_status_id)
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
                user.status = offline_status_object

                # Обновляем статус в Mango
                await change_mango_status(user, mango_statuses["offline"])

        await session.commit()
        result = await session.execute(query)
        updated_users = result.scalars().all()
        await send_ws_with_all_users(updated_users)
    finally:
        await session.close()
