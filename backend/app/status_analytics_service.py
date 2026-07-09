from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, date, datetime, time, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import and_, bindparam, func, or_, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Status, StatusHistory, User
from app.schemas import StatusAnalyticsRequest
from app.status_history_utils import (
    StatusHistorySlice,
    deduplicate_status_history_records,
)
from app.utils import app_statuses

WORK_STATUS_IDS = set(app_statuses["work"])
# «работаю» + «встреча» (без «занят»)
PRODUCTIVE_STATUS_IDS = WORK_STATUS_IDS | {7}
OFFLINE_STATUS_IDS = set(app_statuses["offline"])
MOSCOW_TZ = ZoneInfo("Europe/Moscow")
WORK_DAY_START = time(9, 0)
WORK_DAY_END = time(19, 0)
WORK_WINDOW_SECONDS = 10 * 3600
OFFLINE_FULL_DAY_THRESHOLD_SECONDS = WORK_WINDOW_SECONDS - 60

_ANALYTICS_HISTORY_CTE = """
WITH filtered AS (
    SELECT
        sh.id,
        sh.user_id,
        sh.new_status_id AS status_id,
        sh.start_time,
        sh.end_time,
        sh.duration_seconds
    FROM status_history sh
    WHERE (
        (sh.start_time >= :period_start AND sh.start_time <= :period_end)
        OR (
            sh.start_time < :period_start
            AND (sh.end_time IS NULL OR sh.end_time >= :period_start)
        )
    )
    AND sh.user_id IN :user_ids
    {status_filter}
),
ordered AS (
    SELECT
        f.*,
        LEAD(f.user_id) OVER (ORDER BY f.start_time, f.id) AS next_user_id,
        LEAD(f.status_id) OVER (ORDER BY f.start_time, f.id) AS next_status_id
    FROM filtered f
),
deduped AS (
    SELECT id, user_id, status_id, start_time, end_time
    FROM ordered o
    WHERE NOT (
        o.next_user_id IS NOT NULL
        AND o.user_id = o.next_user_id
        AND o.status_id = o.next_status_id
        AND (
            o.duration_seconds = 0
            OR (o.end_time IS NULL AND o.duration_seconds IS NULL)
        )
    )
)
"""

_ANALYTICS_DAY_CLIPS_SQL = (
    _ANALYTICS_HISTORY_CTE
    + """,
bounded AS (
    SELECT
        d.user_id,
        d.status_id,
        GREATEST(d.start_time, :period_start) AS eff_start,
        LEAST(COALESCE(d.end_time, :current_time), :period_end) AS eff_end
    FROM deduped d
),
day_rows AS (
    SELECT
        b.user_id,
        b.status_id,
        gs::date AS day_key,
        gs::timestamp AS day_start,
        (gs + INTERVAL '1 day' - INTERVAL '1 microsecond')::timestamp AS day_end,
        b.eff_start,
        b.eff_end
    FROM bounded b
    CROSS JOIN LATERAL generate_series(
        date_trunc('day', b.eff_start),
        date_trunc('day', b.eff_end),
        INTERVAL '1 day'
    ) AS gs
    WHERE b.eff_end > b.eff_start
),
clips AS (
    SELECT
        dr.day_key,
        dr.user_id,
        dr.status_id,
        CASE
            WHEN dr.status_id IN :offline_status_ids THEN
                GREATEST(
                    dr.eff_start,
                    dr.day_start,
                    dr.day_start + INTERVAL '6 hours'
                )
            ELSE
                GREATEST(dr.eff_start, dr.day_start)
        END AS clip_start,
        CASE
            WHEN dr.status_id IN :offline_status_ids THEN
                LEAST(
                    dr.eff_end,
                    dr.day_end,
                    dr.day_start + INTERVAL '16 hours'
                )
            ELSE
                LEAST(dr.eff_end, dr.day_end)
        END AS clip_end
    FROM day_rows dr
),
final AS (
    SELECT day_key, user_id, status_id, clip_start, clip_end
    FROM clips
    WHERE clip_end > clip_start
)
SELECT 'clip' AS row_type, day_key, user_id, status_id, clip_start, clip_end, NULL::int AS segment_count
FROM final
UNION ALL
SELECT 'meta', NULL, NULL, NULL, NULL, NULL, (SELECT COUNT(*)::int FROM deduped)
"""
)

