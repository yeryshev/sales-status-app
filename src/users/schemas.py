from datetime import datetime
from typing import Optional

from pydantic import Field, BaseModel

from src.statuses.schemas import StatusGet


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
    is_account_manager: Optional[bool] = Field(None, alias="isAccountManager")
    status_id: Optional[int] = Field(None, alias="statusId")
    is_active: Optional[bool] = Field(None, alias="isActive")
    is_superuser: Optional[bool] = Field(None, alias="isSuperuser")
    is_verified: Optional[bool] = Field(None, alias="isVerified")


class BusyTime(BaseModel):
    id: int
    status_id: int = Field(None, serialization_alias="statusId")
    user_id: int = Field(None, serialization_alias="userId")
    end_time: datetime = Field(None, serialization_alias="endTime")


class UserGet(BaseModel):
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
    is_account_manager: bool = Field(None, serialization_alias="isAccountManager")
    status_id: int = Field(None, serialization_alias="statusId")
    is_active: bool = Field(None, serialization_alias="isActive")
    is_superuser: bool = Field(None, serialization_alias="isSuperuser")
    is_verified: bool = Field(None, serialization_alias="isVerified")
    status: Optional[StatusGet] = None
    busy_time: Optional[BusyTime] = Field(None, serialization_alias="busyTime")
    updated_at: datetime = Field(None, serialization_alias="updatedAt")
