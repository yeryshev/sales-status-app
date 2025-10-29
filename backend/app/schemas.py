from datetime import datetime

from fastapi_users import schemas
from pydantic import BaseModel, Field, field_validator


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
    telegram_chat_id: int | None = Field(None, serialization_alias="telegramChatId")
    inside_id: int | None = Field(None, serialization_alias="insideId")
    is_working_remotely: bool = Field(None, serialization_alias="isWorkingRemotely")
    is_coordinator: bool = Field(None, serialization_alias="isCoordinator")
    is_female: bool = Field(None, serialization_alias="isFemale")
    is_manager: bool = Field(None, serialization_alias="isManager")
    is_account_manager: bool = Field(None, serialization_alias="isAccountManager")
    is_cc_manager: bool = Field(None, serialization_alias="isCcManager")
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
    telegram_chat_id: int | None = Field(None, alias="telegramChatId")
    inside_id: int | None = Field(None, alias="insideId")
    is_working_remotely: bool | None = Field(None, alias="isWorkingRemotely")
    is_coordinator: bool | None = Field(None, alias="isCoordinator")
    is_female: bool | None = Field(None, alias="isFemale")
    is_manager: bool | None = Field(None, alias="isManager")
    is_account_manager: bool | None = Field(None, alias="isAccountManager")
    is_cc_manager: bool | None = Field(None, alias="isCcManager")
    status_id: int | None = Field(None, alias="statusId")


class BusyTime(BaseModel):
    id: int
    status_id: int = Field(None, serialization_alias="statusId")
    user_id: int = Field(None, serialization_alias="userId")
    end_time: datetime = Field(None, serialization_alias="endTime")


class UserGet(UserRead):
    status: StatusGet | None = None
    busy_time: BusyTime | None = Field(None, serialization_alias="busyTime")


class StatusHistoryRead(BaseModel):
    id: int
    user_id: int = Field(serialization_alias="userId")
    old_status_id: int | None = Field(None, serialization_alias="oldStatusId")
    new_status_id: int = Field(serialization_alias="newStatusId")
    start_time: datetime = Field(serialization_alias="startTime")
    end_time: datetime | None = Field(None, serialization_alias="endTime")
    duration_seconds: int | None = Field(None, serialization_alias="durationSeconds")
    created_at: datetime = Field(serialization_alias="createdAt")

    class Config:
        populate_by_name = True


class StatusAnalyticsRequest(BaseModel):
    user_id: int | None = Field(None, alias="userId")
    start_date: datetime = Field(alias="startDate")
    end_date: datetime = Field(alias="endDate")
    status_id: int | None = Field(None, alias="statusId")
    period_type: str = Field("day", alias="periodType")  # day, week, month

    @field_validator("start_date", mode="before")
    @classmethod
    def parse_start_date(cls, v) -> datetime:
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v)
            except ValueError:
                # Для start_date добавляем начало дня
                return datetime.fromisoformat(v + "T00:00:00")
        return v

    @field_validator("end_date", mode="before")
    @classmethod
    def parse_end_date(cls, v) -> datetime:
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v)
            except ValueError:
                # Для end_date добавляем конец дня
                return datetime.fromisoformat(v + "T23:59:59.999999")
        return v

    class Config:
        populate_by_name = True


class StatusAnalyticsResponse(BaseModel):
    user_id: int = Field(serialization_alias="userId")
    user_name: str = Field(serialization_alias="userName")
    status_id: int = Field(serialization_alias="statusId")
    status_title: str = Field(serialization_alias="statusTitle")
    start_time: datetime = Field(serialization_alias="startTime")
    end_time: datetime | None = Field(None, serialization_alias="endTime")
    total_duration_seconds: int = Field(serialization_alias="totalDurationSeconds")
    total_duration_minutes: float = Field(serialization_alias="totalDurationMinutes")
    total_duration_hours: float = Field(serialization_alias="totalDurationHours")
    percentage: float = Field(serialization_alias="percentage")
    periods: list[dict[str, str | int]] = Field(serialization_alias="periods")

    class Config:
        populate_by_name = True


class StatusHistoryQuery(BaseModel):
    user_id: int | None = Field(None, alias="user_id")
    start_date: datetime | None = Field(None, alias="start_date")
    end_date: datetime | None = Field(None, alias="end_date")
    limit: int = Field(100, alias="limit")

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def parse_dates(cls, v) -> datetime | None:
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v)
            except ValueError:
                # Попробуем парсить как дату без времени
                return datetime.fromisoformat(v + "T00:00:00")
        return v

    class Config:
        populate_by_name = True


class GetUserStatus(BaseModel):
    name: str
    status: int
    title: str
    is_deadline_required: bool


class UpdateTelegramRequest(BaseModel):
    username: str
    status: int
    secret: str


class SsoLoginRequest(BaseModel):
    email: str
    name: str | None = None
