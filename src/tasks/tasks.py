from celery import Celery
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.models import User
from src.database import get_async_session
from src.users.schemas import UserUpdate
from src.users.service import update_user
from src.websockets.router import manager

celery = Celery('tasks', broker='redis://localhost:6379')


@celery.task
async def create_celery_task(
        status_id: int,
        comment_id: int,
        user_id: int,
        session: AsyncSession = Depends(get_async_session)):
    try:
        print('Hello from creating task')
        user = await session.get(User, user_id)
        user_update = UserUpdate(status_id=status_id, comment_id=comment_id)
        await update_user(user_update, session, user)
        await manager.broadcast({"userId": user.id, "statusId": status_id, "commentId": comment_id})
    except Exception:
        raise Exception('Could not create celery task')