_ANALYTICS_SEGMENT_COUNT_SQL = (
    _ANALYTICS_HISTORY_CTE + "SELECT COUNT(*)::int FROM deduped"
)


@dataclass
class AnalyticsSegment:
    id: int
    user_id: int
    status_id: int
    start_time: datetime
    end_time: datetime | None
    duration_seconds: int | None


def normalize_end_date(end_date: datetime) -> datetime:
    if end_date.hour == 0 and end_date.minute == 0 and end_date.second == 0:
        return end_date.replace(hour=23, minute=59, second=59, microsecond=999999)
    return end_date


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


def clip_interval(
    start_time: datetime,
    end_time: datetime | None,
    window_start: datetime,
    window_end: datetime,
    current_time: datetime,
) -> tuple[datetime, datetime] | None:
    effective_end = end_time or current_time
    clip_start = max(start_time, window_start)
    clip_end = min(effective_end, window_end)
    if clip_end <= clip_start:
        return None
    return clip_start, clip_end


def merge_intervals(
    intervals: list[tuple[datetime, datetime]],
) -> list[tuple[datetime, datetime]]:
    if not intervals:
        return []
    sorted_intervals = sorted(intervals, key=lambda item: item[0])
    merged: list[tuple[datetime, datetime]] = [sorted_intervals[0]]
    for start, end in sorted_intervals[1:]:
        last_start, last_end = merged[-1]
        if start <= last_end:
            merged[-1] = (last_start, max(last_end, end))
        else:
            merged.append((start, end))
    return merged


def intervals_duration(intervals: list[tuple[datetime, datetime]]) -> int:
    return sum(int((end - start).total_seconds()) for start, end in intervals)


def clip_segment_intervals(
    status_id: int,
    start_time: datetime,
    end_time: datetime | None,
    window_start: datetime,
    window_end: datetime,
    current_time: datetime,
) -> list[tuple[datetime, datetime]]:
    if status_id not in OFFLINE_STATUS_IDS:
        clipped = clip_interval(
            start_time, end_time, window_start, window_end, current_time
        )
        return [clipped] if clipped else []

    intervals: list[tuple[datetime, datetime]] = []
    for day_start, day_end in iter_period_days(window_start, window_end):
        work_start, work_end = moscow_work_window_utc_naive(day_start.date())
        clipped = clip_interval(
            start_time,
            end_time,
            max(window_start, day_start, work_start),
            min(window_end, day_end, work_end),
            current_time,
        )
        if clipped:
            intervals.append(clipped)
    return intervals


def merged_segment_duration(
    status_id: int,
    start_time: datetime,
    end_time: datetime | None,
    window_start: datetime,
    window_end: datetime,
    current_time: datetime,
) -> int:
    intervals = clip_segment_intervals(
        status_id, start_time, end_time, window_start, window_end, current_time
    )
    return intervals_duration(merge_intervals(intervals))


def clip_duration_seconds(
    start_time: datetime,
    end_time: datetime | None,
    period_start: datetime,
    period_end: datetime,
    current_time: datetime,
) -> int:
    effective_end = end_time or current_time
    clip_start = max(start_time, period_start)
    clip_end = min(effective_end, period_end)
    if clip_end <= clip_start:
        return 0
    return int((clip_end - clip_start).total_seconds())


def moscow_work_window_utc_naive(day: date) -> tuple[datetime, datetime]:
    """09:00–19:00 Moscow time as UTC-naive datetimes (matches DB storage)."""
    start_msk = datetime.combine(day, WORK_DAY_START, tzinfo=MOSCOW_TZ)
    end_msk = datetime.combine(day, WORK_DAY_END, tzinfo=MOSCOW_TZ)
    return (
        start_msk.astimezone(UTC).replace(tzinfo=None),
        end_msk.astimezone(UTC).replace(tzinfo=None),
    )


def clip_segment_duration(
    status_id: int,
    start_time: datetime,
    end_time: datetime | None,
    period_start: datetime,
    period_end: datetime,
    current_time: datetime,
) -> int:
    """Clip segment duration to the selected period.

    Offline status is only counted within 09:00–19:00 Moscow on each day.
    """
    if status_id not in OFFLINE_STATUS_IDS:
        return clip_duration_seconds(
            start_time, end_time, period_start, period_end, current_time
        )

    total = 0
    for day_start, day_end in iter_period_days(period_start, period_end):
        work_start, work_end = moscow_work_window_utc_naive(day_start.date())
        total += clip_duration_seconds(
            start_time,
            end_time,
            max(period_start, day_start, work_start),
            min(period_end, day_end, work_end),
            current_time,
        )
    return total


