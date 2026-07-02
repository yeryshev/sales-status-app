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
            locked_user = await session.get(User, user.id, with_for_update=True)
            if locked_user is None or locked_user.status_id == offline_status_id:
                continue

            old_status_id = locked_user.status_id
            await StatusHistoryRepository.record_transition(
                session,
                user_id=locked_user.id,
                old_status_id=old_status_id,
                new_status_id=offline_status_id,
                at_time=current_time,
            )
            locked_user.status_id = offline_status_id
            locked_user.status = offline_status_object
            await change_mango_status(locked_user, mango_statuses["offline"])

        await session.commit()
        result = await session.execute(query)
        updated_users = result.scalars().all()
        await send_ws_with_all_users(updated_users)
    finally:
        await session.close()
