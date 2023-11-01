from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.models import User
from src.models import Comment, Status
from src.database import get_async_session
from src.auth.base_config import current_user
from src.users.schemas import UserRead, UserUpdate, Teammate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[Teammate], response_model_by_alias=True)
async def get_users(session: AsyncSession = Depends(get_async_session)):
    try:
        query = (select(User, Status, Comment)
                 .select_from(User)
                 .outerjoin(Status, Status.id == User.status_id)
                 .outerjoin(Comment, Comment.id == User.comment_id)
                 .order_by(User.status_id.asc(), User.updated_at.desc()))

        result = await session.execute(query)
        rows = result.fetchall()

        users = []
        for row in rows:
            user, status, comment = row
            user_dict = {**user.__dict__}
            del user_dict['status_id']
            del user_dict['comment_id']
            user_dict['status'] = status.title if status else None
            user_dict['comment'] = comment.description if comment else None
            users.append(user_dict)

        return users
    except Exception:
        raise HTTPException(status_code=404, detail="Users not found")


@router.patch("/{user_id}", response_model=UserRead, response_model_by_alias=True)
async def update_user(
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

    update_data = user_update.model_dump(exclude_unset=True)
    print(update_data)

    for key, value in update_data.items():
        setattr(user, key, value)

    await session.commit()
    await session.refresh(user)

    return user
