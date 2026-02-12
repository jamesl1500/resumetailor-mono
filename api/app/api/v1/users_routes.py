# API routes for users
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.libs.db.base import get_db
from app.services.users_service import get_user, get_user_by_email, list_users, create_user, update_user, delete_user
from app.schemas.users_schema import UserRead

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

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