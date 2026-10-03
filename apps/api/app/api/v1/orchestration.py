"""
Multi-Agent Orchestration & Real-time Telemetry API Router
"""

import asyncio
import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.agent import AgentRunOut, StartOrchestrationResponse
from app.services.orchestrator_service import OrchestratorService
from app.core.events import event_bus

router = APIRouter(prefix="/projects", tags=["Agent Orchestration"])


@router.post("/{project_id}/orchestrate", response_model=StartOrchestrationResponse, status_code=status.HTTP_202_ACCEPTED)
def start_orchestration(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        agent_run = OrchestratorService.start_orchestration(db, project_id)
        return StartOrchestrationResponse(
            agent_run_id=agent_run.id,
            status=agent_run.orchestrator_status,
            current_stage=agent_run.current_stage,
            message="Multi-agent orchestration pipeline started."
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{project_id}/agent-runs", response_model=List[AgentRunOut])
def get_agent_runs(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return OrchestratorService.get_agent_runs(db, project_id)


@router.get("/{project_id}/agent-runs/{run_id}", response_model=AgentRunOut)
def get_agent_run(
    project_id: str,
    run_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    run = OrchestratorService.get_agent_run(db, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Agent run not found")
    return run


@router.get("/{project_id}/stream")
async def stream_orchestration_events(
    project_id: str
):
    queue = event_bus.subscribe(project_id)

    async def event_generator():
        try:
            # Yield initial connect ping
            yield f"data: {json.dumps({'event': 'CONNECTED', 'data': {'project_id': project_id}})}\n\n"
            while True:
                try:
                    msg = await asyncio.wait_for(queue.get(), timeout=20.0)
                    yield f"data: {json.dumps(msg)}\n\n"
                except asyncio.TimeoutError:
                    # Keep-alive ping
                    yield f": ping\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            event_bus.unsubscribe(project_id, queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