def clip_segment_duration_for_day(
    status_id: int,
    start_time: datetime,
    end_time: datetime | None,
    day_start: datetime,
    day_end: datetime,
    current_time: datetime,
) -> int:
    if status_id not in OFFLINE_STATUS_IDS:
        return clip_duration_seconds(
            start_time, end_time, day_start, day_end, current_time
        )

    work_start, work_end = moscow_work_window_utc_naive(day_start.date())
    return clip_duration_seconds(
        start_time,
        end_time,
        max(day_start, work_start),
        min(day_end, work_end),
        current_time,
    )


async def _resolve_analytics_user_ids(
    session: AsyncSession,
    request: StatusAnalyticsRequest,
) -> list[int]:
    if request.user_id:
        return [request.user_id]

    department_filter = get_department_filter(request.department_id)
    department_users_result = await session.execute(
        select(User.id).where(department_filter)
    )
    return list(department_users_result.scalars().all())


def _analytics_status_filter_sql(request: StatusAnalyticsRequest) -> str:
    return "AND sh.new_status_id = :status_id" if request.status_id else ""


def _analytics_query_params(
    request: StatusAnalyticsRequest,
    user_ids: list[int],
    current_time: datetime,
) -> dict:
    params = {
        "period_start": request.start_date,
        "period_end": normalize_end_date(request.end_date),
        "current_time": current_time,
        "user_ids": user_ids,
        "offline_status_ids": list(OFFLINE_STATUS_IDS),
    }
    if request.status_id:
        params["status_id"] = request.status_id
    return params


def _rows_to_day_intervals(
    rows,
) -> dict[tuple[str, int, int], list[tuple[datetime, datetime]]]:
    day_intervals: dict[tuple[str, int, int], list[tuple[datetime, datetime]]] = {}
    for row in rows:
        if row.row_type != "clip":
            continue
        day_key = row.day_key.isoformat()
        key = (day_key, row.user_id, row.status_id)
        day_intervals.setdefault(key, []).append((row.clip_start, row.clip_end))
    return day_intervals


async def fetch_analytics_summary_intervals(
    session: AsyncSession,
    request: StatusAnalyticsRequest,
) -> tuple[int, dict[tuple[str, int, int], list[tuple[datetime, datetime]]]]:
    """Fetch day-level clipped intervals via SQL (dedup + generate_series)."""
    user_ids = await _resolve_analytics_user_ids(session, request)
    if not user_ids:
        return 0, {}

    current_time = datetime.now(UTC).replace(tzinfo=None)
    params = _analytics_query_params(request, user_ids, current_time)
    status_filter = _analytics_status_filter_sql(request)
    sql = text(_ANALYTICS_DAY_CLIPS_SQL.format(status_filter=status_filter)).bindparams(
        bindparam("user_ids", expanding=True),
        bindparam("offline_status_ids", expanding=True),
    )

    result = await session.execute(sql, params)
    rows = result.all()

    segment_count = 0
    clip_rows = []
    for row in rows:
        if row.row_type == "meta" and row.segment_count is not None:
            segment_count = row.segment_count
        elif row.row_type == "clip":
            clip_rows.append(row)

    if segment_count == 0 and not clip_rows:
        count_sql = text(
            _ANALYTICS_SEGMENT_COUNT_SQL.format(status_filter=status_filter)
        ).bindparams(bindparam("user_ids", expanding=True))
        segment_count = (await session.execute(count_sql, params)).scalar_one() or 0

    return segment_count, _rows_to_day_intervals(clip_rows)


