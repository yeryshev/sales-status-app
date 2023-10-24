from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from model.database import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    ownerId = Column(Integer, ForeignKey("users.id"), nullable=False)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)

    owner = relationship("User", back_populates="comments")
