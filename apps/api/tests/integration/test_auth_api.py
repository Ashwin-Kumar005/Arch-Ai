"""
Integration Tests for Authentication Endpoints
"""

def test_health_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["HEALTHY", "DEGRADED"]
    assert "app_name" in data


def test_user_registration_and_login(client):
    # 1. Register
    reg_payload = {
        "email": "test_engineer@archai.io",
        "password": "Password123!",
        "full_name": "Test Architect"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == "test_engineer@archai.io"

    # 2. Login
    login_payload = {
        "email": "test_engineer@archai.io",
        "password": "Password123!"
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data


def test_demo_login(client):
    res = client.post("/api/v1/auth/demo-login")
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "demo@archai.io"
