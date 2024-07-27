from datetime import datetime

from fastapi_users import schemas
from pydantic import BaseModel, Field


class StatusCreate(BaseModel):
    title: str
    is_deadline_required: bool | None = Field(None, alias="isDeadlineRequired")
    priority: int


class StatusGet(BaseModel):
    id: int
    title: str
    is_deadline_required: bool = Field(None, serialization_alias="isDeadlineRequired")
    priority: int


class StatusUpdate(BaseModel):
    id: int
    title: str | None = Field(None)
    is_deadline_required: bool | None = Field(None, alias="isDeadlineRequired")
    priority: int


class UserRead(schemas.BaseUser[int]):
    is_active: bool = Field(None, serialization_alias="isActive")
    is_superuser: bool = Field(None, serialization_alias="isSuperuser")
    is_verified: bool = Field(None, serialization_alias="isVerified")
    first_name: str | None = Field(None, serialization_alias="firstName")
    second_name: str | None = Field(None, serialization_alias="secondName")
    ext_number: str | None = Field(None, serialization_alias="extNumber")
    telegram: str | None = Field(None, serialization_alias="telegram")
    inside_id: int | None = Field(None, serialization_alias="insideId")
    is_working_remotely: bool = Field(None, serialization_alias="isWorkingRemotely")
    is_coordinator: bool = Field(None, serialization_alias="isCoordinator")
    is_female: bool = Field(None, serialization_alias="isFemale")
    is_manager: bool = Field(None, serialization_alias="isManager")
    is_account_manager: bool = Field(None, serialization_alias="isAccountManager")
    status_id: int | None = Field(None, serialization_alias="statusId")
    updated_at: datetime = Field(None, serialization_alias="updatedAt")

    class Config:
        populate_by_name = True


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    is_active: bool | None = Field(None, alias="isActive")
    is_superuser: bool | None = Field(None, alias="isSuperuser")
    is_verified: bool | None = Field(None, alias="isVerified")
    first_name: str | None = Field(None, alias="firstName")
    second_name: str | None = Field(None, alias="secondName")
    ext_number: str | None = Field(None, alias="extNumber")
    telegram: str | None = Field(None, alias="telegram")
    inside_id: int | None = Field(None, alias="insideId")
    is_working_remotely: bool | None = Field(None, alias="isWorkingRemotely")
    is_coordinator: bool | None = Field(None, alias="isCoordinator")
    is_female: bool | None = Field(None, alias="isFemale")
    is_manager: bool | None = Field(None, alias="isManager")
    is_account_manager: bool | None = Field(None, alias="isAccountManager")
    status_id: int | None = Field(None, alias="statusId")


class BusyTime(BaseModel):
    id: int
    status_id: int = Field(None, serialization_alias="statusId")
    user_id: int = Field(None, serialization_alias="userId")
    end_time: datetime = Field(None, serialization_alias="endTime")


class UserGet(UserRead):
    status: StatusGet | None = None
    busy_time: BusyTime | None = Field(None, serialization_alias="busyTime")


class GetUserStatus(BaseModel):
    name: str
    status: int
    title: str
    is_deadline_required: bool


class UpdateTelegramRequest(BaseModel):
    username: str
    status: int
    secret: str
