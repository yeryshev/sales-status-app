import os

from celery import Celery
from celery.schedules import crontab
from src.auth.models import User
from src.database import sync_session_factory

celery = Celery('tasks')
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")


@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour='16', minute='00'),
        set_offline_users.s(),
        name='set_offline_users_every_day_at_17_00_UTC',
    )

    # sender.add_periodic_task(10.0, toggle_users_status.s(), name='add every 10')


@celery.task(name='set_offline_users')
def set_offline_users():
    with sync_session_factory() as session:
        users_to_update = session.query(User).filter(User.status_id != 3).all()
        for user in users_to_update:
            user.status_id = 3
        session.commit()


@celery.task(name='set_online_users')
def set_online_users():
    with sync_session_factory() as session:
        users_to_update = session.query(User).filter(User.status_id != 1).all()
        for user in users_to_update:
            user.status_id = 1
        session.commit()


@celery.task(name='toggle_users_status')
def toggle_users_status():
    with sync_session_factory() as session:
        users_to_update = session.query(User).all()
        for user in users_to_update:
            if user.status_id != 3:
                user.status_id = 3
            else:
                user.status_id = 1
        session.commit()
