from litestar.plugins.sqlalchemy import SQLAlchemyAsyncConfig, EngineConfig

from src.infrastructure.database.models.base import Base
from src.core.settings.base import settings



def get_database_config() -> SQLAlchemyAsyncConfig:
    return SQLAlchemyAsyncConfig(
        connection_string=settings.url_db,
        create_all=False,
        metadata=Base.metadata,
        session_dependency_key="db",
        engine_dependency_key="db_engine",
        before_send_handler="autocommit",
        engine_config=EngineConfig(
            pool_pre_ping=True,
            pool_recycle=1800,
            pool_size=settings.db_max_pool_size,
            max_overflow=settings.db_max_overflow,
        )
    )
