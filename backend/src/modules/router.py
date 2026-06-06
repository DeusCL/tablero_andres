from litestar import Router

from .auth.router import auth_router
from .civil_works.router import civil_works_router



main_router = Router(
    path="",
    route_handlers=[
        auth_router,
        civil_works_router,
    ]
)
