from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class ResumeParseRequest(BaseModel):
    resume_text: str
    file_name: Optional[str] = None
    user_id: Optional[UUID] = None

class ResumeParseResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID]
    file_name: Optional[str]
    raw_text: str
    parsed_data: dict
    created_at: datetime

    class Config:
        orm_mode = True
