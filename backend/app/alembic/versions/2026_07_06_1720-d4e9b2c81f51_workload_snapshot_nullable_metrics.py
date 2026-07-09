"""workload_snapshot_nullable_metrics

Revision ID: d4e9b2c81f51
Revises: c3f8a1b92d40
Create Date: 2026-07-06 17:20:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "d4e9b2c81f51"
down_revision: Union[str, None] = "c3f8a1b92d40"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

METRIC_COLUMNS = (
    "leads",
    "overdue_tasks",
    "open_conversations",
    "assigned_tickets",
)


def upgrade() -> None:
    op.execute(
        """
        UPDATE user_workload_daily_snapshot
        SET
            leads = NULL,
            overdue_tasks = NULL,
            open_conversations = NULL,
            assigned_tickets = NULL
        WHERE has_metrics_data = false
        """
    )
    op.drop_column("user_workload_daily_snapshot", "has_metrics_data")
    for column in METRIC_COLUMNS:
        op.alter_column(
            "user_workload_daily_snapshot",
            column,
            existing_type=sa.Integer(),
            nullable=True,
            server_default=None,
        )


def downgrade() -> None:
    for column in METRIC_COLUMNS:
        op.alter_column(
            "user_workload_daily_snapshot",
            column,
            existing_type=sa.Integer(),
            nullable=False,
            server_default="0",
        )
    op.add_column(
        "user_workload_daily_snapshot",
        sa.Column(
            "has_metrics_data",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
    )
    op.execute(
        """
        UPDATE user_workload_daily_snapshot
        SET has_metrics_data = true
        WHERE leads IS NOT NULL
           OR overdue_tasks IS NOT NULL
           OR open_conversations IS NOT NULL
           OR assigned_tickets IS NOT NULL
        """
    )
