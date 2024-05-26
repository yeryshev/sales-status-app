from datetime import datetime
from typing import Annotated, Optional

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import text, String, Boolean, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

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
    owner_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    owner: Mapped["User"] = relationship("User", back_populates="comments", foreign_keys=[owner_id])

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
    status_id: Mapped[Optional[int]] = mapped_column(ForeignKey("status.id", ondelete="SET NULL"), index=True)
    comment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("comment.id", ondelete="SET NULL"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    busy_time: Mapped[Optional["BusyTime"]] = relationship("BusyTime", back_populates="user", uselist=False)
    status: Mapped[Optional["Status"]] = relationship("Status", back_populates="users")
    comments: Mapped[list["Comment"]] = relationship("Comment", back_populates="owner", foreign_keys=[Comment.owner_id])

    def __repr__(self):
        return f"id: {self.id}, email: {self.email} first_name: {self.first_name} second_name: {self.second_name} "


class Status(Base):
    __tablename__ = "status"

    id: Mapped[int_primary_key]
    title: Mapped[str]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    busy_times: Mapped[list["BusyTime"]] = relationship("BusyTime", back_populates="status")
    users: Mapped[list["User"]] = relationship("User", back_populates="status")

    def __repr__(self):
        return f"id: {self.id}, title: {self.title}"


class BusyTime(Base):
    __tablename__ = "busy_time"

    id: Mapped[int_primary_key]
    status_id: Mapped[int] = mapped_column(ForeignKey("status.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), unique=True, index=True)
    end_time: Mapped[datetime]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    user: Mapped["User"] = relationship("User", back_populates="busy_time")
    status: Mapped["Status"] = relationship("Status", back_populates="busy_times")

    def __repr__(self):
        return f"id: {self.id}, status_id: {self.status_id}, user_id: {self.user_id}, end_time: {self.end_time}"
