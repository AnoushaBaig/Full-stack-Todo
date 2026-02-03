from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = Field(..., alias="DATABASE_URL")
    better_auth_secret: str = Field(..., alias="BETTER_AUTH_SECRET")

    app_name: str = Field(default="tasks-api", alias="APP_NAME")


@lru_cache
def get_settings() -> Settings:
    return Settings()
