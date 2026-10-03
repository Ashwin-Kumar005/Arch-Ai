"""
Agent 1: Requirement Analyst Agent
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "packages" / "agent-contracts"))
try:
    from schemas import RequirementAnalysisOutput
except ImportError:
    # Direct import fallback
    from pydantic import BaseModel, Field
    from typing import List, Dict, Any
    class RequirementAnalysisOutput(BaseModel):
        project_summary: str
        business_goals: List[str]
        actors: List[str]
        functional_requirements: List[str]
        non_functional_requirements: List[str]
        constraints: List[str]
        assumptions: List[str]
        dependencies: List[str]
        risks: List[str]
        open_questions: List[Dict[str, Any]]

from app.agents.base import BaseAgent


class RequirementAnalystAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_key="requirement_analyst",
            name="Requirement Analyst",
            role="Requirement Analysis & Scope Discovery",
            prompt_filename="requirement_analyst.md",
            output_schema=RequirementAnalysisOutput
        )
