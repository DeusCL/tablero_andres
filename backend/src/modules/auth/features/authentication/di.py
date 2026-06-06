from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.auth.features.authentication.repositories import AuthRepository
from src.modules.auth.features.authentication.services import AuthService



async def provide_auth_repository(db: AsyncSession) -> AuthRepository:
    return AuthRepository(db)


async def provide_auth_service(auth_repository: AuthRepository) -> AuthService:
    return AuthService(auth_repository)

