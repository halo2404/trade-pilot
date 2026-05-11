# API.md – TradePilot API-Routen

**Base URL:** `http://localhost:8000` (lokal)  
**Format:** JSON  
**Auth:** Bearer Token (JWT) im `Authorization`-Header  

FastAPI generiert automatisch interaktive API-Dokumentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Authentifizierung

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| POST | `/auth/register` | Nein | Neuen Nutzer registrieren |
| POST | `/auth/login` | Nein | Login, JWT zurückgeben |
| POST | `/auth/logout` | Ja | Session beenden |
| GET | `/auth/me` | Ja | Eigenes Profil abrufen |
| POST | `/auth/refresh` | Nein | Access Token erneuern |
| POST | `/auth/forgot-password` | Nein | Passwort-Reset anfordern |
| POST | `/auth/reset-password` | Nein | Passwort zurücksetzen |

---

## Nutzer

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/users/me` | Ja | Eigenes Profil |
| PATCH | `/users/me` | Ja | Profil aktualisieren |
| DELETE | `/users/me` | Ja | Account löschen |

---

## Watchlisten

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/watchlists` | Ja | Alle eigenen Watchlisten |
| POST | `/watchlists` | Ja | Neue Watchlist erstellen |
| GET | `/watchlists/{id}` | Ja | Einzelne Watchlist |
| DELETE | `/watchlists/{id}` | Ja | Watchlist löschen |
| GET | `/watchlists/{id}/items` | Ja | Assets in Watchlist |
| POST | `/watchlists/{id}/items` | Ja | Asset hinzufügen |
| DELETE | `/watchlists/{id}/items/{symbol}` | Ja | Asset entfernen |

---

## Assets & Marktdaten

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/assets/search?q={query}` | Ja | Assets suchen |
| GET | `/assets/{symbol}` | Ja | Asset-Details |
| GET | `/assets/{symbol}/price` | Ja | Aktueller Kurs |
| GET | `/charts/{symbol}?range={range}` | Ja | Chart-Daten (OHLCV) |

**Gültige `range`-Werte:** `1d`, `1w`, `1m`, `3m`, `1y`, `max`

---

## Paper Trading

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/paper-trading/portfolio` | Ja | Eigenes simuliertes Portfolio |
| POST | `/paper-trading/orders` | Ja | Order simulieren (Kauf/Verkauf) |
| GET | `/paper-trading/trades` | Ja | Trade-Journal |
| GET | `/paper-trading/performance` | Ja | Performance-Übersicht |
| POST | `/paper-trading/reset` | Ja | Portfolio zurücksetzen |

---

## Lernmodule

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/learning/modules` | Nein | Alle Module |
| GET | `/learning/modules/{id}` | Nein | Einzelnes Modul mit Lektionen |
| GET | `/learning/modules/{id}/progress` | Ja | Eigener Fortschritt |
| POST | `/learning/lessons/{id}/complete` | Ja | Lektion als abgeschlossen markieren |
| GET | `/learning/quiz/{id}` | Ja | Quiz-Fragen |
| POST | `/learning/quiz/{id}/submit` | Ja | Quiz einreichen |
| GET | `/learning/glossary` | Nein | Glossar |

---

## KI-Assistent

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| POST | `/ai/chat` | Ja | Nachricht senden, Antwort erhalten |
| GET | `/ai/conversations` | Ja | Chat-Verlauf |
| DELETE | `/ai/conversations` | Ja | Chat-Verlauf löschen |

**Wichtig:** Jede Antwort des KI-Assistenten zu Finanzthemen enthält automatisch einen Disclaimer.

---

## Admin (nur `admin`-Rolle)

| Methode | Route | Auth | Beschreibung |
|---|---|---|---|
| GET | `/admin/users` | Admin | Alle Nutzer |
| PATCH | `/admin/users/{id}` | Admin | Nutzer aktualisieren |
| DELETE | `/admin/users/{id}` | Admin | Nutzer sperren/löschen |
| GET | `/admin/learning/modules` | Admin | Module verwalten |
| POST | `/admin/learning/modules` | Admin | Modul erstellen |
| PATCH | `/admin/learning/modules/{id}` | Admin | Modul aktualisieren |
| GET | `/admin/status` | Admin | Systemstatus |

---

## Fehler-Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "E-Mail-Adresse ist ungültig.",
    "details": [...]
  }
}
```

| HTTP-Status | Bedeutung |
|---|---|
| 200 | OK |
| 201 | Erstellt |
| 400 | Ungültige Anfrage |
| 401 | Nicht authentifiziert |
| 403 | Keine Berechtigung |
| 404 | Nicht gefunden |
| 422 | Validierungsfehler |
| 429 | Rate Limit überschritten |
| 500 | Serverfehler |
