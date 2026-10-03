"""
LLM Provider Factory
"""

from app.core.config import settings
from app.llm.base import LLMProvider
from app.llm.gemini_provider import GeminiProvider
from app.llm.huggingface_provider import HuggingFaceProvider
from app.llm.mock_provider import MockProvider


def get_llm_provider() -> LLMProvider:
    """
    Returns the configured LLM provider.
    If DEMO_MODE is True or no API keys are present, falls back to MockProvider.
    """
    if settings.DEMO_MODE:
        return MockProvider()

    if settings.LLM_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        return GeminiProvider()

    if settings.LLM_PROVIDER == "huggingface" and settings.HUGGINGFACE_API_KEY:
        return HuggingFaceProvider()

    # Default safe fallback
    return MockProvider()
