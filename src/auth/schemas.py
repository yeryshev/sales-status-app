from typing import Optional

from fastapi_users import schemas
from pydantic import Field


class UserRead(schemas.BaseUser[int]):
    id: int
    first_name: Optional[str] = Field(None, serialization_alias="firstName")
    second_name: Optional[str] = Field(None, serialization_alias="secondName")
    ext_number: Optional[str] = Field(None, serialization_alias="extNumber")
    telegram: Optional[str] = Field(None, serialization_alias="telegram")
    inside_id: Optional[int] = Field(None, serialization_alias="insideId")
    is_working_remotely: bool = Field(None, serialization_alias="isWorkingRemotely")
    is_coordinator: bool = Field(None, serialization_alias="isCoordinator")
    is_female: bool = Field(None, serialization_alias="isFemale")
    status_id: int = Field(None, serialization_alias="statusId")
    comment_id: Optional[int] = Field(None, serialization_alias="commentId")
    is_active: bool = Field(None, serialization_alias="isActive")
    is_superuser: bool = Field(None, serialization_alias="isSuperuser")
    is_verified: bool = Field(None, serialization_alias="isVerified")

    class Config:
        populate_by_name = True


class UserCreate(schemas.BaseUserCreate):
    pass
