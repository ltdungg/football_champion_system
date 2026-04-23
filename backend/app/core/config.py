import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Football Championship System"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://football_user:football_password@postgres:5432/football_championship")
    TEST_DATABASE_URL: Optional[str] = os.getenv("TEST_DATABASE_URL")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8080", "*"]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # SMTP / Email settings
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = os.getenv("SMTP_PORT")
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST")
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "onboarding@resend.dev")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", "Football Championship System")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:8080")
    RESEND_API_KEY: Optional[str] = os.getenv("RESEND_API_KEY")

    # Gemini AI
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")

    class Config:
        case_sensitive = True

settings = Settings()