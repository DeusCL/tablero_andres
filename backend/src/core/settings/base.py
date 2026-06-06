from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)



class Settings(BaseSettings):
    # App
    debug: bool
    environment: str

    # General
    secret_key: bytes
    allowed_origins: str

    # Database
    db_host: str
    db_port: int
    db_user: str
    db_password: str
    db_name: str
    db_max_pool_size: int
    db_max_overflow: int

    # Channels
    pubsub_url: str
    channels_backend: str
    redis_prefix: str


    @property
    def url_db(self) -> str:
        return (
            f"postgresql+asyncpg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


    @property
    def url_db_sync(self) -> str:
        return (
            f"postgresql+psycopg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


# Singleton para toda la App
settings = Settings()
