"""
Agent 7: DevOps Engineer Agent
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "packages" / "agent-contracts"))
try:
    from schemas import DevOpsArchitectureOutput
except ImportError:
    from pydantic import BaseModel
    from typing import List, Dict, Any
    class DevOpsArchitectureOutput(BaseModel):
        container_topology: List[str]
        docker_compose_yaml: str
        github_actions_ci_yaml: str
        environment_variables_spec: List[Dict[str, str]]
        cost_breakdown: List[Dict[str, Any]]
        total_estimated_monthly_usd: float
        monitoring_and_observability: str

from app.agents.base import BaseAgent


class DevOpsEngineerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_key="devops_engineer",
            name="DevOps Engineer",
            role="CI/CD, Containers & Infrastructure Costing",
            prompt_filename="devops_engineer.md",
            output_schema=DevOpsArchitectureOutput
        )
