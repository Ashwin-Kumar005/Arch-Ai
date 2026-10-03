"""
Integration Tests for Projects CRUD Endpoints
"""

def test_project_crud_lifecycle(client):
    # 1. Create Project
    create_payload = {
        "name": "Fintech Mobile Wallet",
        "description": "Peer-to-peer cryptocurrency and fiat payments platform.",
        "industry": "FinTech",
        "target_users": "Retail Consumers & Merchants",
        "business_objective": "Sub-second transfers and low gas fee abstraction.",
        "scale_tier": "High Growth",
        "tech_preferences": "Next.js, FastAPI, PostgreSQL, Redis",
        "raw_idea": "I want to build a mobile wallet that lets friends split bills and pay merchants instantly."
    }

    create_res = client.post("/api/v1/projects", json=create_payload)
    assert create_res.status_code == 201
    project = create_res.json()
    project_id = project["id"]
    assert project["name"] == "Fintech Mobile Wallet"
    assert project["status"] == "DRAFT"

    # 2. List Projects
    list_res = client.get("/api/v1/projects")
    assert list_res.status_code == 200
    projects = list_res.json()
    assert any(p["id"] == project_id for p in projects)

    # 3. Get Project by ID
    get_res = client.get(f"/api/v1/projects/{project_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == project_id

    # 4. Update Project
    update_res = client.patch(f"/api/v1/projects/{project_id}", json={"scale_tier": "Enterprise (1M+ MAU)"})
    assert update_res.status_code == 200
    assert update_res.json()["scale_tier"] == "Enterprise (1M+ MAU)"

    # 5. Delete Project
    del_res = client.delete(f"/api/v1/projects/{project_id}")
    assert del_res.status_code == 204

    # Verify deleted
    get_after_del = client.get(f"/api/v1/projects/{project_id}")
    assert get_after_del.status_code == 404
