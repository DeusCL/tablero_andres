from structlog import get_logger

from src.core.utils.timing import now
from src.infrastructure.database.models import User

from src.modules.auth.features.authentication.schemas import UserSessionSchema
from src.modules.auth.features.authentication.exceptions import UserNotFoundError
from src.modules.auth.features.authentication.repositories.auth_repository import AuthRepository
from src.modules.auth.features.authentication.utils import verify_password

    

logger = get_logger(__name__)


class AuthService:
    def __init__(self, repo: AuthRepository) -> None:
        self.repo = repo


    async def login(self, username: str, password: str) -> UserSessionSchema:
        user: User | None = await self.repo.get_active_by_username(username)

        if not user or not verify_password(password, user.password_hash):
            raise UserNotFoundError

        id_user: int = user.id
        username: str = user.username

        user.last_login_at = now()
        await self.repo.db.commit()

        return UserSessionSchema(
            id_user=id_user,
            username=username,
        )

