from litestar import Router

from .auth.router import auth_router



main_router = Router(
    path="",
    route_handlers=[
        auth_router,
    ]
)
