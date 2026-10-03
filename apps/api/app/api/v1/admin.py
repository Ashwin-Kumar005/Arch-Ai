"""
Admin & Observability Metrics API Router
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import require_admin
from app.models.user import User
from app.models.project import Project
from app.models.agent import AgentRun, AgentTask
from app.models.artifact import Artifact
from app.models.document import Document

router = APIRouter(prefix="/admin", tags=["Admin & Observability"])


@router.get("/metrics")
def get_system_metrics(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_projects = db.query(Project).count()
    total_runs = db.query(AgentRun).count()
    completed_runs = db.query(AgentRun).filter(AgentRun.orchestrator_status == "COMPLETED").count()
    total_artifacts = db.query(Artifact).count()
    total_documents = db.query(Document).count()
    total_tasks = db.query(AgentTask).count()

    runs = db.query(AgentRun).all()
    total_tokens = sum(r.total_tokens or 0 for r in runs)
    total_duration_ms = sum(r.execution_duration_ms or 0 for r in runs)
    avg_latency_ms = int(total_duration_ms / max(len(runs), 1))

    return {
        "overview": {
            "total_users": total_users,
            "total_projects": total_projects,
            "total_agent_runs": total_runs,
            "completed_runs": completed_runs,
            "total_artifacts": total_artifacts,
            "total_documents": total_documents,
            "total_tasks_executed": total_tasks
        },
        "telemetry": {
            "total_tokens_consumed": total_tokens,
            "estimated_token_cost_usd": round(total_tokens * 0.000002, 4),
            "average_orchestration_duration_ms": avg_latency_ms,
            "success_rate_percent": round((completed_runs / max(total_runs, 1)) * 100, 1)
        }
    }
