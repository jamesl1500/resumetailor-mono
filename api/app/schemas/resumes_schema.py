# Resumes CRUD schemas for API
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

# Base resume schema
class ResumeBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None

# Resume creation schema
class ResumeCreate(ResumeBase):
    file_id: UUID
    user_id: UUID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Resume update schema
class ResumeUpdate(ResumeBase):
    file_id: Optional[UUID] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Resume delete schema
class ResumeDelete(BaseModel):
    id: UUID

# Resume read schema
class ResumeRead(ResumeBase):
    id: UUID
    user_id: UUID
    file_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Resume response schema
class ResumeResponse(ResumeBase):
    id: UUID
    user_id: UUID
    file_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

