"""drop_user_external_metrics

Revision ID: e8f1a2b93c52
Revises: d4e9b2c81f51
Create Date: 2026-07-09 12:30:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "e8f1a2b93c52"
down_revision: Union[str, None] = "d4e9b2c81f51"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("user_external_metrics")


def downgrade() -> None:
    import sqlalchemy as sa

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
