"""add tailored style

Revision ID: 0005_add_tailored_style
Revises: 0004_add_tailored_sections
Create Date: 2026-02-11 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = "0005_add_tailored_style"
down_revision = "0004_add_tailored_sections"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("tailored_resumes", sa.Column("style", sa.String(length=40), nullable=True))


def downgrade() -> None:
    op.drop_column("tailored_resumes", "style")
