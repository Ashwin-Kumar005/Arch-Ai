"""
Agent 3: Solution Architect Agent
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "packages" / "agent-contracts"))
try:
    from schemas import SolutionArchitectureOutput
except ImportError:
    from pydantic import BaseModel
    from typing import List, Dict, Any
    class SolutionArchitectureOutput(BaseModel):
        system_overview: str
        topology_pattern: str
        nodes: List[Dict[str, Any]]
        edges: List[Dict[str, Any]]
        mermaid_diagram: str
        scalability_strategy: str
        caching_and_event_strategy: str
        architecture_decisions: List[Dict[str, Any]]

from app.agents.base import BaseAgent


class SolutionArchitectAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_key="solution_architect",
            name="Solution Architect",
            role="System Topology & Component Architecture",
            prompt_filename="solution_architect.md",
            output_schema=SolutionArchitectureOutput
        )
