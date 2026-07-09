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
    user_name: str | None = Field(None, serialization_alias="userName")
    old_status_id: int | None = Field(None, serialization_alias="oldStatusId")
    old_status_title: str | None = Field(None, serialization_alias="oldStatusTitle")
    new_status_id: int = Field(serialization_alias="newStatusId")
    new_status_title: str | None = Field(None, serialization_alias="newStatusTitle")
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
    period_type: str = Field(
        "today", alias="periodType"
    )  # today, yesterday, last30days, currentWeek, lastWeek, currentMonth, lastMonth, custom
    department_id: str | None = Field(
        None, alias="departmentId"
    )  # "managers", "account_managers", "customer_care"

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


class StatusSummaryStatusItem(BaseModel):
    status_id: int = Field(serialization_alias="statusId")
    status_title: str = Field(serialization_alias="statusTitle")
    duration_seconds: int = Field(serialization_alias="durationSeconds")
    duration_hours: float = Field(serialization_alias="durationHours")
    percentage: float = 0

    class Config:
        populate_by_name = True


class StatusSummaryUserItem(BaseModel):
    user_id: int = Field(serialization_alias="userId")
    user_name: str = Field(serialization_alias="userName")
    duration_seconds: int = Field(serialization_alias="durationSeconds")
    duration_hours: float = Field(serialization_alias="durationHours")
    work_duration_seconds: int = Field(serialization_alias="workDurationSeconds")
    work_duration_hours: float = Field(serialization_alias="workDurationHours")
    work_percentage: float = Field(serialization_alias="workPercentage")

    class Config:
        populate_by_name = True


class StatusSummaryDayStatusItem(BaseModel):
    status_id: int = Field(serialization_alias="statusId")
    status_title: str = Field(serialization_alias="statusTitle")
    duration_seconds: int = Field(serialization_alias="durationSeconds")
    duration_hours: float = Field(serialization_alias="durationHours")

    class Config:
        populate_by_name = True


class StatusSummaryDayItem(BaseModel):
    date: str
    total_duration_seconds: int = Field(serialization_alias="totalDurationSeconds")
    user_count: int = Field(0, serialization_alias="userCount")
    statuses: list[StatusSummaryDayStatusItem]

    class Config:
        populate_by_name = True


class StatusSummaryUserStatusItem(BaseModel):
    user_id: int = Field(serialization_alias="userId")
    user_name: str = Field(serialization_alias="userName")
    statuses: list[StatusSummaryDayStatusItem]

    class Config:
        populate_by_name = True


class StatusAnalyticsSummaryResponse(BaseModel):
    total_duration_seconds: int = Field(serialization_alias="totalDurationSeconds")
    total_duration_hours: float = Field(serialization_alias="totalDurationHours")
    work_duration_seconds: int = Field(serialization_alias="workDurationSeconds")
    work_duration_hours: float = Field(serialization_alias="workDurationHours")
    work_percentage: float = Field(serialization_alias="workPercentage")
    offline_duration_seconds: int = Field(serialization_alias="offlineDurationSeconds")
    offline_duration_hours: float = Field(serialization_alias="offlineDurationHours")
    unique_users: int = Field(serialization_alias="uniqueUsers")
    unique_statuses: int = Field(serialization_alias="uniqueStatuses")
    segment_count: int = Field(serialization_alias="segmentCount")
    is_averaged: bool = Field(False, serialization_alias="isAveraged")
    working_days_count: int = Field(0, serialization_alias="workingDaysCount")
    by_status: list[StatusSummaryStatusItem] = Field(serialization_alias="byStatus")
    by_user: list[StatusSummaryUserItem] = Field(serialization_alias="byUser")
    by_day: list[StatusSummaryDayItem] = Field(serialization_alias="byDay")
    by_user_status: list[StatusSummaryUserStatusItem] = Field(
        serialization_alias="byUserStatus"
    )

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


