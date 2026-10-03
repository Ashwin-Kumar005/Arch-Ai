"""
Artifact Pydantic Schemas
"""

from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel


class ArtifactCreate(BaseModel):
    artifact_type: str
    title: str
    content: Any
    status: Optional[str] = "DRAFT"


class ArtifactUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[Any] = None
    status: Optional[str] = None


class ArtifactOut(BaseModel):
    id: str
    project_id: str
    agent_run_id: Optional[str] = None
    artifact_type: str
    title: str
    version: int
    content: Any
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
