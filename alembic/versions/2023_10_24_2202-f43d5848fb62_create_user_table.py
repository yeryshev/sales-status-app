"""create user table

Revision ID: f43d5848fb62
Revises: 
Create Date: 2023-10-24 22:02:36.252237

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f43d5848fb62'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("username", sa.String, unique=True),
        sa.Column("email", sa.String, unique=True, nullable=False),
        sa.Column("password", sa.String, nullable=False),
        sa.Column("first_name", sa.String),
        sa.Column("second_name", sa.String),
        sa.Column("photo_url", sa.String),
        sa.Column("ext_number", sa.String),
        sa.Column("telegram", sa.String),
        sa.Column("is_working_remotely", sa.Boolean, default=False, nullable=False),
        sa.Column("status_id", sa.Integer, default=3, nullable=False),
        sa.Column("comment_id", sa.Integer, nullable=True),
    )


def downgrade():
    op.drop_table("users")
