from datetime import datetime
from typing import cast

from app.status_history_utils import (
    StatusHistoryRecord,
    StatusHistorySlice,
    deduplicate_status_history_records,
)


def test_deduplicate_zero_duration_followed_by_same_status() -> None:
    records = [
        StatusHistorySlice(1, 10, 1, datetime(2026, 5, 18, 8, 2, 25), 0),
        StatusHistorySlice(2, 10, 1, datetime(2026, 5, 18, 8, 2, 26), 1768),
        StatusHistorySlice(3, 10, 3, datetime(2026, 5, 18, 9, 0, 0), 100),
    ]

    result = deduplicate_status_history_records(
        cast(list[StatusHistoryRecord], records)
    )

    assert [record.id for record in result] == [2, 3]


def test_deduplicate_orphan_open_followed_by_same_status() -> None:
    records = [
        StatusHistorySlice(
            9897,
            10,
            3,
            datetime(2026, 5, 13, 16, 0, 0, 117203),
            None,
            end_time=None,
        ),
        StatusHistorySlice(
            9898,
            10,
            3,
            datetime(2026, 5, 13, 16, 0, 0, 135204),
            58440,
            end_time=datetime(2026, 5, 14, 8, 14, 0),
        ),
    ]

    result = deduplicate_status_history_records(
        cast(list[StatusHistoryRecord], records)
    )

    assert [record.id for record in result] == [9898]


def test_keep_active_open_record_without_next_same_status() -> None:
    records = [
        StatusHistorySlice(
            100,
            10,
            1,
            datetime(2026, 7, 2, 8, 0, 0),
            None,
            end_time=None,
        ),
    ]

    result = deduplicate_status_history_records(
        cast(list[StatusHistoryRecord], records)
    )

    assert [record.id for record in result] == [100]


def test_keep_active_open_record_when_next_status_differs() -> None:
    records = [
        StatusHistorySlice(
            100,
            10,
            1,
            datetime(2026, 7, 2, 8, 0, 0),
            3600,
            end_time=datetime(2026, 7, 2, 9, 0, 0),
        ),
        StatusHistorySlice(
            101,
            10,
            3,
            datetime(2026, 7, 2, 16, 0, 0),
            None,
            end_time=None,
        ),
    ]

    result = deduplicate_status_history_records(
        cast(list[StatusHistoryRecord], records)
    )

    assert [record.id for record in result] == [100, 101]
