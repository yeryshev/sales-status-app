"""create status table

Revision ID: bb15173e7578
Revises: f43d5848fb62
Create Date: 2023-10-24 22:27:33.643311

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'bb15173e7578'
down_revision: Union[str, None] = 'f43d5848fb62'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "statuses",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("title", sa.String),
    )


def downgrade():
    op.drop_table("statuses")
