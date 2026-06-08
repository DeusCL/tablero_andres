from litestar import Controller, get
from litestar.di import Provide

from src.core.guards.auth_guard import user_guard
from ..di import provide_analytics_repository, provide_analytics_service
from ..services.analytics_service import AnalyticsService
from ..schemas import CivilWorkAnalyticsSchema



class AnalyticsAPI(Controller):
    path = "/analytics"
    guards = [user_guard]
    dependencies = {
        "analytics_repository": Provide(provide_analytics_repository),
        "analytics_service": Provide(provide_analytics_service),
    }


    @get(path="/dashboard")
    async def get_dashboard_data(
        self,
        analytics_service: AnalyticsService
    ) -> list[CivilWorkAnalyticsSchema]:
        return await analytics_service.get_dashboard_data()
