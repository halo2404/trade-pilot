# API.md – TradePilot API-Referenz

**Base URL:** `http://localhost:8000`  
**Format:** JSON  
**Auth:** `Authorization: Bearer <access_token>`

FastAPI generiert interaktive Dokumentation (nur in development/staging):
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Authentifizierung `/auth`

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| POST | `/auth/register` | Nein | Neuen Nutzer anlegen |
| POST | `/auth/login` | Nein | Login → JWT + Refresh Token |
| POST | `/auth/logout` | Ja | Refresh Token invalidieren |
| GET | `/auth/me` | Ja | Eigenes Profil abrufen |
| POST | `/auth/refresh` | Nein | Access Token erneuern |
| POST | `/auth/forgot-password` | Nein | Reset-Link anfordern (immer 204) |
| POST | `/auth/reset-password` | Nein | Passwort mit Token zurücksetzen |

**Register-Body:**
```json
{ "email": "user@example.com", "password": "min8Zeichen", "full_name": "Max Muster" }
```
**Login-Response:**
```json
{ "access_token": "...", "refresh_token": "...", "token_type": "bearer" }
```

---

## Assets & Charts `/assets`

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/assets/search?q={query}` | Ja | Assets suchen (Symbol, Name) |
| GET | `/assets/{symbol}` | Ja | Asset-Details (Kurs, 24h-Änderung) |
| GET | `/assets/{symbol}/chart?period={p}` | Ja | OHLCV-Chart-Daten |

**Gültige `period`-Werte:** `1d` · `1w` · `1m` · `3m` · `1y` · `max`

**Chart-Response:**
```json
{
  "symbol": "AAPL",
  "period": "1m",
  "data": [{ "date": "2025-04-12", "open": 170.0, "high": 175.5, "low": 169.0, "close": 174.2, "volume": 52000000 }]
}
```

---

## Watchlist `/watchlist`

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/watchlist` | Ja | Eigene Watchlist (mit aktuellem Kurs) |
| POST | `/watchlist` | Ja | Asset hinzufügen `{ "symbol": "AAPL" }` |
| DELETE | `/watchlist/{symbol}` | Ja | Asset entfernen |

---

## Paper Trading `/portfolio`

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/portfolio` | Ja | Portfolio inkl. Positionen & P&L |
| POST | `/portfolio/orders` | Ja | Order aufgeben |
| GET | `/portfolio/trades` | Ja | Trade-Journal (limit/offset) |
| DELETE | `/portfolio/reset` | Ja | Portfolio zurücksetzen |

**Order-Body:**
```json
{ "symbol": "AAPL", "side": "buy", "quantity": 5.0 }
```
`side`: `"buy"` | `"sell"`

**Portfolio-Response (Auszug):**
```json
{
  "cash_balance": "8500.0000",
  "total_value": 10250.0,
  "total_pnl": 250.0,
  "total_pnl_pct": 2.5,
  "positions": [{ "symbol": "AAPL", "quantity": "10.0", "avg_cost": "150.0", "pnl": 250.0 }]
}
```

---

## Lernmodule `/learning`

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/learning/modules` | Ja | Alle Module mit Fortschritt |
| GET | `/learning/modules/{id}` | Ja | Modul-Detail mit Lektionsliste |
| GET | `/learning/lessons/{id}` | Ja | Lektion (inkl. Markdown-Inhalt) |
| POST | `/learning/lessons/{id}/complete` | Ja | Lektion als abgeschlossen markieren |
| GET | `/learning/modules/{id}/quiz` | Ja | Quiz-Fragen (ohne `correct_index`) |
| POST | `/learning/modules/{id}/quiz` | Ja | Quiz einreichen |
| GET | `/learning/modules/{id}/quiz/attempts` | Ja | Eigene Versuche (letzte 10) |
| GET | `/learning/glossary` | Ja | Alle Glossar-Einträge (alphabetisch) |

**Quiz-Submit-Body:**
```json
{ "answers": [1, 0, 2] }
```

**Quiz-Result-Response (Auszug):**
```json
{
  "score": 2,
  "total": 3,
  "passed": true,
  "items": [{ "question": "...", "correct": true, "explanation": "..." }]
}
```

---

## KI-Assistent `/chat`

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/chat/sessions` | Ja | Eigene Chat-Sessions (letzte 30) |
| POST | `/chat/sessions` | Ja | Neue Chat-Session anlegen |
| DELETE | `/chat/sessions/{id}` | Ja | Session löschen |
| GET | `/chat/sessions/{id}/messages` | Ja | Nachrichten einer Session |
| POST | `/chat/sessions/{id}/messages` | Ja | Nachricht senden → **SSE-Stream** |

**Nachricht senden:**
```json
{ "content": "Was ist ein gleitender Durchschnitt?" }
```

**Stream-Response** (`Content-Type: text/event-stream`):
```
data: {"type": "token", "content": "Ein "}
data: {"type": "token", "content": "gleitender..."}
data: {"type": "done"}
```

> Jede Antwort des KI-Assistenten enthält einen Bildungs-Disclaimer. Es werden keine Anlageempfehlungen gegeben.

---

## System

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/health` | Nein | Systemstatus `{ "status": "ok", "env": "..." }` |

---

## Fehler-Format

```json
{ "detail": "Fehlerbeschreibung als String" }
```

| HTTP-Status | Bedeutung |
|---|---|
| 200 | OK |
| 201 | Erstellt |
| 204 | Kein Inhalt (Erfolg ohne Body) |
| 400 | Ungültige Anfrage (z.B. zu wenig Kapital) |
| 401 | Nicht authentifiziert |
| 403 | Keine Berechtigung |
| 404 | Ressource nicht gefunden |
| 409 | Konflikt (z.B. Duplikat in Watchlist) |
| 422 | Validierungsfehler (Pydantic) |
| 429 | Rate Limit überschritten |
| 500 | Interner Serverfehler |
