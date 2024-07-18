"""changed date format

Revision ID: fc1a2d7b944f
Revises: 303234779878
Create Date: 2024-03-24 14:41:39.667530

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'fc1a2d7b944f'
down_revision: Union[str, None] = '303234779878'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column('user', 'created_at', server_default=sa.text("TIMEZONE('utc', now())"))
    op.alter_column('user', 'updated_at', server_default=sa.text("TIMEZONE('utc', now())"))
    op.alter_column('status', 'created_at', server_default=sa.text("TIMEZONE('utc', now())"))
    op.alter_column('status', 'updated_at', server_default=sa.text("TIMEZONE('utc', now())"))
    op.alter_column('comment', 'updated_at', server_default=sa.text("TIMEZONE('utc', now())"))
    op.drop_table('task')


def downgrade():
    op.alter_column('user', 'created_at', server_default=None)
    op.alter_column('user', 'updated_at', server_default=None)
    op.alter_column('status', 'created_at', server_default=None)
    op.alter_column('status', 'updated_at', server_default=None)
    op.alter_column('comment', 'updated_at', server_default=None)
    op.create_table(
        'task',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('uuid', sa.String),
        sa.Column('status_id', sa.Integer, sa.ForeignKey("status.id", ondelete="CASCADE")),
        sa.Column(
            'comment_id',
            sa.Integer,
            sa.ForeignKey("comment.id", ondelete="SET NULL"),
            nullable=True
        ),
        sa.Column('user_id', sa.Integer, sa.ForeignKey("user.id", ondelete="CASCADE")),
        sa.Column('date', sa.DateTime),
        sa.Column('created_at', sa.DateTime),
        sa.Column('updated_at', sa.DateTime)
    )

