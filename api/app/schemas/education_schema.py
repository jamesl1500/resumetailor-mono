# Education CRUD Schemas for API
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

# Education base schema
class EducationBase(BaseModel):
    institution: str = Field(..., max_length=255)
    degree: str = Field(..., max_length=255)
    field_of_study: str = Field(..., max_length=255)
    start_date: datetime
    end_date: Optional[datetime] = None
    description: Optional[str] = None

# Education creation schema
class EducationCreate(EducationBase):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Education update schema
class EducationUpdate(EducationBase):
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Education delete schema
class EducationDelete(BaseModel):
    id: UUID

# Education read schema
class EducationRead(EducationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Education response schema
class EducationResponse(EducationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True