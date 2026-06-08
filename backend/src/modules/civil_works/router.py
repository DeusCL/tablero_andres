from litestar import Router

from .features.importation.controllers.importation_api import ImportationAPI
from .features.analytics.controllers.analytics_api import AnalyticsAPI



civil_works_router = Router(
    path="",
    route_handlers=[
        ImportationAPI,
        AnalyticsAPI,
    ]
)
