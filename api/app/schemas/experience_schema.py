# Experience Schema for API
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

# Base experience schema
class ExperienceBase(BaseModel):
    title: str = Field(..., max_length=255)
    company: str = Field(..., max_length=255)
    location: str = Field(..., max_length=255)
    start_date: datetime
    end_date: Optional[datetime] = None
    description: Optional[str] = None

# Experience creation schema
class ExperienceCreate(ExperienceBase):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Experience update schema
class ExperienceUpdate(ExperienceBase):
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Experience delete schema
class ExperienceDelete(BaseModel):
    id: UUID

# Experience read schema
class ExperienceRead(ExperienceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Experience response schema
class ExperienceResponse(ExperienceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True