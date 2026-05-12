from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient


# ── Helpers ───────────────────────────────────────────────────────────

async def _register_and_login(client: AsyncClient, email: str = "trader@example.com") -> str:
    await client.post("/auth/register", json={"email": email, "password": "sicher123"})
    resp = await client.post("/auth/login", json={"email": email, "password": "sicher123"})
    return resp.json()["access_token"]


@pytest.fixture(autouse=True)
def skip_rate_limit(monkeypatch):
    monkeypatch.setattr("app.routers.auth.check_rate_limit", AsyncMock(return_value=None))


# ── Portfolio ─────────────────────────────────────────────────────────

async def test_get_portfolio_creates_on_first_access(client: AsyncClient):
    token = await _register_and_login(client)
    resp = await client.get("/portfolio", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert float(data["cash_balance"]) == 10000.0
    assert data["positions"] == []
    assert float(data["initial_capital"]) == 10000.0


async def test_buy_order_reduces_cash(client: AsyncClient):
    token = await _register_and_login(client)
    with patch("app.routers.portfolio.get_asset") as mock:
        mock.return_value = {"symbol": "AAPL", "name": "Apple Inc.", "price": 150.0}
        resp = await client.post(
            "/portfolio/orders",
            json={"symbol": "AAPL", "side": "buy", "quantity": 10},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert resp.status_code == 201
    data = resp.json()
    assert float(data["cash_balance"]) == pytest.approx(10000.0 - 1500.0)
    assert len(data["positions"]) == 1
    assert data["positions"][0]["symbol"] == "AAPL"


async def test_buy_insufficient_funds(client: AsyncClient):
    token = await _register_and_login(client)
    with patch("app.routers.portfolio.get_asset") as mock:
        mock.return_value = {"symbol": "AAPL", "name": "Apple Inc.", "price": 5000.0}
        resp = await client.post(
            "/portfolio/orders",
            json={"symbol": "AAPL", "side": "buy", "quantity": 100},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert resp.status_code == 400
    assert "Kapital" in resp.json()["detail"]


async def test_sell_without_position_fails(client: AsyncClient):
    token = await _register_and_login(client)
    with patch("app.routers.portfolio.get_asset") as mock:
        mock.return_value = {"symbol": "TSLA", "name": "Tesla", "price": 200.0}
        resp = await client.post(
            "/portfolio/orders",
            json={"symbol": "TSLA", "side": "sell", "quantity": 1},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert resp.status_code == 400


async def test_buy_then_sell_updates_position(client: AsyncClient):
    token = await _register_and_login(client)
    with patch("app.routers.portfolio.get_asset") as mock:
        mock.return_value = {"symbol": "MSFT", "name": "Microsoft", "price": 200.0}
        await client.post(
            "/portfolio/orders",
            json={"symbol": "MSFT", "side": "buy", "quantity": 5},
            headers={"Authorization": f"Bearer {token}"},
        )
        resp = await client.post(
            "/portfolio/orders",
            json={"symbol": "MSFT", "side": "sell", "quantity": 3},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert resp.status_code == 201
    positions = resp.json()["positions"]
    assert len(positions) == 1
    assert float(positions[0]["quantity"]) == pytest.approx(2.0)


async def test_sell_all_removes_position(client: AsyncClient):
    token = await _register_and_login(client)
    with patch("app.routers.portfolio.get_asset") as mock:
        mock.return_value = {"symbol": "AMZN", "name": "Amazon", "price": 100.0}
        await client.post(
            "/portfolio/orders",
            json={"symbol": "AMZN", "side": "buy", "quantity": 3},
            headers={"Authorization": f"Bearer {token}"},
        )
        resp = await client.post(
            "/portfolio/orders",
            json={"symbol": "AMZN", "side": "sell", "quantity": 3},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert resp.status_code == 201
    assert resp.json()["positions"] == []


async def test_get_trades_returns_history(client: AsyncClient):
    token = await _register_and_login(client)
    with patch("app.routers.portfolio.get_asset") as mock:
        mock.return_value = {"symbol": "NVDA", "name": "Nvidia", "price": 500.0}
        await client.post(
            "/portfolio/orders",
            json={"symbol": "NVDA", "side": "buy", "quantity": 2},
            headers={"Authorization": f"Bearer {token}"},
        )
    resp = await client.get("/portfolio/trades", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    trades = resp.json()
    assert len(trades) == 1
    assert trades[0]["symbol"] == "NVDA"
    assert trades[0]["side"] == "buy"


async def test_reset_clears_portfolio(client: AsyncClient):
    token = await _register_and_login(client)
    with patch("app.routers.portfolio.get_asset") as mock:
        mock.return_value = {"symbol": "AAPL", "name": "Apple", "price": 100.0}
        await client.post(
            "/portfolio/orders",
            json={"symbol": "AAPL", "side": "buy", "quantity": 5},
            headers={"Authorization": f"Bearer {token}"},
        )
    resp = await client.delete("/portfolio/reset", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 204

    portfolio_resp = await client.get("/portfolio", headers={"Authorization": f"Bearer {token}"})
    data = portfolio_resp.json()
    assert data["positions"] == []
    assert float(data["cash_balance"]) == pytest.approx(10000.0)


async def test_unknown_asset_returns_404(client: AsyncClient):
    token = await _register_and_login(client)
    with patch("app.routers.portfolio.get_asset") as mock:
        mock.return_value = None
        resp = await client.post(
            "/portfolio/orders",
            json={"symbol": "UNKNOWN", "side": "buy", "quantity": 1},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert resp.status_code == 404
