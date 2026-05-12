# ROADMAP.md – TradePilot Entwicklungs-Roadmap

---

## Phase 1: Fundament (aktuell)

**Ziel:** Solides Repository-Fundament, klare Architektur, keine Produktivcode-Komplexität.

- [x] Monorepo-Struktur anlegen
- [x] Dokumentation erstellen (README, AGENTS, DESIGN, ARCHITECTURE, API, SECURITY, COMPLIANCE)
- [x] .gitignore, .env.example, docker-compose.yml (Platzhalter)
- [x] Git-Repository initialisieren

---

## Phase 2: Backend-Grundstruktur

**Ziel:** Lauffähiges Backend mit Authentifizierung und Datenbank.

- [x] FastAPI Projekt initialisieren (`apps/api/`)
- [x] PostgreSQL + SQLAlchemy + Alembic einrichten
- [x] Datenbank-Modelle implementieren (User, Role, ...)
- [x] Auth-Endpunkte: Register, Login, Logout, Me
- [x] JWT + Refresh Token
- [x] Rate Limiting (Redis)
- [x] Unit Tests für Auth
- [x] Docker: `apps/api/Dockerfile`

---

## Phase 3: Frontend-Grundstruktur

**Ziel:** Lauffähiges Frontend mit Auth-Flow und Navigation.

- [x] Next.js 14 Projekt initialisieren (`apps/web/`)
- [x] Tailwind CSS + shadcn/ui einrichten
- [x] Layout-Komponente (Navigation, Sidebar)
- [x] Login- und Registrierungsseite
- [x] Auth-Integration (JWT im Frontend)
- [x] Protected Routes
- [x] Dark Mode
- [x] Docker: `apps/web/Dockerfile`

---

## Phase 4: Watchlist & Assets ✅

**Ziel:** Nutzer können Assets suchen und Watchlisten verwalten.

- [x] Asset-Suche (Mock-Daten) — 40+ Assets: Aktien USA/DE, ETFs, Krypto
- [x] Watchlist-Endpunkte (CRUD) — GET/POST/DELETE /watchlist
- [x] Watchlist-UI mit Kursen — Suche, Tabelle, Kurs + 24h-Änderung
- [x] Asset-Details-Seite — /chart/[symbol] mit Chart-Placeholder (Phase 5)

---

## Phase 5: Charts ✅

**Ziel:** Interaktive Charts für beliebige Assets.

- [x] Chart-Daten-Endpunkt (Mock-Daten) — GET /assets/{symbol}/chart?period=
- [x] Recharts Integration — ComposedChart mit Area/Line
- [x] Zeitraum-Auswahl (1T, 1W, 1M, 3M, 1J, Max) — segment control in der UI
- [x] Volumenanzeige — BarChart unterhalb des Preischarts
- [x] Technische Indikatoren: SMA(20), EMA(20), RSI(14) — umschaltbar

---

## Phase 6: Paper Trading ✅

**Ziel:** Nutzer können mit virtuellem Kapital handeln.

- [x] Portfolio-Modell (DB) — portfolios, positions, trades Tabellen (Migration 0003)
- [x] Order-Simulation (Kauf/Verkauf) — POST /portfolio/orders mit Validierung + WACC
- [x] Trade-Journal — GET /portfolio/trades, chronologische Übersicht
- [x] Performance-Übersicht — Gesamtwert, Cash, P&L mit %, beste/schlechteste Position
- [x] Paper-Trading-UI mit Simulation-Banner — Order-Form, Positionen-Tab, Journal-Tab

---

## Phase 7: Lernmodule ✅

**Ziel:** Strukturiertes Lernsystem mit Fortschritts-Tracking und Quiz.

- [x] Lernmodul-Datenmodell (learning_modules, lessons, user_lesson_progress, quiz_questions, quiz_attempts, glossary_entries)
- [x] Admin: Seed-Daten — 3 Module à 3 Lektionen + je 3 Quiz-Fragen, 18 Glossar-Einträge (lädt beim Start automatisch)
- [x] Lernmodul-UI (Modul-Übersicht, Lektion-Reader mit Fortschrittsbalken)
- [x] Quiz-System (Fragen einzeln, detaillierte Auswertung, Wiederholung, Bestehen bei ≥70 %)
- [x] Glossar (18 Begriffe, alphabetisch gruppiert, Suche)

---

## Phase 8: KI-Assistent ✅

**Ziel:** Nutzer können Begriffe und Charts erklären lassen.

- [x] Anthropic API anbinden (claude-haiku-4-5) — Fallback auf Mock wenn kein API-Key
- [x] Chat-Interface mit Echtzeit-Streaming (SSE), Session-Sidebar, Vorschläge
- [x] Sicherheitsfilter — System-Prompt verbietet Anlageempfehlungen, Prognosen, Rechts-/Steuerberatung
- [x] Automatischer Disclaimer (UI-Banner + System-Prompt)
- [x] Chat-Verlauf speichern (chat_sessions + chat_messages, Migration 0005)

---

## Phase 9: Tests & CI/CD ✅

**Ziel:** Stabile, automatisch getestete Codebasis.

- [x] pytest Unit Tests (Backend) — test_security.py (security/tokens)
- [x] pytest Integration Tests (Backend) — test_auth, test_portfolio, test_watchlist, test_learning, test_chat (SQLite in-memory, Redis gemockt)
- [x] Vitest Unit Tests (Frontend) — utils.test.ts (cn()), indicators.test.ts (SMA/EMA/RSI)
- [x] Playwright E2E Tests — e2e/auth.spec.ts, e2e/navigation.spec.ts
- [x] GitHub Actions: Lint (Ruff) → Type Check (mypy / tsc) → Test → Build → E2E (nur main)
- [x] Codecoverage-Reporting via Codecov (backend lcov + frontend lcov)

---

## Phase 10: Dokumentation & Go-Live-Vorbereitung ✅

**Ziel:** Alles bereit für einen öffentlichen Launch.

- [x] Alle Dokumentationsdateien aktualisiert (README, ARCHITECTURE, API)
- [x] Impressum, Datenschutzerklärung, AGB — öffentliche Seiten unter /impressum, /datenschutz, /agb (Platzhalter, rechtliche Prüfung erforderlich)
- [ ] Rechtliche Prüfung (extern) ⚠️ Vor Go-Live durch Anwalt prüfen lassen
- [ ] Penetrationstest (empfohlen) ⚠️ Vor Go-Live durchführen
- [x] Performance-Tests — Locust-Testfile mit SLA-Zielen (tests/performance/)
- [x] Staging-Environment — docker-compose.staging.yml mit Traefik-Labels

---

## Spätere Erweiterungen (Post-MVP)

Diese Features sind bewusst aus dem MVP ausgeschlossen und werden erst nach ausführlicher rechtlicher und technischer Prüfung implementiert:

- Echtes Brokerage (Broker-API-Anbindung)
- Social Trading (Strategien teilen, folgen)
- Copy Trading
- Hebelprodukte, CFDs, Optionen (nur mit BaFin-Lizenz)
- Mobile App (React Native oder Flutter)
- Premium-Abonnement
- Erweiterte KI-Funktionen (Chart-Pattern-Erkennung, KI-Backtesting)
- Mehrsprachigkeit (EN, ES, FR)
