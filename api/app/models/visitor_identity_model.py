from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, DateTime, Integer, String, UUID, ForeignKey
from app.libs.db.base import Base


class VisitorIdentity(Base):
    __tablename__ = "visitor_identities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    ip_address = Column(String(64), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    first_seen = Column(DateTime, nullable=False, default=datetime.utcnow)
    last_seen = Column(DateTime, nullable=False, default=datetime.utcnow)
    visit_count = Column(Integer, nullable=False, default=1)
