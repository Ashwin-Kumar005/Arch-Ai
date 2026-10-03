"""
Agent 2: Product Manager Agent
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "packages" / "agent-contracts"))
try:
    from schemas import ProductRoadmapOutput
except ImportError:
    from pydantic import BaseModel
    from typing import List, Dict, Any
    class ProductRoadmapOutput(BaseModel):
        mvp_definition: str
        mvp_features: List[str]
        post_mvp_features: List[str]
        user_stories: List[Dict[str, Any]]
        sprint_plan: List[Dict[str, Any]]
        key_performance_indicators: List[str]

from app.agents.base import BaseAgent


class ProductManagerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_key="product_manager",
            name="Product Manager",
            role="Roadmap, MVP & User Story Strategy",
            prompt_filename="product_manager.md",
            output_schema=ProductRoadmapOutput
        )
