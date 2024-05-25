from typing import Optional

from fastapi import Depends
from fastapi_users.db import SQLAlchemyBaseUserTable, SQLAlchemyUserDatabase
from sqlalchemy import String, ForeignKey, Boolean
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from src.comments.models import Comment
from src.database import get_async_session
from src.models import intpk, created_at, updated_at
from src.statuses.models import Base


class User(SQLAlchemyBaseUserTable[int], Base):
    id: Mapped[intpk]
    email: Mapped[str] = mapped_column(
        String(length=320), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(
        String(length=1024), nullable=False
    )
    first_name: Mapped[Optional[str]]
    second_name: Mapped[Optional[str]]
    ext_number: Mapped[Optional[str]]
    telegram: Mapped[Optional[str]]
    inside_id: Mapped[Optional[int]] = mapped_column(unique=True, nullable=True)
    is_working_remotely: Mapped[bool] = mapped_column(default=False)
    is_coordinator: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default='false')
    is_female: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default='false')
    status_id: Mapped[int] = mapped_column(default=3)
    comment_id: Mapped[Optional[int]] = mapped_column(ForeignKey(
        Comment.id,
        name="users_comment_id_fkey",
        ondelete="SET NULL",
    ))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)
