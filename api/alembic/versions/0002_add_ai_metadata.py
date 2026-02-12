"""add ai metadata columns

Revision ID: 0002_add_ai_metadata
Revises: 0001_init_tables
Create Date: 2026-02-11 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0002_add_ai_metadata"
down_revision = "0001_init_tables"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("job_analyses", sa.Column("ai_raw_response", postgresql.JSON(), nullable=True))
    op.add_column("job_analyses", sa.Column("ai_model", sa.String(length=120), nullable=True))
    op.add_column("resume_profiles", sa.Column("ai_raw_response", postgresql.JSON(), nullable=True))
    op.add_column("resume_profiles", sa.Column("ai_model", sa.String(length=120), nullable=True))


def downgrade() -> None:
    op.drop_column("resume_profiles", "ai_model")
    op.drop_column("resume_profiles", "ai_raw_response")
    op.drop_column("job_analyses", "ai_model")
    op.drop_column("job_analyses", "ai_raw_response")
