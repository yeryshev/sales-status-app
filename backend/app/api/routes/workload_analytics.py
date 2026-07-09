from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth_config import current_superuser
from app.core.db import get_async_session
from app.models import User
from app.schemas import WorkloadAnalyticsRequest, WorkloadAnalyticsSummaryResponse
from app.workload_snapshot_service import (
    fetch_workload_analytics_summary,
    get_workload_snapshot_date_range,
)

router = APIRouter()


@router.post("/summary", response_model=WorkloadAnalyticsSummaryResponse)
async def get_workload_analytics_summary(
    request: WorkloadAnalyticsRequest,
    session: AsyncSession = Depends(get_async_session),
    _current_user: User = Depends(current_superuser),
):
    """Aggregated end-of-day workload metrics for analytics dashboards."""
    try:
        summary = await fetch_workload_analytics_summary(
            session,
            start_date=request.start_date.date(),
            end_date=request.end_date.date(),
            user_id=request.user_id,
            department_id=request.department_id,
        )
        return WorkloadAnalyticsSummaryResponse.model_validate(summary)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка получения аналитики нагрузки: {exc}",
        ) from exc


@router.get("/date-range")
async def get_workload_date_range(
    session: AsyncSession = Depends(get_async_session),
    _current_user: User = Depends(current_superuser),
):
    try:
        return await get_workload_snapshot_date_range(session)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка получения диапазона дат: {exc}",
        ) from exc
