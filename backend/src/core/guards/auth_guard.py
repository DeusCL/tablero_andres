from typing import Any

from litestar.connection.base import ASGIConnection
from litestar.exceptions.http_exceptions import NotAuthorizedException
from litestar.handlers.base import BaseRouteHandler



def user_guard(connection: ASGIConnection[Any, Any, Any, Any], _: BaseRouteHandler) -> None:
    user_session: dict[str, Any] = connection.scope.get("session", {}) # type: ignore

    if not user_session or not user_session.get("id_user"):
        raise NotAuthorizedException(
            status_code=401, detail="User is not authenticated"
        )
