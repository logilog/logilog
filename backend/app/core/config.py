from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    app_name: str = "LogiLog MCP"
    environment: str = "development"
    secret_key: str
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite+aiosqlite:///./logilog.db"
    openai_api_key: str | None = None
    trial_length_days: int = 1

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()  # type: ignore[arg-type]
