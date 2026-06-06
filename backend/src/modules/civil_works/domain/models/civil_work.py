from typing import TYPE_CHECKING

from datetime import date

from sqlalchemy import (
    String,
    Integer,
    Numeric,
    Date,
    ForeignKey,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from src.infrastructure.database.models.base import Base

if TYPE_CHECKING:
    from .excel_upload import ExcelUpload



class CivilWork(Base):
    __tablename__ = "civil_work"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_upload: Mapped[int] = mapped_column(ForeignKey("excel_upload.id"), index=True)

    # Identificadores del Excel
    numero_trabajo: Mapped[int] = mapped_column(Integer, index=True)
    semana: Mapped[int | None] = mapped_column(Integer, nullable=True)
    fecha: Mapped[date] = mapped_column(Date, index=True)

    # Datos en texto libre
    contratista: Mapped[str] = mapped_column(String(150), index=True)
    detalle_trabajos: Mapped[str | None] = mapped_column(String(500), nullable=True)
    tipo_trabajo: Mapped[str] = mapped_column(String(100), index=True)
    forma_pago: Mapped[str] = mapped_column(String(100))
    agenda_tipo_levantamiento: Mapped[str | None] = mapped_column(String(150), nullable=True)

    # Ubicaciones y Geografía
    zonal: Mapped[str] = mapped_column(String(100), index=True)
    localidad: Mapped[str] = mapped_column(String(100))
    region: Mapped[str] = mapped_column(String(100), index=True)
    edificio_instalacion: Mapped[str | None] = mapped_column(String(150), nullable=True)

    # Estados y Facturación
    estado_trabajos: Mapped[str] = mapped_column(String(50), index=True)
    factura: Mapped[str | None] = mapped_column(String(100), nullable=True) # Maneja estados como 'Facturado' o links/códigos
    hh: Mapped[str | None] = mapped_column(String(50), nullable=True) # Siglas como 'MF', 'HL', 'PR'

    # Montos Financieros (Usamos Numeric para precisión monetaria exacta)
    monto_neto: Mapped[float] = mapped_column(Numeric(precision=12, scale=2))
    monto_hh: Mapped[float | None] = mapped_column(Numeric(precision=12, scale=2), nullable=True)

    # Relación inversa con la carga
    upload: Mapped["ExcelUpload"] = relationship("ExcelUpload", back_populates="civil_works")

