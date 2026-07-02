from dataclasses import dataclass
from datetime import datetime
from typing import Protocol


@dataclass(frozen=True, slots=True)
class StatusHistorySlice:
    id: int
    user_id: int
    new_status_id: int
    start_time: datetime
    duration_seconds: int | None
    end_time: datetime | None = None


class StatusHistoryRecord(Protocol):
    id: int
    user_id: int
    new_status_id: int
    start_time: datetime
    duration_seconds: int | None
    end_time: datetime | None


def _should_drop_duplicate_record(
    record: StatusHistoryRecord,
    next_record: StatusHistoryRecord,
) -> bool:
    if (
        record.user_id != next_record.user_id
        or record.new_status_id != next_record.new_status_id
    ):
        return False

    if record.duration_seconds == 0:
        return True

    # Orphaned open row left by a concurrent transition (common at 16:00 UTC cron).
    return record.end_time is None and record.duration_seconds is None


def deduplicate_status_history_records(
    records: list[StatusHistoryRecord],
) -> list[StatusHistoryRecord]:
    """Drop superseded duplicate rows before the next same-status record."""
    if len(records) < 2:
        return records

    sorted_records = sorted(records, key=lambda record: (record.start_time, record.id))
    skip_ids: set[int] = set()

    for index, record in enumerate(sorted_records[:-1]):
        next_record = sorted_records[index + 1]
        if record.id not in skip_ids and _should_drop_duplicate_record(
            record, next_record
        ):
            skip_ids.add(record.id)

    return [record for record in records if record.id not in skip_ids]
