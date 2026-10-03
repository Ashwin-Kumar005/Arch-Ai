"""
Orchestrator Service
"""

import asyncio
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.project import Project
from app.models.agent import AgentRun
from app.orchestrator.runner import OrchestrationRunner
from app.core.logging import logger


class OrchestratorService:
    @staticmethod
    def start_orchestration(db: Session, project_id: str) -> AgentRun:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise ValueError("Project not found")

        # Create AgentRun record
        agent_run = AgentRun(
            project_id=project_id,
            orchestrator_status="RUNNING",
            current_stage=2
        )
        db.add(agent_run)
        project.status = "ORCHESTRATING"
        db.commit()
        db.refresh(agent_run)

        # Trigger background task if event loop is available
        runner = OrchestrationRunner(project_id, agent_run.id)
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(runner.run())
        except RuntimeError:
            # When called from sync test context without running loop
            pass

        return agent_run

    @staticmethod
    def get_agent_runs(db: Session, project_id: str) -> List[AgentRun]:
        return db.query(AgentRun).filter(AgentRun.project_id == project_id).order_by(AgentRun.started_at.desc()).all()

    @staticmethod
    def get_agent_run(db: Session, run_id: str) -> Optional[AgentRun]:
        return db.query(AgentRun).filter(AgentRun.id == run_id).first()
