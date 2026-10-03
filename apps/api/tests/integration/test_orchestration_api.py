"""
Integration Tests for Multi-Agent Orchestration & Deliverable APIs
"""

import pytest


def test_orchestration_and_artifacts(client):
    # 1. Create project & finalize requirements
    create_res = client.post("/api/v1/projects", json={
        "name": "HealthTech Telemedicine",
        "description": "HIPAA-compliant video consultation and prescription routing.",
        "raw_idea": "Telehealth app connecting patients with certified doctors."
    })
    project_id = create_res.json()["id"]

    client.post(f"/api/v1/projects/{project_id}/analyze")
    client.post(f"/api/v1/projects/{project_id}/finalize", json={})

    # 2. Trigger Orchestration
    orch_res = client.post(f"/api/v1/projects/{project_id}/orchestrate")
    assert orch_res.status_code == 202
    orch_data = orch_res.json()
    assert "agent_run_id" in orch_data
    run_id = orch_data["agent_run_id"]

    # 3. Check Agent Runs list
    runs_res = client.get(f"/api/v1/projects/{project_id}/agent-runs")
    assert runs_res.status_code == 200
    runs = runs_res.json()
    assert any(r["id"] == run_id for r in runs)

    # 4. Check Artifacts
    art_res = client.get(f"/api/v1/projects/{project_id}/artifacts")
    assert art_res.status_code == 200
