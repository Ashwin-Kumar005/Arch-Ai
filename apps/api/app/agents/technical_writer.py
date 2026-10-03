"""
Agent 10: Technical Writer Agent
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "packages" / "agent-contracts"))
try:
    from schemas import TechnicalDocumentationOutput
except ImportError:
    from pydantic import BaseModel
    class TechnicalDocumentationOutput(BaseModel):
        document_title: str
        version: str
        executive_summary: str
        system_architecture_document: str
        software_requirements_specification: str
        developer_onboarding_guide: str
        operations_manual: str

from app.agents.base import BaseAgent


class TechnicalWriterAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_key="technical_writer",
            name="Technical Writer",
            role="SAD, Comprehensive SRS & Developer Onboarding Manual",
            prompt_filename="technical_writer.md",
            output_schema=TechnicalDocumentationOutput
        )
