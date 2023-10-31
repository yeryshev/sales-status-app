from datetime import datetime
from typing import Optional

from fastapi_users import schemas
from pydantic import Field


class UserRead(schemas.BaseUser[int]):
    first_name: Optional[str]
    second_name: Optional[str]
    photo_url: Optional[str]
    ext_number: Optional[str]
    telegram: Optional[str]
    is_working_remotely: bool
    status_id: int
    comment_id: Optional[int]
    updated_at: datetime


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    first_name: Optional[str] = Field(None, alias="firstName")
    second_name: Optional[str] = Field(None, alias="secondName")
    photo_url: Optional[str] = Field(None, alias="photo")
    ext_number: Optional[str] = Field(None, alias="extNumber")
    telegram: Optional[str] = Field(None, alias="telegram")
    is_working_remotely: Optional[bool] = Field(None, alias="isWorkingRemotely")
    status_id: Optional[int] = Field(None, alias="statusId")
    comment_id: Optional[int] = Field(None, alias="commentId")
    is_active: Optional[bool] = Field(None, alias="isActive")
    is_superuser: Optional[bool] = Field(None, alias="isSuperuser")
    is_verified: Optional[bool] = Field(None, alias="isVerified")
