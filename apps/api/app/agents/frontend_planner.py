"""
Agent 6: Frontend Planner Agent
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "packages" / "agent-contracts"))
try:
    from schemas import FrontendArchitectureOutput
except ImportError:
    from pydantic import BaseModel
    from typing import List, Dict, Any
    class FrontendArchitectureOutput(BaseModel):
        framework: str
        state_management: str
        ui_library: str
        screens: List[Dict[str, Any]]
        component_hierarchy: List[Dict[str, Any]]
        responsive_design_rules: List[str]

from app.agents.base import BaseAgent


class FrontendPlannerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_key="frontend_planner",
            name="Frontend Planner",
            role="UI/UX Flows & Component Hierarchy",
            prompt_filename="frontend_planner.md",
            output_schema=FrontendArchitectureOutput
        )
