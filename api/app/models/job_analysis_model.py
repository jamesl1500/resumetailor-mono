from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, DateTime, Text, JSON, String, UUID
from app.libs.db.base import Base

class JobAnalysis(Base):
    __tablename__ = "job_analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    source_ip = Column(String(64), nullable=True, index=True)
    source_url = Column(String(1024), nullable=True)
    job_text = Column(Text, nullable=False)
    extracted_text = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    keywords = Column(JSON, nullable=False)
    signals = Column(JSON, nullable=False)
    ai_raw_response = Column(JSON, nullable=True)
    ai_model = Column(String(120), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
