"""
Abstract LLM Provider Base
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Type, Optional
from pydantic import BaseModel


class LLMResponse(BaseModel):
    raw_content: str
    parsed_json: Optional[Dict[str, Any]] = None
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    duration_ms: int = 0
    model_name: str = ""


class LLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
        temperature: float = 0.2
    ) -> LLMResponse:
        pass

    @abstractmethod
    async def get_embedding(self, text: str) -> list[float]:
        pass
