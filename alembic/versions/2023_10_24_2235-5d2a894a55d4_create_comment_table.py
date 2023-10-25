"""create comment table

Revision ID: 5d2a894a55d4
Revises: bb15173e7578
Create Date: 2023-10-24 22:35:26.968147

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '5d2a894a55d4'
down_revision: Union[str, None] = 'bb15173e7578'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "comments",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("description", sa.String),
        sa.Column("owner_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
    )


def downgrade():
    op.drop_table("comments")
