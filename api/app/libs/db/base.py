# Database Base Setup for the API
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config.database import DatabaseConfig

# Create the SQLAlchemy engine
engine = create_engine(
    DatabaseConfig.SQLALCHEMY_DATABASE_URI,
    pool_size = 10,
    max_overflow = 20,
    pool_pre_ping = True
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()