import io

from typing import Any

from litestar import Controller, post, Request, Response
from litestar.di import Provide
from litestar.enums import RequestEncodingType
from litestar.params import Body
from litestar.datastructures import UploadFile
from litestar.background_tasks import BackgroundTask
from litestar.exceptions import HTTPException
from litestar.status_codes import HTTP_400_BAD_REQUEST

from src.core.guards.auth_guard import user_guard

from src.modules.civil_works.features.importation.services.importation_service import ImportationService
from src.modules.civil_works.features.importation.di import (
    provide_importation_repository,
    provide_importation_service,
)



class ImportationAPI(Controller):
    path = "/civil-works"
    guards = [user_guard]
    dependencies = {
        "importation_repository": Provide(provide_importation_repository),
        "importation_service": Provide(provide_importation_service),
    }


    @post(
        path="/upload",
        summary="Cargar Excel Maestro",
        description="Recibe un archivo Excel y lo procesa en segundo plano.",
    )
    async def upload_excel(
        self,
        request: Request[Any, Any, Any],
        importation_service: ImportationService,
        data: UploadFile = Body(media_type=RequestEncodingType.MULTI_PART),
    ) -> Response[dict[str, str]]:
        user_id: Any | None = request.session.get("id_user")

        if not user_id:
            raise HTTPException(detail="User session not found", status_code=401)

        try:
            content: bytes = await data.read()
            file_stream = io.BytesIO(content)
            
            # Lanzar tarea en segundo plano
            task = BackgroundTask(
                importation_service.process_upload,
                user_id=user_id,
                filename=data.filename,
                file_content=file_stream
            )

            return Response(
                content={
                    "message": "Procesamiento iniciado en segundo plano",
                    "filename": data.filename,
                },
                background=task,
            )

        except Exception as e:
            raise HTTPException(detail=str(e), status_code=500)

        except ValueError as e:
            raise HTTPException(
                detail=str(e),
                status_code=HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            raise HTTPException(
                detail=f"Error inesperado al procesar el archivo: {str(e)}",
                status_code=500
            )
