from pydantic import BaseModel


class StatusIn(BaseModel):
    title: str


class StatusOut(StatusIn):
    id: int


class StatusUpdate(StatusIn):
    id: int
