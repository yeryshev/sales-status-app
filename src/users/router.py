import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.base_config import current_user
from src.database import get_async_session
from src.models import User
from src.users.schemas import UserRead, UserUpdate, Teammate
from src.users.service import update_user, get_team
from src.websockets.router import manager

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/team",
            response_model=list[Teammate],
            response_model_by_alias=True,
            dependencies=[Depends(current_user)])
async def get_users_router(
        session: AsyncSession = Depends(get_async_session)):
    try:
        team = await get_team(session)
        return team
    except Exception:
        raise HTTPException(status_code=404, detail="Users not found")


@router.get("/me", response_model=UserRead)
def check_user(user: UserRead = Depends(current_user)):
    return user


@router.patch("/me", response_model=UserRead, response_model_by_alias=True)
async def update_user_router(
        user_update: UserUpdate,
        session: AsyncSession = Depends(get_async_session),
        session_user: User = Depends(current_user)
):
    user = await session.get(User, session_user.id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if session_user.id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    updated_user = await update_user(user_update, session, user)
    await manager.broadcast(json.dumps({
        "userId": updated_user.id,
        "statusId": updated_user.status_id,
        "commentId": updated_user.comment_id,
        "isWorkingRemotely": updated_user.is_working_remotely
    }))
    return updated_user
