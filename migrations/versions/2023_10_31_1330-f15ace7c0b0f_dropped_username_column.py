"""dropped username column

Revision ID: f15ace7c0b0f
Revises: 1f702dcc946e
Create Date: 2023-10-31 13:30:47.538345

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f15ace7c0b0f'
down_revision: Union[str, None] = '1f702dcc946e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('user', 'username')


def downgrade() -> None:
    op.add_column('user', sa.Column('username', sa.String, unique=True))
