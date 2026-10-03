"""
Agent 9: QA Engineer Agent
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "packages" / "agent-contracts"))
try:
    from schemas import QAArchitectureOutput
except ImportError:
    from pydantic import BaseModel
    from typing import List, Dict, Any
    class QAArchitectureOutput(BaseModel):
        test_strategy_overview: str
        testing_tools: List[str]
        test_cases: List[Dict[str, Any]]
        edge_cases_and_recovery: List[Dict[str, str]]
        load_and_performance_criteria: str
        sample_automated_test_code: str

from app.agents.base import BaseAgent


class QAEngineerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_key="qa_engineer",
            name="QA Engineer",
            role="Test Strategy, Pytest/Playwright Suites & Edge Cases",
            prompt_filename="qa_engineer.md",
            output_schema=QAArchitectureOutput
        )
