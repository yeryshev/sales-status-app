from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.base_config import fastapi_users
from src.auth.models import User
from src.auth.schemas import UserUpdate, UserRead
from src.crud import AsyncORM
from src.database import get_async_session

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
async def get_users():
    return await AsyncORM.select_users()


@router.patch("/{user_id}", response_model=UserRead, response_model_by_alias=True)
async def update_user(user_id: int, user_update: UserUpdate, session: AsyncSession = Depends(get_async_session)):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = user_update.model_dump(exclude_unset=True, by_alias=False)

    for key, value in update_data.items():
        setattr(user, key, value)

    await session.commit()
    return user
