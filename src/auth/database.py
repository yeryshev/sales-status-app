from typing import AsyncGenerator, Optional

from fastapi import Depends
from fastapi_users.db import SQLAlchemyBaseUserTable, SQLAlchemyUserDatabase
from sqlalchemy import String, ForeignKey, Boolean
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from src.config import settings
from src.models import intpk, created_at, updated_at, Comment

DATABASE_URL = settings.DATABASE_URL_asyncpg


class Base(DeclarativeBase):
    pass


class User(SQLAlchemyBaseUserTable[int], Base):
    id: Mapped[intpk]
    username: Mapped[str] = mapped_column(unique=True)
    email: Mapped[str] = mapped_column(
        String(length=320), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(
        String(length=1024), nullable=False
    )
    first_name: Mapped[Optional[str]]
    second_name: Mapped[Optional[str]]
    photo_url: Mapped[Optional[str]]
    ext_number: Mapped[Optional[str]]
    telegram: Mapped[Optional[str]]
    is_working_remotely: Mapped[bool] = mapped_column(default=False)
    status_id: Mapped[int] = mapped_column(default=3)
    comment_id: Mapped[Optional[int]] = mapped_column(ForeignKey(
        Comment.id,
        name="users_comment_id_fkey",
        ondelete="SET NULL"
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


engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)
