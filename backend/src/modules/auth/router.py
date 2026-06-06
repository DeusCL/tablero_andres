from litestar import Router

from .features.authentication.controllers.auth_api import AuthAPI



auth_router = Router(
    path="",
    route_handlers=[
        AuthAPI,
    ]
)
