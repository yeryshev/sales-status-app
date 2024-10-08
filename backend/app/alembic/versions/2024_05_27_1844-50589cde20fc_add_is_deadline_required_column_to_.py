"""Add is_deadline_required column to Status

Revision ID: 50589cde20fc
Revises: 20527eba50e7
Create Date: 2024-05-27 18:44:41.392718

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '50589cde20fc'
down_revision: Union[str, None] = '20527eba50e7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('status', sa.Column('is_deadline_required', sa.Boolean(), server_default='true', nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('status', 'is_deadline_required')
    # ### end Alembic commands ###
