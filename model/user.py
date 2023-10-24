from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, ForeignKeyConstraint, DateTime
from sqlalchemy.orm import relationship

from model.database import Base


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
    statusId = Column(Integer, ForeignKey("statuses.id"), default=3)
    commentId = Column(Integer, ForeignKey("comments.id"), nullable=True)
    emailConfirmationToken = Column(String, nullable=True, default=None)
    emailConfirmed = Column(Boolean, default=False, nullable=True)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)

    status = relationship("Status", back_populates="users")
    comments = relationship("Comment", back_populates="owner")
    tasks = relationship("Task", back_populates="owner")

    __table_args__ = (
        ForeignKeyConstraint(['commentId'], ["comments.id"], ondelete="SET NULL"),
    )
