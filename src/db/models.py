from datetime import datetime
from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column

from src.db.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    first_name: Mapped[str] = mapped_column(nullable=True)
    second_name: Mapped[str] = mapped_column(nullable=True)
    photo_url: Mapped[str] = mapped_column(nullable=True)
    ext_number: Mapped[str] = mapped_column(nullable=True)
    telegram: Mapped[str] = mapped_column(nullable=True)
    is_working_remotely: Mapped[bool] = mapped_column(default=False, nullable=False)
    status_id: Mapped[int] = mapped_column(default=3, nullable=False)
    comment_id: Mapped[int] = mapped_column(ForeignKey("comments.id", ondelete="SET NULL"), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now, onupdate=datetime.now, nullable=False)

    comments: Mapped[List["Comment"]] = relationship(foreign_keys=[comment_id])
    tasks: Mapped[List["Task"]] = relationship(back_populates="owner")


class Status(Base):
    __tablename__ = "statuses"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(nullable=False)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    owner: Mapped["User"] = relationship(foreign_keys=owner_id)


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    uuid: Mapped[str] = mapped_column(unique=True)
    status_id: Mapped[int] = mapped_column(ForeignKey("statuses.id"), nullable=False)
    comment_id: Mapped[int] = mapped_column(ForeignKey("comments.id", ondelete="SET NULL"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date: Mapped[datetime] = mapped_column(nullable=False)

    owner: Mapped["User"] = relationship(back_populates="tasks", foreign_keys=user_id)
