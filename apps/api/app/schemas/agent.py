"""
Agent and Orchestration Pydantic Schemas
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel


class AgentTaskOut(BaseModel):
    id: str
    agent_key: str
    agent_name: str
    stage: int
    status: str
    retry_count: int
    token_usage: int
    duration_ms: int
    error_log: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AgentRunOut(BaseModel):
    id: str
    project_id: str
    orchestrator_status: str
    current_stage: int
    total_tokens: int
    execution_duration_ms: int
    error_message: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    tasks: List[AgentTaskOut] = []

    class Config:
        from_attributes = True


class StartOrchestrationResponse(BaseModel):
    agent_run_id: str
    status: str
    current_stage: int
    message: str
