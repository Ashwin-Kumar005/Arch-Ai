"""
Orchestration Pipeline Runner with Live State Updates and Persistence
"""

import asyncio
import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.project import Project
from app.models.requirement import Requirement
from app.models.agent import AgentRun, AgentTask, AgentMessage
from app.models.artifact import Artifact
from app.agents import AGENT_REGISTRY
from app.orchestrator.stage_graph import ORCHESTRATION_STAGES
from app.core.events import event_bus
from app.core.logging import logger
from app.rag.retriever import RAGRetriever


class OrchestrationRunner:
    def __init__(self, project_id: str, agent_run_id: str, db: Optional[Session] = None):
        self.project_id = project_id
        self.agent_run_id = agent_run_id
        self._external_db = db

    async def run(self):
        db: Session = self._external_db or SessionLocal()
        should_close = self._external_db is None
        try:
            agent_run = db.query(AgentRun).filter(AgentRun.id == self.agent_run_id).first()
            project = db.query(Project).filter(Project.id == self.project_id).first()
            req = db.query(Requirement).filter(Requirement.project_id == self.project_id).first()

            if not agent_run or not project:
                logger.error(f"Cannot run orchestration: missing run/project for {self.project_id}")
                return

            agent_run.orchestrator_status = "RUNNING"
            project.status = "ORCHESTRATING"
            db.commit()

            await event_bus.publish(self.project_id, "RUN_STATUS", {
                "agent_run_id": self.agent_run_id,
                "status": "RUNNING",
                "stage": 2
            })

            # Retrieve RAG context
            retriever = RAGRetriever(db)
            rag_context = await retriever.retrieve_context_for_project(
                self.project_id,
                query=f"{project.name} {project.description} {project.tech_preferences}",
                top_k=3
            )

            # Cumulative context passed to each agent
            pipeline_context: Dict[str, Any] = {
                "project_name": project.name,
                "project_description": project.description,
                "industry": project.industry,
                "target_users": project.target_users,
                "scale_tier": project.scale_tier,
                "tech_preferences": project.tech_preferences,
                "raw_idea": project.raw_idea,
                "finalized_srs": req.finalized_srs if req else project.description,
                "retrieved_guidelines": rag_context,
                "domain_outputs": {}
            }

            total_tokens = 0
            start_run_time = time.time()

            # Execute stages
            for stage in ORCHESTRATION_STAGES:
                agent_run.current_stage = stage.stage_number
                db.commit()

                await event_bus.publish(self.project_id, "STAGE_TRANSITION", {
                    "stage": stage.stage_number,
                    "stage_name": stage.name
                })

                if stage.parallel:
                    # Execute all agents in stage concurrently
                    tasks_to_run = []
                    for agent_key in stage.agent_keys:
                        tasks_to_run.append(self._execute_agent_task(db, agent_key, stage.stage_number, pipeline_context))
                    results = await asyncio.gather(*tasks_to_run)
                    for res in results:
                        if res:
                            total_tokens += res.total_tokens
                            pipeline_context["domain_outputs"][res.agent_key] = res.output
                else:
                    # Sequential stage execution
                    for agent_key in stage.agent_keys:
                        res = await self._execute_agent_task(db, agent_key, stage.stage_number, pipeline_context)
                        if res:
                            total_tokens += res.total_tokens
                            pipeline_context["domain_outputs"][res.agent_key] = res.output

            # Mark Run Completed
            run_duration_ms = int((time.time() - start_run_time) * 1000)
            agent_run.orchestrator_status = "COMPLETED"
            agent_run.total_tokens = total_tokens
            agent_run.execution_duration_ms = run_duration_ms
            agent_run.completed_at = datetime.now(timezone.utc)
            project.status = "COMPLETED"
            db.commit()

            await event_bus.publish(self.project_id, "RUN_COMPLETED", {
                "agent_run_id": self.agent_run_id,
                "status": "COMPLETED",
                "total_tokens": total_tokens,
                "duration_ms": run_duration_ms
            })

        except Exception as e:
            logger.error(f"Orchestration run failed: {str(e)}")
            agent_run = db.query(AgentRun).filter(AgentRun.id == self.agent_run_id).first()
            if agent_run:
                agent_run.orchestrator_status = "FAILED"
                agent_run.error_message = str(e)
                agent_run.completed_at = datetime.now(timezone.utc)
            project = db.query(Project).filter(Project.id == self.project_id).first()
            if project:
                project.status = "FAILED"
            db.commit()

            await event_bus.publish(self.project_id, "RUN_FAILED", {
                "agent_run_id": self.agent_run_id,
                "error": str(e)
            })
        finally:
            if should_close:
                db.close()

    async def _execute_agent_task(
        self,
        db: Session,
        agent_key: str,
        stage_num: int,
        context: Dict[str, Any]
    ):
        agent_cls = AGENT_REGISTRY.get(agent_key)
        if not agent_cls:
            return None

        agent_instance = agent_cls()

        # Create Task DB record
        task = AgentTask(
            agent_run_id=self.agent_run_id,
            agent_key=agent_key,
            agent_name=agent_instance.name,
            stage=stage_num,
            status="RUNNING",
            started_at=datetime.now(timezone.utc)
        )
        db.add(task)
        db.commit()

        await event_bus.publish(self.project_id, "AGENT_STATUS", {
            "agent_key": agent_key,
            "status": "RUNNING",
            "stage": stage_num
        })

        # Run agent
        result = await agent_instance.execute(context)

        # Update Task Record
        task.status = result.status
        task.token_usage = result.total_tokens
        task.duration_ms = result.duration_ms
        task.output_payload = result.output
        task.error_log = result.error_message
        task.completed_at = datetime.now(timezone.utc)
        db.commit()

        # Save Artifact Deliverable
        self._persist_agent_artifact(db, agent_key, agent_instance.name, result.output)

        await event_bus.publish(self.project_id, "AGENT_STATUS", {
            "agent_key": agent_key,
            "status": result.status,
            "tokens": result.total_tokens,
            "duration_ms": result.duration_ms
        })

        return result

    def _persist_agent_artifact(self, db: Session, agent_key: str, agent_name: str, output: Dict[str, Any]):
        type_mapping = {
            "product_manager": ("ROADMAP", "Product Roadmap & MVP Scope"),
            "solution_architect": ("ARCHITECTURE", "System Architecture & Topology"),
            "database_architect": ("ERD", "Database ERD & SQL Schema"),
            "backend_engineer": ("API_SPEC", "REST API & OpenAPI Specification"),
            "frontend_planner": ("UI_FLOW", "Frontend UI Flow & Component Hierarchy"),
            "devops_engineer": ("DEPLOYMENT_PLAN", "DevOps & Infrastructure Plan"),
            "security_expert": ("SECURITY_REPORT", "Security Assessment & Threat Model"),
            "qa_engineer": ("TEST_PLAN", "QA Test Strategy & Test Cases"),
            "validator": ("CONSISTENCY_REPORT", "Architecture Consistency Validation Report"),
            "technical_writer": ("TECHNICAL_DOC", "Master Technical Documentation")
        }

        if agent_key in type_mapping:
            art_type, title = type_mapping[agent_key]
            artifact = Artifact(
                project_id=self.project_id,
                agent_run_id=self.agent_run_id,
                artifact_type=art_type,
                title=title,
                content=output,
                status="APPROVED"
            )
            db.add(artifact)
            db.commit()
