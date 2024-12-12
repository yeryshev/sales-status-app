import os

from celery import Celery
from celery.schedules import crontab
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.db import async_session_maker, sync_session_factory
from app.models import User
from app.utils import change_mango_status, mango_statuses, send_ws_with_all_users

celery = Celery("tasks")
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get(
    "CELERY_RESULT_BACKEND", "redis://localhost:6379"
)

offline_status_id = 3


async def toggle_users():
    print("Toggle users task started")
    session = async_session_maker()
    try:
        query = select(User).options(
            selectinload(User.status), selectinload(User.busy_time)
        )
        result = await session.execute(query)
        users_to_update = result.scalars().all()

        for user in users_to_update:
            if user.status_id == offline_status_id:
                user.status_id = 1
            else:
                user.status_id = offline_status_id

        await session.commit()
        await session.refresh(users_to_update)
        await send_ws_with_all_users(users_to_update)
    finally:
        await session.close()


@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):  # noqa: ARG001
    sender.add_periodic_task(
        crontab(hour="16", minute="00"),
        set_offline_users.s(),
        name="set_offline_users_every_day_at_16_00_UTC",
    )


@celery.task(name="set_offline_users")
def set_offline_users():
    with sync_session_factory() as session:
        users_to_update = (
            session.query(User).filter(User.status_id != offline_status_id).all()
        )

        for user in users_to_update:
            user.status_id = offline_status_id
            change_mango_status(user, mango_statuses["offline"])
        session.commit()
        session.close()
    return "All users are offline now"
