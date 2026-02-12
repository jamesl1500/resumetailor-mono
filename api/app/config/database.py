# Databse Configuration for API
from .config import Config

class DatabaseConfig(Config):
    SQLALCHEMY_DATABASE_URI = Config.SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = Config.SQLALCHEMY_TRACK_MODIFICATIONS