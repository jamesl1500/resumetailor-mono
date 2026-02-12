"""add tailored experience and education

Revision ID: 0004_add_tailored_sections
Revises: 0003_add_file_user_id
Create Date: 2026-02-11 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0004_add_tailored_sections"
down_revision = "0003_add_file_user_id"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "tailored_resumes",
        sa.Column("tailored_experience", postgresql.JSON(), nullable=False, server_default="[]"),
    )
    op.add_column(
        "tailored_resumes",
        sa.Column("tailored_education", postgresql.JSON(), nullable=False, server_default="[]"),
    )
    op.alter_column("tailored_resumes", "tailored_experience", server_default=None)
    op.alter_column("tailored_resumes", "tailored_education", server_default=None)


def downgrade() -> None:
    op.drop_column("tailored_resumes", "tailored_education")
    op.drop_column("tailored_resumes", "tailored_experience")
