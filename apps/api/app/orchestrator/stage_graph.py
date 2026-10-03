"""
Multi-Agent Stage Graph Definition
"""

from typing import List, Dict, Any


class StageDefinition:
    def __init__(self, stage_number: int, name: str, agent_keys: List[str], parallel: bool = True):
        self.stage_number = stage_number
        self.name = name
        self.agent_keys = agent_keys
        self.parallel = parallel


ORCHESTRATION_STAGES: List[StageDefinition] = [
    StageDefinition(
        stage_number=2,
        name="Product Strategy & High-Level Architecture",
        agent_keys=["product_manager", "solution_architect"],
        parallel=True
    ),
    StageDefinition(
        stage_number=3,
        name="Technical Domain Engineering",
        agent_keys=["database_architect", "backend_engineer", "frontend_planner"],
        parallel=True
    ),
    StageDefinition(
        stage_number=4,
        name="Operations, Security & QA",
        agent_keys=["devops_engineer", "security_expert", "qa_engineer"],
        parallel=True
    ),
    StageDefinition(
        stage_number=5,
        name="Consistency Validation & Technical Documentation",
        agent_keys=["validator", "technical_writer"],
        parallel=False
    )
]
