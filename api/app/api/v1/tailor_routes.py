from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
import os
from uuid import UUID
from sqlalchemy.orm import Session
from app.libs.db.base import get_db
from app.schemas.job_analysis_schema import JobAnalyzeRequest, JobAnalyzeResponse
from app.schemas.resume_profile_schema import ResumeParseRequest, ResumeParseResponse
from app.schemas.tailored_resume_schema import TailorResumeRequest, TailorResumeResponse
from app.schemas.tailor_regenerate_schema import TailorRegenerateRequest
from app.schemas.tailor_result_schema import TailorResultResponse
from app.services.tailor_service import (
    create_job_analysis,
    create_resume_profile,
    create_tailored_resume,
    update_resume_profile_data,
    get_job_analysis,
    get_resume_profile,
    get_tailored_resume,
    extract_text_from_upload,
)
from app.config.config import Config

router = APIRouter(prefix="/tailor", tags=["tailor"])

@router.post("/analyze-job", response_model=JobAnalyzeResponse)
def analyze_job(payload: JobAnalyzeRequest, db: Session = Depends(get_db)):
    if not payload.job_text and not payload.job_url:
        raise HTTPException(status_code=400, detail="job_text or job_url is required")

    analysis = create_job_analysis(
        db=db,
        job_text=payload.job_text,
        job_url=str(payload.job_url) if payload.job_url else None,
        user_id=payload.user_id,
    )
    return analysis

@router.post("/parse-resume", response_model=ResumeParseResponse)
def parse_resume(payload: ResumeParseRequest, db: Session = Depends(get_db)):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text is required")

    profile = create_resume_profile(
        db=db,
        resume_text=payload.resume_text,
        file_name=payload.file_name,
        user_id=payload.user_id,
    )
    return profile


@router.post("/parse-resume-file", response_model=ResumeParseResponse)
async def parse_resume_file(
    file: UploadFile = File(...),
    user_id: UUID | None = Form(default=None),
    db: Session = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="file is required")

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="file is empty")

    try:
        resume_text = extract_text_from_upload(file.filename, data)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    profile = create_resume_profile(
        db=db,
        resume_text=resume_text,
        file_name=file.filename,
        user_id=user_id,
    )
    return profile

@router.post("/generate", response_model=TailorResumeResponse)
def generate_resume(payload: TailorResumeRequest, db: Session = Depends(get_db)):
    job_analysis = None
    resume_profile = None

    if payload.job_analysis_id:
        job_analysis = get_job_analysis(db, payload.job_analysis_id)
    if payload.resume_profile_id:
        resume_profile = get_resume_profile(db, payload.resume_profile_id)

    if not job_analysis:
        if not payload.job_text and not payload.job_url:
            raise HTTPException(
                status_code=400,
                detail="job_text/job_url or job_analysis_id is required",
            )
        job_analysis = create_job_analysis(
            db=db,
            job_text=payload.job_text,
            job_url=str(payload.job_url) if payload.job_url else None,
            user_id=payload.user_id,
        )

    if not resume_profile:
        if not payload.resume_text:
            raise HTTPException(
                status_code=400,
                detail="resume_text or resume_profile_id is required",
            )
        resume_profile = create_resume_profile(
            db=db,
            resume_text=payload.resume_text,
            file_name=payload.file_name,
            user_id=payload.user_id,
        )

    tailored = create_tailored_resume(
        db=db,
        job_analysis=job_analysis,
        resume_profile=resume_profile,
        target_role=payload.target_role,
        user_id=payload.user_id,
        style=payload.style,
    )
    return tailored


@router.post("/regenerate/{tailored_id}", response_model=TailorResumeResponse)
def regenerate_resume(
    tailored_id: UUID,
    payload: TailorRegenerateRequest,
    db: Session = Depends(get_db),
):
    tailored = get_tailored_resume(db, tailored_id)
    if not tailored:
        raise HTTPException(status_code=404, detail="Tailored resume not found")

    job_analysis = get_job_analysis(db, tailored.job_analysis_id)
    resume_profile = get_resume_profile(db, tailored.resume_profile_id)

    if not job_analysis or not resume_profile:
        raise HTTPException(status_code=404, detail="Analysis data not found")

    resume_profile = update_resume_profile_data(
        db=db,
        resume_profile=resume_profile,
        statement=payload.statement,
        skills=payload.skills,
        experience=payload.experience,
        education=payload.education,
    )

    regenerated = create_tailored_resume(
        db=db,
        job_analysis=job_analysis,
        resume_profile=resume_profile,
        target_role=tailored.target_role,
        user_id=tailored.user_id,
        style=payload.style or tailored.style,
    )
    return regenerated


@router.get("/download/{tailored_id}/{filename}")
def download_tailored_file(
    tailored_id: UUID,
    filename: str,
    db: Session = Depends(get_db),
):
    tailored = get_tailored_resume(db, tailored_id)
    if not tailored:
        raise HTTPException(status_code=404, detail="Tailored resume not found")

    safe_name = os.path.basename(filename)
    candidates = [path for path in tailored.output_files if path.endswith(safe_name)]
    if not candidates:
        raise HTTPException(status_code=404, detail="File not found")

    relative_path = candidates[0]
    file_path = os.path.join(Config.STORAGE_PATH, relative_path)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File missing on disk")

    return FileResponse(file_path, filename=safe_name)


@router.get("/preview/{tailored_id}/{filename}")
def preview_tailored_file(
    tailored_id: UUID,
    filename: str,
    db: Session = Depends(get_db),
):
    tailored = get_tailored_resume(db, tailored_id)
    if not tailored:
        raise HTTPException(status_code=404, detail="Tailored resume not found")

    safe_name = os.path.basename(filename)
    candidates = [path for path in tailored.output_files if path.endswith(safe_name)]
    if not candidates:
        raise HTTPException(status_code=404, detail="File not found")

    relative_path = candidates[0]
    file_path = os.path.join(Config.STORAGE_PATH, relative_path)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File missing on disk")

    media_type = "application/pdf" if safe_name.lower().endswith(".pdf") else None
    headers = {"Content-Disposition": f'inline; filename="{safe_name}"'}
    return FileResponse(file_path, media_type=media_type, headers=headers)


@router.get("/result/{tailored_id}", response_model=TailorResultResponse)
def get_tailored_result(tailored_id: UUID, db: Session = Depends(get_db)):
    tailored = get_tailored_resume(db, tailored_id)
    if not tailored:
        raise HTTPException(status_code=404, detail="Tailored resume not found")

    job_analysis = get_job_analysis(db, tailored.job_analysis_id)
    resume_profile = get_resume_profile(db, tailored.resume_profile_id)

    if not job_analysis or not resume_profile:
        raise HTTPException(status_code=404, detail="Analysis data not found")

    job_length = len(job_analysis.extracted_text or "")
    match_score = min(96, 60 + job_length // 55)
    candidate_name = resume_profile.parsed_data.get("name")
    statement = resume_profile.parsed_data.get("summary")
    skills = resume_profile.parsed_data.get("skills", [])
    experience = resume_profile.parsed_data.get("experience", [])
    education = resume_profile.parsed_data.get("education", [])

    return TailorResultResponse(
        id=tailored.id,
        match_score=match_score,
        summary=job_analysis.summary,
        keywords=job_analysis.keywords,
        signals=job_analysis.signals,
        outputs=tailored.output_files,
        statement=statement,
        skills=skills,
        experience=experience,
        education=education,
        target_role=tailored.target_role,
        style=tailored.style,
        candidate_name=candidate_name,
        created_at=tailored.created_at,
    )
