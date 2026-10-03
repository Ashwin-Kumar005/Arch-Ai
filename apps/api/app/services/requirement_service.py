"""
Requirement and Follow-up Q&A Service Layer
"""

from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.project import Project
from app.models.requirement import Requirement, RequirementQuestion, RequirementAnswer
from app.models.artifact import Artifact
from app.agents.requirement_analyst import RequirementAnalystAgent
from app.schemas.requirement import QuestionAnswerItem, FinalizeRequirementsRequest
from app.rag.retriever import RAGRetriever


class RequirementService:
    @staticmethod
    async def analyze_idea(db: Session, project_id: str) -> Dict[str, Any]:
        project = db.query(Project).filter(Project.id == project_id).first()
        req = db.query(Requirement).filter(Requirement.project_id == project_id).first()

        if not project:
            raise ValueError("Project not found")

        project.status = "ANALYZING"
        db.commit()

        # Retrieve any uploaded domain documents
        retriever = RAGRetriever(db)
        rag_context = await retriever.retrieve_context_for_project(
            project_id,
            query=f"{project.name} {project.raw_idea}",
            top_k=2
        )

        agent = RequirementAnalystAgent()
        context = {
            "project_name": project.name,
            "project_description": project.description,
            "industry": project.industry,
            "scale_tier": project.scale_tier,
            "tech_preferences": project.tech_preferences,
            "raw_idea": project.raw_idea or req.raw_input,
            "retrieved_guidelines": rag_context
        }

        result = await agent.execute(context)
        out_data = result.output

        if not req:
            req = Requirement(project_id=project_id)
            db.add(req)

        req.project_summary = out_data.get("project_summary", "")
        req.business_goals = out_data.get("business_goals", [])
        req.actors = out_data.get("actors", [])
        req.functional_requirements = out_data.get("functional_requirements", [])
        req.non_functional_requirements = out_data.get("non_functional_requirements", [])
        req.constraints = out_data.get("constraints", [])
        req.assumptions = out_data.get("assumptions", [])
        req.dependencies = out_data.get("dependencies", [])
        req.risks = out_data.get("risks", [])

        # Clear existing questions
        db.query(RequirementQuestion).filter(RequirementQuestion.requirement_id == req.id).delete()

        # Save questions
        questions_data = out_data.get("open_questions", [])
        for q in questions_data:
            q_obj = RequirementQuestion(
                requirement_id=req.id,
                question_key=q.get("id", "q"),
                question_text=q.get("question_text", ""),
                category=q.get("category", "General"),
                options=q.get("options", []),
                priority=q.get("priority", "MEDIUM")
            )
            db.add(q_obj)

        project.status = "QUESTIONS_PENDING"
        db.commit()
        db.refresh(req)

        return out_data

    @staticmethod
    def answer_questions(db: Session, project_id: str, answers: List[QuestionAnswerItem]):
        req = db.query(Requirement).filter(Requirement.project_id == project_id).first()
        if not req:
            raise ValueError("Requirements record not found")

        for ans in answers:
            q = db.query(RequirementQuestion).filter(RequirementQuestion.id == ans.question_id).first()
            if q:
                # Delete existing answers for question
                db.query(RequirementAnswer).filter(RequirementAnswer.question_id == q.id).delete()
                new_ans = RequirementAnswer(
                    question_id=q.id,
                    selected_option=ans.selected_option,
                    custom_text=ans.custom_text
                )
                db.add(new_ans)

        db.commit()

    @staticmethod
    def finalize_requirements(db: Session, project_id: str, payload: Optional[FinalizeRequirementsRequest] = None) -> Requirement:
        project = db.query(Project).filter(Project.id == project_id).first()
        req = db.query(Requirement).filter(Requirement.project_id == project_id).first()

        if not req or not project:
            raise ValueError("Requirements or project not found")

        # Compile final SRS payload
        srs_content = payload.finalized_srs if payload and payload.finalized_srs else {
            "title": f"SRS: {project.name}",
            "project_summary": req.project_summary,
            "business_goals": req.business_goals,
            "actors": req.actors,
            "functional_requirements": req.functional_requirements,
            "non_functional_requirements": req.non_functional_requirements,
            "constraints": req.constraints,
            "assumptions": req.assumptions,
            "risks": req.risks,
        }

        req.is_finalized = True
        req.finalized_srs = srs_content
        project.status = "FINALIZING"

        # Create or update SRS artifact
        existing_srs_artifact = db.query(Artifact).filter(
            Artifact.project_id == project_id,
            Artifact.artifact_type == "SRS"
        ).first()

        if existing_srs_artifact:
            existing_srs_artifact.content = srs_content
            existing_srs_artifact.status = "APPROVED"
        else:
            srs_art = Artifact(
                project_id=project_id,
                artifact_type="SRS",
                title=f"Software Requirements Specification (SRS) - {project.name}",
                content=srs_content,
                status="APPROVED"
            )
            db.add(srs_art)

        db.commit()
        db.refresh(req)
        return req
