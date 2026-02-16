"""add visitor tracking and source_ip fields

Revision ID: 0006_add_visitor_tracking_and_source_ip
Revises: 0005_add_tailored_style
Create Date: 2026-02-16 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0006_visitor_ip_tracking"
down_revision = "0005_add_tailored_style"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("job_analyses", sa.Column("source_ip", sa.String(length=64), nullable=True))
    op.add_column("resume_profiles", sa.Column("source_ip", sa.String(length=64), nullable=True))
    op.add_column("tailored_resumes", sa.Column("source_ip", sa.String(length=64), nullable=True))
    op.add_column("files", sa.Column("source_ip", sa.String(length=64), nullable=True))

    op.create_index("ix_job_analyses_source_ip", "job_analyses", ["source_ip"], unique=False)
    op.create_index("ix_resume_profiles_source_ip", "resume_profiles", ["source_ip"], unique=False)
    op.create_index("ix_tailored_resumes_source_ip", "tailored_resumes", ["source_ip"], unique=False)
    op.create_index("ix_files_source_ip", "files", ["source_ip"], unique=False)

    op.create_table(
        "visitor_identities",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("ip_address", sa.String(length=64), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("first_seen", sa.DateTime(), nullable=False),
        sa.Column("last_seen", sa.DateTime(), nullable=False),
        sa.Column("visit_count", sa.Integer(), nullable=False, server_default="1"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_visitor_identities_ip_address", "visitor_identities", ["ip_address"], unique=False)
    op.create_index("ix_visitor_identities_user_id", "visitor_identities", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_visitor_identities_user_id", table_name="visitor_identities")
    op.drop_index("ix_visitor_identities_ip_address", table_name="visitor_identities")
    op.drop_table("visitor_identities")

    op.drop_index("ix_files_source_ip", table_name="files")
    op.drop_index("ix_tailored_resumes_source_ip", table_name="tailored_resumes")
    op.drop_index("ix_resume_profiles_source_ip", table_name="resume_profiles")
    op.drop_index("ix_job_analyses_source_ip", table_name="job_analyses")

    op.drop_column("files", "source_ip")
    op.drop_column("tailored_resumes", "source_ip")
    op.drop_column("resume_profiles", "source_ip")
    op.drop_column("job_analyses", "source_ip")
