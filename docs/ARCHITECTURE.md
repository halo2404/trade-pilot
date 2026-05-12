# ARCHITECTURE.md – TradePilot Systemarchitektur

**Version:** 1.0 (MVP implementiert)

---

## Überblick

```
Browser (Next.js 16) ←─── HTTP/SSE ───→ FastAPI Backend ←──→ PostgreSQL
                                               ↕
                                         Redis (Rate Limit)
                                               ↕
                                    Anthropic Claude API (KI-Assistent)
```

---

## Monorepo-Struktur (Ist-Stand)

```
tradepilot/
├── apps/
│   ├── api/                      # FastAPI Backend
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── config.py     # Pydantic Settings (.env)
│   │   │   │   ├── database.py   # AsyncSessionLocal, engine, Base
│   │   │   │   ├── deps.py       # get_current_user, require_admin
│   │   │   │   ├── redis.py      # Verbindungsmanagement
│   │   │   │   ├── security.py   # JWT, bcrypt
│   │   │   │   └── rate_limit.py # Redis-basiertes Rate Limiting
│   │   │   ├── models/
│   │   │   │   ├── user.py       # User, UserRole, AuditLog
│   │   │   │   ├── watchlist.py  # WatchlistItem
│   │   │   │   ├── portfolio.py  # Portfolio, Position, Trade
│   │   │   │   ├── learning.py   # LearningModule, Lesson, UserLessonProgress,
│   │   │   │   │                 # QuizQuestion, QuizAttempt, GlossaryEntry
│   │   │   │   └── chat.py       # ChatSession, ChatMessage
│   │   │   ├── schemas/          # Pydantic v2 Request/Response-Schemas
│   │   │   ├── routers/
│   │   │   │   ├── auth.py       # /auth/*
│   │   │   │   ├── assets.py     # /assets/*
│   │   │   │   ├── charts.py     # /assets/{symbol}/chart
│   │   │   │   ├── watchlist.py  # /watchlist
│   │   │   │   ├── portfolio.py  # /portfolio/*
│   │   │   │   ├── learning.py   # /learning/*
│   │   │   │   └── chat.py       # /chat/*
│   │   │   ├── services/
│   │   │   │   └── ai_client.py  # Anthropic-Stream + Fallback-Mock
│   │   │   └── data/
│   │   │       ├── mock_assets.py   # 40+ Mock-Assets
│   │   │       ├── mock_ohlcv.py    # OHLCV-Zeitreihendaten
│   │   │       └── seed_learning.py # 3 Module, 9 Lektionen, Quiz, Glossar
│   │   ├── alembic/
│   │   │   └── versions/
│   │   │       ├── 0001_initial_users.py
│   │   │       ├── 0002_watchlist.py
│   │   │       ├── 0003_portfolio.py
│   │   │       ├── 0004_learning.py
│   │   │       └── 0005_chat.py
│   │   └── tests/
│   │       ├── conftest.py       # SQLite-Testdatenbank, Redis-Mock
│   │       ├── test_auth.py
│   │       ├── test_security.py
│   │       ├── test_portfolio.py
│   │       ├── test_watchlist.py
│   │       ├── test_learning.py
│   │       └── test_chat.py
│   └── web/                      # Next.js 16 Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/login, register, ...
│       │   │   ├── (app)/dashboard, watchlist, chart/[symbol],
│       │   │   │         paper-trading, learning/*, ai-assistant
│       │   │   └── (public)/impressum, datenschutz, agb
│       │   ├── components/ui/    # shadcn/ui-Komponenten
│       │   └── lib/
│       │       ├── api.ts        # axios-Instanz + Auth-Interceptor
│       │       ├── auth-store.ts
│       │       ├── watchlist-store.ts
│       │       ├── portfolio-store.ts
│       │       ├── learning-store.ts
│       │       ├── chat-store.ts
│       │       └── indicators.ts # SMA, EMA, RSI
│       ├── e2e/                  # Playwright-Tests
│       └── src/__tests__/        # Vitest-Unit-Tests
├── tests/performance/            # Locust-Performance-Tests
├── .github/workflows/ci.yml      # GitHub Actions
├── docker-compose.yml
└── docker-compose.staging.yml
```

