"""
Agent 5: Backend Engineer Agent
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "packages" / "agent-contracts"))
try:
    from schemas import BackendArchitectureOutput
except ImportError:
    from pydantic import BaseModel
    from typing import List, Dict, Any
    class BackendArchitectureOutput(BaseModel):
        framework: str
        api_title: str
        version: str
        endpoints: List[Dict[str, Any]]
        service_layer_structure: List[str]
        authentication_strategy: str
        openapi_spec: Dict[str, Any]

from app.agents.base import BaseAgent


class BackendEngineerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_key="backend_engineer",
            name="Backend Engineer",
            role="REST API & Service Architecture",
            prompt_filename="backend_engineer.md",
            output_schema=BackendArchitectureOutput
        )
