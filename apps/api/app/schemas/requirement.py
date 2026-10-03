"""
Requirement and Q&A Pydantic Schemas
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel


class QuestionAnswerItem(BaseModel):
    question_id: str
    selected_option: Optional[str] = None
    custom_text: Optional[str] = None


class AnswerQuestionsRequest(BaseModel):
    answers: List[QuestionAnswerItem]


class RequirementQuestionOut(BaseModel):
    id: str
    question_key: str
    question_text: str
    category: str
    options: List[str]
    priority: str

    class Config:
        from_attributes = True


class RequirementOut(BaseModel):
    id: str
    project_id: str
    raw_input: Optional[str] = None
    project_summary: Optional[str] = None
    business_goals: List[str] = []
    actors: List[str] = []
    functional_requirements: List[str] = []
    non_functional_requirements: List[str] = []
    constraints: List[str] = []
    assumptions: List[str] = []
    dependencies: List[str] = []
    risks: List[str] = []
    is_finalized: bool
    finalized_srs: Optional[Dict[str, Any]] = None
    questions: List[RequirementQuestionOut] = []

    class Config:
        from_attributes = True


class FinalizeRequirementsRequest(BaseModel):
    finalized_srs: Optional[Dict[str, Any]] = None
