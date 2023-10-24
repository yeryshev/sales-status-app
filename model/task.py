from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, DateTime
from sqlalchemy.orm import relationship

from model.database import Base


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
