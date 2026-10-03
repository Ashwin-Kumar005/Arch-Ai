"""
Blueprint Export API Router
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.export_service import ExportService

router = APIRouter(prefix="/projects", tags=["Export"])


@router.post("/{project_id}/export")
def export_blueprint(
    project_id: str,
    format: str = Query("zip", description="Export format: zip, markdown, json"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        data = ExportService.export_project_bundle(db, project_id, format)
        if format == "zip":
            return Response(
                content=data,
                media_type="application/zip",
                headers={"Content-Disposition": f"attachment; filename=archai_blueprint_{project_id[:8]}.zip"}
            )
        elif format == "markdown":
            return Response(
                content=data,
                media_type="text/markdown",
                headers={"Content-Disposition": f"attachment; filename=archai_blueprint_{project_id[:8]}.md"}
            )
        else:
            return Response(
                content=data,
                media_type="application/json",
                headers={"Content-Disposition": f"attachment; filename=archai_blueprint_{project_id[:8]}.json"}
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
