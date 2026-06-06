from litestar.openapi.plugins import YamlRenderPlugin
from litestar.openapi.plugins import SwaggerRenderPlugin
from litestar import Litestar
from litestar.config.cors import CORSConfig
from litestar.logging import LoggingConfig
from litestar.plugins.sqlalchemy import SQLAlchemyPlugin
from litestar.openapi import OpenAPIConfig

from src.core.settings.base import settings
from src.core.middleware import middleware
from src.core.version import VERSION
from src.infrastructure.database.config import get_database_config
from src.modules.router import main_router



IS_PROD: bool = settings.environment == "prod"

# CORS Configuration
ALLOWED_ORIGINS: list[str] = settings.allowed_origins.split(",")

cors_config = CORSConfig(
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["*"],
    max_age=600,
)


# Logging Configuration
logging_config = LoggingConfig(
    root={
        "level": "INFO" if IS_PROD else "DEBUG",
        "handlers": ["queue_listener"],
    },
)

# DB Configuration
sql_alchemy_plugin = SQLAlchemyPlugin(config=get_database_config())

# OpenAPI Config
openapi_config = OpenAPIConfig(
    title="RDC",
    version=VERSION,
    path="/docs",
    render_plugins=[
        SwaggerRenderPlugin(
            version="latest",
            path="/swagger",
        ),
        YamlRenderPlugin(
            path="/openapi.yaml",
        ),
    ],
)

app = Litestar(
    route_handlers=[
        main_router,
    ],
    plugins=[
        sql_alchemy_plugin,
    ],
    cors_config=cors_config,
    logging_config=logging_config,
    openapi_config=openapi_config,
    middleware=middleware,
)
