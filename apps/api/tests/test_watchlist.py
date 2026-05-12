from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient


async def _auth(client: AsyncClient, email: str = "watcher@example.com") -> str:
    await client.post("/auth/register", json={"email": email, "password": "sicher123"})
    resp = await client.post("/auth/login", json={"email": email, "password": "sicher123"})
    return resp.json()["access_token"]


@pytest.fixture(autouse=True)
def skip_rate_limit(monkeypatch):
    monkeypatch.setattr("app.routers.auth.check_rate_limit", AsyncMock(return_value=None))


async def test_watchlist_empty_on_start(client: AsyncClient):
    token = await _auth(client)
    resp = await client.get("/watchlist", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json() == []


async def test_add_to_watchlist(client: AsyncClient):
    token = await _auth(client)
    with patch("app.routers.watchlist.get_asset") as mock:
        mock.return_value = {"symbol": "AAPL", "name": "Apple Inc.", "price": 180.0, "change_pct": 1.2, "asset_type": "stock"}
        resp = await client.post(
            "/watchlist",
            json={"symbol": "AAPL"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert resp.status_code == 201
    data = resp.json()
    assert data["symbol"] == "AAPL"


async def test_add_duplicate_returns_conflict(client: AsyncClient):
    token = await _auth(client)
    with patch("app.routers.watchlist.get_asset") as mock:
        mock.return_value = {"symbol": "AAPL", "name": "Apple Inc.", "price": 180.0, "change_pct": 1.2, "asset_type": "stock"}
        await client.post("/watchlist", json={"symbol": "AAPL"}, headers={"Authorization": f"Bearer {token}"})
        resp = await client.post("/watchlist", json={"symbol": "AAPL"}, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 409


async def test_add_unknown_symbol_returns_404(client: AsyncClient):
    token = await _auth(client)
    with patch("app.routers.watchlist.get_asset") as mock:
        mock.return_value = None
        resp = await client.post(
            "/watchlist",
            json={"symbol": "UNKNOWN"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert resp.status_code == 404


async def test_remove_from_watchlist(client: AsyncClient):
    token = await _auth(client)
    with patch("app.routers.watchlist.get_asset") as mock:
        mock.return_value = {"symbol": "TSLA", "name": "Tesla", "price": 250.0, "change_pct": -0.5, "asset_type": "stock"}
        await client.post("/watchlist", json={"symbol": "TSLA"}, headers={"Authorization": f"Bearer {token}"})

    resp = await client.delete("/watchlist/TSLA", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 204

    list_resp = await client.get("/watchlist", headers={"Authorization": f"Bearer {token}"})
    assert list_resp.json() == []


async def test_remove_nonexistent_returns_404(client: AsyncClient):
    token = await _auth(client)
    resp = await client.delete("/watchlist/GHOST", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 404


async def test_watchlist_isolated_between_users(client: AsyncClient):
    token_a = await _auth(client, "a@example.com")
    token_b = await _auth(client, "b@example.com")

    with patch("app.routers.watchlist.get_asset") as mock:
        mock.return_value = {"symbol": "AAPL", "name": "Apple Inc.", "price": 180.0, "change_pct": 0.0, "asset_type": "stock"}
        await client.post("/watchlist", json={"symbol": "AAPL"}, headers={"Authorization": f"Bearer {token_a}"})

    resp = await client.get("/watchlist", headers={"Authorization": f"Bearer {token_b}"})
    assert resp.json() == []
