from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.base_config import current_user
from src.models import User, Comment
from src.comments.schemas import CommentGet, CommentCreate
from src.comments.service import add_comment_to_db, delete_comment_from_db, get_comments
from src.database import get_async_session

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.get("/", response_model=list[CommentGet], dependencies=[Depends(current_user)])
async def get_my_comments(
        session: AsyncSession = Depends(get_async_session),
        user: int = None):
    try:
        return await get_comments(session, user)
    except Exception:
        raise HTTPException(status_code=404, detail="Comments not found")


@router.post("/", response_model=CommentGet)
async def create_comment(
        comment: CommentCreate,
        session: AsyncSession = Depends(get_async_session),
        session_user: User = Depends(current_user)
):
    try:
        new_comment = Comment(description=comment.description, owner_id=session_user.id)
        return await add_comment_to_db(comment=new_comment, session=session)
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Could not create comment")


@router.delete("/{comment_id}", response_model=CommentGet)
async def delete_comment(
        comment_id: int,
        session: AsyncSession = Depends(get_async_session),
        session_user: User = Depends(current_user)):
    try:
        comment = await session.get(Comment, comment_id)
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")
        if comment.owner_id != session_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        return await delete_comment_from_db(comment, session)
    except Exception:
        raise HTTPException(status_code=500, detail="Could not delete comment")
