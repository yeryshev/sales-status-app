"""rename_duration_minutes_to_seconds

Revision ID: 24710be1e9df
Revises: 0f4b11caa3c3
Create Date: 2025-10-27 16:33:12.333172

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '24710be1e9df'
down_revision: Union[str, None] = '0f4b11caa3c3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Переименовываем колонку duration_minutes в duration_seconds
    op.alter_column('status_history', 'duration_minutes', new_column_name='duration_seconds')


def downgrade() -> None:
    # Возвращаем обратно duration_seconds в duration_minutes
    op.alter_column('status_history', 'duration_seconds', new_column_name='duration_minutes')
