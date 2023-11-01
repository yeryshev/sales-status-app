from fastapi import APIRouter, Depends
from src.auth.base_config import fastapi_users, auth_backend, current_user
from src.auth.schemas import UserRead, UserCreate

router = APIRouter(prefix="/auth", tags=["Auth"])

router.include_router(fastapi_users.get_register_router(UserRead, UserCreate))

router.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/jwt")


@router.get("/check", response_model=UserRead)
def check_user(user: UserRead = Depends(current_user)):
    return user
