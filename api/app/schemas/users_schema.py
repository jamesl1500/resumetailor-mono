# Users CRUD schemas for API
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

# Base user schema
class UserBase(BaseModel):
    username: str = Field(..., max_length=255)
    email: EmailStr = Field(..., max_length=255)
    password: str = Field(..., min_length=8)

# User creation schema
class UserCreate(UserBase):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# User update schema
class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, max_length=255)
    email: Optional[EmailStr] = Field(None, max_length=255)
    password: Optional[str] = Field(None, min_length=8)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# User delete schema
class UserDelete(BaseModel):
    id: UUID

# User read schema
class UserRead(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# User response schema
class UserResponse(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class SignupResponse(BaseModel):
    user: UserResponse
    message: str