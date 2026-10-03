"""
Requirement, Question, and Answer ORM Models
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.user import generate_uuid


class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), unique=True, nullable=False)
    raw_input = Column(Text, nullable=True)
    project_summary = Column(Text, nullable=True)
    business_goals = Column(JSON, default=list)
    actors = Column(JSON, default=list)
    functional_requirements = Column(JSON, default=list)
    non_functional_requirements = Column(JSON, default=list)
    constraints = Column(JSON, default=list)
    assumptions = Column(JSON, default=list)
    dependencies = Column(JSON, default=list)
    risks = Column(JSON, default=list)
    is_finalized = Column(Boolean, default=False)
    finalized_srs = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="requirements")
    questions = relationship("RequirementQuestion", back_populates="requirement", cascade="all, delete-orphan")


class RequirementQuestion(Base):
    __tablename__ = "requirement_questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    requirement_id = Column(String(36), ForeignKey("requirements.id"), nullable=False)
    question_key = Column(String(50), nullable=False)
    question_text = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    options = Column(JSON, default=list)
    priority = Column(String(20), default="MEDIUM")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    requirement = relationship("Requirement", back_populates="questions")
    answers = relationship("RequirementAnswer", back_populates="question", cascade="all, delete-orphan")


class RequirementAnswer(Base):
    __tablename__ = "requirement_answers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    question_id = Column(String(36), ForeignKey("requirement_questions.id"), nullable=False)
    selected_option = Column(String(255), nullable=True)
    custom_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    question = relationship("RequirementQuestion", back_populates="answers")
