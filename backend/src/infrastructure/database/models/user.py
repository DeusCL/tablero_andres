from datetime import datetime

from sqlalchemy import (
    String,
    DateTime,
    Boolean,
)

from sqlalchemy.orm import Mapped, mapped_column

from src.infrastructure.database.models.base import Base



class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    last_login_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
    )
