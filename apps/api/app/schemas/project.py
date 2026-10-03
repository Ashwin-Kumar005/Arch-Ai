"""
Project Pydantic Schemas
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    industry: Optional[str] = None
    target_users: Optional[str] = None
    business_objective: Optional[str] = None
    scale_tier: Optional[str] = None
    tech_preferences: Optional[str] = None
    raw_idea: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    target_users: Optional[str] = None
    business_objective: Optional[str] = None
    scale_tier: Optional[str] = None
    tech_preferences: Optional[str] = None
    raw_idea: Optional[str] = None
    status: Optional[str] = None


class ProjectOut(BaseModel):
    id: str
    owner_id: str
    name: str
    description: Optional[str] = None
    industry: Optional[str] = None
    target_users: Optional[str] = None
    business_objective: Optional[str] = None
    scale_tier: Optional[str] = None
    tech_preferences: Optional[str] = None
    raw_idea: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    artifacts_count: Optional[int] = 0

    class Config:
        from_attributes = True
