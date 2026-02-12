from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, HttpUrl

class TailorResumeRequest(BaseModel):
    job_analysis_id: Optional[UUID] = None
    resume_profile_id: Optional[UUID] = None
    job_text: Optional[str] = None
    job_url: Optional[HttpUrl] = None
    resume_text: Optional[str] = None
    file_name: Optional[str] = None
    user_id: Optional[UUID] = None
    target_role: Optional[str] = None
    style: Optional[str] = None

class TailorResumeResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID]
    job_analysis_id: UUID
    resume_profile_id: UUID
    target_role: Optional[str]
    style: Optional[str]
    tailored_summary: str
    tailored_bullets: list[str]
    tailored_experience: list[dict]
    tailored_education: list[dict]
    output_files: list[str]
    created_at: datetime

    class Config:
        orm_mode = True
