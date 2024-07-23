from datetime import datetime
from typing import Optional

from fastapi_users import schemas
from pydantic import Field, BaseModel


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


class UserRead(schemas.BaseUser[int]):
    is_active: bool = Field(None, serialization_alias="isActive")
    is_superuser: bool = Field(None, serialization_alias="isSuperuser")
    is_verified: bool = Field(None, serialization_alias="isVerified")
    first_name: Optional[str] = Field(None, serialization_alias="firstName")
    second_name: Optional[str] = Field(None, serialization_alias="secondName")
    ext_number: Optional[str] = Field(None, serialization_alias="extNumber")
    telegram: Optional[str] = Field(None, serialization_alias="telegram")
    inside_id: Optional[int] = Field(None, serialization_alias="insideId")
    is_working_remotely: bool = Field(None, serialization_alias="isWorkingRemotely")
    is_coordinator: bool = Field(None, serialization_alias="isCoordinator")
    is_female: bool = Field(None, serialization_alias="isFemale")
    is_manager: bool = Field(None, serialization_alias="isManager")
    is_account_manager: bool = Field(None, serialization_alias="isAccountManager")
    status_id: Optional[int] = Field(None, serialization_alias="statusId")
    updated_at: datetime = Field(None, serialization_alias="updatedAt")

    class Config:
        populate_by_name = True


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    is_active: Optional[bool] = Field(None, alias="isActive")
    is_superuser: Optional[bool] = Field(None, alias="isSuperuser")
    is_verified: Optional[bool] = Field(None, alias="isVerified")
    first_name: Optional[str] = Field(None, alias="firstName")
    second_name: Optional[str] = Field(None, alias="secondName")
    ext_number: Optional[str] = Field(None, alias="extNumber")
    telegram: Optional[str] = Field(None, alias="telegram")
    inside_id: Optional[int] = Field(None, alias="insideId")
    is_working_remotely: Optional[bool] = Field(None, alias="isWorkingRemotely")
    is_coordinator: Optional[bool] = Field(None, alias="isCoordinator")
    is_female: Optional[bool] = Field(None, alias="isFemale")
    is_manager: Optional[bool] = Field(None, alias="isManager")
    is_account_manager: Optional[bool] = Field(None, alias="isAccountManager")
    status_id: Optional[int] = Field(None, alias="statusId")


class BusyTime(BaseModel):
    id: int
    status_id: int = Field(None, serialization_alias="statusId")
    user_id: int = Field(None, serialization_alias="userId")
    end_time: datetime = Field(None, serialization_alias="endTime")


class UserGet(UserRead):
    status: Optional[StatusGet] = None
    busy_time: Optional[BusyTime] = Field(None, serialization_alias="busyTime")


class GetUserStatus(BaseModel):
    name: str
    status: int
    title: str
    is_deadline_required: bool


class UpdateTelegramRequest(BaseModel):
    username: str
    status: int
    secret: str
