from typing import Any

from litestar import Controller, Request, post

from litestar.di import Provide
from litestar.exceptions import HTTPException
from litestar.status_codes import HTTP_401_UNAUTHORIZED

from src.modules.auth.features.authentication.di import (
    provide_auth_repository,
    provide_auth_service,
)
from src.modules.auth.features.authentication.exceptions import UserNotFoundError
from src.modules.auth.features.authentication.services import AuthService
from src.modules.auth.features.authentication.schemas import (
    LoginDTO,
    LoginResponseDTO,
    UserSessionSchema,
)




class AuthAPI(Controller):
    path = "/auth"
    dependencies = {
        "auth_repository": Provide(provide_auth_repository),
        "auth_service": Provide(provide_auth_service),
    }


    @post("/login")
    async def login(
        self,
        data: LoginDTO,
        request: Request[Any, Any, Any],
        auth_service: AuthService,
    ) -> LoginResponseDTO:
        try:
            user_session_schema: UserSessionSchema = await auth_service.login(data.username, data.password)
        except UserNotFoundError:
            raise HTTPException(
                detail="User not found or invalid password",
                status_code=HTTP_401_UNAUTHORIZED
            )

        request.session.clear()
        request.session.update(user_session_schema.model_dump(mode="json"))

        return LoginResponseDTO(
            id_user=user_session_schema.id_user,
            username=user_session_schema.username
        )
