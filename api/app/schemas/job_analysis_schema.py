from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, HttpUrl

class JobAnalyzeRequest(BaseModel):
    job_text: Optional[str] = None
    job_url: Optional[HttpUrl] = None
    user_id: Optional[UUID] = None

class JobAnalyzeResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID]
    source_url: Optional[str]
    job_text: str
    extracted_text: str
    summary: str
    keywords: list[str]
    signals: dict[str, list[str]]
    created_at: datetime

    class Config:
        orm_mode = True
