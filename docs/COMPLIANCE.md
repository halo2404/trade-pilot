# COMPLIANCE.md – TradePilot Finanz-Compliance und Risikohinweise

**Version:** 0.1 (MVP)

---

## Grundsatz

TradePilot ist **ausschließlich eine Bildungs- und Simulationsplattform**. Die App bietet keine Anlageberatung, keine Finanzberatung und keine Empfehlungen zum Kauf oder Verkauf von Wertpapieren.

---

## Gesetzlicher Rahmen (Orientierung)

TradePilot orientiert sich an folgenden regulatorischen Rahmenbedingungen (ohne rechtliche Gewähr):

| Regulierung | Relevanz |
|---|---|
| MiFID II (EU) | Verbot der Anlageberatung ohne Lizenz |
| WpHG (Deutschland) | Wertpapierhandelsgesetz, Beratungsverbot |
| DSGVO (EU) | Datenschutz bei Nutzerdaten |
| TMG / TDDDG | Impressumspflicht, Datenschutz |

**Wichtig:** Vor einem kommerziellen Launch muss eine rechtliche Prüfung durch einen qualifizierten Anwalt erfolgen.

---

## Verbotene Inhalte und Funktionen (MVP und darüber hinaus)

Die folgenden Inhalte und Funktionen dürfen **nicht** implementiert werden, ohne vorherige rechtliche Freigabe:

- Konkrete Kauf- oder Verkaufsempfehlungen für Wertpapiere
- Personalisierte Finanzberatung
- Prognosen über zukünftige Kursentwicklungen als Fakten
- Garantierte Renditen oder Gewinnversprechen
- Ranking von Wertpapieren als „sicher" oder „empfehlenswert"
- Echtes Brokerage oder Orderausführung
- Hebelprodukte, CFDs, Optionen, Margin Trading

---

## Pflichthinweise in der Anwendung

Die folgenden Hinweise **müssen** in der Anwendung sichtbar sein:

### 1. Allgemeiner Disclaimer (Footer, Landing Page, Dashboard)

> TradePilot ist eine Bildungsplattform und bietet keine Anlageberatung. Alle Handelsaktionen sind Simulationen. Investitionen in Wertpapiere sind mit Risiken verbunden. Historische Kursentwicklungen sind kein verlässlicher Indikator für zukünftige Entwicklungen. Bitte konsultiere einen qualifizierten Finanzberater, bevor du echte Investitionsentscheidungen triffst.

### 2. Paper Trading Banner

> Diese Funktion ist eine **Simulation**. Es wird kein echtes Geld eingesetzt. Paper Trading dient ausschließlich Übungs- und Lernzwecken.

### 3. KI-Assistent Disclaimer (bei jeder Antwort zu Finanzthemen)

> Dies ist keine Anlageberatung. Bitte prüfe Informationen selbst und beachte Dein persönliches Risiko.

### 4. Risikohinweis bei Charts und Marktdaten

> Marktdaten können verzögert sein. Historische Daten garantieren keine zukünftigen Ergebnisse.

---

## KI-Assistent Sicherheitsfilter

Der KI-Assistent muss folgende Regeln einhalten:

- **Erlaubt:** Begriffe erklären, Konzepte beschreiben, Lernfragen beantworten, Charts neutral erklären
- **Verboten:** Konkrete Kaufempfehlungen, Kursvorhersagen, Renditeversprechen, aggressive Handlungsaufforderungen

### Implementierung des Filters

```python
FINANCIAL_ADVICE_DISCLAIMER = (
    "⚠️ Dies ist keine Anlageberatung. "
    "Bitte prüfe Informationen selbst und beachte Dein persönliches Risiko."
)

FORBIDDEN_PATTERNS = [
    "kaufe jetzt",
    "verkaufe jetzt",
    "sicherer gewinn",
    "garantierte rendite",
    "ich empfehle dir zu kaufen",
]
```

---

## Datenschutz (DSGVO-Orientierung)

- Nur notwendige Nutzerdaten speichern
- Kein Verkauf oder Weitergabe von Nutzerdaten an Dritte
- Nutzer können alle ihre Daten anfordern und löschen
- Datenschutzerklärung muss vor Go-Live vollständig vorliegen
- Cookies nur mit Einwilligung (sofern nicht technisch notwendig)

---

## Nutzungsbedingungen (Pflicht vor Go-Live)

Vor dem offiziellen Launch müssen vollständige Nutzungsbedingungen (AGB) erstellt werden, die folgende Punkte abdecken:

- Keine Anlageberatung
- Haftungsausschluss für Simulationsergebnisse
- Nutzungsalter (mind. 18 Jahre empfohlen)
- Datenschutz-Verweis

---

## Checkliste vor Go-Live

- [ ] Rechtliche Prüfung durch qualifizierten Anwalt
- [ ] Impressum vollständig (§ 5 TMG)
- [ ] Datenschutzerklärung vollständig (DSGVO)
- [ ] AGB / Nutzungsbedingungen
- [ ] Alle Pflichthinweise implementiert
- [ ] KI-Filter getestet
- [ ] Paper-Trading-Simulation klar als solche gekennzeichnet
