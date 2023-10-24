from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from model.database import Base


class Status(Base):
    __tablename__ = "statuses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)

    users = relationship("User", back_populates="status")
