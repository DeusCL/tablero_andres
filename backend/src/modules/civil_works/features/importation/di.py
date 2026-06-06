from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.civil_works.features.importation.repositories.importation_repository import ImportationRepository
from src.modules.civil_works.features.importation.services.importation_service import ImportationService



async def provide_importation_repository(db: AsyncSession) -> ImportationRepository:
    return ImportationRepository(db)


async def provide_importation_service(importation_repository: ImportationRepository) -> ImportationService:
    return ImportationService(importation_repository)
