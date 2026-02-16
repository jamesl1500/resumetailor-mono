# Files model for API
from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, Integer, String, Text, DateTime, UUID, ForeignKey
from app.libs.db.base import Base

class File(Base):
    __tablename__ = 'files'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True, index=True)
    source_ip = Column(String(64), nullable=True, index=True)
    filename = Column(String(255), nullable=False)
    filepath = Column(String(255), nullable=False)
    filetype = Column(String(50), nullable=False)
    filesize = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)