# Схемы для дополнительных данных пользователя от внешнего сервиса
class QlikData(BaseModel):
    forecast_with_k: str = Field(..., alias="forecastWithK")
    fact_with_k: str = Field(..., alias="factWithK")

    class Config:
        populate_by_name = True


class BudgetDealsData(BaseModel):
    new_sale: int | None = Field(None, alias="newSale")
    new_sale_and_upsale: int | None = Field(None, alias="newSaleAndUpsale")

    class Config:
        populate_by_name = True


class LastWeekData(BaseModel):
    budget: int
    deals: int


class AbsenceData(BaseModel):
    is_absence: bool = Field(..., alias="isAbsence")
    end_date: str | None = Field(None, alias="endDate")
    description: str | None = None

    class Config:
        populate_by_name = True


class ExternalUserDataRequest(BaseModel):
    """Схема для приёма данных от внешнего сервиса через POST запрос"""

    id_amo_crm: int = Field(..., alias="idAmoCRM")
    id_inside: int = Field(..., alias="idInside")
    id_chatwoot: int = Field(..., alias="idChatwoot")
    qlik: QlikData | None = None
    budget: BudgetDealsData
    deals: BudgetDealsData
    overdue_tasks: int = Field(..., alias="overdueTasks")
    conversations: int
    tickets: int
    avatar: str
    absence: AbsenceData
    mango_state: bool = Field(..., alias="mangoState")
    leads: int
    last_week: LastWeekData = Field(..., alias="lastWeek")
    mango_ext: int | None = Field(None, alias="mangoExt")

    class Config:
        populate_by_name = True


class ExternalUserDataResponse(BaseModel):
    """Схема для отправки данных на фронтенд через WebSocket"""

    id_amo_crm: int = Field(serialization_alias="idAmoCRM")
    id_inside: int = Field(serialization_alias="idInside")
    id_chatwoot: int = Field(serialization_alias="idChatwoot")
    qlik: QlikData | None = None
    budget: BudgetDealsData
    deals: BudgetDealsData
    overdue_tasks: int = Field(serialization_alias="overdueTasks")
    conversations: int
    tickets: int
    avatar: str
    is_birthday: bool = Field(default=False, serialization_alias="isBirthday")
    absence: AbsenceData
    mango_state: bool = Field(serialization_alias="mangoState")
    leads: int
    last_week: LastWeekData = Field(serialization_alias="lastWeek")

    class Config:
        populate_by_name = True


class WorkloadCountersData(BaseModel):
    leads: int | None = None
    overdue_tasks: int | None = Field(None, serialization_alias="overdueTasks")
    open_conversations: int | None = Field(
        None, serialization_alias="openConversations"
    )
    assigned_tickets: int | None = Field(None, serialization_alias="assignedTickets")

    class Config:
        populate_by_name = True


class WorkloadUserAnalyticsItem(BaseModel):
    user_id: int = Field(serialization_alias="userId")
    user_name: str = Field(serialization_alias="userName")
    snapshot_days: int = Field(serialization_alias="snapshotDays")
    averages: WorkloadCountersData
    totals: WorkloadCountersData


class WorkloadDayAnalyticsItem(BaseModel):
    date: str
    user_count: int = Field(serialization_alias="userCount")
    averages: WorkloadCountersData
    totals: WorkloadCountersData


class WorkloadAnalyticsSummaryResponse(BaseModel):
    snapshot_days: int = Field(serialization_alias="snapshotDays")
    unique_users: int = Field(serialization_alias="uniqueUsers")
    averages: WorkloadCountersData
    by_user: list[WorkloadUserAnalyticsItem] = Field(serialization_alias="byUser")
    by_day: list[WorkloadDayAnalyticsItem] = Field(serialization_alias="byDay")

    class Config:
        populate_by_name = True


class WorkloadAnalyticsRequest(BaseModel):
    start_date: datetime = Field(alias="startDate")
    end_date: datetime = Field(alias="endDate")
    user_id: int | None = Field(None, alias="userId")
    department_id: str | None = Field(None, alias="departmentId")

    class Config:
        populate_by_name = True
