from app.workload_snapshot_service import empty_workload_counters


def test_empty_workload_counters():
    counters = empty_workload_counters()
    assert counters.leads == 0
    assert counters.overdue_tasks == 0
    assert counters.open_conversations == 0
    assert counters.assigned_tickets == 0
