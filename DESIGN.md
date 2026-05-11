# DESIGN.md – TradePilot Produkt- und UI-Prinzipien

---

## Produktprinzipien

### 1. Anfängerfreundlichkeit vor Komplexität
Jede Funktion muss auch für jemanden ohne Börsenerfahrung verständlich sein. Fachbegriffe werden immer erklärt.

### 2. Lernen vor Spekulation
Die Plattform soll Wissen vermitteln, nicht zum Handeln verleiten. Lernmodule haben genauso viel Priorität wie Charts.

### 3. Paper Trading vor echtem Trading
Im MVP wird ausschließlich simuliert. Kein echter Geldfluss, keine Broker-Anbindung.

### 4. Risikoaufklärung vor Gewinnversprechen
Risiken werden aktiv kommuniziert. Gewinne werden nie garantiert oder versprochen.

### 5. Sicherheit und Datenschutz
DSGVO-Grundprinzipien werden von Anfang an beachtet. Minimale Datenhaltung, klare Einwilligungen.

---

## UI-Prinzipien

### Klarheit
- Klare visuelle Hierarchie (Überschriften, Abschnitte, Abstände)
- Wichtige Informationen prominenter platziert als Details
- Keine überladenen Seiten

### Anfängerfreundlichkeit
- Tooltips für alle Fachbegriffe (SMA, RSI, ETF, Dividende, ...)
- Hilfetexte an wichtigen Aktionen
- Onboarding-Flow für neue Nutzer

### Dark Mode
- Vollständige Dark-Mode-Unterstützung
- System-Präferenz automatisch erkennen
- Manuell umschaltbar

### Konsistenz
- shadcn/ui Komponenten konsequent verwenden
- Einheitliche Farb- und Typografieskala (Tailwind CSS)
- Einheitliche Fehler- und Erfolgsmeldungen

### Warnungen und Hinweise
- Risikohinweise bei Paper-Trading-Aktionen
- Disclaimer bei KI-generierten Finanzinhalten
- Klare Unterscheidung: Simulation vs. Realität

---

## Farbpalette (Empfehlung)

| Zweck | Tailwind-Klasse |
|---|---|
| Primär | `blue-600` |
| Erfolg / Kursanstieg | `green-500` |
| Warnung / Kursrückgang | `red-500` |
| Neutral | `gray-500` |
| Hintergrund (Dark) | `gray-900` |
| Hintergrund (Light) | `white` |

---

## Typografie

- **Schriftart:** Inter (System-Font-Stack als Fallback)
- **Überschriften:** `font-bold` + entsprechende `text-`-Größe
- **Fließtext:** `text-base` (16px), `leading-relaxed`
- **Code / Ticker-Symbole:** `font-mono`

---

## Seiten und Navigation

### Hauptnavigation
```
/ (Landing)
/dashboard
/watchlist
/chart/[symbol]
/paper-trading
/learning
/learning/[module]
/ai-assistant
/settings
```

### Auth
```
/login
/register
/forgot-password
```

### Admin
```
/admin
/admin/users
/admin/learning
```

---

## Komponenten-Leitlinien

### Charts
- Default: Linienchart (einfacher für Anfänger)
- Optional: Candlestick umschalten
- Zeitraum-Auswahl immer sichtbar: `1T 1W 1M 3M 1J Max`
- Indikatoren als optionaler Layer (nicht standardmäßig aktiv)

### Watchlist
- Asset-Symbol + Name + Kurs + Änderung (+/- %)
- Grün für positiv, Rot für negativ
- Einfaches Hinzufügen/Entfernen

### Paper Trading
- Deutlicher Banner: „Simulation – kein echtes Geld"
- Virtuelles Startkapital: 10.000 €
- Kauf/Verkauf mit Bestätigungsdialog

### KI-Assistent
- Chat-Interface (einfach, klar)
- Jede Antwort zu Finanzthemen mit Disclaimer
- Keine Empfehlungen, nur Erklärungen

---

## Accessibility

- Semantisches HTML
- ARIA-Labels für interaktive Elemente
- Ausreichend Kontrast (WCAG AA)
- Keyboard-Navigation
- Fokus-Sichtbarkeit
