from litestar import Router

from .features.importation.controllers.importation_api import ImportationAPI



civil_works_router = Router(
    path="",
    route_handlers=[
        ImportationAPI,
    ]
)
