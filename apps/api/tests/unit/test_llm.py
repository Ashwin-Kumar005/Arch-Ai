"""
Unit Tests for LLM Abstraction and Mock Provider
"""

import pytest
from app.llm.mock_provider import MockProvider
from app.llm.factory import get_llm_provider
from app.llm.base import LLMResponse


@pytest.mark.asyncio
async def test_mock_llm_provider_generation():
    provider = MockProvider()
    response = await provider.generate(
        system_prompt="You are an architect",
        user_prompt="I want an e-commerce store"
    )
    assert isinstance(response, LLMResponse)
    assert response.total_tokens > 0
    assert response.duration_ms >= 0


@pytest.mark.asyncio
async def test_mock_llm_embedding():
    provider = MockProvider()
    embedding = await provider.get_embedding("test prompt for embedding")
    assert len(embedding) == 768
    assert all(isinstance(v, float) for v in embedding)


def test_llm_factory():
    provider = get_llm_provider()
    assert provider is not None
