import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch


@pytest.fixture(autouse=True)
def skip_rate_limit(monkeypatch):
    """Disable rate limiting in all auth tests."""
    monkeypatch.setattr("app.routers.auth.check_rate_limit", AsyncMock(return_value=None))


async def test_register_success(client: AsyncClient):
    resp = await client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "sicher123",
        "full_name": "Test Nutzer",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "free"
    assert "id" in data


async def test_register_duplicate_email(client: AsyncClient):
    payload = {"email": "dup@example.com", "password": "sicher123"}
    await client.post("/auth/register", json=payload)
    resp = await client.post("/auth/register", json=payload)
    assert resp.status_code == 409


async def test_register_weak_password(client: AsyncClient):
    resp = await client.post("/auth/register", json={
        "email": "weak@example.com",
        "password": "kurz",
    })
    assert resp.status_code == 422


async def test_login_success(client: AsyncClient):
    await client.post("/auth/register", json={"email": "login@example.com", "password": "sicher123"})
    resp = await client.post("/auth/login", json={"email": "login@example.com", "password": "sicher123"})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


async def test_login_wrong_password(client: AsyncClient):
    await client.post("/auth/register", json={"email": "wp@example.com", "password": "sicher123"})
    resp = await client.post("/auth/login", json={"email": "wp@example.com", "password": "falsch"})
    assert resp.status_code == 401


async def test_me_requires_auth(client: AsyncClient):
    resp = await client.get("/auth/me")
    assert resp.status_code == 403  # No Authorization header → HTTPBearer raises 403


async def test_me_returns_profile(client: AsyncClient):
    await client.post("/auth/register", json={"email": "me@example.com", "password": "sicher123"})
    login = await client.post("/auth/login", json={"email": "me@example.com", "password": "sicher123"})
    token = login.json()["access_token"]

    resp = await client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == "me@example.com"


async def test_forgot_password_always_204(client: AsyncClient):
    resp = await client.post("/auth/forgot-password", json={"email": "nobody@example.com"})
    assert resp.status_code == 204


async def test_reset_password_invalid_token(client: AsyncClient):
    resp = await client.post("/auth/reset-password", json={
        "token": "invalid-token",
        "new_password": "neuesPasswort123",
    })
    assert resp.status_code == 400
