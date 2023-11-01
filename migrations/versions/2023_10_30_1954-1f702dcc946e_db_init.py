"""db init

Revision ID: 1f702dcc946e
Revises: 
Create Date: 2023-10-30 19:54:03.316163

"""
from datetime import datetime
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision: str = '1f702dcc946e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'comment',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('description', sa.String),
        sa.Column('owner_id', sa.Integer),
        sa.Column('created_at', sa.DateTime, server_default=text("TIMEZONE('utc', now())")),
        sa.Column(
            'updated_at',
            sa.DateTime,
            server_default=text("TIMEZONE('utc', now())"),
            onupdate=datetime.utcnow,),
    )

    op.create_table(
        'user',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('email', sa.String(length=320), unique=True),
        sa.Column('hashed_password', sa.String(length=1024)),
        sa.Column('first_name', sa.String),
        sa.Column('second_name', sa.String),
        sa.Column('photo_url', sa.String),
        sa.Column('ext_number', sa.String),
        sa.Column('telegram', sa.String),
        sa.Column('is_working_remotely', sa.Boolean, default=False),
        sa.Column('status_id', sa.Integer),
        sa.Column('comment_id', sa.Integer, sa.ForeignKey(
            "comment.id",
            name="users_comment_id_fkey",
            ondelete="SET NULL",
        )),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('is_superuser', sa.Boolean, default=False),
        sa.Column('is_verified', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime),
        sa.Column('updated_at', sa.DateTime),
    )

    op.create_table(
        'status',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('title', sa.String),
        sa.Column('created_at', sa.DateTime),
        sa.Column('updated_at', sa.DateTime),
    )

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


def downgrade() -> None:
    op.drop_table('task')
    op.drop_table('comment')
    op.drop_table('status')
    op.drop_table('user')