"""
Integration Tests for Artifacts CRUD and Export
"""

def test_artifacts_endpoints_and_export(client):
    # 1. Create project
    create_res = client.post("/api/v1/projects", json={
        "name": "Cloud Observability Platform",
        "description": "Log management and metrics aggregation."
    })
    project_id = create_res.json()["id"]

    # 2. Test Export in JSON format
    export_json = client.post(f"/api/v1/projects/{project_id}/export?format=json")
    assert export_json.status_code == 200
    assert "project" in export_json.json()

    # 3. Test Export in Markdown format
    export_md = client.post(f"/api/v1/projects/{project_id}/export?format=markdown")
    assert export_md.status_code == 200
    assert "ArchAI Software Blueprint" in export_md.text

    # 4. Test Export in ZIP format
    export_zip = client.post(f"/api/v1/projects/{project_id}/export?format=zip")
    assert export_zip.status_code == 200
    assert export_zip.headers["content-type"] == "application/zip"
