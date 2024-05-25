from sqlalchemy.orm import Mapped

from src.comments.models import Base
from src.models import intpk, created_at, updated_at


class Status(Base):
    __tablename__ = "status"

    id: Mapped[intpk]
    title: Mapped[str]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
