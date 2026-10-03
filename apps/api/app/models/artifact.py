"""
Artifact and Specialized Architecture Deliverable ORM Models
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.user import generate_uuid


class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    agent_run_id = Column(String(36), ForeignKey("agent_runs.id"), nullable=True)
    artifact_type = Column(String(50), nullable=False, index=True)  # SRS, ROADMAP, ARCHITECTURE, ERD, SQL, API_SPEC, UI_FLOW, SECURITY_REPORT, TEST_PLAN, DEPLOYMENT_PLAN, TECHNICAL_DOC, USER_MANUAL, ADR, CONSISTENCY_REPORT
    title = Column(String(255), nullable=False)
    version = Column(Integer, default=1)
    content = Column(JSON, nullable=False)  # JSON or Markdown object
    status = Column(String(50), default="DRAFT")  # DRAFT, REVIEW, APPROVED, REJECTED
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="artifacts")
    agent_run = relationship("AgentRun", back_populates="artifacts")
