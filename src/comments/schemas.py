from pydantic import BaseModel


class CommentCreate(BaseModel):
    description: str


class CommentGet(CommentCreate):
    id: int
