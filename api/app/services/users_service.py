"""users CRUD operations for API"""
from datetime import datetime
import hashlib
from sqlalchemy.orm import Session
from app.models.users_model import User
from app.schemas.users_schema import UserCreate, UserUpdate


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

# Get user by ID
def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

# Get user by email
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

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

# Update user
def update_user(db: Session, user_id: str, updated_user: UserUpdate):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    if updated_user.username is not None:
        user.username = updated_user.username
    if updated_user.email is not None:
        user.email = updated_user.email
    if updated_user.password is not None:
        user.password_hash = hash_password(updated_user.password)
    user.updated_at = updated_user.updated_at or datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user

# Delete user
def delete_user(db: Session, user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    db.delete(user)
    db.commit()
    return user