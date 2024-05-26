from datetime import datetime
from typing import Annotated, Optional

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import text, String, Boolean, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped

from src.database import Base

int_primary_key = Annotated[int, mapped_column(primary_key=True)]

created_at = Annotated[
    datetime,
    mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )]

updated_at = Annotated[
    datetime,
    mapped_column(
        server_default=text("TIMEZONE('utc', now())"),
        onupdate=text("TIMEZONE('utc', now())")
    )]


class Comment(Base):
    __tablename__ = "comment"

    id: Mapped[int_primary_key]
    description: Mapped[str]
    owner_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    def __repr__(self):
        return f"id: {self.id}, description: {self.description}"


class User(SQLAlchemyBaseUserTable[int], Base):
    id: Mapped[int_primary_key]
    email: Mapped[str] = mapped_column(String(length=320), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(length=1024), nullable=False)
    first_name: Mapped[Optional[str]]
    second_name: Mapped[Optional[str]]
    ext_number: Mapped[Optional[str]]
    telegram: Mapped[Optional[str]]
    inside_id: Mapped[Optional[int]] = mapped_column(unique=True, nullable=True)
    is_working_remotely: Mapped[bool] = mapped_column(default=False)
    is_coordinator: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default='false')
    is_female: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default='false')
    is_manager: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default='true')
    status_id: Mapped[int] = mapped_column(default=3)
    comment_id: Mapped[Optional[int]] = mapped_column(ForeignKey(
        Comment.id,
        name="users_comment_id_fkey",
        ondelete="SET NULL",
    ))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    def __repr__(self):
        return f"id: {self.id}, email: {self.email} first_name: {self.first_name} second_name: {self.second_name} "


class Status(Base):
    __tablename__ = "status"

    id: Mapped[int_primary_key]
    title: Mapped[str]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    def __repr__(self):
        return f"id: {self.id}, title: {self.title}"
