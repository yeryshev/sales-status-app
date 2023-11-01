from typing import Optional
from fastapi_users import schemas
from pydantic import Field


class UserRead(schemas.BaseUser[int]):
    first_name: Optional[str] = Field(None, serialization_alias="firstName")
    second_name: Optional[str] = Field(None, serialization_alias="secondName")
    photo_url: Optional[str] = Field(None, serialization_alias="photoUrl")
    ext_number: Optional[str] = Field(None, serialization_alias="extNumber")
    telegram: Optional[str] = Field(None, serialization_alias="telegram")
    is_working_remotely: bool = Field(None, serialization_alias="isWorkingRemotely")
    status_id: int = Field(None, serialization_alias="statusId")
    comment_id: Optional[int] = Field(None, serialization_alias="commentId")

    class Config:
        populate_by_name = True


class UserCreate(schemas.BaseUserCreate):
    pass
