from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, ForeignKeyConstraint, DateTime, Date
from sqlalchemy.orm import relationship

from src.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String)
    second_name = Column(String)
    photo_url = Column(String)
    ext_number = Column(String)
    telegram = Column(String)
    is_working_remotely = Column(Boolean, default=False, nullable=False)
    status_id = Column(Integer, default=3)
    comment_id = Column(Integer, nullable=True)

    comments = relationship("Comment", back_populates="owner")
    tasks = relationship("Task", back_populates="owner")

    # __table_args__ = (
    #     ForeignKeyConstraint(['commentId'], ["comments.id"], ondelete="SET NULL"),
    # )


class Status(Base):
    __tablename__ = "statuses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="comments")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String)
    status_id = Column(Integer)
    comment_id = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)

    owner = relationship("User", back_populates="tasks")