def build_day_intervals_from_segments(
    segments: list[AnalyticsSegment],
    period_start: datetime,
    period_end: datetime,
) -> dict[tuple[str, int, int], list[tuple[datetime, datetime]]]:
    """Build day intervals from segments, only iterating overlapping days."""
    current_time = datetime.now(UTC).replace(tzinfo=None)
    period_end = normalize_end_date(period_end)
    day_intervals: dict[tuple[str, int, int], list[tuple[datetime, datetime]]] = {}

    for segment in segments:
        effective_end = segment.end_time or current_time
        overlap_start = max(segment.start_time, period_start)
        overlap_end = min(effective_end, period_end)
        if overlap_end <= overlap_start:
            continue

        for day_start, day_end in iter_period_days(overlap_start, overlap_end):
            day_key = day_start.date().isoformat()
            day_key_tuple = (day_key, segment.user_id, segment.status_id)
            day_intervals.setdefault(day_key_tuple, []).extend(
                clip_segment_intervals(
                    segment.status_id,
                    segment.start_time,
                    segment.end_time,
                    day_start,
                    day_end,
                    current_time,
                )
            )

    return day_intervals


async def fetch_analytics_segments(
    session: AsyncSession,
    request: StatusAnalyticsRequest,
) -> list[AnalyticsSegment]:
    period_start = request.start_date
    period_end = normalize_end_date(request.end_date)
    current_time = datetime.now(UTC).replace(tzinfo=None)

    query = (
        select(
            StatusHistory.id,
            StatusHistory.user_id,
            StatusHistory.new_status_id,
            StatusHistory.start_time,
            StatusHistory.end_time,
            func.coalesce(
                StatusHistory.duration_seconds,
                func.extract("epoch", current_time - StatusHistory.start_time),
            ).label("duration_seconds"),
        )
        .where(
            or_(
                and_(
                    StatusHistory.start_time >= period_start,
                    StatusHistory.start_time <= period_end,
                ),
                and_(
                    StatusHistory.start_time < period_start,
                    or_(
                        StatusHistory.end_time.is_(None),
                        StatusHistory.end_time >= period_start,
                    ),
                ),
            )
        )
        .order_by(StatusHistory.start_time.desc(), StatusHistory.user_id)
    )

    if request.user_id:
        query = query.where(StatusHistory.user_id == request.user_id)
    if request.status_id:
        query = query.where(StatusHistory.new_status_id == request.status_id)

    if not request.user_id:
        department_filter = get_department_filter(request.department_id)
        department_users_result = await session.execute(
            select(User.id).where(department_filter)
        )
        department_user_ids = list(department_users_result.scalars().all())
        if not department_user_ids:
            return []
        query = query.where(StatusHistory.user_id.in_(department_user_ids))

    result = await session.execute(query)
    rows = result.all()
    deduped_ids = {
        row.id
        for row in deduplicate_status_history_records(
            [
                StatusHistorySlice(
                    id=row.id,
                    user_id=row.user_id,
                    new_status_id=row.new_status_id,
                    start_time=row.start_time,
                    end_time=row.end_time,
                    duration_seconds=(
                        int(row.duration_seconds)
                        if row.duration_seconds is not None
                        else None
                    ),
                )
                for row in rows
            ]
        )
    }

    return [
        AnalyticsSegment(
            id=row.id,
            user_id=row.user_id,
            status_id=row.new_status_id,
            start_time=row.start_time,
            end_time=row.end_time,
            duration_seconds=(
                int(row.duration_seconds) if row.duration_seconds is not None else None
            ),
        )
        for row in rows
        if row.id in deduped_ids
    ]


def iter_period_days(period_start: datetime, period_end: datetime):
    current = period_start.replace(hour=0, minute=0, second=0, microsecond=0)
    last_day = period_end.replace(hour=0, minute=0, second=0, microsecond=0)
    while current <= last_day:
        day_end = current.replace(hour=23, minute=59, second=59, microsecond=999999)
        yield current, min(day_end, period_end)
        current += timedelta(days=1)


def is_multi_day_period(period_start: datetime, period_end: datetime) -> bool:
    return period_start.date() != normalize_end_date(period_end).date()


def is_user_working_day(status_durations: dict[int, int]) -> bool:
    """Exclude days with no activity except full-day offline (weekends, vacation)."""
    if not status_durations:
        return False

    active_duration = sum(
        duration
        for status_id, duration in status_durations.items()
        if status_id not in OFFLINE_STATUS_IDS
    )
    if active_duration > 0:
        return True

    offline_duration = sum(
        duration
        for status_id, duration in status_durations.items()
        if status_id in OFFLINE_STATUS_IDS
    )
    return offline_duration < OFFLINE_FULL_DAY_THRESHOLD_SECONDS


