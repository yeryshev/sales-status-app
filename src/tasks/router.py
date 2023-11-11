from fastapi import APIRouter, Depends
from src.auth.base_config import current_user
from src.auth.models import User
from src.tasks.schemas import TaskOut, TaskIn
from src.tasks.tasks import create_celery_task

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskOut)
async def create_task(
        task: TaskIn,
        session_user: User = Depends(current_user)):
    scheduled_time = task.date
    celery_task = create_celery_task.apply_async(
        args=[task.status_id, task.comment_id, session_user.id],
        eta=scheduled_time
    )
    new_task = TaskOut(
        uuid=celery_task.task_id,
        user_id=session_user.id,
        status_id=task.status_id,
        comment_id=task.comment_id,
        date=scheduled_time
    )
    return new_task

