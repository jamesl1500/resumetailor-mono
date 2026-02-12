from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class TailorResultResponse(BaseModel):
    id: UUID
    match_score: int
    summary: str
    keywords: list[str]
    signals: dict[str, list[str]]
    outputs: list[str]
    statement: Optional[str]
    skills: list[str]
    experience: list[dict]
    education: list[dict]
    target_role: Optional[str]
    style: Optional[str]
    candidate_name: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
