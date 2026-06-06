from sqlalchemy import select, delete, Delete, Select, Sequence, Result
from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.civil_works.domain.models.excel_upload import ExcelUpload
from src.modules.civil_works.domain.models.civil_work import CivilWork



class ImportationRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db


    async def delete_previous_uploads(self, user_id: int) -> None:
        """Borra todas las cargas previas del usuario y sus datos asociados de forma explícita."""

        # Identificar las cargas del usuario
        upload_ids_stmt: Select[tuple[int]] = select(ExcelUpload.id).where(ExcelUpload.id_user == user_id)
        result: Result[tuple[int]] = await self.db.execute(upload_ids_stmt)
        upload_ids: Sequence[int] = result.scalars().all()

        if upload_ids:
            # Borrar hechos asociados (civil_work)
            delete_works_stmt: Delete = delete(CivilWork).where(CivilWork.id_upload.in_(upload_ids))
            await self.db.execute(delete_works_stmt)

            # Borrar cabeceras (excel_upload)
            delete_uploads_stmt: Delete = delete(ExcelUpload).where(ExcelUpload.id.in_(upload_ids))
            await self.db.execute(delete_uploads_stmt)


    async def save_upload(self, upload: ExcelUpload) -> ExcelUpload:
        self.db.add(upload)
        await self.db.flush()
        return upload
