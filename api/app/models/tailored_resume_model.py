from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, DateTime, Text, JSON, String, UUID, ForeignKey
from app.libs.db.base import Base

class TailoredResume(Base):
    __tablename__ = "tailored_resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    job_analysis_id = Column(UUID(as_uuid=True), ForeignKey("job_analyses.id"), nullable=False)
    resume_profile_id = Column(UUID(as_uuid=True), ForeignKey("resume_profiles.id"), nullable=False)
    target_role = Column(String(255), nullable=True)
    style = Column(String(40), nullable=True)
    tailored_summary = Column(Text, nullable=False)
    tailored_bullets = Column(JSON, nullable=False)
    tailored_experience = Column(JSON, nullable=False, default=list)
    tailored_education = Column(JSON, nullable=False, default=list)
    output_files = Column(JSON, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
