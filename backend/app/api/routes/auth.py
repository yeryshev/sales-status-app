from fastapi import APIRouter

from app.api.auth_config import auth_backend, fastapi_users
from app.schemas import UserCreate, UserRead

router = APIRouter()

router.include_router(fastapi_users.get_auth_router(auth_backend))
router.include_router(fastapi_users.get_register_router(UserRead, UserCreate))
router.include_router(fastapi_users.get_reset_password_router())
