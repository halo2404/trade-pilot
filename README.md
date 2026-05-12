# TradePilot

> Eine anfängerfreundliche Trading-, Marktanalyse- und Lernplattform.

TradePilot hilft Menschen, Finanzmärkte zu verstehen – ohne echtes Geld zu riskieren. Die Plattform bietet interaktive Charts, eine Watchlist, Paper Trading mit virtuellem Kapital, strukturierte Lernmodule und einen KI-gestützten Bildungs-Assistenten.

> **Wichtiger Hinweis:** TradePilot ist ausschließlich zu **Bildungszwecken**. Es wird keine Anlageberatung angeboten. Paper Trading ist eine Simulation – es wird kein echtes Geld eingesetzt.

---

## Feature-Status (MVP)

| Feature | Status |
|---|---|
| Benutzerkonten (Register, Login, JWT, Refresh, Passwort-Reset) | ✅ Implementiert |
| Dashboard | ✅ Implementiert |
| Watchlist (40+ Assets: Aktien, ETFs, Krypto) | ✅ Implementiert |
| Charts mit Zeitraum-Auswahl (1T–Max) | ✅ Implementiert |
| Technische Indikatoren (SMA, EMA, RSI) | ✅ Implementiert |
| Paper Trading (Kauf/Verkauf, WACC, Trade-Journal) | ✅ Implementiert |
| Lernmodule (3 Module, 9 Lektionen, Quiz, Glossar) | ✅ Implementiert |
| KI-Assistent (Anthropic Claude, Streaming, Verlauf) | ✅ Implementiert |
| Rechtliche Seiten (Impressum, Datenschutz, AGB) | ✅ Implementiert |
| Dark Mode | ✅ Implementiert |
| Tests (pytest, Vitest, Playwright) + CI/CD | ✅ Implementiert |

---

## Tech Stack

| Schicht | Technologie |
|---|---|
| **Frontend** | Next.js 16 · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Recharts · Zustand |
| **Backend** | Python 3.12 · FastAPI · PostgreSQL · SQLAlchemy 2 (async) · Alembic · Redis |
| **Auth** | JWT (python-jose) · bcrypt · Refresh Tokens |
| **AI** | Anthropic Claude API (claude-haiku-4-5) · SSE-Streaming |
| **Tests** | pytest · Vitest · Playwright |
| **CI/CD** | GitHub Actions · Codecov |
| **DevOps** | Docker · Docker Compose |

---

## Projektstruktur

```
tradepilot/
├── apps/
│   ├── api/                  # FastAPI Backend
│   │   ├── app/
│   │   │   ├── core/         # Config, DB, Auth, Redis
│   │   │   ├── models/       # SQLAlchemy-Modelle
│   │   │   ├── schemas/      # Pydantic-Schemas
│   │   │   ├── routers/      # API-Endpunkte
│   │   │   ├── services/     # AI-Client
│   │   │   └── data/         # Mock-Daten, Seed-Skripte
│   │   ├── alembic/          # DB-Migrationen (0001–0005)
│   │   └── tests/            # pytest-Integrationstests
│   └── web/                  # Next.js Frontend
│       ├── src/
│       │   ├── app/          # App Router Pages
│       │   ├── components/   # UI-Komponenten
│       │   └── lib/          # Types, Stores, Utilities
│       └── e2e/              # Playwright E2E-Tests
├── docs/                     # Technische Dokumentation
├── tests/performance/        # Locust Performance-Tests
├── .github/workflows/        # GitHub Actions CI/CD
├── docker-compose.yml        # Lokale Entwicklung
├── docker-compose.staging.yml # Staging-Umgebung
└── .env.example              # Umgebungsvariablen-Template
```

---

## Schnellstart (lokal)

### Voraussetzungen

- Docker & Docker Compose
- Python 3.12+
- Node.js 20+

### 1. Repository klonen & Umgebung konfigurieren

```bash
git clone <repo-url>
cd tradepilot
cp .env.example .env
# .env mit echten Werten befüllen (Passwörter, JWT_SECRET, ANTHROPIC_API_KEY)
```

### 2. Datenbank & Redis starten

```bash
docker compose up -d db redis
```

### 3. Backend starten

```bash
cd apps/api
pip install -r requirements.txt
alembic upgrade head      # Migrationen ausführen
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend starten

```bash
cd apps/web
npm install
npm run dev
```

Die Anwendung ist jetzt unter **http://localhost:3000** erreichbar.  
API-Dokumentation: **http://localhost:8000/docs**

### Oder: Alles mit Docker Compose

```bash
docker compose up --build
```

---

## Umgebungsvariablen

Alle Variablen sind in [`.env.example`](.env.example) dokumentiert. Die wichtigsten:

| Variable | Beschreibung | Pflicht |
|---|---|---|
| `DATABASE_URL` | PostgreSQL-Verbindungsstring | Ja |
| `JWT_SECRET` | Geheimer Schlüssel für JWT-Signierung | Ja |
| `ANTHROPIC_API_KEY` | API-Key für den KI-Assistenten | Nein\* |
| `REDIS_URL` | Redis-Verbindungsstring | Ja |

\* Ohne Key läuft die App weiter – der KI-Assistent zeigt einen Demo-Hinweis.

---

## Tests ausführen

### Backend (pytest)

```bash
cd apps/api
pytest -v                          # alle Tests
pytest --cov=app --cov-report=term # mit Coverage
```

### Frontend (Vitest)

```bash
cd apps/web
npm test                    # einmalig
npm run test:watch          # Watch-Modus
npm run test:coverage       # mit Coverage
```

### E2E (Playwright)

```bash
cd apps/web
npx playwright install      # Browser einmalig installieren
npm run test:e2e            # Tests ausführen
```

---

## Dokumentation

| Dokument | Inhalt |
|---|---|
| [docs/ROADMAP.md](docs/ROADMAP.md) | Entwicklungs-Roadmap (Phasen 1–10) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Systemarchitektur & Datenbankschema |
| [docs/API.md](docs/API.md) | Alle API-Endpunkte |
| [docs/SECURITY.md](docs/SECURITY.md) | Sicherheitsrichtlinien |
| [docs/COMPLIANCE.md](docs/COMPLIANCE.md) | Finanz-Compliance (BaFin, MiFID II) |
| [AGENTS.md](AGENTS.md) | Leitfaden für Coding-Agenten |

---

## Compliance & Rechtliches

TradePilot ist eine **Bildungsplattform** ohne Finanzlizenz (kein echtes Brokerage):

- Alle dargestellten Kurse sind **Simulationsdaten** (Mock)
- Paper Trading verwendet **kein echtes Geld**
- Der KI-Assistent gibt **keine Anlageberatung**
- Für echte Anlageentscheidungen wende dich an einen **zugelassenen Finanzberater**

Rechtliche Seiten: [Impressum](/impressum) · [Datenschutz](/datenschutz) · [AGB](/agb)

---

## Lizenz

MIT
