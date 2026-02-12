from typing import Optional
from pydantic import BaseModel

class TailorRegenerateRequest(BaseModel):
    statement: Optional[str] = None
    skills: Optional[list[str]] = None
    experience: Optional[list[dict]] = None
    education: Optional[list[dict]] = None
    style: Optional[str] = None
