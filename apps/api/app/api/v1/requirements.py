"""
Requirements and Follow-up Q&A API Router
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.requirement import Requirement, RequirementQuestion
from app.schemas.requirement import (
    RequirementOut,
    RequirementQuestionOut,
    AnswerQuestionsRequest,
    FinalizeRequirementsRequest,
)
from app.services.requirement_service import RequirementService

router = APIRouter(prefix="/projects", tags=["Requirements"])


@router.post("/{project_id}/analyze")
async def analyze_project_requirements(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return await RequirementService.analyze_idea(db, project_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{project_id}/requirements", response_model=RequirementOut)
def get_project_requirements(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = db.query(Requirement).filter(Requirement.project_id == project_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirements not found for this project")
    return req


@router.post("/{project_id}/questions/answer", status_code=status.HTTP_200_OK)
def answer_questions(
    project_id: str,
    payload: AnswerQuestionsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        RequirementService.answer_questions(db, project_id, payload.answers)
        return {"status": "SUCCESS", "message": "Answers recorded successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{project_id}/finalize", response_model=RequirementOut)
def finalize_requirements(
    project_id: str,
    payload: FinalizeRequirementsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return RequirementService.finalize_requirements(db, project_id, payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
