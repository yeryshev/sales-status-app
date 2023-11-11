from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base
from src.models import intpk
from src.models import created_at, updated_at


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
