from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, date, datetime

import httpx
from sqlalchemy import func, or_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models import User, UserWorkloadDailySnapshot


@dataclass(frozen=True, slots=True)
class WorkloadCounters:
    leads: int
    overdue_tasks: int
    open_conversations: int
    assigned_tickets: int


def empty_workload_counters() -> WorkloadCounters:
    return WorkloadCounters(0, 0, 0, 0)


def get_department_filter(department_id: str | None):
    if department_id == "managers":
        return User.is_manager.is_(True)
    if department_id == "account_managers":
        return User.is_account_manager.is_(True)
    if department_id == "customer_care":
        return User.is_cc_manager.is_(True)
    return or_(
        User.is_manager.is_(True),
        User.is_account_manager.is_(True),
        User.is_cc_manager.is_(True),
    )


METRIC_FIELDS = (
    "leads",
    "overdue_tasks",
    "open_conversations",
    "assigned_tickets",
)


def _empty_counters_dict() -> dict[str, None]:
    return dict.fromkeys(METRIC_FIELDS, None)


def _new_user_aggregate(user_id: int, user_name: str) -> dict:
    return {
        "user_id": user_id,
        "user_name": user_name,
        "snapshot_days": 0,
        "sums": dict.fromkeys(METRIC_FIELDS, 0),
        "counts": dict.fromkeys(METRIC_FIELDS, 0),
    }


def _new_day_aggregate() -> dict:
    aggregate = dict.fromkeys(METRIC_FIELDS, 0)
    aggregate["user_count"] = 0
    for field in METRIC_FIELDS:
        aggregate[f"{field}_count"] = 0
    return aggregate


def _finalize_counters(
    sums: dict[str, int], counts: dict[str, int]
) -> dict[str, int | None]:
    return {
        field: int(round(sums[field] / counts[field])) if counts[field] else None
        for field in METRIC_FIELDS
    }


