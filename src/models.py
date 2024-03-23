from datetime import datetime, timezone
from typing import Annotated
from sqlalchemy import text
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base

intpk = Annotated[int, mapped_column(primary_key=True)]
created_at = Annotated[datetime, mapped_column(server_default=text("TIMEZONE('utc', now())"))]
updated_at = Annotated[datetime, mapped_column(
        server_default=text("TIMEZONE('utc', now())"),
        onupdate=datetime.now(timezone.utc),
    )]


class Status(Base):
    __tablename__ = "status"

    id: Mapped[intpk]
    title: Mapped[str]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
