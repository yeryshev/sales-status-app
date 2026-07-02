"""remove_orphan_open_status_history_duplicates

Revision ID: b7d1e4a92c10
Revises: a8c4e2f19b3d
Create Date: 2026-07-01 16:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b7d1e4a92c10"
down_revision: Union[str, None] = "a8c4e2f19b3d"
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
          AND duplicate_row.end_time IS NULL
          AND duplicate_row.duration_seconds IS NULL
          AND duplicate_row.new_status_id = next_row.new_status_id
        """
    )


def downgrade() -> None:
    pass
