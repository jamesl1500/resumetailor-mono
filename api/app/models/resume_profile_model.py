from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, DateTime, Text, JSON, String, UUID
from app.libs.db.base import Base

class ResumeProfile(Base):
    __tablename__ = "resume_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    file_name = Column(String(255), nullable=True)
    raw_text = Column(Text, nullable=False)
    parsed_data = Column(JSON, nullable=False)
    ai_raw_response = Column(JSON, nullable=True)
    ai_model = Column(String(120), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