def _build_user_day_status(
    day_intervals: dict[tuple[str, int, int], list[tuple[datetime, datetime]]],
) -> dict[tuple[str, int], dict[int, int]]:
    user_day_status: dict[tuple[str, int], dict[int, int]] = {}
    for (day_key, user_id, status_id), intervals in day_intervals.items():
        duration = intervals_duration(merge_intervals(intervals))
        if duration <= 0:
            continue
        day_map = user_day_status.setdefault((day_key, user_id), {})
        day_map[status_id] = day_map.get(status_id, 0) + duration
    return user_day_status


def _compute_working_day_averages(
    user_day_status: dict[tuple[str, int], dict[int, int]],
) -> tuple[dict[int, int], dict[int, dict[int, int]], int]:
    """Returns working_days per user, totals on working days, total user-working-days."""
    working_days_per_user: dict[int, int] = {}
    user_working_totals: dict[int, dict[int, int]] = {}

    for (_day_key, user_id), status_map in user_day_status.items():
        if not is_user_working_day(status_map):
            continue
        working_days_per_user[user_id] = working_days_per_user.get(user_id, 0) + 1
        user_totals = user_working_totals.setdefault(user_id, {})
        for status_id, duration in status_map.items():
            user_totals[status_id] = user_totals.get(status_id, 0) + duration

    total_working_days = sum(working_days_per_user.values())
    return working_days_per_user, user_working_totals, total_working_days


def build_analytics_summary(
    segments: list[AnalyticsSegment],
    users: dict[int, User],
    statuses: dict[int, Status],
    period_start: datetime,
    period_end: datetime,
) -> dict:
    day_intervals = build_day_intervals_from_segments(
        segments, period_start, period_end
    )
    return build_analytics_summary_from_intervals(
        day_intervals,
        users,
        statuses,
        period_start,
        period_end,
        segment_count=len(segments),
    )


