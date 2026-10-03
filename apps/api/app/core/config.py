"""
ArchAI Configuration Module
"""

import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App Information
    APP_NAME: str = "ArchAI"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "archai-super-secret-production-key-change-in-prod-123456789"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Operating Mode
    DEMO_MODE: bool = True  # True enables deterministic high-fidelity mock LLM generation

    # Database
    DATABASE_URL: str = "sqlite:///./archai.db"  # Fallback to local sqlite; can be postgresql://...
    REDIS_URL: str = "redis://localhost:6379/0"

    # LLM Settings
    LLM_PROVIDER: str = "gemini"  # gemini, openai, huggingface, mock
    LLM_MODEL: str = "gemini-1.5-pro"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""

    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    ROOT_DIR: Path = BASE_DIR.parent.parent
    PROMPTS_DIR: Path = ROOT_DIR / "packages" / "prompts"
    UPLOADS_DIR: Path = BASE_DIR / "uploads"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    # Rate Limiting & Timeouts
    AGENT_TIMEOUT_SECONDS: int = 60
    AGENT_MAX_RETRIES: int = 3

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
