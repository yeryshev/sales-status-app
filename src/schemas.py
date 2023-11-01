from pydantic import BaseModel
from datetime import datetime


class Status(BaseModel):
    title: str


class Comment(BaseModel):
    description: str
    owner_id: int


class Task(BaseModel):
    uuid: str
    status_id: int
    comment_id: int | None
    user_id: int
    date: datetime