def build_analytics_summary_from_intervals(
    day_intervals: dict[tuple[str, int, int], list[tuple[datetime, datetime]]],
    users: dict[int, User],
    statuses: dict[int, Status],
    period_start: datetime,
    period_end: datetime,
    *,
    segment_count: int,
) -> dict:
    period_end = normalize_end_date(period_end)

    by_day_status: dict[str, dict[int, int]] = {}
    day_users: dict[str, set[int]] = {}
    for (day_key, user_id, status_id), intervals in day_intervals.items():
        duration = intervals_duration(merge_intervals(intervals))
        if duration <= 0:
            continue
        day_users.setdefault(day_key, set()).add(user_id)
        day_map = by_day_status.setdefault(day_key, {})
        day_map[status_id] = day_map.get(status_id, 0) + duration

    user_day_status = _build_user_day_status(day_intervals)
    use_averages = is_multi_day_period(period_start, period_end)
    working_days_per_user: dict[int, int] = {}
    user_working_totals: dict[int, dict[int, int]] = {}
    total_working_days = 0
    by_status: dict[int, int] = {}
    by_user: dict[int, int] = {}
    by_user_work: dict[int, int] = {}
    by_user_status: dict[int, dict[int, int]] = {}

    if use_averages:
        working_days_per_user, user_working_totals, total_working_days = (
            _compute_working_day_averages(user_day_status)
        )

        for user_id, status_totals in user_working_totals.items():
            user_working_day_count = working_days_per_user.get(user_id, 0)
            if user_working_day_count <= 0:
                continue
            user_total = 0
            for status_id, duration in status_totals.items():
                by_status[status_id] = by_status.get(status_id, 0) + duration
                user_total += duration
                user_status_map = by_user_status.setdefault(user_id, {})
                user_status_map[status_id] = (
                    user_status_map.get(status_id, 0) + duration
                )
                if status_id in PRODUCTIVE_STATUS_IDS:
                    by_user_work[user_id] = by_user_work.get(user_id, 0) + duration
            by_user[user_id] = by_user.get(user_id, 0) + user_total

        if total_working_days > 0:
            by_status = {
                status_id: int(round(duration / total_working_days))
                for status_id, duration in by_status.items()
            }
            by_user = {
                user_id: int(round(duration / working_days_per_user[user_id]))
                for user_id, duration in by_user.items()
                if working_days_per_user.get(user_id, 0) > 0
            }
            by_user_work = {
                user_id: int(round(duration / working_days_per_user[user_id]))
                for user_id, duration in by_user_work.items()
                if working_days_per_user.get(user_id, 0) > 0
            }
            by_user_status = {
                user_id: {
                    status_id: int(round(duration / working_days_per_user[user_id]))
                    for status_id, duration in status_map.items()
                }
                for user_id, status_map in by_user_status.items()
                if working_days_per_user.get(user_id, 0) > 0
            }
    else:
        for (_day_key, user_id, status_id), intervals in day_intervals.items():
            duration = intervals_duration(merge_intervals(intervals))
            if duration <= 0:
                continue

            by_status[status_id] = by_status.get(status_id, 0) + duration
            by_user[user_id] = by_user.get(user_id, 0) + duration

            if status_id in PRODUCTIVE_STATUS_IDS:
                by_user_work[user_id] = by_user_work.get(user_id, 0) + duration

            user_status_map = by_user_status.setdefault(user_id, {})
            user_status_map[status_id] = user_status_map.get(status_id, 0) + duration

    total_duration = sum(by_status.values())
    work_duration = sum(
        duration
        for status_id, duration in by_status.items()
        if status_id in PRODUCTIVE_STATUS_IDS
    )
    offline_duration = sum(
        duration
        for status_id, duration in by_status.items()
        if status_id in OFFLINE_STATUS_IDS
    )

    def status_title(status_id: int) -> str:
        status = statuses.get(status_id)
        return status.title if status else f"Статус {status_id}"

    def user_name(user_id: int) -> str:
        user = users.get(user_id)
        if not user:
            return f"Пользователь {user_id}"
        return f"{user.first_name or ''} {user.second_name or ''}".strip()

    by_status_response = [
        {
            "status_id": status_id,
            "status_title": status_title(status_id),
            "duration_seconds": duration,
            "duration_hours": round(duration / 3600, 2),
            "percentage": round((duration / total_duration) * 100, 1)
            if total_duration
            else 0,
        }
        for status_id, duration in sorted(
            by_status.items(), key=lambda item: item[1], reverse=True
        )
    ]

    by_user_response = [
        {
            "user_id": user_id,
            "user_name": user_name(user_id),
            "duration_seconds": duration,
            "duration_hours": round(duration / 3600, 2),
            "work_duration_seconds": by_user_work.get(user_id, 0),
            "work_duration_hours": round(by_user_work.get(user_id, 0) / 3600, 2),
            "work_percentage": round((by_user_work.get(user_id, 0) / duration) * 100, 1)
            if duration
            else 0,
        }
        for user_id, duration in sorted(
            by_user.items(), key=lambda item: item[1], reverse=True
        )
    ]

    by_day_response = [
        {
            "date": day_key,
            "total_duration_seconds": sum(day_map.values()),
            "user_count": len(day_users.get(day_key, set())),
            "statuses": [
                {
                    "status_id": status_id,
                    "status_title": status_title(status_id),
                    "duration_seconds": duration,
                    "duration_hours": round(duration / 3600, 2),
                }
                for status_id, duration in sorted(
                    day_map.items(), key=lambda item: item[1], reverse=True
                )
            ],
        }
        for day_key, day_map in sorted(by_day_status.items())
    ]

    by_user_status_response = [
        {
            "user_id": user_id,
            "user_name": user_name(user_id),
            "statuses": [
                {
                    "status_id": status_id,
                    "status_title": status_title(status_id),
                    "duration_seconds": duration,
                    "duration_hours": round(duration / 3600, 2),
                }
                for status_id, duration in sorted(
                    status_map.items(), key=lambda item: item[1], reverse=True
                )
            ],
        }
        for user_id, status_map in sorted(
            by_user_status.items(),
            key=lambda item: sum(item[1].values()),
            reverse=True,
        )
    ]

    return {
        "total_duration_seconds": total_duration,
        "total_duration_hours": round(total_duration / 3600, 2),
        "work_duration_seconds": work_duration,
        "work_duration_hours": round(work_duration / 3600, 2),
        "work_percentage": round((work_duration / total_duration) * 100, 1)
        if total_duration
        else 0,
        "offline_duration_seconds": offline_duration,
        "offline_duration_hours": round(offline_duration / 3600, 2),
        "unique_users": len(by_user),
        "unique_statuses": len(by_status),
        "segment_count": segment_count,
        "is_averaged": use_averages,
        "working_days_count": total_working_days,
        "by_status": by_status_response,
        "by_user": by_user_response,
        "by_day": by_day_response,
        "by_user_status": by_user_status_response,
    }
