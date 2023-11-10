from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.base_config import current_user
from src.auth.models import User
from src.database import get_async_session
from src.models import Comment

router = APIRouter(prefix="/comments", tags=["Comments"])


class CommentIn(BaseModel):
    description: str


class CommentOut(CommentIn):
    id: int


@router.get("/", response_model=list[CommentOut])
async def get_comments(session: AsyncSession = Depends(get_async_session), session_user: User = Depends(current_user)):
    try:
        query = select(Comment).filter(Comment.owner_id == session_user.id).order_by(Comment.created_at.desc())
        result = await session.execute(query)
        comments = result.scalars().all()
        return comments
    except Exception:
        raise HTTPException(status_code=404, detail="Comments not found")


@router.post("/", response_model=CommentOut)
async def create_comment(
        comment: CommentIn,
        session: AsyncSession = Depends(get_async_session),
        session_user: User = Depends(current_user)
):
    try:
        new_comment = Comment(description=comment.description, owner_id=session_user.id)
        session.add(new_comment)
        await session.commit()
        return new_comment
    except Exception:
        raise HTTPException(status_code=500, detail="Could not create comment")


@router.delete("/{comment_id}", response_model=CommentOut)
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
        await session.delete(comment)
        await session.commit()
        return comment
    except Exception:
        raise HTTPException(status_code=500, detail="Could not delete comment")
