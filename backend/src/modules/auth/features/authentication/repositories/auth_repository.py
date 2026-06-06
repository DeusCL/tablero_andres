from datetime import datetime

from sqlalchemy import Result, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.infrastructure.database.models import User



class AuthRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db


    async def get_active_by_username(self, username: str) -> User | None:
        result: Result[tuple[User]] = await self.db.execute(
            select(User).where(
                User.username == username,
                User.is_active == True,
            )
        )

        return result.scalar_one_or_none()


    def update_user_last_login_at(
        self,
        user: User,
        last_login_at: datetime,
    ) -> None:
        user.last_login_at = last_login_at

