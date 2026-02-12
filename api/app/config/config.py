# Config File for the API
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql+psycopg://app:app@localhost:5432/resumetailor')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # App information
    APP_NAME = os.getenv('APP_NAME', 'ResumeTailor API')
    APP_ENV = os.getenv('APP_ENV', 'development')
    APP_DEBUG = os.getenv('APP_DEBUG', 'True').lower() in ['true', '1', 't']
    APP_PORT = int(os.getenv('APP_PORT', 8000))
    APP_VERSION = os.getenv('APP_VERSION', '1.0.0')

    # Security settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key_here')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key_here')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 86400  # 24 hours

    #CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')

    # Storage
    STORAGE_PATH = os.getenv('STORAGE_PATH', 'storage')

    # OpenAI
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-4.1-mini')
    OPENAI_JOB_MODEL = os.getenv('OPENAI_JOB_MODEL', OPENAI_MODEL)
    OPENAI_RESUME_MODEL = os.getenv('OPENAI_RESUME_MODEL', OPENAI_MODEL)
    OPENAI_BASE_URL = os.getenv('OPENAI_BASE_URL', 'https://api.openai.com/v1')
    OPENAI_MAX_RPM = int(os.getenv('OPENAI_MAX_RPM', '30'))
    OPENAI_MAX_RETRIES = int(os.getenv('OPENAI_MAX_RETRIES', '2'))
    OPENAI_RETRY_BACKOFF = float(os.getenv('OPENAI_RETRY_BACKOFF', '1.5'))