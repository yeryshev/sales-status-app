from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from src.models import intpk, created_at, updated_at
from src.database import Base


class Comment(Base):
    __tablename__ = "comment"

    id: Mapped[intpk]
    description: Mapped[str]
    owner_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
