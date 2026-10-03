"""
Agent 8: Security Expert Agent
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "packages" / "agent-contracts"))
try:
    from schemas import SecurityArchitectureOutput
except ImportError:
    from pydantic import BaseModel
    from typing import List, Dict, Any
    class SecurityArchitectureOutput(BaseModel):
        threat_model: List[Dict[str, Any]]
        owasp_top_10_mitigations: List[Dict[str, Any]]
        rbac_permission_matrix: Dict[str, List[str]]
        encryption_standards: Dict[str, str]
        secrets_management: str
        security_hardening_checklist: List[str]

from app.agents.base import BaseAgent


class SecurityExpertAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_key="security_expert",
            name="Security Expert",
            role="STRIDE Threat Modeling & OWASP Hardening",
            prompt_filename="security_expert.md",
            output_schema=SecurityArchitectureOutput
        )
