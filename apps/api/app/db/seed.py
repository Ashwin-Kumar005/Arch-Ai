"""
Database Seeder Script for ArchAI
Creates demo user, agent definitions, and showcase blueprints.
"""

from datetime import datetime, timezone
from app.db.session import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User, Role
from app.models.agent import Agent, AgentRun, AgentTask
from app.models.project import Project, ProjectMember
from app.models.requirement import Requirement, RequirementQuestion, RequirementAnswer
from app.models.artifact import Artifact
from app.llm.mock_provider import MockProvider


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        print("[SEED] Seeding ArchAI database...")

        # 1. Seed Roles
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        if not admin_role:
            admin_role = Role(name="admin", description="Full system access", permissions=["*"])
            db.add(admin_role)

        user_role = db.query(Role).filter(Role.name == "user").first()
        if not user_role:
            user_role = Role(name="user", description="Standard architect user", permissions=["projects:*"])
            db.add(user_role)

        # 2. Seed Demo User
        demo_user = db.query(User).filter(User.email == "demo@archai.io").first()
        if not demo_user:
            demo_user = User(
                email="demo@archai.io",
                full_name="ArchAI Lead Architect",
                hashed_password=get_password_hash("demo12345"),
                role="admin"
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            print("[+] Created demo user: demo@archai.io / demo12345")

        # 3. Seed 10 Agent Definitions
        agents_data = [
            ("requirement_analyst", "Requirement Analyst", "Requirement Analysis & Scope Discovery", "requirement_analyst.md"),
            ("product_manager", "Product Manager", "Roadmap, MVP & User Story Strategy", "product_manager.md"),
            ("solution_architect", "Solution Architect", "System Topology & Component Architecture", "solution_architect.md"),
            ("database_architect", "Database Architect", "Data Modeling, ERD & SQL DDL Design", "database_architect.md"),
            ("backend_engineer", "Backend Engineer", "REST API & Service Architecture", "backend_engineer.md"),
            ("frontend_planner", "Frontend Planner", "UI/UX Flows & Component Hierarchy", "frontend_planner.md"),
            ("devops_engineer", "DevOps Engineer", "CI/CD, Containers & Infrastructure Costing", "devops_engineer.md"),
            ("security_expert", "Security Expert", "STRIDE Threat Modeling & OWASP Hardening", "security_expert.md"),
            ("qa_engineer", "QA Engineer", "Test Strategy, Pytest/Playwright Suites & Edge Cases", "qa_engineer.md"),
            ("technical_writer", "Technical Writer", "SAD, Comprehensive SRS & Developer Onboarding Manual", "technical_writer.md")
        ]

        for a_key, name, role_title, prompt_path in agents_data:
            existing_agent = db.query(Agent).filter(Agent.agent_key == a_key).first()
            if not existing_agent:
                ag = Agent(
                    agent_key=a_key,
                    name=name,
                    role_title=role_title,
                    system_prompt_path=prompt_path
                )
                db.add(ag)

        db.commit()
        print("[+] Registered 10 specialized agent personas")

        # 4. Seed Showcase Project: "AI-Powered Local Services Marketplace"
        sample_proj = db.query(Project).filter(Project.name == "AI-Powered Local Services Marketplace").first()
        if not sample_proj:
            sample_proj = Project(
                owner_id=demo_user.id,
                name="AI-Powered Local Services Marketplace",
                description="On-demand digital marketplace connecting local service providers with homeowners for instant quote comparison, verified booking, secure escrow payments, and job tracking.",
                industry="Home Services & Marketplaces",
                target_users="Homeowners, Licensed Contractors, Platform Administrators",
                business_objective="Accelerate contractor discovery to under 5 minutes and protect transactions via automated escrow.",
                scale_tier="High Growth (100k+ MAU)",
                tech_preferences="Next.js, FastAPI, PostgreSQL, Redis, Stripe Connect, Docker",
                raw_idea="I want to build an online marketplace for local service providers where customers can search providers, compare prices, book appointments and pay online.",
                status="COMPLETED"
            )
            db.add(sample_proj)
            db.commit()
            db.refresh(sample_proj)

            # Add member
            member = ProjectMember(project_id=sample_proj.id, user_id=demo_user.id, role="owner")
            db.add(member)

            # Generate realistic mock payloads
            mock = MockProvider()
            req_data = mock._generate_mock_payload("RequirementAnalysisOutput", "")
            pm_data = mock._generate_mock_payload("ProductRoadmapOutput", "")
            sol_data = mock._generate_mock_payload("SolutionArchitectureOutput", "")
            db_data = mock._generate_mock_payload("DatabaseArchitectureOutput", "")
            api_data = mock._generate_mock_payload("BackendArchitectureOutput", "")
            ui_data = mock._generate_mock_payload("FrontendArchitectureOutput", "")
            devops_data = mock._generate_mock_payload("DevOpsArchitectureOutput", "")
            sec_data = mock._generate_mock_payload("SecurityArchitectureOutput", "")
            qa_data = mock._generate_mock_payload("QAArchitectureOutput", "")
            val_data = mock._generate_mock_payload("ConsistencyReport", "")
            doc_data = mock._generate_mock_payload("TechnicalDocumentationOutput", "")

            # Create Requirements
            req = Requirement(
                project_id=sample_proj.id,
                raw_input=sample_proj.raw_idea,
                project_summary=req_data["project_summary"],
                business_goals=req_data["business_goals"],
                actors=req_data["actors"],
                functional_requirements=req_data["functional_requirements"],
                non_functional_requirements=req_data["non_functional_requirements"],
                constraints=req_data["constraints"],
                assumptions=req_data["assumptions"],
                dependencies=req_data["dependencies"],
                risks=req_data["risks"],
                is_finalized=True,
                finalized_srs={
                    "title": f"SRS: {sample_proj.name}",
                    "summary": req_data["project_summary"],
                    "actors": req_data["actors"],
                    "functional_requirements": req_data["functional_requirements"]
                }
            )
            db.add(req)
            db.commit()
            db.refresh(req)

            # Add Questions & Answers
            for q in req_data.get("open_questions", []):
                q_obj = RequirementQuestion(
                    requirement_id=req.id,
                    question_key=q["id"],
                    question_text=q["question_text"],
                    category=q["category"],
                    options=q["options"],
                    priority=q["priority"]
                )
                db.add(q_obj)
                db.commit()
                db.refresh(q_obj)

                ans = RequirementAnswer(
                    question_id=q_obj.id,
                    selected_option=q["options"][0],
                    custom_text="Optimal standard production choice."
                )
                db.add(ans)

            # Create AgentRun
            agent_run = AgentRun(
                project_id=sample_proj.id,
                orchestrator_status="COMPLETED",
                current_stage=5,
                total_tokens=14850,
                execution_duration_ms=4200,
                completed_at=datetime.now(timezone.utc)
            )
            db.add(agent_run)
            db.commit()
            db.refresh(agent_run)

            # Create Tasks
            task_keys = [
                ("product_manager", "Product Manager", 2),
                ("solution_architect", "Solution Architect", 2),
                ("database_architect", "Database Architect", 3),
                ("backend_engineer", "Backend Engineer", 3),
                ("frontend_planner", "Frontend Planner", 3),
                ("devops_engineer", "DevOps Engineer", 4),
                ("security_expert", "Security Expert", 4),
                ("qa_engineer", "QA Engineer", 4),
                ("validator", "Consistency Validator", 5),
                ("technical_writer", "Technical Writer", 5)
            ]
            for t_key, t_name, stage_num in task_keys:
                task = AgentTask(
                    agent_run_id=agent_run.id,
                    agent_key=t_key,
                    agent_name=t_name,
                    stage=stage_num,
                    status="COMPLETED",
                    token_usage=1485,
                    duration_ms=420,
                    completed_at=datetime.now(timezone.utc)
                )
                db.add(task)

            # Create Complete Artifacts
            artifacts = [
                ("SRS", "Software Requirements Specification (SRS)", req.finalized_srs),
                ("ROADMAP", "Product Roadmap & MVP Scope", pm_data),
                ("ARCHITECTURE", "System Architecture & Topology", sol_data),
                ("ERD", "Database ERD & SQL Schema", db_data),
                ("API_SPEC", "REST API & OpenAPI Specification", api_data),
                ("UI_FLOW", "Frontend UI Flow & Component Hierarchy", ui_data),
                ("DEPLOYMENT_PLAN", "DevOps & Infrastructure Plan", devops_data),
                ("SECURITY_REPORT", "Security Assessment & Threat Model", sec_data),
                ("TEST_PLAN", "QA Test Strategy & Test Cases", qa_data),
                ("CONSISTENCY_REPORT", "Architecture Consistency Validation Report", val_data),
                ("TECHNICAL_DOC", "Master Technical Documentation", doc_data),
            ]

            for a_type, title, content in artifacts:
                art = Artifact(
                    project_id=sample_proj.id,
                    agent_run_id=agent_run.id,
                    artifact_type=a_type,
                    title=title,
                    version=1,
                    content=content,
                    status="APPROVED"
                )
                db.add(art)

            db.commit()
            print("[+] Seeded Showcase Project with complete 10-agent blueprints and artifacts!")

        print("[*] Database seed completed successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
