# TradePilot

> Eine anfängerfreundliche Trading-, Marktanalyse- und Lernplattform.

TradePilot hilft Menschen, Finanzmärkte zu verstehen – ohne echtes Geld zu riskieren. Die Plattform bietet interaktive Charts, eine Watchlist, Paper Trading mit virtuellem Kapital und strukturierte Lernmodule.

**Wichtiger Hinweis:** TradePilot ist ausschließlich zu Bildungszwecken. Es wird keine Anlageberatung angeboten. Paper Trading ist eine Simulation – kein echtes Geld.

---

## Features (MVP)

| Feature | Status |
|---|---|
| Benutzerkonten (Registrierung, Login, 2FA) | Geplant |
| Dashboard mit Marktübersicht | Geplant |
| Watchlist (Aktien, ETFs, Krypto) | Geplant |
| Charts (Line, Candlestick, SMA, EMA, RSI) | Geplant |
| Paper Trading (virtuelles Kapital) | Geplant |
| Lernmodule mit Quiz | Geplant |
| KI-Assistent (Begriffe & Charts erklären) | Geplant |
| News & Marktinformationen | Geplant |
| Portfolio-Simulation | Geplant |
| Admin-Bereich | Geplant |

---

## Tech Stack

**Frontend:** Next.js · React · TypeScript · Tailwind CSS · shadcn/ui · Recharts

**Backend:** Python FastAPI · PostgreSQL · Redis · WebSockets

**AI Layer:** OpenAI API / Claude API

**DevOps:** Docker · Docker Compose · GitHub Actions

---

## Projektstruktur

```
tradepilot/
├── apps/
│   ├── web/          # Next.js Frontend
│   └── api/          # FastAPI Backend
├── packages/
│   ├── ui/           # Shared UI-Komponenten
│   ├── config/       # Geteilte Konfiguration
│   ├── types/        # Geteilte TypeScript-Typen
│   └── utils/        # Geteilte Hilfsfunktionen
├── docs/             # Technische Dokumentation
├── infra/            # Docker & CI/CD-Konfiguration
├── scripts/          # Build- und Setup-Skripte
└── tests/            # Integrations- und E2E-Tests
```

---

## Schnellstart (lokal)

```bash
# 1. Repository klonen
git clone <repo-url>
cd tradepilot

# 2. Umgebungsvariablen konfigurieren
cp .env.example .env
# .env mit echten Werten befüllen

# 3. Dienste starten (DB + Redis)
docker compose up -d db redis

# 4. Backend starten (nach Implementierung)
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload

# 5. Frontend starten (nach Implementierung)
cd apps/web
npm install
npm run dev
```

---

## Dokumentation

| Dokument | Inhalt |
|---|---|
| [AGENTS.md](AGENTS.md) | Leitfaden für Coding-Agenten |
| [DESIGN.md](DESIGN.md) | Produkt- und UI-Prinzipien |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Systemarchitektur |
| [docs/PRD.md](docs/PRD.md) | Product Requirements |
| [docs/API.md](docs/API.md) | API-Routen |
| [docs/SECURITY.md](docs/SECURITY.md) | Sicherheitsrichtlinien |
| [docs/COMPLIANCE.md](docs/COMPLIANCE.md) | Finanz-Compliance |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Entwicklungs-Roadmap |

---

## Compliance

TradePilot ist eine **Bildungsplattform**. Es wird keine Anlageberatung angeboten. Alle Handelsaktionen sind Simulationen. Historische Daten garantieren keine zukünftigen Ergebnisse. Nutzer handeln auf eigenes Risiko.

---

## Lizenz

MIT