async def fetch_external_team_workload() -> list[dict]:
    """Fetch workload counters from external integration service (n8n)."""
    if not settings.EXTERNAL_TEAM_DATA_URL:
        return []

    timeout = httpx.Timeout(30.0, connect=10.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(str(settings.EXTERNAL_TEAM_DATA_URL))
        response.raise_for_status()
        payload = response.json()
        return payload if isinstance(payload, list) else []


def _coerce_int(value) -> int | None:
    if value is None:
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _parse_workload_item(item: dict) -> tuple[int | None, WorkloadCounters | None]:
    inside_id = _coerce_int(item.get("idInside") or item.get("id_inside"))
    if not inside_id:
        return None, None

    counters = WorkloadCounters(
        leads=_coerce_int(item.get("leads")) or 0,
        overdue_tasks=_coerce_int(item.get("overdueTasks") or item.get("overdue_tasks"))
        or 0,
        open_conversations=_coerce_int(
            item.get("conversations")
            or item.get("openConversations")
            or item.get("open_conversations")
        )
        or 0,
        assigned_tickets=_coerce_int(
            item.get("tickets")
            or item.get("assignedTickets")
            or item.get("assigned_tickets")
        )
        or 0,
    )
    return inside_id, counters


async def snapshot_daily_user_workload(
    session: AsyncSession,
    *,
    snapshot_at: datetime | None = None,
) -> int:
    """Persist end-of-day workload counters for every user, fetched via external API."""
    snapshot_at = snapshot_at or datetime.now(UTC).replace(tzinfo=None)
    snapshot_date = snapshot_at.date()

    users_result = await session.execute(select(User.id, User.inside_id))
    users = list(users_result.all())
    if not users:
        return 0

    payload = await fetch_external_team_workload()
    by_inside_id: dict[int, WorkloadCounters] = {}
    for item in payload:
        if not isinstance(item, dict):
            continue
        inside_id, counters = _parse_workload_item(item)
        if inside_id and counters:
            by_inside_id[inside_id] = counters

    rows = []
    for user_id, inside_id in users:
        counters = by_inside_id.get(int(inside_id)) if inside_id is not None else None
        rows.append(
            {
                "user_id": int(user_id),
                "snapshot_date": snapshot_date,
                "snapshot_at": snapshot_at,
                "leads": counters.leads if counters else None,
                "overdue_tasks": counters.overdue_tasks if counters else None,
                "open_conversations": (
                    counters.open_conversations if counters else None
                ),
                "assigned_tickets": (counters.assigned_tickets if counters else None),
            }
        )

    insert_stmt = insert(UserWorkloadDailySnapshot).values(rows)
    upsert_stmt = insert_stmt.on_conflict_do_update(
        constraint="uq_user_workload_snapshot_day",
        set_={
            "snapshot_at": insert_stmt.excluded.snapshot_at,
            "leads": insert_stmt.excluded.leads,
            "overdue_tasks": insert_stmt.excluded.overdue_tasks,
            "open_conversations": insert_stmt.excluded.open_conversations,
            "assigned_tickets": insert_stmt.excluded.assigned_tickets,
        },
    )
    await session.execute(upsert_stmt)
    return len(rows)


async def fetch_workload_analytics_summary(
    session: AsyncSession,
    *,
    start_date: date,
    end_date: date,
    user_id: int | None = None,
    department_id: str | None = None,
) -> dict:
    query = (
        select(UserWorkloadDailySnapshot, User)
        .join(User, User.id == UserWorkloadDailySnapshot.user_id)
        .where(
            UserWorkloadDailySnapshot.snapshot_date >= start_date,
            UserWorkloadDailySnapshot.snapshot_date <= end_date,
        )
    )

    if user_id:
        query = query.where(UserWorkloadDailySnapshot.user_id == user_id)
    elif department_id is not None:
        query = query.where(get_department_filter(department_id))

    result = await session.execute(query)
    rows = result.all()
    if not rows:
        return {
            "snapshot_days": 0,
            "unique_users": 0,
            "averages": _empty_counters_dict(),
            "by_user": [],
            "by_day": [],
        }

    user_totals: dict[int, dict] = {}
    day_totals: dict[date, dict] = {}

    for snapshot, user in rows:
        user_entry = user_totals.setdefault(
            snapshot.user_id,
            _new_user_aggregate(
                snapshot.user_id,
                f"{user.first_name or ''} {user.second_name or ''}".strip(),
            ),
        )
        user_entry["snapshot_days"] += 1
        for field in METRIC_FIELDS:
            value = getattr(snapshot, field)
            if value is None:
                continue
            user_entry["sums"][field] += value
            user_entry["counts"][field] += 1

        day_entry = day_totals.setdefault(snapshot.snapshot_date, _new_day_aggregate())
        day_entry["user_count"] += 1
        for field in METRIC_FIELDS:
            value = getattr(snapshot, field)
            if value is None:
                continue
            day_entry[field] += value
            day_entry[f"{field}_count"] += 1

    unique_users = len(user_totals)
    snapshot_days = len(day_totals)

    department_sums = dict.fromkeys(METRIC_FIELDS, 0)
    department_counts = dict.fromkeys(METRIC_FIELDS, 0)
    by_user = []
    for entry in user_totals.values():
        averages = _finalize_counters(entry["sums"], entry["counts"])
        totals = {
            field: entry["sums"][field] if entry["counts"][field] else None
            for field in METRIC_FIELDS
        }
        for field in METRIC_FIELDS:
            if averages[field] is not None:
                department_sums[field] += averages[field]
                department_counts[field] += 1
        by_user.append(
            {
                "user_id": entry["user_id"],
                "user_name": entry["user_name"],
                "snapshot_days": entry["snapshot_days"],
                "averages": averages,
                "totals": totals,
            }
        )
    by_user.sort(
        key=lambda item: item["averages"]["overdue_tasks"] or -1,
        reverse=True,
    )

    averages = {
        field: (
            int(round(department_sums[field] / department_counts[field]))
            if department_counts[field]
            else None
        )
        for field in METRIC_FIELDS
    }

    by_day = []
    for day, values in sorted(day_totals.items()):
        day_averages = {
            field: (
                int(round(values[field] / values[f"{field}_count"]))
                if values[f"{field}_count"]
                else None
            )
            for field in METRIC_FIELDS
        }
        day_totals_values = {
            field: values[field] if values[f"{field}_count"] else None
            for field in METRIC_FIELDS
        }
        by_day.append(
            {
                "date": day.isoformat(),
                "user_count": values["user_count"],
                "averages": day_averages,
                "totals": day_totals_values,
            }
        )

    return {
        "snapshot_days": snapshot_days,
        "unique_users": unique_users,
        "averages": averages,
        "by_user": by_user,
        "by_day": by_day,
    }


async def get_workload_snapshot_date_range(
    session: AsyncSession,
) -> dict[str, str | None]:
    result = await session.execute(
        select(
            func.min(UserWorkloadDailySnapshot.snapshot_date),
            func.max(UserWorkloadDailySnapshot.snapshot_date),
        )
    )
    min_date, max_date = result.one()
    return {
        "minDate": min_date.isoformat() if min_date else None,
        "maxDate": max_date.isoformat() if max_date else None,
    }
