from datetime import datetime
from typing import Optional

from pydantic import Field, BaseModel


class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, alias="firstName")
    second_name: Optional[str] = Field(None, alias="secondName")
    ext_number: Optional[str] = Field(None, alias="extNumber")
    telegram: Optional[str] = Field(None, alias="telegram")
    inside_id: Optional[int] = Field(None, alias="insideId")
    is_working_remotely: Optional[bool] = Field(None, alias="isWorkingRemotely")
    is_coordinator: Optional[bool] = Field(None, alias="isCoordinator")
    is_female: Optional[bool] = Field(None, alias="isFemale")
    is_manager: Optional[bool] = Field(None, alias="isManager")
    status_id: Optional[int] = Field(None, alias="statusId")
    comment_id: Optional[int] = Field(None, alias="commentId")
    is_active: Optional[bool] = Field(None, alias="isActive")
    is_superuser: Optional[bool] = Field(None, alias="isSuperuser")
    is_verified: Optional[bool] = Field(None, alias="isVerified")


class UserRead(BaseModel):
    id: int
    email: str
    first_name: Optional[str] = Field(None, serialization_alias="firstName")
    second_name: Optional[str] = Field(None, serialization_alias="secondName")
    ext_number: Optional[str] = Field(None, serialization_alias="extNumber")
    telegram: Optional[str] = Field(None, serialization_alias="telegram")
    inside_id: Optional[int] = Field(None, serialization_alias="insideId")
    is_working_remotely: Optional[bool] = Field(None, serialization_alias="isWorkingRemotely")
    is_coordinator: bool = Field(None, serialization_alias="isCoordinator")
    is_female: bool = Field(None, serialization_alias="isFemale")
    is_manager: bool = Field(None, serialization_alias="isManager")
    status_id: int = Field(None, serialization_alias="statusId")
    comment_id: Optional[int] = Field(None, serialization_alias="commentId")
    is_active: bool = Field(None, serialization_alias="isActive")
    is_superuser: bool = Field(None, serialization_alias="isSuperuser")
    is_verified: bool = Field(None, serialization_alias="isVerified")


class Teammate(BaseModel):
    id: int
    email: str
    first_name: Optional[str] = Field(None, serialization_alias="firstName")
    second_name: Optional[str] = Field(None, serialization_alias="secondName")
    ext_number: Optional[str] = Field(None, serialization_alias="extNumber")
    telegram: Optional[str] = Field(None, serialization_alias="telegram")
    inside_id: Optional[int] = Field(None, serialization_alias="insideId")
    is_working_remotely: Optional[bool] = Field(None, serialization_alias="isWorkingRemotely")
    is_coordinator: bool = Field(None, serialization_alias="isCoordinator")
    is_female: bool = Field(None, serialization_alias="isFemale")
    is_manager: bool = Field(None, serialization_alias="isManager")
    status: Optional[str]
    comment: Optional[str]
    updated_at: datetime = Field(None, serialization_alias="updatedAt")
