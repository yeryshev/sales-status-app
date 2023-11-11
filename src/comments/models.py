from sqlalchemy.orm import Mapped
from src.models import intpk, created_at, updated_at
from src.database import Base


class Comment(Base):
    __tablename__ = "comment"

    id: Mapped[intpk]
    description: Mapped[str]
    owner_id: Mapped[int]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
