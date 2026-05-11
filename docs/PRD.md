# PRD – Product Requirements Document

**Projekt:** TradePilot  
**Version:** 0.1 (MVP)  
**Stand:** 2026-05-11

---

## Vision

TradePilot macht Finanzmärkte verständlich. Wer keine Börsenerfahrung hat, soll Charts lesen, Aktien und ETFs verstehen, Risiken einschätzen und mit virtuellem Geld üben können – ohne echtes Geld zu riskieren.

---

## Zielgruppe

### Primär
- Personen ohne Trading-Erfahrung (18–45 Jahre)
- Menschen, die Börse, ETFs und Trading verstehen wollen
- Nutzer, die zuerst mit virtuellem Kapital üben möchten

### Sekundär
- Fortgeschrittene, die Charts analysieren
- Swing Trader mit Lernbedarf
- Lehrende und Studierende im Finanzbereich

---

## Kernfunktionen (MVP)

### F-01: Benutzerkonto
- Registrierung mit E-Mail + Passwort
- Login / Logout
- Passwort-Reset per E-Mail
- Optionale 2FA
- Rollenmodell: `free`, `premium`, `admin`

### F-02: Dashboard
- Watchlist-Übersicht
- Portfolio-Simulation-Snapshot
- Aktuelle Marktübersicht (Mock-Daten im MVP)
- Lernfortschritt
- Letzte Paper-Trades
- Risikohinweise-Banner

### F-03: Watchlist
- Assets hinzufügen / entfernen (Aktien, ETFs, Krypto)
- Favoriten markieren
- Kurs + prozentuale Änderung anzeigen
- Einfache Erklärung zum Asset

### F-04: Charts
- Linienchart + Candlestick-Chart (umschaltbar)
- Zeiträume: 1T, 1W, 1M, 3M, 1J, Max
- Volumenanzeige
- Technische Indikatoren: SMA, EMA, RSI
- MACD als spätere Erweiterung

### F-05: Paper Trading
- Virtuelles Startkapital: 10.000 €
- Kauf und Verkauf simulieren
- Stop Loss und Take Profit optional
- Trade Journal
- Performance-Übersicht (Gewinn/Verlust)
- Deutlicher Hinweis: Simulation, kein echtes Geld

### F-06: Lernmodule
- Strukturierte Lektionen mit Fortschritts-Tracking
- Quiz nach jeder Lektion
- Glossar für Fachbegriffe
- Themen: Aktie, ETF, Chart, Risiko, Diversifikation, Stop Loss, Trading, Investieren

### F-07: KI-Assistent
- Chat-Interface
- Begriffe und Charts erklären
- Keine Kaufempfehlungen
- Automatischer Disclaimer bei Finanzthemen

### F-08: News & Marktinformationen
- Marktnachrichten (Mock-Daten im MVP)
- Wirtschaftskalender
- Earnings-Übersicht
- Dividendeninformationen

### F-09: Portfolio-Simulation
- Asset-Bestand
- Durchschnittlicher Kaufpreis
- Aktueller simulierter Wert
- Gewinn/Verlust
- Asset Allocation (Kreisdiagramm)

### F-10: Admin-Bereich
- Lernmodule verwalten
- Nutzer verwalten
- Systemstatus
- API-Status
- Gemeldete Inhalte prüfen

---

## Nicht im MVP

- Echtes Brokerage
- Hebelprodukte, CFDs, Optionen, Margin Trading
- Social Trading mit echten Empfehlungen
- Copy Trading
- Mobil-App (Native)

---

## Nicht-funktionale Anforderungen

| Anforderung | Zielwert |
|---|---|
| Antwortzeit API | < 300 ms (p95) |
| Verfügbarkeit | 99 % (MVP) |
| Skalierbarkeit | 1.000 gleichzeitige Nutzer (MVP) |
| Sicherheit | OWASP Top 10 adressiert |
| Datenschutz | DSGVO-Grundprinzipien |

---

## Akzeptanzkriterien

- Alle Kernfunktionen funktionieren end-to-end
- Paper Trading ist deutlich als Simulation gekennzeichnet
- KI-Antworten enthalten Disclaimer
- Tests vorhanden (Unit + Integration)
- Keine echten Secrets im Repository
