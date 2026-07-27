import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()


class Config:
    """Central app configuration, pulled from environment variables."""

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

    # MySQL connection built for SQLAlchemy + PyMySQL driver
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "smart_internship_db")

    
    SQLALCHEMY_DATABASE_URI = (
    f"mysql+pymysql://{DB_USER}:{quote_plus(DB_PASSWORD)}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
   )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT settings (Day 3 - Authentication Module ke liye)
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES_MIN = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MIN", 60))

    # AI module endpoint (Day 6 - Atharva ke recommendation engine se connect)
    AI_MODULE_URL = os.getenv("AI_MODULE_URL","http://localhost:5001/recommend")