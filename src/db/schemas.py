from pydantic import BaseModel, Field


class UserWithoutPassword(BaseModel):
    username: str | None
    email: str
    first_name: str | None
    second_name: str | None
    photo_url: str | None
    ext_number: str | None
    telegram: str | None
    is_working_remotely: bool
    status_id: int | None
    comment_id: int | None


class User(UserWithoutPassword):
    password: str


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
    date: str
