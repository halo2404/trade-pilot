import uuid
from unittest.mock import AsyncMock

import pytest
from httpx import AsyncClient
from sqlalchemy import insert

from tests.conftest import TestSessionLocal
from app.models.learning import GlossaryEntry, Lesson, LearningModule, QuizQuestion


# ── Helpers ───────────────────────────────────────────────────────────

async def _auth(client: AsyncClient, email: str = "learner@example.com") -> str:
    await client.post("/auth/register", json={"email": email, "password": "sicher123"})
    resp = await client.post("/auth/login", json={"email": email, "password": "sicher123"})
    return resp.json()["access_token"]


async def _seed_module(title: str = "Testmodul") -> tuple[str, str, str]:
    """Returns (module_id, lesson1_id, lesson2_id)."""
    async with TestSessionLocal() as db:
        mod = LearningModule(title=title, description="Test Beschreibung", order=1)
        db.add(mod)
        await db.flush()

        l1 = Lesson(module_id=mod.id, title="Lektion 1", content="# Inhalt\nText", order=1)
        l2 = Lesson(module_id=mod.id, title="Lektion 2", content="Mehr Inhalt", order=2)
        db.add(l1)
        db.add(l2)

        q = QuizQuestion(
            module_id=mod.id,
            question="Was ist 1+1?",
            options=["1", "2", "3", "4"],
            correct_index=1,
            explanation="1+1 ergibt 2.",
            order=1,
        )
        db.add(q)

        g = GlossaryEntry(term="Aktie", definition="Ein Anteilsschein.", order=1)
        db.add(g)

        await db.commit()
        return str(mod.id), str(l1.id), str(l2.id)


@pytest.fixture(autouse=True)
def skip_rate_limit(monkeypatch):
    monkeypatch.setattr("app.routers.auth.check_rate_limit", AsyncMock(return_value=None))


# ── Module list ───────────────────────────────────────────────────────

async def test_list_modules_empty(client: AsyncClient):
    token = await _auth(client)
    resp = await client.get("/learning/modules", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json() == []


async def test_list_modules_with_data(client: AsyncClient):
    await _seed_module("Grundlagen")
    token = await _auth(client)
    resp = await client.get("/learning/modules", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    modules = resp.json()
    assert len(modules) == 1
    assert modules[0]["title"] == "Grundlagen"
    assert modules[0]["lesson_count"] == 2
    assert modules[0]["completed_count"] == 0
    assert modules[0]["has_quiz"] is True


async def test_get_module_detail(client: AsyncClient):
    mod_id, l1_id, _ = await _seed_module()
    token = await _auth(client)
    resp = await client.get(f"/learning/modules/{mod_id}", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == mod_id
    assert len(data["lessons"]) == 2
    assert data["lessons"][0]["completed"] is False


async def test_get_module_not_found(client: AsyncClient):
    token = await _auth(client)
    resp = await client.get(f"/learning/modules/{uuid.uuid4()}", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 404


# ── Lessons ───────────────────────────────────────────────────────────

async def test_get_lesson(client: AsyncClient):
    _, l1_id, _ = await _seed_module()
    token = await _auth(client)
    resp = await client.get(f"/learning/lessons/{l1_id}", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Lektion 1"
    assert data["completed"] is False


async def test_complete_lesson(client: AsyncClient):
    _, l1_id, _ = await _seed_module()
    token = await _auth(client)

    resp = await client.post(
        f"/learning/lessons/{l1_id}/complete",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 204

    # Verify lesson is now completed
    lesson_resp = await client.get(f"/learning/lessons/{l1_id}", headers={"Authorization": f"Bearer {token}"})
    assert lesson_resp.json()["completed"] is True


async def test_complete_lesson_idempotent(client: AsyncClient):
    _, l1_id, _ = await _seed_module()
    token = await _auth(client)
    await client.post(f"/learning/lessons/{l1_id}/complete", headers={"Authorization": f"Bearer {token}"})
    resp = await client.post(f"/learning/lessons/{l1_id}/complete", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 204


async def test_progress_counts_update(client: AsyncClient):
    mod_id, l1_id, _ = await _seed_module()
    token = await _auth(client)

    await client.post(f"/learning/lessons/{l1_id}/complete", headers={"Authorization": f"Bearer {token}"})

    resp = await client.get(f"/learning/modules/{mod_id}", headers={"Authorization": f"Bearer {token}"})
    assert resp.json()["completed_count"] == 1


async def test_progress_isolated_between_users(client: AsyncClient):
    _, l1_id, _ = await _seed_module()
    token_a = await _auth(client, "a@learning.com")
    token_b = await _auth(client, "b@learning.com")

    await client.post(f"/learning/lessons/{l1_id}/complete", headers={"Authorization": f"Bearer {token_a}"})

    resp = await client.get(f"/learning/lessons/{l1_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert resp.json()["completed"] is False


# ── Quiz ──────────────────────────────────────────────────────────────

async def test_get_quiz_questions(client: AsyncClient):
    mod_id, _, _ = await _seed_module()
    token = await _auth(client)
    resp = await client.get(f"/learning/modules/{mod_id}/quiz", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    questions = resp.json()
    assert len(questions) == 1
    assert questions[0]["question"] == "Was ist 1+1?"
    # correct_index must NOT be exposed
    assert "correct_index" not in questions[0]


async def test_submit_quiz_correct(client: AsyncClient):
    mod_id, _, _ = await _seed_module()
    token = await _auth(client)
    resp = await client.post(
        f"/learning/modules/{mod_id}/quiz",
        json={"answers": [1]},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    result = resp.json()
    assert result["score"] == 1
    assert result["total"] == 1
    assert result["passed"] is True
    assert result["items"][0]["correct"] is True


async def test_submit_quiz_wrong(client: AsyncClient):
    mod_id, _, _ = await _seed_module()
    token = await _auth(client)
    resp = await client.post(
        f"/learning/modules/{mod_id}/quiz",
        json={"answers": [0]},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    result = resp.json()
    assert result["score"] == 0
    assert result["passed"] is False
    assert result["items"][0]["correct"] is False
    assert result["items"][0]["correct_index"] == 1
    assert "1+1" in result["items"][0]["explanation"]


async def test_submit_quiz_wrong_answer_count(client: AsyncClient):
    mod_id, _, _ = await _seed_module()
    token = await _auth(client)
    resp = await client.post(
        f"/learning/modules/{mod_id}/quiz",
        json={"answers": [1, 0]},  # 2 answers for 1 question
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 400


async def test_quiz_attempts_saved(client: AsyncClient):
    mod_id, _, _ = await _seed_module()
    token = await _auth(client)
    await client.post(f"/learning/modules/{mod_id}/quiz", json={"answers": [1]}, headers={"Authorization": f"Bearer {token}"})
    resp = await client.get(f"/learning/modules/{mod_id}/quiz/attempts", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert len(resp.json()) == 1


# ── Glossary ──────────────────────────────────────────────────────────

async def test_glossary_returns_entries(client: AsyncClient):
    await _seed_module()  # seeds a glossary entry too
    token = await _auth(client)
    resp = await client.get("/learning/glossary", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    entries = resp.json()
    assert any(e["term"] == "Aktie" for e in entries)
