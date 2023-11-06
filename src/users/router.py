from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.models import User
from src.database import get_async_session
from src.auth.base_config import current_user
from src.users.schemas import UserRead, UserUpdate, Teammate
from src.users.service import update_user, get_users

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[Teammate], response_model_by_alias=True)
async def get_users_router(session: AsyncSession = Depends(get_async_session)):
    try:
        users = await get_users(session)
        return users
    except Exception:
        raise HTTPException(status_code=404, detail="Users not found")


@router.patch("/{user_id}", response_model=UserRead, response_model_by_alias=True)
async def update_user_router(
        user_id: int,
        user_update: UserUpdate,
        session: AsyncSession = Depends(get_async_session),
        session_user: User = Depends(current_user)
):
    user = await session.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if session_user.id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    updated_user = await update_user(user_update, session, user)
    return updated_user
