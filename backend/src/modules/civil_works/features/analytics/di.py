from sqlalchemy.ext.asyncio import AsyncSession

from .repositories.analytics_repository import AnalyticsRepository
from .services.analytics_service import AnalyticsService



async def provide_analytics_repository(db: AsyncSession) -> AnalyticsRepository:
    return AnalyticsRepository(db)


async def provide_analytics_service(
    analytics_repository: AnalyticsRepository
) -> AnalyticsService:
    return AnalyticsService(analytics_repository)
