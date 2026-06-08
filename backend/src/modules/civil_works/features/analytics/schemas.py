from pydantic import BaseModel



class CivilWorkAnalyticsSchema(BaseModel):
    id: int
    numero_trabajo: int
    fecha: str
    year: int | str
    month: int | str
    detalle: str
    tipo: str
    edificio: str
    hh: str
    zonal: str
    monto_neto: float
    monto_hh: float
    margin: float
    rent: float


class DashboardResponseSchema(BaseModel):
    data: list[CivilWorkAnalyticsSchema]
