from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    String,
    Integer,
    DateTime,
    ForeignKey,
    func,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from src.core.utils.timing import now
from src.infrastructure.database.models.base import Base

if TYPE_CHECKING:
    from .civil_work import CivilWork
    from src.infrastructure.database.models import User



class ExcelUpload(Base):
    __tablename__ = "excel_upload"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("user.id"), index=True)

    filename: Mapped[str] = mapped_column(String(255))
    file_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, server_default=func.now(), index=True)

    civil_works: Mapped[list["CivilWork"]] = relationship(
        "CivilWork", back_populates="upload", cascade="all, delete-orphan"
    )

    user: Mapped["User"] = relationship("User", back_populates="uploads")
