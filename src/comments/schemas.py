from pydantic import BaseModel


class CommentIn(BaseModel):
    description: str


class CommentOut(CommentIn):
    id: int
