"""Anthropic AI client with educational safety guardrails.

Falls back to a mock stream when ANTHROPIC_API_KEY is not configured,
so the app remains runnable without a key in development.
"""
import asyncio
import json
from collections.abc import AsyncGenerator

from app.core.config import settings

SYSTEM_PROMPT = """Du bist der TradePilot KI-Assistent – ein intelligenter Bildungs-Bot für Börsen- und Finanzthemen auf der TradePilot-Lernplattform.

DEINE ROLLE:
- Du erklärst Finanz- und Börsenkonzepte verständlich und lehrreich
- Du hilfst beim Verstehen von Charts, technischen Indikatoren und Handelsstrategien
- Du beantwortest Fragen zu den Lernmodulen der Plattform (Grundlagen, Technische Analyse, Risikomanagement)
- Du kannst Paper-Trading-Ergebnisse des Nutzers kommentieren und erklären

STRIKTE GRENZEN – KEINE AUSNAHMEN:
- Du gibst KEINE personalisierten Anlageempfehlungen
- Du sagst NICHT "kaufe Aktie X" oder "verkaufe jetzt"
- Du machst KEINE konkreten Kursprognosen oder Kauf-/Verkauf-Empfehlungen
- Du gibst KEINE steuerlichen oder rechtlichen Ratschläge
- Wenn jemand nach konkreten Empfehlungen fragt: erkläre freundlich den Bildungscharakter der Plattform und empfehle einen zugelassenen Finanzberater

STIL:
- Antworte auf Deutsch (oder der Sprache des Nutzers)
- Klar, präzise, lehrreich – wie ein geduldiger Lehrer
- Nutze Beispiele und Analogien, um Konzepte greifbar zu machen
- Halte Antworten prägnant (maximal 300–400 Wörter, außer bei komplexen Themen)

DISCLAIMER: TradePilot ist eine Bildungsplattform. Keine Inhalte stellen eine Anlageberatung dar."""

MOCK_RESPONSES = [
    "Ich bin der TradePilot KI-Assistent. Dein ANTHROPIC_API_KEY ist noch nicht konfiguriert – dies ist eine Demo-Antwort.\n\nSobald du einen API-Key in deiner `.env` einträgst (`ANTHROPIC_API_KEY=sk-ant-...`), beantworte ich deine Fragen zu Börse, Charts und Risikomanagement.\n\n**Hinweis:** TradePilot ist eine Bildungsplattform. Keine Inhalte stellen eine Anlageberatung dar.",
]


async def stream_ai_response(
    history: list[dict[str, str]],
) -> AsyncGenerator[str, None]:
    """Yield SSE-formatted chunks: data: {...}\\n\\n"""

    if not settings.ANTHROPIC_API_KEY:
        yield from _mock_stream()
        return

    try:
        import anthropic  # imported lazily so the app starts without the package

        client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        async with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=history,
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps({'type': 'token', 'content': text})}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except ImportError:
        yield f"data: {json.dumps({'type': 'error', 'message': 'anthropic-Paket nicht installiert. Führe pip install anthropic aus.'})}\n\n"
    except Exception as exc:
        yield f"data: {json.dumps({'type': 'error', 'message': str(exc)})}\n\n"


def _mock_stream() -> list[str]:
    chunks = []
    text = MOCK_RESPONSES[0]
    # Simulate token-by-token for the mock
    for word in text.split(" "):
        chunks.append(f"data: {json.dumps({'type': 'token', 'content': word + ' '})}\n\n")
    chunks.append(f"data: {json.dumps({'type': 'done'})}\n\n")
    return chunks
