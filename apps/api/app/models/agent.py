"""
Agent, AgentRun, AgentTask, and AgentMessage ORM Models
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.user import generate_uuid


class Agent(Base):
    __tablename__ = "agents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    agent_key = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    role_title = Column(String(100), nullable=False)
    system_prompt_path = Column(String(255), nullable=False)
    version = Column(String(20), default="1.0.0")
    is_active = Column(String(10), default="true")


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    orchestrator_status = Column(String(50), default="PENDING")  # PENDING, RUNNING, COMPLETED, FAILED, CANCELLED
    current_stage = Column(Integer, default=1)
    total_tokens = Column(Integer, default=0)
    execution_duration_ms = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="agent_runs")
    tasks = relationship("AgentTask", back_populates="agent_run", cascade="all, delete-orphan")
    messages = relationship("AgentMessage", back_populates="agent_run", cascade="all, delete-orphan")
    artifacts = relationship("Artifact", back_populates="agent_run")


class AgentTask(Base):
    __tablename__ = "agent_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    agent_run_id = Column(String(36), ForeignKey("agent_runs.id"), nullable=False)
    agent_key = Column(String(50), nullable=False)
    agent_name = Column(String(100), nullable=False)
    stage = Column(Integer, default=1)
    status = Column(String(50), default="QUEUED")  # QUEUED, RUNNING, COMPLETED, FAILED, RETRYING
    retry_count = Column(Integer, default=0)
    token_usage = Column(Integer, default=0)
    duration_ms = Column(Integer, default=0)
    input_payload = Column(JSON, nullable=True)
    output_payload = Column(JSON, nullable=True)
    error_log = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    agent_run = relationship("AgentRun", back_populates="tasks")


class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    agent_run_id = Column(String(36), ForeignKey("agent_runs.id"), nullable=False)
    agent_key = Column(String(50), nullable=False)
    message_type = Column(String(20), default="STATUS")  # STATUS, LOG, WARNING, ERROR
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    agent_run = relationship("AgentRun", back_populates="messages")
