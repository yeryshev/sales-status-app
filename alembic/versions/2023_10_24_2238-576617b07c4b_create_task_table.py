"""create task table

Revision ID: 576617b07c4b
Revises: 5d2a894a55d4
Create Date: 2023-10-24 22:38:10.633865

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '576617b07c4b'
down_revision: Union[str, None] = '5d2a894a55d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("uuid", sa.String),
        sa.Column("status_id", sa.Integer),
        sa.Column("comment_id", sa.Integer),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("date", sa.Date),
    )


def downgrade():
    op.drop_table("tasks")
