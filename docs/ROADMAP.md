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

- [ ] FastAPI Projekt initialisieren (`apps/api/`)
- [ ] PostgreSQL + SQLAlchemy + Alembic einrichten
- [ ] Datenbank-Modelle implementieren (User, Role, ...)
- [ ] Auth-Endpunkte: Register, Login, Logout, Me
- [ ] JWT + Refresh Token
- [ ] Rate Limiting (Redis)
- [ ] Unit Tests für Auth
- [ ] Docker: `apps/api/Dockerfile`

---

## Phase 3: Frontend-Grundstruktur

**Ziel:** Lauffähiges Frontend mit Auth-Flow und Navigation.

- [ ] Next.js 14 Projekt initialisieren (`apps/web/`)
- [ ] Tailwind CSS + shadcn/ui einrichten
- [ ] Layout-Komponente (Navigation, Sidebar)
- [ ] Login- und Registrierungsseite
- [ ] Auth-Integration (JWT im Frontend)
- [ ] Protected Routes
- [ ] Dark Mode
- [ ] Docker: `apps/web/Dockerfile`

---

## Phase 4: Watchlist & Assets

**Ziel:** Nutzer können Assets suchen und Watchlisten verwalten.

- [ ] Asset-Suche (Mock-Daten)
- [ ] Watchlist-Endpunkte (CRUD)
- [ ] Watchlist-UI mit Kursen
- [ ] Asset-Details-Seite

---

## Phase 5: Charts

**Ziel:** Interaktive Charts für beliebige Assets.

- [ ] Chart-Daten-Endpunkt (Mock-Daten)
- [ ] Recharts / Lightweight Charts Integration
- [ ] Zeitraum-Auswahl (1T, 1W, 1M, 3M, 1J, Max)
- [ ] Volumenanzeige
- [ ] Technische Indikatoren: SMA, EMA, RSI

---

## Phase 6: Paper Trading

**Ziel:** Nutzer können mit virtuellem Kapital handeln.

- [ ] Portfolio-Modell (DB)
- [ ] Order-Simulation (Kauf/Verkauf)
- [ ] Trade-Journal
- [ ] Performance-Übersicht
- [ ] Paper-Trading-UI mit Simulation-Banner

---

## Phase 7: Lernmodule

**Ziel:** Strukturiertes Lernsystem mit Fortschritts-Tracking und Quiz.

- [ ] Lernmodul-Datenmodell
- [ ] Admin: Module und Lektionen anlegen
- [ ] Lernmodul-UI (Lektion, Fortschritt)
- [ ] Quiz-System
- [ ] Glossar

---

## Phase 8: KI-Assistent

**Ziel:** Nutzer können Begriffe und Charts erklären lassen.

- [ ] OpenAI / Anthropic API anbinden
- [ ] Chat-Interface
- [ ] Sicherheitsfilter (kein Finanzrat)
- [ ] Automatischer Disclaimer
- [ ] Chat-Verlauf speichern

---

## Phase 9: Tests & CI/CD

**Ziel:** Stabile, automatisch getestete Codebasis.

- [ ] pytest Unit Tests (Backend)
- [ ] pytest Integration Tests (Backend)
- [ ] Vitest Unit Tests (Frontend)
- [ ] Playwright E2E Tests
- [ ] GitHub Actions: Lint → Type Check → Test → Build
- [ ] Codecoverage-Reporting

---

## Phase 10: Dokumentation & Go-Live-Vorbereitung

**Ziel:** Alles bereit für einen öffentlichen Launch.

- [ ] Alle Dokumentationsdateien aktualisieren
- [ ] Impressum, Datenschutzerklärung, AGB
- [ ] Rechtliche Prüfung (extern)
- [ ] Penetrationstest (empfohlen)
- [ ] Performance-Tests
- [ ] Staging-Environment aufsetzen

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
