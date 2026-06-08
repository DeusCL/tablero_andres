from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.modules.civil_works.domain.models.civil_work import CivilWork



class AnalyticsRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session


    async def get_all_civil_works(self) -> list[CivilWork]:
        query = select(CivilWork)
        result = await self.session.execute(query)
        return list(result.scalars().all())
