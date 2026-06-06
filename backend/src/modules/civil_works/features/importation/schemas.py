from datetime import datetime
from pydantic import BaseModel



class ExcelUploadResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime | None
    total_records: int
    message: str = "Excel procesado exitosamente"


class ImportErrorResponse(BaseModel):
    error: str
    details: str | None = None
