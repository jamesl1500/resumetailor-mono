"""users CRUD operations for API"""
from datetime import datetime
import hashlib
from sqlalchemy.orm import Session
from typing import Any, cast
from app.models.users_model import User
from app.models.job_analysis_model import JobAnalysis
from app.models.resume_profile_model import ResumeProfile
from app.models.tailored_resume_model import TailoredResume
from app.models.files_model import File
from app.schemas.users_schema import UserCreate, UserUpdate


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

# Get user by ID
def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

# Get user by email
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

# List users
def list_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

# Create new user
def create_user(db: Session, user_in: UserCreate):
    user = User(
        username=user_in.username,
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        created_at=user_in.created_at,
        updated_at=user_in.updated_at,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def attach_anonymous_data_to_user_by_ip(db: Session, ip_address: str, user_id):
    if not ip_address or ip_address == "unknown":
        return

    db.query(JobAnalysis).filter(
        JobAnalysis.user_id.is_(None),
        JobAnalysis.source_ip == ip_address,
    ).update(
        {JobAnalysis.user_id: user_id}, synchronize_session=False
    )

    db.query(ResumeProfile).filter(
        ResumeProfile.user_id.is_(None),
        ResumeProfile.source_ip == ip_address,
    ).update(
        {ResumeProfile.user_id: user_id}, synchronize_session=False
    )

    db.query(TailoredResume).filter(
        TailoredResume.user_id.is_(None),
        TailoredResume.source_ip == ip_address,
    ).update(
        {TailoredResume.user_id: user_id}, synchronize_session=False
    )

    db.query(File).filter(
        File.user_id.is_(None),
        File.source_ip == ip_address,
    ).update(
        {File.user_id: user_id}, synchronize_session=False
    )

    db.commit()

# Update user
def update_user(db: Session, user_id: str, updated_user: UserUpdate):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    mutable_user = user
    mutable_user_any = cast(Any, mutable_user)
    if updated_user.username is not None:
        mutable_user_any.username = str(updated_user.username)
    if updated_user.email is not None:
        mutable_user_any.email = str(updated_user.email)
    if updated_user.password is not None:
        mutable_user_any.password_hash = hash_password(updated_user.password)
    mutable_user_any.updated_at = updated_user.updated_at or datetime.utcnow()
    db.commit()
    db.refresh(mutable_user)
    return mutable_user

# Delete user
def delete_user(db: Session, user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    db.delete(user)
    db.commit()
    return user