from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import FileResponse
import os
from typing import Any, cast
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
from app.services.visitor_service import get_client_ip, get_user_id_for_ip, track_visitor_by_ip
from app.config.config import Config

router = APIRouter(prefix="/tailor", tags=["tailor"])


def _as_uuid(value: Any) -> UUID:
    return cast(UUID, value)


def _as_optional_uuid(value: Any) -> UUID | None:
    return cast(UUID | None, value)


def _as_optional_str(value: Any) -> str | None:
    return cast(str | None, value)


def _as_str(value: Any) -> str:
    return cast(str, value)


def _as_list_str(value: Any) -> list[str]:
    return cast(list[str], value)


def _as_signals(value: Any) -> dict[str, list[str]]:
    return cast(dict[str, list[str]], value)


def _as_list_dict(value: Any) -> list[dict]:
    return cast(list[dict], value)

@router.post("/analyze-job", response_model=JobAnalyzeResponse)
def analyze_job(payload: JobAnalyzeRequest, request: Request, db: Session = Depends(get_db)):
    if not payload.job_text and not payload.job_url:
        raise HTTPException(status_code=400, detail="job_text or job_url is required")

    ip_address = get_client_ip(request)
    inferred_user_id = _as_optional_uuid(payload.user_id or get_user_id_for_ip(db, ip_address))
    track_visitor_by_ip(db, ip_address, inferred_user_id)

    analysis = create_job_analysis(
        db=db,
        job_text=payload.job_text,
        job_url=str(payload.job_url) if payload.job_url else None,
        user_id=inferred_user_id,
        source_ip=ip_address,
    )
    return analysis

@router.post("/parse-resume", response_model=ResumeParseResponse)
def parse_resume(payload: ResumeParseRequest, request: Request, db: Session = Depends(get_db)):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text is required")

    ip_address = get_client_ip(request)
    inferred_user_id = _as_optional_uuid(payload.user_id or get_user_id_for_ip(db, ip_address))
    track_visitor_by_ip(db, ip_address, inferred_user_id)

    profile = create_resume_profile(
        db=db,
        resume_text=payload.resume_text,
        file_name=payload.file_name,
        user_id=inferred_user_id,
        source_ip=ip_address,
    )
    return profile


@router.post("/parse-resume-file", response_model=ResumeParseResponse)
async def parse_resume_file(
    request: Request,
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

    ip_address = get_client_ip(request)
    inferred_user_id = _as_optional_uuid(user_id or get_user_id_for_ip(db, ip_address))
    track_visitor_by_ip(db, ip_address, inferred_user_id)

    profile = create_resume_profile(
        db=db,
        resume_text=resume_text,
        file_name=file.filename,
        user_id=inferred_user_id,
        source_ip=ip_address,
    )
    return profile

@router.post("/generate", response_model=TailorResumeResponse)
def generate_resume(payload: TailorResumeRequest, request: Request, db: Session = Depends(get_db)):
    job_analysis = None
    resume_profile = None
    ip_address = get_client_ip(request)
    inferred_user_id = _as_optional_uuid(payload.user_id or get_user_id_for_ip(db, ip_address))
    track_visitor_by_ip(db, ip_address, inferred_user_id)

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
            user_id=inferred_user_id,
            source_ip=ip_address,
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
            user_id=inferred_user_id,
            source_ip=ip_address,
        )

    tailored = create_tailored_resume(
        db=db,
        job_analysis=job_analysis,
        resume_profile=resume_profile,
        target_role=payload.target_role,
        user_id=inferred_user_id,
        style=payload.style,
        source_ip=ip_address,
    )
    return tailored


@router.post("/regenerate/{tailored_id}", response_model=TailorResumeResponse)
def regenerate_resume(
    tailored_id: UUID,
    payload: TailorRegenerateRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    tailored = get_tailored_resume(db, tailored_id)
    if not tailored:
        raise HTTPException(status_code=404, detail="Tailored resume not found")

    job_analysis = get_job_analysis(db, _as_uuid(tailored.job_analysis_id))
    resume_profile = get_resume_profile(db, _as_uuid(tailored.resume_profile_id))

    if not job_analysis or not resume_profile:
        raise HTTPException(status_code=404, detail="Analysis data not found")

    ip_address = get_client_ip(request)
    inferred_user_id = _as_optional_uuid(tailored.user_id or get_user_id_for_ip(db, ip_address))
    track_visitor_by_ip(db, ip_address, inferred_user_id)

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
        target_role=_as_optional_str(tailored.target_role),
        user_id=inferred_user_id,
        style=_as_optional_str(payload.style or tailored.style),
        source_ip=ip_address,
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
    output_files = _as_list_str(tailored.output_files)
    candidates = [path for path in output_files if _as_str(path).endswith(safe_name)]
    if not candidates:
        raise HTTPException(status_code=404, detail="File not found")

    relative_path = _as_str(candidates[0])
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
    output_files = _as_list_str(tailored.output_files)
    candidates = [path for path in output_files if _as_str(path).endswith(safe_name)]
    if not candidates:
        raise HTTPException(status_code=404, detail="File not found")

    relative_path = _as_str(candidates[0])
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

    job_analysis = get_job_analysis(db, _as_uuid(tailored.job_analysis_id))
    resume_profile = get_resume_profile(db, _as_uuid(tailored.resume_profile_id))

    if not job_analysis or not resume_profile:
        raise HTTPException(status_code=404, detail="Analysis data not found")

    job_length = len(_as_str(job_analysis.extracted_text or ""))
    match_score = min(96, 60 + job_length // 55)
    parsed_data = cast(dict[str, Any], resume_profile.parsed_data or {})
    candidate_name = cast(str | None, parsed_data.get("name"))
    statement = cast(str | None, parsed_data.get("summary"))
    skills = _as_list_str(parsed_data.get("skills", []))
    experience = _as_list_dict(parsed_data.get("experience", []))
    education = _as_list_dict(parsed_data.get("education", []))

    return TailorResultResponse(
        id=_as_uuid(tailored.id),
        match_score=match_score,
        summary=_as_str(job_analysis.summary),
        keywords=_as_list_str(job_analysis.keywords),
        signals=_as_signals(job_analysis.signals),
        outputs=_as_list_str(tailored.output_files),
        statement=statement,
        skills=skills,
        experience=experience,
        education=education,
        target_role=_as_optional_str(tailored.target_role),
        style=_as_optional_str(tailored.style),
        candidate_name=candidate_name,
        created_at=cast(Any, tailored.created_at),
    )
