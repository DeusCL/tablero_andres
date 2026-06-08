from ..repositories.analytics_repository import AnalyticsRepository
from ..schemas import CivilWorkAnalyticsSchema



class AnalyticsService:
    def __init__(self, repository: AnalyticsRepository) -> None:
        self.repository = repository


    async def get_dashboard_data(self) -> list[CivilWorkAnalyticsSchema]:
        civil_works = await self.repository.get_all_civil_works()

        result = []
        for cw in civil_works:
            monto_neto = float(cw.monto_neto) if cw.monto_neto else 0.0 # type: ignore
            monto_hh = float(cw.monto_hh) if cw.monto_hh else 0.0 # type: ignore
            margin = monto_neto - monto_hh
            rentability = (margin / monto_neto * 100) if monto_neto > 0 else 0.0

            result.append(CivilWorkAnalyticsSchema(
                id=cw.id,
                numero_trabajo=cw.numero_trabajo,
                fecha=cw.fecha.isoformat(),
                year=cw.fecha.year,
                month=cw.fecha.month,
                detalle=cw.detalle_trabajos or "",
                tipo=cw.tipo_trabajo,
                edificio=cw.edificio_instalacion or "Sin Edificio",
                hh=cw.hh or "N/A",
                zonal=cw.zonal,
                monto_neto=monto_neto,
                monto_hh=monto_hh,
                margin=margin,
                rent=rentability
            ))

        return result

