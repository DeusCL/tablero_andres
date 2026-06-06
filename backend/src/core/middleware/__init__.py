from typing import Any

from .session_config import session_config



middleware: list[Any] = [
    session_config.middleware,
]
