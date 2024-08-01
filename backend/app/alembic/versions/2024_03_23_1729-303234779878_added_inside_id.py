"""Added inside id

Revision ID: 303234779878
Revises: 274e2be3c486
Create Date: 2024-03-23 17:29:37.286065

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '303234779878'
down_revision: Union[str, None] = '274e2be3c486'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('user', sa.Column('inside_id', sa.Integer(), nullable=True))
    op.create_unique_constraint('uniq_inside_id', 'user', ['inside_id'])


def downgrade():
    op.drop_constraint('uniq_inside_id', 'user', type_='unique')
    op.drop_column('user', 'inside_id')