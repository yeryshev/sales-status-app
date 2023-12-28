from fastapi import APIRouter

from src.tasks.tasks import set_offline_users, set_online_users

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/offline")
def offline_users():
    set_offline_users.delay()


@router.get("/online")
def online_users():
    set_online_users.delay()
