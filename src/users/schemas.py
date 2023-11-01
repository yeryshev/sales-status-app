from datetime import datetime
from typing import Optional
from pydantic import Field, BaseModel


class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, alias="firstName")
    second_name: Optional[str] = Field(None, alias="secondName")
    photo_url: Optional[str] = Field(None, alias="photoUrl")
    ext_number: Optional[str] = Field(None, alias="extNumber")
    telegram: Optional[str] = Field(None, alias="telegram")
    is_working_remotely: Optional[bool] = Field(None, alias="isWorkingRemotely")
    status_id: Optional[int] = Field(None, alias="statusId")
    comment_id: Optional[int] = Field(None, alias="commentId")
    is_active: Optional[bool] = Field(None, alias="isActive")
    is_superuser: Optional[bool] = Field(None, alias="isSuperuser")
    is_verified: Optional[bool] = Field(None, alias="isVerified")


class UserRead(BaseModel):
    first_name: Optional[str] = Field(None, serialization_alias="firstName")
    second_name: Optional[str] = Field(None, serialization_alias="secondName")
    photo_url: Optional[str] = Field(None, serialization_alias="photoUrl")
    ext_number: Optional[str] = Field(None, serialization_alias="extNumber")
    telegram: Optional[str] = Field(None, serialization_alias="telegram")
    is_working_remotely: Optional[bool] = Field(None, serialization_alias="isWorkingRemotely")
    status_id: int = Field(None, serialization_alias="statusId")
    comment_id: Optional[int] = Field(None, serialization_alias="commentId")
    updated_at: datetime = Field(None, serialization_alias="updatedAt")
    is_active: bool = Field(None, serialization_alias="isActive")
    is_superuser: bool = Field(None, serialization_alias="isSuperuser")
    is_verified: bool = Field(None, serialization_alias="isVerified")
