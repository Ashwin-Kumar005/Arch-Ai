"""
ArchAI Agents Package
"""

from app.agents.base import BaseAgent, AgentResult
from app.agents.requirement_analyst import RequirementAnalystAgent
from app.agents.product_manager import ProductManagerAgent
from app.agents.solution_architect import SolutionArchitectAgent
from app.agents.database_architect import DatabaseArchitectAgent
from app.agents.backend_engineer import BackendEngineerAgent
from app.agents.frontend_planner import FrontendPlannerAgent
from app.agents.devops_engineer import DevOpsEngineerAgent
from app.agents.security_expert import SecurityExpertAgent
from app.agents.qa_engineer import QAEngineerAgent
from app.agents.technical_writer import TechnicalWriterAgent
from app.agents.validator import ConsistencyValidatorAgent

AGENT_REGISTRY = {
    "requirement_analyst": RequirementAnalystAgent,
    "product_manager": ProductManagerAgent,
    "solution_architect": SolutionArchitectAgent,
    "database_architect": DatabaseArchitectAgent,
    "backend_engineer": BackendEngineerAgent,
    "frontend_planner": FrontendPlannerAgent,
    "devops_engineer": DevOpsEngineerAgent,
    "security_expert": SecurityExpertAgent,
    "qa_engineer": QAEngineerAgent,
    "technical_writer": TechnicalWriterAgent,
    "validator": ConsistencyValidatorAgent,
}

__all__ = [
    "BaseAgent",
    "AgentResult",
    "AGENT_REGISTRY",
    "RequirementAnalystAgent",
    "ProductManagerAgent",
    "SolutionArchitectAgent",
    "DatabaseArchitectAgent",
    "BackendEngineerAgent",
    "FrontendPlannerAgent",
    "DevOpsEngineerAgent",
    "SecurityExpertAgent",
    "QAEngineerAgent",
    "TechnicalWriterAgent",
    "ConsistencyValidatorAgent",
]
