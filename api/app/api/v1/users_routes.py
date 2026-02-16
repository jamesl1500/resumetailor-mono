# API routes for users
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.libs.db.base import get_db
from app.models.tailored_resume_model import TailoredResume
from app.services.users_service import (
    get_user,
    get_user_by_email,
    get_user_by_username,
    list_users,
    create_user,
    attach_anonymous_data_to_user_by_ip,
)
from app.services.visitor_service import get_client_ip, link_visitor_ip_to_user, track_visitor_by_ip
from app.schemas.users_schema import UserRead, UserCreate, SignupResponse

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.post("/signup", response_model=SignupResponse)
def signup_user(payload: UserCreate, request: Request, db: Session = Depends(get_db)):
    existing_by_email = get_user_by_email(db, payload.email)
    if existing_by_email is not None:
        raise HTTPException(status_code=409, detail="Email already in use")

    existing_by_username = get_user_by_username(db, payload.username)
    if existing_by_username is not None:
        raise HTTPException(status_code=409, detail="Username already in use")

    ip_address = get_client_ip(request)
    user = create_user(db, payload)
    attach_anonymous_data_to_user_by_ip(db, ip_address, user.id)
    link_visitor_ip_to_user(db, ip_address, user.id)
    track_visitor_by_ip(db, ip_address, user.id)

    return {
        "user": user,
        "message": "Signup successful. Your previous resume activity has been linked to this account.",
    }


@router.post("/track-visit")
def track_visit(request: Request, db: Session = Depends(get_db)):
    ip_address = get_client_ip(request)
    visitor = track_visitor_by_ip(db, ip_address)
    return {
        "message": "Visit tracked",
        "ip_address": ip_address,
        "visit_count": visitor.visit_count,
    }

# Get user by ID
@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: str, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Get user by email
@router.get("/email/{email}", response_model=UserRead)
def read_user_by_email(email: str, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# List users
@router.get("/", response_model=list[UserRead])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = list_users(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}/history")
def read_user_history(user_id: str, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    tailored = (
        db.query(TailoredResume)
        .filter(TailoredResume.user_id == user.id)
        .order_by(TailoredResume.created_at.desc())
        .limit(50)
        .all()
    )

    return {
        "user_id": str(user.id),
        "email": user.email,
        "username": user.username,
        "tailored_resumes": [
            {
                "id": str(item.id),
                "target_role": item.target_role,
                "style": item.style,
                "created_at": item.created_at,
                "output_files": item.output_files,
            }
            for item in tailored
        ],
    }