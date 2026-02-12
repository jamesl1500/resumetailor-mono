"""add files.user_id

Revision ID: 0003_add_file_user_id
Revises: 0002_add_ai_metadata
Create Date: 2026-02-11 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0003_add_file_user_id"
down_revision = "0002_add_ai_metadata"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "files",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.create_index("ix_files_user_id", "files", ["user_id"])
    op.create_foreign_key(
        "fk_files_user_id_users",
        "files",
        "users",
        ["user_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_files_user_id_users", "files", type_="foreignkey")
    op.drop_index("ix_files_user_id", table_name="files")
    op.drop_column("files", "user_id")
