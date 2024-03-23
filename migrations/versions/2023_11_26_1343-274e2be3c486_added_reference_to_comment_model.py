"""added reference to comment model

Revision ID: 274e2be3c486
Revises: 1f702dcc946e
Create Date: 2023-11-26 13:43:51.919835

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '274e2be3c486'
down_revision: Union[str, None] = '1f702dcc946e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_foreign_key(
        'fk_comment_owner_id_user',
        'comment',
        'user',
        ['owner_id'],
        ['id'],
        ondelete='CASCADE'
    )


def downgrade() -> None:
    op.drop_constraint(
        'fk_comment_owner_id_user',
        'comment',
    )
