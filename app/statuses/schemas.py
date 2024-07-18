from typing import Optional

from pydantic import BaseModel, Field


class StatusCreate(BaseModel):
    title: str
    is_deadline_required: Optional[bool] = Field(None, alias="isDeadlineRequired")
    priority: int


class StatusGet(BaseModel):
    id: int
    title: str
    is_deadline_required: bool = Field(None, serialization_alias="isDeadlineRequired")
    priority: int


class StatusUpdate(BaseModel):
    id: int
    title: Optional[str] = Field(None)
    is_deadline_required: Optional[bool] = Field(None, alias="isDeadlineRequired")
    priority: int
