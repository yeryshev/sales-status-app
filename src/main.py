from fastapi import FastAPI, Depends
from fastapi_users import FastAPIUsers

from src.auth.base_config import auth_backend
from src.auth.models import User
from src.auth.manager import get_user_manager
from src.auth.schemas import UserRead, UserCreate
from src.users.router import router as users_router


app = FastAPI(title='Team Status API')

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)


app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(users_router)

current_user = fastapi_users.current_user()


@app.get("/auth/check", tags=["auth"])
def check_user(user: User = Depends(current_user)):
    return user
