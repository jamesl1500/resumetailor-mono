# Files CRUD schemas for API
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

# Base files schema
class FileBase(BaseModel):
    filename: str = Field(..., max_length=255)
    filepath: str = Field(..., max_length=255)
    filetype: str = Field(..., max_length=50)
    filesize: int
    user_id: Optional[UUID] = None

# File creation schema
class FileCreate(FileBase):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# File update schema
class FileUpdate(FileBase):
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# File delete schema
class FileDelete(BaseModel):
    id: UUID

# File read schema
class FileRead(FileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# File response schema
class FileResponse(FileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True