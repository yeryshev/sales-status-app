import os

import requests
from celery import Celery
from celery.schedules import crontab
from fastapi import HTTPException

from backend.app.core.db import sync_session_factory
from backend.app.models import User

from backend.app.utils import mango_statuses

celery = Celery('tasks')
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")

offline_status_id = 3


@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour='16', minute='00'),
        set_offline_users.s(),
        name='set_offline_users_every_day_at_16_00_UTC',
    )


@celery.task(name='set_offline_users')
def set_offline_users():
    with sync_session_factory() as session:
        users_to_update = session.query(User).filter(User.status_id != offline_status_id).all()

        api_url = backend.app.core.config.MANGO_SET_STATUS
        headers = {'Content-Type': 'application/json'}

        for user in users_to_update:
            user.status_id = offline_status_id
            if user.mango_user_id is not None:

                payload = {
                    'abonent_id': user.mango_user_id,
                    'status': mango_statuses['offline']
                }
                response = requests.post(api_url, json=payload, headers=headers)

                if response.status_code != 200:
                    raise HTTPException(status_code=500, detail="Failed to notify mango API")
        session.commit()
