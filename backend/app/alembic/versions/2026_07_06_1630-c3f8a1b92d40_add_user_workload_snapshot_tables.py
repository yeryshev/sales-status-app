"""add_user_workload_snapshot_tables

Revision ID: c3f8a1b92d40
Revises: b7d1e4a92c10
Create Date: 2026-07-06 16:30:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "c3f8a1b92d40"
down_revision: Union[str, None] = "b7d1e4a92c10"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_external_metrics",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("leads", sa.Integer(), server_default="0", nullable=False),
        sa.Column("overdue_tasks", sa.Integer(), server_default="0", nullable=False),
        sa.Column("open_conversations", sa.Integer(), server_default="0", nullable=False),
        sa.Column("assigned_tickets", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "metrics_updated_at",
            sa.DateTime(),
            server_default=sa.text("TIMEZONE('utc', now())"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("TIMEZONE('utc', now())"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("TIMEZONE('utc', now())"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id"),
    )

    op.create_table(
        "user_workload_daily_snapshot",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("snapshot_date", sa.Date(), nullable=False),
        sa.Column("snapshot_at", sa.DateTime(), nullable=False),
        sa.Column("leads", sa.Integer(), server_default="0", nullable=False),
        sa.Column("overdue_tasks", sa.Integer(), server_default="0", nullable=False),
        sa.Column("open_conversations", sa.Integer(), server_default="0", nullable=False),
        sa.Column("assigned_tickets", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "has_metrics_data",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("TIMEZONE('utc', now())"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "user_id", "snapshot_date", name="uq_user_workload_snapshot_day"
        ),
    )
    op.create_index(
        op.f("ix_user_workload_daily_snapshot_snapshot_date"),
        "user_workload_daily_snapshot",
        ["snapshot_date"],
        unique=False,
    )
    op.create_index(
        op.f("ix_user_workload_daily_snapshot_user_id"),
        "user_workload_daily_snapshot",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_user_workload_daily_snapshot_user_id"),
        table_name="user_workload_daily_snapshot",
    )
    op.drop_index(
        op.f("ix_user_workload_daily_snapshot_snapshot_date"),
        table_name="user_workload_daily_snapshot",
    )
    op.drop_table("user_workload_daily_snapshot")
    op.drop_table("user_external_metrics")
