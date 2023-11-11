from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TaskIn(BaseModel):
    date: datetime
    status_id: int = Field(None, alias="statusId")
    comment_id: Optional[int] = Field(None, alias="commentId")


class TaskOut(TaskIn):
    uuid: str
    user_id: int = Field(None, serialization_alias="userId")
    status_id: int = Field(None, serialization_alias="statusId")
    comment_id: Optional[int] = Field(None, serialization_alias="commentId")
