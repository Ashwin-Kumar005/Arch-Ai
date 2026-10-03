"""
Project Service Layer
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.project import Project, ProjectMember
from app.models.requirement import Requirement
from app.models.artifact import Artifact
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    @staticmethod
    def create_project(db: Session, owner_id: str, payload: ProjectCreate) -> Project:
        project = Project(
            owner_id=owner_id,
            name=payload.name,
            description=payload.description,
            industry=payload.industry,
            target_users=payload.target_users,
            business_objective=payload.business_objective,
            scale_tier=payload.scale_tier,
            tech_preferences=payload.tech_preferences,
            raw_idea=payload.raw_idea,
            status="DRAFT"
        )
        db.add(project)
        db.commit()
        db.refresh(project)

        # Add owner member
        member = ProjectMember(
            project_id=project.id,
            user_id=owner_id,
            role="owner"
        )
        db.add(member)

        # Create initial empty requirement row
        req = Requirement(
            project_id=project.id,
            raw_input=payload.raw_idea or payload.description or ""
        )
        db.add(req)
        db.commit()

        return project

    @staticmethod
    def get_projects(db: Session, user_id: str) -> List[Project]:
        projects = db.query(Project).filter(
            (Project.owner_id == user_id) |
            (Project.members.any(user_id=user_id))
        ).order_by(Project.created_at.desc()).all()

        for p in projects:
            p.artifacts_count = db.query(Artifact).filter(Artifact.project_id == p.id).count()

        return projects

    @staticmethod
    def get_project(db: Session, project_id: str) -> Optional[Project]:
        project = db.query(Project).filter(Project.id == project_id).first()
        if project:
            project.artifacts_count = db.query(Artifact).filter(Artifact.project_id == project.id).count()
        return project

    @staticmethod
    def update_project(db: Session, project_id: str, payload: ProjectUpdate) -> Optional[Project]:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return None

        update_data = payload.model_dump(exclude_unset=True)
        for key, val in update_data.items():
            setattr(project, key, val)

        db.commit()
        db.refresh(project)
        return project

    @staticmethod
    def delete_project(db: Session, project_id: str) -> bool:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return False
        db.delete(project)
        db.commit()
        return True
