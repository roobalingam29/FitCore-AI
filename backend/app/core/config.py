import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FitCore AI – Smart Gym Management System"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretjwtkeyforfitcoreai12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/fitcore_db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        case_sensitive = True

settings = Settings()
