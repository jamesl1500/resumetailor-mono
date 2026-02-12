# Resumes Model for API
from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, Integer, String, Text, DateTime, UUID, ForeignKey
from app.libs.db.base import Base

class Resume(Base):
    __tablename__ = 'resumes'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    file_id = Column(UUID(as_uuid=True), ForeignKey('files.id'), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)