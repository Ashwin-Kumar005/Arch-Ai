"""
End-to-End Pipeline Verification Test
"""

import pytest
from app.orchestrator.runner import OrchestrationRunner


@pytest.mark.asyncio
async def test_complete_idea_to_blueprint_pipeline(client, db_session):
    # Step 1: Demo Login
    auth_res = client.post("/api/v1/auth/demo-login")
    assert auth_res.status_code == 200
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Step 2: Create Project Wizard
    project_payload = {
        "name": "E2E Verified Home Services Platform",
        "description": "On-demand local service provider marketplace with instant booking and escrow payments.",
        "industry": "Home Services & Marketplace",
        "target_users": "Homeowners, Contractors, Admins",
        "business_objective": "Accelerate service matching to under 5 minutes with guaranteed escrow payment protection.",
        "scale_tier": "High Growth (100k+ MAU)",
        "tech_preferences": "Next.js 14, FastAPI, PostgreSQL, Redis, Docker",
        "raw_idea": "I want to build an online marketplace for local service providers where customers can search providers, compare prices, book appointments and pay online."
    }
    create_res = client.post("/api/v1/projects", json=project_payload, headers=headers)
    assert create_res.status_code == 201
    project_id = create_res.json()["id"]

    # Step 3: Run Requirement Analyst Agent
    analyze_res = client.post(f"/api/v1/projects/{project_id}/analyze", headers=headers)
    assert analyze_res.status_code == 200
    analysis = analyze_res.json()
    assert len(analysis["actors"]) > 0
    assert len(analysis["functional_requirements"]) > 0
    assert len(analysis["open_questions"]) > 0

    # Step 4: Answer Follow-up Questions
    req_res = client.get(f"/api/v1/projects/{project_id}/requirements", headers=headers)
    questions = req_res.json()["questions"]
    assert len(questions) > 0

    answers = []
    for q in questions:
        answers.append({
            "question_id": q["id"],
            "selected_option": q["options"][0] if q["options"] else "Standard",
            "custom_text": "Production standard configuration."
        })
    ans_res = client.post(
        f"/api/v1/projects/{project_id}/questions/answer",
        json={"answers": answers},
        headers=headers
    )
    assert ans_res.status_code == 200

    # Step 5: Finalize Requirements & Baseline SRS
    finalize_res = client.post(f"/api/v1/projects/{project_id}/finalize", json={}, headers=headers)
    assert finalize_res.status_code == 200
    assert finalize_res.json()["is_finalized"] is True

    # Step 6: Start Multi-Agent Orchestration
    orch_res = client.post(f"/api/v1/projects/{project_id}/orchestrate", headers=headers)
    assert orch_res.status_code == 202
    agent_run_id = orch_res.json()["agent_run_id"]

    # Step 7: Execute Orchestration synchronously in test with test session
    runner = OrchestrationRunner(project_id, agent_run_id, db=db_session)
    await runner.run()

    # Step 8: Verify Completed Agent Run
    run_res = client.get(f"/api/v1/projects/{project_id}/agent-runs/{agent_run_id}", headers=headers)
    assert run_res.status_code == 200
    run_data = run_res.json()
    assert run_data["orchestrator_status"] == "COMPLETED"
    assert run_data["total_tokens"] > 0
    assert len(run_data["tasks"]) >= 10

    # Step 9: Verify Artifacts Deliverables
    art_res = client.get(f"/api/v1/projects/{project_id}/artifacts", headers=headers)
    assert art_res.status_code == 200
    artifacts = art_res.json()
    artifact_types = {a["artifact_type"] for a in artifacts}

    expected_types = {
        "SRS",
        "ROADMAP",
        "ARCHITECTURE",
        "ERD",
        "API_SPEC",
        "UI_FLOW",
        "DEPLOYMENT_PLAN",
        "SECURITY_REPORT",
        "TEST_PLAN",
        "CONSISTENCY_REPORT",
        "TECHNICAL_DOC"
    }
    assert expected_types.issubset(artifact_types)

    # Step 10: Export ZIP Blueprint Bundle
    export_res = client.post(f"/api/v1/projects/{project_id}/export?format=zip", headers=headers)
    assert export_res.status_code == 200
    assert export_res.headers["content-type"] == "application/zip"
    assert len(export_res.content) > 500  # Non-empty ZIP archive
