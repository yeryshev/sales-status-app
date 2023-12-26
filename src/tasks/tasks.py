from celery import Celery
from celery.schedules import crontab
from sqlalchemy import select
from config import REDIS_URL
from src.auth.models import User
from src.database import sync_session_factory


celery = Celery('tasks', broker=REDIS_URL)


@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour='17', minute='00'),
        set_offline_users.s(),
        name='set_offline_users_every_day_at_17_00_UTC',
    )


@celery.task
def set_offline_users():
    with sync_session_factory() as session:
        users_to_update = session.query(User).filter(User.status_id != 3).all()
        for user in users_to_update:
            user.status_id = 3
        session.commit()
