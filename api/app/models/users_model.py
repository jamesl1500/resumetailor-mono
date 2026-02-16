# Users model for API
from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, Integer, String, Text, DateTime, UUID, ForeignKey
from sqlalchemy.orm import relationship
from app.libs.db.base import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    resumes = relationship('Resume', backref='user', lazy=True)
    education = relationship('Education', backref='user', lazy=True)
    experience = relationship('Experience', backref='user', lazy=True)
    files = relationship('File', backref='user', lazy=True)
    visitor_identities = relationship('VisitorIdentity', backref='user', lazy=True)