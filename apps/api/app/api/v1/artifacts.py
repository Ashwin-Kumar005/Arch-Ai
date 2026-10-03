"""
Artifacts and Specialized Architecture Deliverables API Router
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.artifact import ArtifactOut, ArtifactCreate, ArtifactUpdate
from app.services.artifact_service import ArtifactService

router = APIRouter(prefix="/projects", tags=["Artifacts"])


@router.get("/{project_id}/artifacts", response_model=List[ArtifactOut])
def get_artifacts(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ArtifactService.get_project_artifacts(db, project_id)


@router.get("/{project_id}/artifacts/{artifact_id}", response_model=ArtifactOut)
def get_artifact(
    project_id: str,
    artifact_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact(db, artifact_id)
    if not art:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return art


@router.put("/{project_id}/artifacts/{artifact_id}", response_model=ArtifactOut)
def update_artifact(
    project_id: str,
    artifact_id: str,
    payload: ArtifactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.update_artifact(db, artifact_id, payload)
    if not art:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return art


@router.put("/{project_id}/artifacts/by-type/{artifact_type}", response_model=ArtifactOut)
def upsert_artifact_by_type(
    project_id: str,
    artifact_type: str,
    payload: ArtifactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.upsert_artifact_by_type(
        db=db,
        project_id=project_id,
        artifact_type=artifact_type.upper(),
        title=payload.title or f"{artifact_type.upper()} Deliverable",
        content=payload.content,
        user_id=current_user.id
    )
    return art


@router.get("/{project_id}/architecture")
def get_architecture_artifact(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact_by_type(db, project_id, "ARCHITECTURE")
    if not art:
        raise HTTPException(status_code=404, detail="Architecture deliverable not yet generated")
    return art.content


@router.get("/{project_id}/database")
def get_database_artifact(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact_by_type(db, project_id, "ERD")
    if not art:
        raise HTTPException(status_code=404, detail="Database deliverable not yet generated")
    return art.content


@router.get("/{project_id}/api-spec")
def get_api_spec_artifact(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact_by_type(db, project_id, "API_SPEC")
    if not art:
        raise HTTPException(status_code=404, detail="API Specification not yet generated")
    return art.content


@router.get("/{project_id}/security")
def get_security_artifact(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact_by_type(db, project_id, "SECURITY_REPORT")
    if not art:
        raise HTTPException(status_code=404, detail="Security Report not yet generated")
    return art.content


@router.get("/{project_id}/testing")
def get_testing_artifact(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact_by_type(db, project_id, "TEST_PLAN")
    if not art:
        raise HTTPException(status_code=404, detail="Testing strategy not yet generated")
    return art.content


@router.get("/{project_id}/deployment")
def get_deployment_artifact(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact_by_type(db, project_id, "DEPLOYMENT_PLAN")
    if not art:
        raise HTTPException(status_code=404, detail="Deployment plan not yet generated")
    return art.content


@router.get("/{project_id}/validation")
def get_validation_artifact(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact_by_type(db, project_id, "CONSISTENCY_REPORT")
    if not art:
        raise HTTPException(status_code=404, detail="Validation report not yet generated")
    return art.content


@router.get("/{project_id}/codebase")
def get_project_codebase(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.services.codebase_synthesizer import CodebaseSynthesizerService
    try:
        return CodebaseSynthesizerService.generate_codebase(db, project_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get('/{project_id}/roadmap')
def get_roadmap_artifact(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact_by_type(db, project_id, "ROADMAP")
    if not art:
        raise HTTPException(status_code=404, detail="Roadmap deliverable not yet generated")
    return art.content

@router.get('/{project_id}/uiflow')
def get_uiflow_artifact(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact_by_type(db, project_id, "UI_FLOW")
    if not art:
        raise HTTPException(status_code=404, detail="UI Flow deliverable not yet generated")
    return art.content

@router.get('/{project_id}/techdoc')
def get_techdoc_artifact(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    art = ArtifactService.get_artifact_by_type(db, project_id, "TECHNICAL_DOC")
    if not art:
        raise HTTPException(status_code=404, detail="Technical Documentation not yet generated")
    return art.content
