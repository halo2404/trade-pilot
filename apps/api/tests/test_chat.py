from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient


async def _auth(client: AsyncClient, email: str = "chatter@example.com") -> str:
    await client.post("/auth/register", json={"email": email, "password": "sicher123"})
    resp = await client.post("/auth/login", json={"email": email, "password": "sicher123"})
    return resp.json()["access_token"]


@pytest.fixture(autouse=True)
def skip_rate_limit(monkeypatch):
    monkeypatch.setattr("app.routers.auth.check_rate_limit", AsyncMock(return_value=None))


# ── Sessions ──────────────────────────────────────────────────────────

async def test_list_sessions_empty(client: AsyncClient):
    token = await _auth(client)
    resp = await client.get("/chat/sessions", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json() == []


async def test_create_session(client: AsyncClient):
    token = await _auth(client)
    resp = await client.post("/chat/sessions", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 201
    data = resp.json()
    assert "id" in data
    assert data["title"] == "Neue Unterhaltung"


async def test_sessions_isolated_between_users(client: AsyncClient):
    token_a = await _auth(client, "a@chat.com")
    token_b = await _auth(client, "b@chat.com")

    await client.post("/chat/sessions", headers={"Authorization": f"Bearer {token_a}"})

    resp = await client.get("/chat/sessions", headers={"Authorization": f"Bearer {token_b}"})
    assert resp.json() == []


async def test_delete_session(client: AsyncClient):
    token = await _auth(client)
    create_resp = await client.post("/chat/sessions", headers={"Authorization": f"Bearer {token}"})
    session_id = create_resp.json()["id"]

    del_resp = await client.delete(f"/chat/sessions/{session_id}", headers={"Authorization": f"Bearer {token}"})
    assert del_resp.status_code == 204

    list_resp = await client.get("/chat/sessions", headers={"Authorization": f"Bearer {token}"})
    assert list_resp.json() == []


async def test_delete_other_users_session_returns_404(client: AsyncClient):
    token_a = await _auth(client, "owner@chat.com")
    token_b = await _auth(client, "thief@chat.com")

    create_resp = await client.post("/chat/sessions", headers={"Authorization": f"Bearer {token_a}"})
    session_id = create_resp.json()["id"]

    resp = await client.delete(f"/chat/sessions/{session_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert resp.status_code == 404


# ── Messages ──────────────────────────────────────────────────────────

async def test_get_messages_empty(client: AsyncClient):
    token = await _auth(client)
    create_resp = await client.post("/chat/sessions", headers={"Authorization": f"Bearer {token}"})
    session_id = create_resp.json()["id"]

    resp = await client.get(f"/chat/sessions/{session_id}/messages", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json() == []


async def _mock_ai_stream(history):
    """Yields a minimal SSE stream without calling the real AI."""
    import json
    yield f"data: {json.dumps({'type': 'token', 'content': 'Hallo '})}\n\n".encode()
    yield f"data: {json.dumps({'type': 'token', 'content': 'Welt!'})}\n\n".encode()
    yield f"data: {json.dumps({'type': 'done'})}\n\n".encode()


async def test_send_message_streams_response(client: AsyncClient):
    token = await _auth(client)
    create_resp = await client.post("/chat/sessions", headers={"Authorization": f"Bearer {token}"})
    session_id = create_resp.json()["id"]

    with patch("app.routers.chat.stream_ai_response") as mock_stream:
        import json

        async def _gen(history):
            yield f"data: {json.dumps({'type': 'token', 'content': 'Test '})}\n\n"
            yield f"data: {json.dumps({'type': 'token', 'content': 'Antwort'})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        mock_stream.side_effect = _gen

        resp = await client.post(
            f"/chat/sessions/{session_id}/messages",
            json={"content": "Was ist eine Aktie?"},
            headers={"Authorization": f"Bearer {token}"},
        )

    assert resp.status_code == 200
    assert "text/event-stream" in resp.headers["content-type"]
    body = resp.content.decode()
    assert "token" in body


async def test_send_message_updates_session_title(client: AsyncClient):
    token = await _auth(client)
    create_resp = await client.post("/chat/sessions", headers={"Authorization": f"Bearer {token}"})
    session_id = create_resp.json()["id"]

    with patch("app.routers.chat.stream_ai_response") as mock_stream:
        import json

        async def _gen(history):
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        mock_stream.side_effect = _gen

        await client.post(
            f"/chat/sessions/{session_id}/messages",
            json={"content": "Was bedeutet Diversifikation?"},
            headers={"Authorization": f"Bearer {token}"},
        )

    sessions_resp = await client.get("/chat/sessions", headers={"Authorization": f"Bearer {token}"})
    session = next(s for s in sessions_resp.json() if s["id"] == session_id)
    assert session["title"] == "Was bedeutet Diversifikation?"


async def test_get_messages_after_sending(client: AsyncClient):
    token = await _auth(client)
    create_resp = await client.post("/chat/sessions", headers={"Authorization": f"Bearer {token}"})
    session_id = create_resp.json()["id"]

    with patch("app.routers.chat.stream_ai_response") as mock_stream:
        import json

        async def _gen(history):
            yield f"data: {json.dumps({'type': 'token', 'content': 'Antwort'})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        mock_stream.side_effect = _gen

        await client.post(
            f"/chat/sessions/{session_id}/messages",
            json={"content": "Erkläre RSI"},
            headers={"Authorization": f"Bearer {token}"},
        )

    msgs_resp = await client.get(
        f"/chat/sessions/{session_id}/messages",
        headers={"Authorization": f"Bearer {token}"},
    )
    messages = msgs_resp.json()
    assert len(messages) >= 1
    assert messages[0]["role"] == "user"
    assert messages[0]["content"] == "Erkläre RSI"


async def test_get_messages_unauthorized_session(client: AsyncClient):
    token_a = await _auth(client, "owner2@chat.com")
    token_b = await _auth(client, "spy@chat.com")

    create_resp = await client.post("/chat/sessions", headers={"Authorization": f"Bearer {token_a}"})
    session_id = create_resp.json()["id"]

    resp = await client.get(
        f"/chat/sessions/{session_id}/messages",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert resp.status_code == 404
