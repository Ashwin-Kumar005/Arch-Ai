"""
Artifact Service Layer
"""

from typing import List, Optional, Any
from sqlalchemy.orm import Session
from app.models.artifact import Artifact
from app.schemas.artifact import ArtifactCreate, ArtifactUpdate


class ArtifactService:
    @staticmethod
    def get_project_artifacts(db: Session, project_id: str) -> List[Artifact]:
        return db.query(Artifact).filter(Artifact.project_id == project_id).order_by(Artifact.created_at.asc()).all()

    @staticmethod
    def get_artifact(db: Session, artifact_id: str) -> Optional[Artifact]:
        return db.query(Artifact).filter(Artifact.id == artifact_id).first()

    @staticmethod
    def get_artifact_by_type(db: Session, project_id: str, artifact_type: str) -> Optional[Artifact]:
        return db.query(Artifact).filter(
            Artifact.project_id == project_id,
            Artifact.artifact_type == artifact_type
        ).order_by(Artifact.version.desc()).first()

    @staticmethod
    def create_artifact(db: Session, project_id: str, payload: ArtifactCreate, user_id: Optional[str] = None) -> Artifact:
        artifact = Artifact(
            project_id=project_id,
            artifact_type=payload.artifact_type,
            title=payload.title,
            content=payload.content,
            status=payload.status or "DRAFT",
            created_by=user_id
        )
        db.add(artifact)
        db.commit()
        db.refresh(artifact)
        return artifact

    @staticmethod
    def update_artifact(db: Session, artifact_id: str, payload: ArtifactUpdate) -> Optional[Artifact]:
        artifact = db.query(Artifact).filter(Artifact.id == artifact_id).first()
        if not artifact:
            return None

        if payload.title is not None:
            artifact.title = payload.title
        if payload.content is not None:
            artifact.content = payload.content
            artifact.version += 1
        if payload.status is not None:
            artifact.status = payload.status

        db.commit()
        db.refresh(artifact)
        return artifact

    @staticmethod
    def upsert_artifact_by_type(db: Session, project_id: str, artifact_type: str, title: str, content: Any, user_id: Optional[str] = None) -> Artifact:
        artifact = db.query(Artifact).filter(
            Artifact.project_id == project_id,
            Artifact.artifact_type == artifact_type
        ).order_by(Artifact.version.desc()).first()

        if artifact:
            artifact.title = title or artifact.title
            artifact.content = content
            artifact.version += 1
            db.commit()
            db.refresh(artifact)
            return artifact
        else:
            artifact = Artifact(
                project_id=project_id,
                artifact_type=artifact_type,
                title=title,
                content=content,
                status="FINAL",
                created_by=user_id
            )
            db.add(artifact)
            db.commit()
            db.refresh(artifact)
            return artifact
