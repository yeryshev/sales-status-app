from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, ForeignKeyConstraint, DateTime, Date
from sqlalchemy.orm import relationship

from src.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    firstName = Column(String)
    secondName = Column(String)
    photoUrl = Column(String)
    extNumber = Column(String)
    telegram = Column(String)
    isWorkingRemotely = Column(Boolean, default=False, nullable=False)
    statusId = Column(Integer, default=3)
    commentId = Column(Integer, nullable=True)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)

    comments = relationship("Comment", back_populates="owner")
    tasks = relationship("Task", back_populates="owner")

    # __table_args__ = (
    #     ForeignKeyConstraint(['commentId'], ["comments.id"], ondelete="SET NULL"),
    # )


class Status(Base):
    __tablename__ = "statuses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    ownerId = Column(Integer, ForeignKey("users.id"), nullable=False)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)

    owner = relationship("User", back_populates="comments")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String)
    statusId = Column(Integer)
    commentId = Column(Integer)
    userId = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)

    owner = relationship("User", back_populates="tasks")
