# AGENTS.md – TradePilot Coding-Agenten-Leitfaden

Dieses Dokument richtet sich an KI-Coding-Agenten (Claude Code, Codex, Cursor u. a.), die am TradePilot-Projekt arbeiten. Lies es vollständig, bevor du Änderungen vornimmst.

---

## Projektziel

TradePilot ist eine anfängerfreundliche Trading-, Marktanalyse- und Lernplattform. Kern-Prinzip: **Lernen vor Spekulation**, **Paper Trading statt echtem Trading im MVP**.

---

## Tech Stack

| Bereich | Technologie |
|---|---|
| Frontend | Next.js 14+, React, TypeScript, Tailwind CSS, shadcn/ui |
| Charts | Recharts oder Lightweight Charts |
| Backend | Python FastAPI, PostgreSQL, Redis, WebSockets |
| Auth | JWT + optionale 2FA |
| AI | OpenAI API / Anthropic Claude API |
| DevOps | Docker, Docker Compose, GitHub Actions |
| Testing | pytest (Backend), Jest/Vitest + Playwright (Frontend) |

---

## Repository-Struktur

```
apps/web/       → Next.js Frontend-App
apps/api/       → FastAPI Backend-App
packages/ui/    → Geteilte React-Komponenten
packages/types/ → Geteilte TypeScript-Typen
packages/utils/ → Geteilte Hilfsfunktionen
docs/           → Technische Dokumentation
infra/          → Docker & CI/CD
tests/          → Integrations- und E2E-Tests
```

---

## Setup-Befehle

```bash
# Infrastruktur starten
docker compose up -d db redis

# Backend (apps/api/)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (apps/web/)
npm install
npm run dev
```

---

## Entwicklungsbefehle

```bash
# Frontend
npm run dev          # Dev-Server
npm run build        # Production Build
npm run lint         # ESLint
npm run type-check   # TypeScript

# Backend
uvicorn main:app --reload   # Dev-Server
ruff check .                # Linting
mypy .                      # Type Checking
```

---

## Testbefehle

```bash
# Backend
pytest                    # Alle Tests
pytest -v --cov=.         # Mit Coverage

# Frontend
npm run test              # Unit Tests (Vitest)
npm run test:e2e          # E2E Tests (Playwright)
```

---

## Coding-Konventionen

### Allgemein
- Erst planen, dann implementieren
- Kleine, fokussierte Commits
- Keine halbfertigen Features mergen

### TypeScript / Frontend
- Strikte Typen, kein `any` ohne Begründung
- Komponenten in `PascalCase`
- Hooks mit `use`-Prefix
- Tailwind-Klassen direkt im JSX (keine separaten CSS-Dateien)

### Python / Backend
- Type Hints überall
- Pydantic für Validierung
- Async-Endpunkte bevorzugen
- SQLAlchemy für ORM

### API
- REST-Konventionen (GET liest, POST erstellt, PATCH aktualisiert, DELETE löscht)
- Fehler mit HTTP-Status-Codes + strukturiertem JSON-Body
- Alle Endpunkte dokumentiert (FastAPI auto-docs)

---

## Sicherheitsregeln

- Passwörter immer mit bcrypt hashen
- JWT-Tokens kurzlebig (60 Min.) + Refresh Token
- Input immer mit Pydantic validieren
- Rate Limiting auf Auth-Endpunkten
- CORS restriktiv konfigurieren
- Keine Secrets in Code oder Git
- Logging ohne sensible Daten (Passwörter, Tokens, PII)

---

## Compliance-Regeln für Finanzthemen

- Keine echten Kauf- oder Verkaufsempfehlungen generieren
- Jede KI-Antwort zu Finanzthemen muss diesen Hinweis enthalten:
  > „Dies ist keine Anlageberatung. Bitte prüfe Informationen selbst und beachte Dein persönliches Risiko."
- Paper Trading immer als Simulation kennzeichnen
- Historische Daten dürfen nicht als Prognose dargestellt werden

---

## Do-not-Regeln

Du darfst **nicht**:
- Echte Broker-Orders implementieren (im MVP)
- API-Keys oder Secrets in Code schreiben
- Tests entfernen, um Fehler zu verstecken
- Sicherheitswarnungen oder Compliance-Hinweise löschen
- Hebelprodukte, CFDs, Optionen oder Margin Trading im MVP aktivieren
- Nutzer zu riskantem Trading drängen
- `any` in TypeScript ohne Kommentar und Begründung verwenden

---

## Definition of Done

Eine Aufgabe gilt als fertig, wenn:
- [ ] Code implementiert
- [ ] TypeScript/Python-Typen korrekt
- [ ] Tests vorhanden (oder Auslassung begründet)
- [ ] Linting erfolgreich
- [ ] Build erfolgreich
- [ ] Relevante Dokumentation aktualisiert
- [ ] Keine Secrets im Code
- [ ] Offene Punkte dokumentiert

---

## Pull-Request-Erwartungen

- Titel: kurz und präzise (z. B. `feat: add watchlist endpoint`)
- Beschreibung: Was wurde geändert und warum
- Screenshots bei UI-Änderungen
- Keine direkte Merges in `main` ohne Review
- CI muss grün sein
