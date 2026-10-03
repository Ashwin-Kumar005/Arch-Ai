"""
Base Agent Implementation with Schema Validation, Retries, and Token Tracking
"""

import time
import json
from abc import ABC, abstractmethod
from typing import Dict, Any, Type, Optional
from pathlib import Path
from pydantic import BaseModel
from app.core.config import settings
from app.llm.factory import get_llm_provider
from app.core.logging import logger


class AgentResult(BaseModel):
    agent_key: str
    agent_name: str
    status: str  # COMPLETED, FAILED
    output: Dict[str, Any]
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    duration_ms: int = 0
    error_message: Optional[str] = None


class BaseAgent(ABC):
    def __init__(
        self,
        agent_key: str,
        name: str,
        role: str,
        prompt_filename: str,
        output_schema: Type[BaseModel]
    ):
        self.agent_key = agent_key
        self.name = name
        self.role = role
        self.prompt_filename = prompt_filename
        self.output_schema = output_schema
        self.llm = get_llm_provider()

    def load_system_prompt(self) -> str:
        prompt_path = settings.PROMPTS_DIR / self.prompt_filename
        if prompt_path.exists():
            with open(prompt_path, "r", encoding="utf-8") as f:
                return f.read()
        return f"You are the {self.name} for ArchAI. Perform your domain tasks and return valid JSON."

    async def execute(self, context: Dict[str, Any], max_retries: int = 2) -> AgentResult:
        start_time = time.time()
        system_prompt = self.load_system_prompt()
        user_prompt = f"Project Context:\n{json.dumps(context, indent=2)}\n\nPlease generate the domain deliverables according to your schema."

        attempts = 0
        last_error = None

        while attempts <= max_retries:
            attempts += 1
            try:
                response = await self.llm.generate(
                    system_prompt=system_prompt,
                    user_prompt=user_prompt,
                    response_schema=self.output_schema
                )

                duration_ms = int((time.time() - start_time) * 1000)
                output_data = response.parsed_json or {}

                return AgentResult(
                    agent_key=self.agent_key,
                    agent_name=self.name,
                    status="COMPLETED",
                    output=output_data,
                    prompt_tokens=response.prompt_tokens,
                    completion_tokens=response.completion_tokens,
                    total_tokens=response.total_tokens,
                    duration_ms=duration_ms
                )
            except Exception as e:
                last_error = str(e)
                logger.warning(f"Agent {self.agent_key} attempt {attempts} failed: {last_error}")
                if attempts <= max_retries:
                    time.sleep(0.5 * attempts)

        duration_ms = int((time.time() - start_time) * 1000)
        return AgentResult(
            agent_key=self.agent_key,
            agent_name=self.name,
            status="FAILED",
            output={},
            duration_ms=duration_ms,
            error_message=last_error
        )
