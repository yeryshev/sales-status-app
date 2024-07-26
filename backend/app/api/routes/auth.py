from fastapi import APIRouter

from app.api.auth_config import fastapi_users, auth_backend
from app.schemas import UserRead, UserCreate

router = APIRouter()

router.include_router(fastapi_users.get_auth_router(auth_backend))
router.include_router(fastapi_users.get_register_router(UserRead, UserCreate))
router.include_router(fastapi_users.get_reset_password_router())
