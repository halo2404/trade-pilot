# ARCHITECTURE.md – TradePilot Systemarchitektur

**Version:** 0.1 (MVP)

---

## Überblick

TradePilot ist als **Monorepo** mit klar getrennten Schichten organisiert:

```
Browser (Next.js) ←→ FastAPI Backend ←→ PostgreSQL
                              ↕
                           Redis (Cache)
                              ↕
                       External APIs (Marktdaten, KI)
```

---

## Monorepo-Struktur

```
tradepilot/
├── apps/
│   ├── web/          # Next.js 14 Frontend (App Router)
│   └── api/          # FastAPI Backend
├── packages/
│   ├── ui/           # Geteilte shadcn/ui-Komponenten
│   ├── config/       # ESLint, TypeScript, Tailwind Configs
│   ├── types/        # Geteilte TypeScript-Interfaces
│   └── utils/        # Geteilte Hilfsfunktionen (Formatierung, Validierung)
├── docs/
├── infra/
│   ├── docker/       # Dockerfiles
│   └── github-actions/ # CI/CD Workflows
└── tests/            # E2E-Tests (Playwright)
```

---

## Frontend (apps/web/)

**Framework:** Next.js 14 (App Router)  
**Sprache:** TypeScript  
**Styling:** Tailwind CSS + shadcn/ui  
**Charts:** Recharts oder Lightweight Charts  
**State:** React Query (Server State) + Zustand (Client State)  
**Auth:** next-auth oder eigene JWT-Integration  

### Seitenstruktur

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (app)/
│   ├── dashboard/
│   ├── watchlist/
│   ├── chart/[symbol]/
│   ├── paper-trading/
│   ├── learning/
│   │   └── [module]/
│   ├── ai-assistant/
│   └── settings/
└── (admin)/
    └── admin/
```

---

## Backend (apps/api/)

**Framework:** FastAPI  
**Sprache:** Python 3.12+  
**ORM:** SQLAlchemy 2.x (async)  
**Validierung:** Pydantic v2  
**Auth:** JWT (python-jose) + bcrypt  
**Cache:** Redis (aioredis)  
**DB-Migrationen:** Alembic  

### Router-Struktur

```
routers/
├── auth.py          # /auth/*
├── users.py         # /users/*
├── watchlists.py    # /watchlists/*
├── assets.py        # /assets/*
├── charts.py        # /charts/*
├── paper_trading.py # /paper-trading/*
├── learning.py      # /learning/*
├── ai_chat.py       # /ai/*
└── admin.py         # /admin/*
```

---

## Datenbank (PostgreSQL)

### Kern-Entitäten

| Tabelle | Beschreibung |
|---|---|
| `users` | Nutzerkonten |
| `roles` | Rollendefinitionen (free, premium, admin) |
| `watchlists` | Nutzerspezifische Watchlisten |
| `watchlist_items` | Assets in einer Watchlist |
| `assets` | Asset-Metadaten (Symbol, Name, Typ) |
| `market_prices` | Gecachte Marktpreise |
| `paper_portfolios` | Simuliertes Portfolio pro Nutzer |
| `paper_trades` | Einzelne simulierte Trades |
| `learning_modules` | Lernmodule |
| `lessons` | Einzelne Lektionen |
| `quizzes` | Quiz-Fragen |
| `quiz_answers` | Mögliche Antworten |
| `user_progress` | Lernfortschritt pro Nutzer |
| `ai_conversations` | KI-Chat-Verlauf |
| `audit_logs` | Sicherheits-Audit-Trail |

### Konventionen
- `id`: UUID (primärer Schlüssel)
- `created_at`, `updated_at`: Timestamp (automatisch)
- Soft Delete via `deleted_at` wo sinnvoll

---

## Caching (Redis)

| Key-Pattern | Inhalt | TTL |
|---|---|---|
| `asset:{symbol}:price` | Aktueller Kurs | 60s |
| `asset:{symbol}:chart:{range}` | Chart-Daten | 5 min |
| `session:{token}` | Nutzer-Session | 60 min |
| `rate_limit:{ip}` | Rate-Limit-Counter | 1 min |

---

## Externe APIs (geplant)

| Service | Zweck |
|---|---|
| Alpha Vantage / Polygon.io | Marktdaten, Kurse, Charts |
| OpenAI / Anthropic | KI-Assistent |
| SendGrid / Mailgun | Transaktions-E-Mails |

Im MVP können Mock-Daten verwendet werden.

---

## Authentifizierung & Autorisierung

```
POST /auth/register → bcrypt-Hash → DB → JWT zurückgeben
POST /auth/login    → Passwort prüfen → JWT + Refresh Token
GET  /auth/me       → JWT validieren → Nutzer zurückgeben
```

- Access Token: 60 Minuten
- Refresh Token: 7 Tage (in HttpOnly Cookie)
- Rollenprüfung als FastAPI-Dependency

---

## Deployment (geplant)

**Lokal:** Docker Compose (db + redis + api + web)  
**Staging/Prod:** Docker-Container auf VPS oder Cloud-Provider  
**CI/CD:** GitHub Actions (Lint → Test → Build → Deploy)
