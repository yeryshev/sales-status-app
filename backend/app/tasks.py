from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.db import async_session_maker
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

        for user in users:
            user.status_id = offline_status_id
            user.status = offline_status_object
            await change_mango_status(user, mango_statuses["offline"])
        await session.commit()
        result = await session.execute(query)
        updated_users = result.scalars().all()
        await send_ws_with_all_users(updated_users)
    finally:
        await session.close()
