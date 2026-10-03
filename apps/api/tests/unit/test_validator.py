"""
Unit Tests for Consistency Validator Engine
"""

import pytest
from app.agents.validator import ConsistencyValidatorAgent


@pytest.mark.asyncio
async def test_validator_cross_domain_evaluation():
    validator = ConsistencyValidatorAgent()
    mock_completed_outputs = {
        "solution_architect": {"system_overview": "FastAPI with PostgreSQL 16"},
        "database_architect": {"dialect": "PostgreSQL 16", "tables": []},
        "backend_engineer": {"endpoints": [{"path": "/api/v1/users", "method": "GET"}]},
        "security_expert": {"threat_model": [{"category": "Spoofing"}]}
    }

    report = await validator.validate_blueprints(mock_completed_outputs)
    assert report["overall_valid"] is True
    assert report["score_percentage"] >= 80
    assert len(report["issues"]) > 0
