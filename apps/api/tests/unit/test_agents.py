"""
Unit Tests for 10 Specialized Agents
"""

import pytest
from app.agents import AGENT_REGISTRY


@pytest.mark.asyncio
async def test_all_10_agents_executable():
    assert len(AGENT_REGISTRY) >= 11

    dummy_context = {
        "project_name": "Test App",
        "project_description": "A collaborative task manager",
        "industry": "Productivity",
        "scale_tier": "Standard",
        "tech_preferences": "Next.js, FastAPI, PostgreSQL",
        "raw_idea": "Task management platform with real-time updates."
    }

    for agent_key, agent_cls in AGENT_REGISTRY.items():
        agent = agent_cls()
        result = await agent.execute(dummy_context)
        assert result.status == "COMPLETED"
        assert result.agent_key == agent_key
        assert result.total_tokens > 0
        assert isinstance(result.output, dict)
