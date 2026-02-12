# Main API application setup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.libs.db.base import Base, engine
from app.api.v1.users_routes import router as users_router
from app.api.v1.tailor_routes import router as tailor_router
from app.config.config import Config

app = FastAPI(
    title="Resume Tailor API",
    description="API for managing users, resumes, education, experience, and files for Resume Tailor application",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup tables handled by Alembic migrations.

# Include API routers
app.include_router(users_router)
app.include_router(tailor_router)

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy"}