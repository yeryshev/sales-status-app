"""remove_zero_duration_status_history_duplicates

Revision ID: a8c4e2f19b3d
Revises: 0f4b11caa3c3
Create Date: 2026-07-01 15:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a8c4e2f19b3d"
down_revision: Union[str, None] = "0f4b11caa3c3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        DELETE FROM status_history AS duplicate_row
        USING status_history AS next_row
        WHERE next_row.user_id = duplicate_row.user_id
          AND next_row.id = (
              SELECT MIN(id)
              FROM status_history
              WHERE user_id = duplicate_row.user_id
                AND id > duplicate_row.id
          )
          AND duplicate_row.duration_seconds = 0
          AND duplicate_row.new_status_id = next_row.new_status_id
        """
    )


def downgrade() -> None:
    pass
