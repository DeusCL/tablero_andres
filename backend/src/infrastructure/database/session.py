from asyncio import AbstractEventLoop
from typing import (
    AsyncGenerator,
    Generator,
)

from contextlib import (
    asynccontextmanager,
    contextmanager,
)

from sqlalchemy.pool import NullPool
from sqlalchemy import (
    create_engine,
    Engine,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    AsyncEngine,
    async_sessionmaker,
    create_async_engine,
)

from sqlalchemy.orm import (
    sessionmaker,
    Session,
)

from src.core.settings.base import settings



sync_engine: Engine = create_engine(
    settings.url_db_sync,
    pool_size=settings.db_max_pool_size,
    max_overflow=settings.db_max_overflow,
    pool_pre_ping=True,
)

SyncSessionLocal: sessionmaker[Session] = sessionmaker(
    bind=sync_engine,
    future=True,
)

# Cache engines per event loop to avoid "bound to a different event loop" errors
# while still benefiting from some engine-level caching within the same loop.
_async_engines: dict[AbstractEventLoop, AsyncEngine] = {}

def get_async_engine() -> AsyncEngine:
    import asyncio
    try:
        loop: AbstractEventLoop = asyncio.get_running_loop()
    except RuntimeError:
        # Fallback for cases where no loop is running yet
        return create_async_engine(
            settings.url_db,
            poolclass=NullPool,
            pool_pre_ping=True,
        )

    if loop not in _async_engines:
        _async_engines[loop] = create_async_engine(
            settings.url_db,
            poolclass=NullPool,
            pool_pre_ping=True,
        )

    return _async_engines[loop]


@asynccontextmanager
async def AsyncSessionLocal() -> AsyncGenerator[AsyncSession, None]:
    engine: AsyncEngine = get_async_engine()
    async_session_factory: async_sessionmaker[AsyncSession] = async_sessionmaker(
        bind=engine,
        expire_on_commit=False,
        class_=AsyncSession,
    )

    async with async_session_factory() as session:
        yield session


@asynccontextmanager
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


@contextmanager
def get_sync_db_session() -> Generator[Session, None]:
    session: Session = SyncSessionLocal()

    try:
        yield session
    finally:
        session.close()

