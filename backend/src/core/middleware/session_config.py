from litestar.middleware.session.client_side import CookieBackendConfig

from src.core.settings.base import settings



IS_PROD: bool = settings.environment == "prod"

session_config = CookieBackendConfig(
    secret=settings.secret_key,
    key="session",
    secure=IS_PROD,
    httponly=True,
    max_age=28800,
    samesite="lax",
)
