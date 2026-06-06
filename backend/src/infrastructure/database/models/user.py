from typing import TYPE_CHECKING

from datetime import datetime

from sqlalchemy import (
    String,
    DateTime,
    Boolean,
)

from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.infrastructure.database.models.base import Base

if TYPE_CHECKING:
    from src.modules.civil_works.domain.models.excel_upload import ExcelUpload



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

    uploads: Mapped[list["ExcelUpload"]] = relationship("ExcelUpload", back_populates="user")
