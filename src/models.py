from datetime import datetime
from typing import Annotated, Optional

from sqlalchemy import text, ForeignKey, Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base

intpk = Annotated[int, mapped_column(primary_key=True)]
created_at = Annotated[datetime, mapped_column(server_default=text("TIMEZONE('utc', now())"))]
updated_at = Annotated[datetime, mapped_column(
        server_default=text("TIMEZONE('utc', now())"),
        onupdate=datetime.utcnow,
    )]


class Status(Base):
    __tablename__ = "status"

    id: Mapped[intpk]
    title: Mapped[str]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class Comment(Base):
    __tablename__ = "comment"

    id: Mapped[intpk]
    description: Mapped[str]
    owner_id: Mapped[int]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class Task(Base):
    __tablename__ = "task"

    id: Mapped[intpk]
    uuid: Mapped[str]
    status_id: Mapped[int] = mapped_column(ForeignKey("status.id", ondelete="CASCADE"))
    comment_id: Mapped[int] = mapped_column(ForeignKey("comment.id", ondelete="SET NULL"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    date: Mapped[datetime]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
