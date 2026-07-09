from datetime import datetime

from app.status_analytics_service import (
    WORK_WINDOW_SECONDS,
    AnalyticsSegment,
    build_analytics_summary,
    clip_segment_duration,
    clip_segment_duration_for_day,
    intervals_duration,
    is_user_working_day,
    merge_intervals,
    moscow_work_window_utc_naive,
)
from app.utils import app_statuses

OFFLINE_STATUS_ID = app_statuses["offline"][0]
WORK_STATUS_ID = app_statuses["work"][0]
MEETING_STATUS_ID = 7


def test_moscow_work_window_maps_to_utc_naive():
    work_start, work_end = moscow_work_window_utc_naive(datetime(2026, 7, 2).date())
    assert work_start == datetime(2026, 7, 2, 6, 0, 0)
    assert work_end == datetime(2026, 7, 2, 16, 0, 0)


def test_offline_outside_work_hours_is_ignored():
    period_start = datetime(2026, 7, 2, 0, 0, 0)
    period_end = datetime(2026, 7, 2, 23, 59, 59)
    current_time = datetime(2026, 7, 2, 20, 0, 0)

    duration = clip_segment_duration(
        OFFLINE_STATUS_ID,
        datetime(2026, 7, 1, 22, 0, 0),
        datetime(2026, 7, 2, 5, 0, 0),
        period_start,
        period_end,
        current_time,
    )
    assert duration == 0


def test_offline_within_work_hours_is_counted():
    period_start = datetime(2026, 7, 2, 0, 0, 0)
    period_end = datetime(2026, 7, 2, 23, 59, 59)
    current_time = datetime(2026, 7, 2, 20, 0, 0)

    duration = clip_segment_duration(
        OFFLINE_STATUS_ID,
        datetime(2026, 7, 2, 7, 0, 0),
        datetime(2026, 7, 2, 9, 0, 0),
        period_start,
        period_end,
        current_time,
    )
    assert duration == 2 * 3600


def test_non_offline_status_uses_full_period_clip():
    period_start = datetime(2026, 7, 2, 0, 0, 0)
    period_end = datetime(2026, 7, 2, 23, 59, 59)
    current_time = datetime(2026, 7, 2, 20, 0, 0)

    duration = clip_segment_duration(
        WORK_STATUS_ID,
        datetime(2026, 7, 2, 5, 0, 0),
        datetime(2026, 7, 2, 7, 0, 0),
        period_start,
        period_end,
        current_time,
    )
    assert duration == 2 * 3600


def test_merge_intervals_prevents_double_counting():
    intervals = [
        (datetime(2026, 6, 28, 6, 0, 0), datetime(2026, 6, 28, 16, 0, 0)),
        (datetime(2026, 6, 28, 6, 0, 0), datetime(2026, 6, 28, 16, 0, 0)),
    ]
    assert intervals_duration(merge_intervals(intervals)) == 10 * 3600


def test_is_user_working_day_excludes_full_offline_day():
    assert not is_user_working_day({3: WORK_WINDOW_SECONDS})
    assert is_user_working_day({3: WORK_WINDOW_SECONDS - 120, 1: 600})
    assert is_user_working_day({1: 3600})


def test_offline_for_day_clips_to_work_window():
    day_start = datetime(2026, 7, 2, 0, 0, 0)
    day_end = datetime(2026, 7, 2, 23, 59, 59)
    current_time = datetime(2026, 7, 2, 20, 0, 0)

    duration = clip_segment_duration_for_day(
        OFFLINE_STATUS_ID,
        datetime(2026, 7, 2, 6, 0, 0),
        datetime(2026, 7, 2, 17, 0, 0),
        day_start,
        day_end,
        current_time,
    )
    assert duration == 10 * 3600


def test_build_analytics_summary_single_day_period():
    period_start = datetime(2026, 7, 3, 0, 0, 0)
    period_end = datetime(2026, 7, 3, 23, 59, 59)
    segments = [
        AnalyticsSegment(
            id=1,
            user_id=10,
            status_id=WORK_STATUS_ID,
            start_time=datetime(2026, 7, 3, 8, 0, 0),
            end_time=datetime(2026, 7, 3, 10, 0, 0),
            duration_seconds=7200,
        )
    ]

    summary = build_analytics_summary(segments, {}, {}, period_start, period_end)

    assert summary["is_averaged"] is False
    assert summary["total_duration_seconds"] == 7200
    assert len(summary["by_status"]) == 1


def test_build_analytics_summary_work_duration_includes_meeting():
    period_start = datetime(2026, 7, 3, 0, 0, 0)
    period_end = datetime(2026, 7, 3, 23, 59, 59)
    segments = [
        AnalyticsSegment(
            id=1,
            user_id=10,
            status_id=WORK_STATUS_ID,
            start_time=datetime(2026, 7, 3, 8, 0, 0),
            end_time=datetime(2026, 7, 3, 9, 0, 0),
            duration_seconds=3600,
        ),
        AnalyticsSegment(
            id=2,
            user_id=10,
            status_id=MEETING_STATUS_ID,
            start_time=datetime(2026, 7, 3, 10, 0, 0),
            end_time=datetime(2026, 7, 3, 11, 0, 0),
            duration_seconds=3600,
        ),
    ]

    summary = build_analytics_summary(segments, {}, {}, period_start, period_end)

    assert summary["work_duration_seconds"] == 7200
    assert summary["by_user"][0]["work_duration_seconds"] == 7200