---

## Datenbankschema (Ist-Stand)

| Tabelle | Schlüsselfelder | Beschreibung |
|---|---|---|
| `users` | id (UUID), email, role, is_active, deleted_at | Nutzerkonten |
| `audit_logs` | id, user_id→users, action, created_at | Sicherheits-Audit-Trail |
| `watchlist_items` | id, user_id→users, symbol | Watchlist |
| `portfolios` | id, user_id→users, cash_balance, initial_capital | Paper-Portfolio (1:1 pro User) |
| `positions` | id, portfolio_id→portfolios, symbol, quantity, avg_cost | Offene Positionen |
| `trades` | id, portfolio_id→portfolios, symbol, side, quantity, price | Trade-Journal |
| `learning_modules` | id, title, description, order | Lernmodule |
| `lessons` | id, module_id→modules, title, content, order | Lektionen (Markdown) |
| `user_lesson_progress` | id, user_id→users, lesson_id→lessons | Fortschritts-Tracking |
| `quiz_questions` | id, module_id→modules, question, options (JSON), correct_index | Quiz-Fragen |
| `quiz_attempts` | id, user_id→users, module_id→modules, score, total | Quiz-Versuche |
| `glossary_entries` | id, term, definition, order | Finanzglossar |
| `chat_sessions` | id, user_id→users, title, updated_at | Chat-Unterhaltungen |
| `chat_messages` | id, session_id→sessions, role, content | Chat-Nachrichten |

---

## Frontend-Routing

```
/                          → Redirect → /dashboard
/login  /register          → Öffentlich (auth)
/impressum  /datenschutz /agb → Öffentlich (public)

(app) – geschützt durch Middleware (JWT-Cookie):
  /dashboard
  /watchlist
  /chart/[symbol]
  /paper-trading
  /learning
  /learning/[moduleId]
  /learning/[moduleId]/[lessonId]
  /learning/[moduleId]/quiz
  /learning/glossar
  /ai-assistant
```

---

## Authentifizierung

```
POST /auth/register  →  bcrypt-Hash  →  DB  →  JWT-Paar zurückgeben
POST /auth/login     →  Passwort prüfen  →  JWT (60 min) + Refresh (7 Tage)
GET  /auth/me        →  Bearer-Token validieren  →  User zurückgeben
POST /auth/refresh   →  Refresh Token prüfen  →  neues JWT-Paar
```

Frontend speichert Tokens in `localStorage` und setzt `access_token` als Cookie (Middleware-Check).

---

## KI-Assistent (Streaming)

```
POST /chat/sessions/{id}/messages
  → user_msg in DB speichern
  → history aufbauen (letzte 20 Nachrichten)
  → stream_ai_response(history) → Anthropic Claude SSE-Stream
  → StreamingResponse (text/event-stream) an Browser
  → nach Stream: assistant_msg in neuer DB-Session speichern
```

SSE-Datenformat:
```
data: {"type": "token", "content": "Hallo "}
data: {"type": "token", "content": "Welt!"}
data: {"type": "done"}
```

---

## Rate Limiting

Redis-basiert: `{endpoint}:{ip}` als Key, TTL 60 Sekunden.  
Login: max. 5 Versuche/min. Registrierung: max. 3/min.

---

## CI/CD-Pipeline

```
Push → backend-lint (Ruff, mypy)
     → backend-test (pytest, Postgres + Redis als Services)
     → frontend-lint (tsc, eslint)
     → frontend-test (Vitest + Coverage)
     → frontend-build (next build)
     → e2e (Playwright, nur main-Branch)
```

Coverage-Reports werden an Codecov hochgeladen.
