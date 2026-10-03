"""
Agent 4: Database Architect Agent
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "packages" / "agent-contracts"))
try:
    from schemas import DatabaseArchitectureOutput
except ImportError:
    from pydantic import BaseModel
    from typing import List, Dict, Any, Optional
    class DatabaseArchitectureOutput(BaseModel):
        dialect: str
        database_overview: str
        tables: List[Dict[str, Any]]
        relations: List[Dict[str, Any]]
        indexing_strategy: str
        ddl_script: str
        vector_storage_design: Optional[str] = None

from app.agents.base import BaseAgent


class DatabaseArchitectAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_key="database_architect",
            name="Database Architect",
            role="Data Modeling, ERD & SQL DDL Design",
            prompt_filename="database_architect.md",
            output_schema=DatabaseArchitectureOutput
        )
