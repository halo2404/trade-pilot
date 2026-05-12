"""Seed learning modules, lessons, quiz questions, and glossary entries.

Runs at startup if the learning_modules table is empty.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.learning import GlossaryEntry, Lesson, LearningModule, QuizQuestion

MODULES = [
    {
        "title": "Grundlagen der Börse",
        "description": "Verstehe, wie Finanzmärkte funktionieren, was Aktien und ETFs sind, und wie du als Anleger einsteigen kannst.",
        "order": 1,
        "lessons": [
            {
                "title": "Was ist eine Aktie?",
                "order": 1,
                "content": """## Was ist eine Aktie?

Eine **Aktie** ist ein Anteilsschein an einem Unternehmen. Wer eine Aktie kauft, wird zum Miteigentümer dieses Unternehmens – und zwar anteilig entsprechend der Anzahl der gehaltenen Aktien.

### Wie funktioniert das?

Unternehmen benötigen Kapital, um zu wachsen. Eine Möglichkeit, dieses Kapital aufzutreiben, ist der **Börsengang** (IPO – Initial Public Offering). Dabei gibt das Unternehmen Aktien aus und verkauft diese an Anleger.

### Rechte als Aktionär

- **Stimmrecht** auf der Hauptversammlung
- **Dividende** – ein Anteil am Gewinn, falls das Unternehmen ausschüttet
- **Liquidationserlös** – im Insolvenzfall nach Gläubigern

### Kursveränderungen

Der Kurs einer Aktie schwankt täglich, basierend auf Angebot und Nachfrage. Einflussfaktoren:

- Unternehmensergebnisse (Quartalszahlen)
- Makroökonomische Daten (Inflation, Zinsen)
- Marktstimmung und Nachrichten

### Beispiel

Du kaufst 10 Aktien von Apple (AAPL) zu je 180 USD. Dein Investitionswert beträgt 1.800 USD. Steigt der Kurs auf 200 USD, ist dein Investment 2.000 USD wert – ein Gewinn von 200 USD (+11,1 %).

> **Wichtig:** Aktienkurse können auch fallen. Es besteht immer das Risiko eines Kapitalverlusts.""",
            },
            {
                "title": "Was ist ein ETF?",
                "order": 2,
                "content": """## Was ist ein ETF?

Ein **ETF** (Exchange Traded Fund) ist ein börsengehandelter Fonds, der einen Index, einen Sektor oder eine Anlagestrategie nachbildet. ETFs ermöglichen mit einem einzigen Kauf eine breite Diversifikation.

### Wie funktioniert ein ETF?

Ein ETF bündelt viele Wertpapiere in einem einzigen Produkt. Ein ETF auf den **S&P 500** beispielsweise enthält Anteile aller 500 größten US-Unternehmen.

### Vorteile von ETFs

| Merkmal | ETF | Einzelaktie |
|---|---|---|
| Diversifikation | Hoch | Gering |
| Kosten (TER) | Niedrig (0,1–0,5 %) | Transaktionskosten |
| Aufwand | Gering | Hoch (Recherche) |
| Renditechancen | Marktrendite | Über-/Unterperformance |

### Arten von ETFs

- **Aktien-ETFs** (z.B. MSCI World, S&P 500, DAX)
- **Anleihen-ETFs** (festverzinsliche Wertpapiere)
- **Rohstoff-ETFs** (Gold, Öl)
- **Themen-ETFs** (Technologie, Clean Energy)

### Physisch vs. Synthetisch

- **Physisch replizierende ETFs** kaufen die tatsächlichen Wertpapiere des Index.
- **Synthetische ETFs** bilden den Index über Derivate (Swaps) nach.

### Beispiel

Du investierst 1.000 EUR in einen MSCI-World-ETF. Damit bist du gleichzeitig an über 1.600 Unternehmen aus 23 Industrieländern beteiligt.""",
            },
            {
                "title": "Wie funktioniert eine Börse?",
                "order": 3,
                "content": """## Wie funktioniert eine Börse?

Eine **Börse** ist ein organisierter Marktplatz, auf dem Wertpapiere wie Aktien, Anleihen oder ETFs gehandelt werden. Sie bringt Käufer und Verkäufer zusammen und sorgt für einen fairen, transparenten Preisbildungsprozess.

### Wichtige Börsenplätze

- **NYSE** – New York Stock Exchange (größte Börse der Welt)
- **NASDAQ** – Technologiebörse in den USA
- **XETRA** – Elektronische Handelsplattform der Deutschen Börse (Frankfurt)
- **LSE** – London Stock Exchange

### Wie entsteht ein Kurs?

Der Kurs wird durch **Angebot und Nachfrage** bestimmt:

1. Anleger geben **Kauf-** und **Verkaufsorders** ab.
2. Das Handelssystem (Order-Matching) führt passende Orders zusammen.
3. Der ausgeführte Preis wird als neuer **Kurs** veröffentlicht.

### Handelszeiten (XETRA)

| Phase | Uhrzeit (MEZ) |
|---|---|
| Pre-Trading | 07:30 – 09:00 |
| Haupthandel | 09:00 – 17:30 |
| Post-Trading | 17:30 – 20:00 |

### Order-Typen

- **Market Order:** Kauf/Verkauf zum aktuellen Marktpreis (sofortige Ausführung)
- **Limit Order:** Kauf/Verkauf nur zu einem vorgegebenen Preis oder besser
- **Stop-Loss Order:** Automatischer Verkauf, wenn der Kurs unter ein bestimmtes Niveau fällt

### Marktindex

Ein **Index** fasst mehrere Wertpapiere zusammen und zeigt die durchschnittliche Entwicklung. Beispiele: DAX (40 größte deutsche Unternehmen), S&P 500 (500 größte US-Unternehmen).""",
            },
        ],
        "quiz": [
            {
                "question": "Was erwirbt man beim Kauf einer Aktie?",
                "options": [
                    "Ein Darlehen an das Unternehmen",
                    "Einen Anteil am Eigenkapital des Unternehmens",
                    "Eine feste jährliche Rendite",
                    "Das Recht, das Unternehmen zu leiten",
                ],
                "correct_index": 1,
                "explanation": "Eine Aktie ist ein Anteilsschein. Der Käufer wird Miteigentümer des Unternehmens und trägt damit am Gewinn, aber auch am Verlust teil.",
                "order": 1,
            },
            {
                "question": "Was ist ein wesentlicher Vorteil eines ETFs gegenüber einer Einzelaktie?",
                "options": [
                    "ETFs liefern immer höhere Renditen",
                    "ETFs unterliegen keinen Kursschwankungen",
                    "ETFs ermöglichen breite Diversifikation mit einem Kauf",
                    "ETFs sind staatlich garantiert",
                ],
                "correct_index": 2,
                "explanation": "Ein ETF bündelt viele Wertpapiere – z.B. enthält ein S&P-500-ETF Anteile an 500 Unternehmen. Das reduziert das Einzeltitelrisiko erheblich.",
                "order": 2,
            },
            {
                "question": "Was bestimmt den Kurs einer Aktie an der Börse?",
                "options": [
                    "Der Vorstand des Unternehmens",
                    "Die Bundesbank",
                    "Angebot und Nachfrage der Marktteilnehmer",
                    "Der Nennwert bei Ausgabe der Aktie",
                ],
                "correct_index": 2,
                "explanation": "Der Börsenpreis entsteht durch das Zusammenspiel von Kauf- und Verkaufsorders. Das Handelssystem führt passende Orders zusammen und bildet so den Kurs.",
                "order": 3,
            },
        ],
    },
    {
        "title": "Technische Analyse",
        "description": "Lerne Charts zu lesen, technische Indikatoren zu verstehen und Kursmuster zu erkennen.",
        "order": 2,
        "lessons": [
            {
                "title": "Candlestick-Charts verstehen",
                "order": 1,
                "content": """## Candlestick-Charts verstehen

**Candlestick-Charts** (Kerzencharts) sind die am häufigsten verwendete Chartdarstellung in der technischen Analyse. Sie zeigen für jeden Zeitraum vier Preisinformationen auf einen Blick.

### Aufbau einer Kerze (Candle)

```
  │  ← Oberer Schatten (Docht)
 ┌─┐
 │ │ ← Körper (Eröffnung bis Schluss)
 └─┘
  │  ← Unterer Schatten (Docht)
```

- **Eröffnungskurs (Open):** Preis zu Beginn des Zeitraums
- **Schlusskurs (Close):** Preis am Ende des Zeitraums
- **Höchstkurs (High):** Höchster erreichter Preis
- **Tiefstkurs (Low):** Niedrigster erreichter Preis

### Grüne vs. Rote Kerze

| Kerzenfarbe | Bedeutung |
|---|---|
| **Grün (bullish)** | Schlusskurs > Eröffnungskurs – Kurs ist gestiegen |
| **Rot (bearish)** | Schlusskurs < Eröffnungskurs – Kurs ist gefallen |

### Wichtige Candlestick-Muster

**Doji:** Eröffnung ≈ Schluss → Unentschlossenheit im Markt

**Hammer:** Langer unterer Docht, kleiner Körper oben → mögliche Trendumkehr nach unten

**Shooting Star:** Langer oberer Docht, kleiner Körper unten → mögliche Trendumkehr nach oben

**Marubozu:** Kein Docht, nur Körper → starke Entschlossenheit der Käufer/Verkäufer

### Zeitrahmen

Candlesticks können für jeden Zeitraum dargestellt werden: 1 Minute, 1 Stunde, 1 Tag, 1 Woche. Tages- und Wochenkerzen sind für die meisten Anleger am relevantesten.""",
            },
            {
                "title": "Gleitende Durchschnitte (SMA & EMA)",
                "order": 2,
                "content": """## Gleitende Durchschnitte (SMA & EMA)

Gleitende Durchschnitte glätten Kursdaten und helfen dabei, den zugrundeliegenden **Trend** eines Wertpapiers zu erkennen.

### SMA – Simple Moving Average

Der **einfache gleitende Durchschnitt** berechnet den arithmetischen Mittelwert der letzten N Schlusskurse.

**Formel:** SMA(N) = (K₁ + K₂ + … + Kₙ) / N

**Beispiel SMA(5):** Kurse der letzten 5 Tage: 100, 102, 105, 103, 107
SMA = (100 + 102 + 105 + 103 + 107) / 5 = **103,4**

### EMA – Exponential Moving Average

Der **exponentiell gewichtete Durchschnitt** gibt neueren Kursen mehr Gewicht. Dadurch reagiert er schneller auf aktuelle Kursbewegungen.

**Gewichtungsfaktor:** k = 2 / (N + 1)

Für EMA(20): k = 2 / 21 ≈ 0,095

### SMA vs. EMA

| Merkmal | SMA | EMA |
|---|---|---|
| Reaktionsgeschwindigkeit | Langsam | Schnell |
| Signale | Späte, aber zuverlässige Signale | Frühe, aber mehr Fehlsignale |
| Glättung | Stärker | Schwächer |

### Trading-Signale

**Golden Cross:** SMA(50) kreuzt SMA(200) von unten → bullishes Signal
**Death Cross:** SMA(50) kreuzt SMA(200) von oben → bearishes Signal

**Preis über MA:** Aufwärtstrend
**Preis unter MA:** Abwärtstrend

> **Hinweis:** Gleitende Durchschnitte sind Lagging-Indikatoren – sie bestätigen Trends, sagen sie aber nicht voraus.""",
            },
            {
                "title": "RSI – Relative Strength Index",
                "order": 3,
                "content": """## RSI – Relative Strength Index

Der **RSI** ist ein Momentum-Indikator, der die Stärke und Geschwindigkeit von Kursbewegungen misst. Er zeigt an, ob ein Wertpapier **überkauft** oder **überverkauft** ist.

### Berechnung

Der RSI wird auf einer Skala von **0 bis 100** dargestellt.

**Formel:** RSI = 100 – (100 / (1 + RS))

Dabei ist RS = Durchschnittliche Gewinne / Durchschnittliche Verluste (über N Perioden, Standard: 14)

### Interpretation

| RSI-Wert | Interpretation |
|---|---|
| > 70 | **Überkauft** – möglicher Rückgang |
| 30–70 | Neutrales Territorium |
| < 30 | **Überverkauft** – mögliche Erholung |

### RSI-Divergenz

Eine besonders wertvolle Signalform:

**Bullische Divergenz:** Kurs macht neue Tiefs, RSI macht höhere Tiefs → Trendumkehr nach oben möglich

**Bärische Divergenz:** Kurs macht neue Hochs, RSI macht niedrigere Hochs → Trendumkehr nach unten möglich

### Einschränkungen

- In starken Trends kann der RSI lange überkauft/überverkauft bleiben
- Keine absolute Handelsstrategie – immer mit anderen Indikatoren kombinieren
- Vergangenheitsdaten garantieren keine zukünftigen Ergebnisse

### Praktische Anwendung in TradePilot

In der Chart-Ansicht kannst du den RSI(14) über den Indikator-Toggle aktivieren und im unteren Chartbereich beobachten.""",
            },
        ],
        "quiz": [
            {
                "question": "Was zeigt eine grüne (bullishe) Candlestick-Kerze an?",
                "options": [
                    "Der Kurs ist im Betrachtungszeitraum gestiegen",
                    "Das Volumen war überdurchschnittlich hoch",
                    "Der Kurs ist im Betrachtungszeitraum gefallen",
                    "Es gab keine Kursbewegung",
                ],
                "correct_index": 0,
                "explanation": "Eine grüne Kerze zeigt an, dass der Schlusskurs höher war als der Eröffnungskurs – der Kurs ist in diesem Zeitraum gestiegen.",
                "order": 1,
            },
            {
                "question": "Welcher gleitende Durchschnitt reagiert schneller auf aktuelle Kursbewegungen?",
                "options": [
                    "SMA (Simple Moving Average)",
                    "EMA (Exponential Moving Average)",
                    "Beide reagieren gleich schnell",
                    "Keiner der beiden – GDs sind verzögert",
                ],
                "correct_index": 1,
                "explanation": "Der EMA gewichtet neuere Kurse stärker, weshalb er schneller auf aktuelle Marktbewegungen reagiert als der SMA.",
                "order": 2,
            },
            {
                "question": "Was signalisiert ein RSI-Wert von über 70?",
                "options": [
                    "Das Wertpapier ist überverkauft",
                    "Das Wertpapier ist überkauft – ein Rückgang ist möglich",
                    "Der Trend ist besonders stark und wird anhalten",
                    "Der Kurs ist in einer neutralen Zone",
                ],
                "correct_index": 1,
                "explanation": "Ein RSI > 70 gilt als Warnsignal: Das Wertpapier könnte überkauft sein, was eine potenzielle Kurskorrektur andeutet. Es ist jedoch kein sicheres Verkaufssignal.",
                "order": 3,
            },
        ],
    },
    {
        "title": "Risikomanagement",
        "description": "Schütze dein Kapital durch Diversifikation, Stop-Loss-Strategien und sinnvolles Position Sizing.",
        "order": 3,
        "lessons": [
            {
                "title": "Diversifikation – Das einzige kostenlose Mittagessen",
                "order": 1,
                "content": """## Diversifikation

Der Nobelpreisträger Harry Markowitz nannte Diversifikation das „einzige kostenlose Mittagessen" im Finanzbereich. Gemeint ist: Durch Streuung lässt sich Risiko reduzieren, ohne die erwartete Rendite proportional zu senken.

### Was ist Diversifikation?

Diversifikation bedeutet, Kapital auf verschiedene Anlagen zu verteilen, die **nicht perfekt miteinander korreliert** sind. Wenn eine Anlage an Wert verliert, kompensiert eine andere den Verlust.

### Ebenen der Diversifikation

**1. Einzeltitel-Ebene**
Statt einer Aktie: 20–30 verschiedene Aktien aus unterschiedlichen Branchen

**2. Anlageklassen-Ebene**
Kombination aus Aktien, Anleihen, Rohstoffen, Immobilien

**3. Geografische Diversifikation**
USA, Europa, Emerging Markets, Asien

**4. Zeitliche Diversifikation (Cost Averaging)**
Regelmäßige Investitionen in gleichen Abständen statt Einmalinvestition

### Korrelation

Die **Korrelation** zwischen zwei Anlagen liegt zwischen -1 und +1:

- **+1:** Bewegen sich immer gleich → keine Diversifikation
- **0:** Unabhängig voneinander → gute Diversifikation
- **-1:** Bewegen sich entgegengesetzt → perfekte Absicherung

### Beispiel

Portfolio A: 100 % in einer Technologieaktie
Portfolio B: 50 % Technologieaktie + 25 % Anleihen + 25 % Gold

In einem Technologie-Crash verliert Portfolio A massiv, während Portfolio B durch Anleihen und Gold abgefedert wird.

> Ein breit gestreuter ETF auf den MSCI World enthält über 1.600 Aktien aus 23 Ländern – Diversifikation in einem einzigen Produkt.""",
            },
            {
                "title": "Stop-Loss – Verluste begrenzen",
                "order": 2,
                "content": """## Stop-Loss – Verluste begrenzen

Ein **Stop-Loss** ist eine Schutzorder, die eine Position automatisch verkauft, wenn der Kurs unter einen definierten Schwellenwert fällt. Er schützt vor emotionalen Entscheidungen und begrenzt Verluste.

### Warum Stop-Loss?

Ohne Stop-Loss neigen Anleger dazu, Verlustpositionen zu lange zu halten – in der Hoffnung auf Erholung. Das kann zu dramatischen Verlusten führen.

**Psychologisches Phänomen:** Loss Aversion (Verlustaversion) – Verluste fühlen sich doppelt so schlimm an wie gleichgroße Gewinne.

### Arten von Stop-Loss-Orders

**Fester Stop-Loss:**
Gesetzter Preis: z.B. Kauf bei 100 EUR, Stop-Loss bei 90 EUR (–10 %)

**Trailing Stop-Loss:**
Bewegt sich mit dem Kurs nach oben, bleibt aber bei Kursrückgängen stehen.
Beispiel: Trailing Stop 10 % – Kurs steigt auf 120 EUR → Stop bei 108 EUR

**Prozentbasiert:** Stop bei festem Prozentsatz unter Einstiegspreis
**ATR-basiert:** Stop basierend auf der durchschnittlichen Kursschwankung (Average True Range)

### Stop-Loss-Platzierung

| Strategie | Stop-Platzierung |
|---|---|
| Technisch | Unter wichtige Unterstützungszone |
| Prozentual | 5–10 % unter Einstieg |
| ATR-basiert | 2× ATR unter Einstieg |

### Grenzen des Stop-Loss

- **Gaps:** Kurs kann über den Stop hinaus springen (overnight)
- **Whipsaw:** Kurs berührt Stop kurz, dreht dann aber doch um
- **False Security:** Stop-Loss ersetzt keine Analyse

> Im Paper-Trading-Modus von TradePilot kannst du Strategien testen, ohne echtes Kapital zu riskieren.""",
            },
            {
                "title": "Position Sizing",
                "order": 3,
                "content": """## Position Sizing

**Position Sizing** bestimmt, wie viel Kapital du in eine einzelne Transaktion investierst. Es ist eines der wichtigsten Konzepte im Risikomanagement – und eines der am meisten unterschätzten.

### Die 1-%-Regel

Eine der bekanntesten Position-Sizing-Regeln: **Riskiere nie mehr als 1–2 % deines Gesamtkapitals in einem einzelnen Trade.**

**Beispiel:**
Kapital: 10.000 EUR
Maximaler Verlust pro Trade: 1 % = 100 EUR
Stop-Loss-Abstand: 5 %
→ Positionsgröße: 100 EUR / 5 % = **2.000 EUR** (20 % des Portfolios)

### Berechnung der Positionsgröße

```
Positionsgröße = (Kapital × Risiko%) / Stop-Loss%
```

### Warum ist Position Sizing wichtig?

Selbst bei einer Trefferquote von nur 40 % kannst du profitabel sein, wenn deine Gewinne größer sind als deine Verluste (**Chance-Risiko-Verhältnis, CRV**).

**Beispiel CRV 2:1:**
- 10 Trades, 4 Gewinner × 200 EUR = +800 EUR
- 6 Verlierer × 100 EUR = –600 EUR
- Nettogewinn: +200 EUR trotz 40 % Trefferquote

### Häufige Fehler

- **Overtrading:** Zu viele Positionen gleichzeitig
- **Revenge Trading:** Nach Verlust sofort mit größerer Position einsteigen
- **Ignorieren des CRV:** Ohne gutes Chance-Risiko-Verhältnis ist Profitabilität schwer

### Kelly-Kriterium

Eine mathematisch optimale Formel für die Positionsgröße:

```
f* = (p × b – q) / b
```

p = Gewinnwahrscheinlichkeit, q = 1 – p, b = Gewinn/Verlust-Verhältnis

In der Praxis wird oft ein halbes Kelly-Kriterium (Half-Kelly) verwendet, um das Risiko zu reduzieren.""",
            },
        ],
        "quiz": [
            {
                "question": "Was versteht man unter Diversifikation im Investmentbereich?",
                "options": [
                    "Möglichst viele Trades in kurzer Zeit ausführen",
                    "Das gesamte Kapital in die sicherste Anlage investieren",
                    "Kapital auf verschiedene, nicht perfekt korrelierte Anlagen verteilen",
                    "Nur in Anlagen mit garantierter Rendite investieren",
                ],
                "correct_index": 2,
                "explanation": "Diversifikation bedeutet Streuung über verschiedene Anlagen, die sich nicht gleichzeitig in dieselbe Richtung bewegen. Dadurch wird das Risiko gesenkt, ohne die erwartete Rendite proportional zu reduzieren.",
                "order": 1,
            },
            {
                "question": "Was ist ein Trailing Stop-Loss?",
                "options": [
                    "Ein Stop, der immer bei einem festen Preis liegt",
                    "Ein Stop, der mit steigendem Kurs nach oben nachzieht, bei Kursrückgängen aber stehen bleibt",
                    "Ein Stop, der nach jedem Trade manuell neu gesetzt werden muss",
                    "Ein Stop, der erst nach 30 Tagen aktiv wird",
                ],
                "correct_index": 1,
                "explanation": "Ein Trailing Stop zieht automatisch mit steigenden Kursen mit, um Gewinne zu sichern. Bei Kursrückgängen bleibt er auf dem erreichten Niveau stehen und löst dann die Verkaufsorder aus.",
                "order": 2,
            },
            {
                "question": "Welchen maximalen Verlust erlaubt die 1-%-Regel pro Trade bei einem Kapital von 5.000 EUR?",
                "options": [
                    "500 EUR",
                    "1 EUR",
                    "50 EUR",
                    "100 EUR",
                ],
                "correct_index": 2,
                "explanation": "Die 1-%-Regel besagt: Maximal 1 % des Gesamtkapitals pro Trade riskieren. Bei 5.000 EUR sind das 1 % = 50 EUR maximaler Verlust pro Position.",
                "order": 3,
            },
        ],
    },
]

GLOSSARY = [
    {"term": "Aktie", "definition": "Anteilsschein an einem Unternehmen. Aktionäre sind Miteigentümer und können an Gewinnen (Dividenden) und Kursgewinnen teilhaben.", "order": 1},
    {"term": "ETF", "definition": "Exchange Traded Fund – ein börsengehandelter Fonds, der einen Index oder eine Anlagestrategie nachbildet. Ermöglicht breite Diversifikation mit einem einzigen Kauf.", "order": 2},
    {"term": "IPO", "definition": "Initial Public Offering – der Börsengang eines Unternehmens. Erstmals werden Aktien an der Börse zum Kauf angeboten.", "order": 3},
    {"term": "Dividende", "definition": "Gewinnausschüttung eines Unternehmens an seine Aktionäre. Nicht alle Unternehmen zahlen Dividenden – Wachstumsunternehmen reinvestieren Gewinne oft.", "order": 4},
    {"term": "SMA", "definition": "Simple Moving Average – einfacher gleitender Durchschnitt. Berechnet den arithmetischen Mittelwert der letzten N Schlusskurse.", "order": 5},
    {"term": "EMA", "definition": "Exponential Moving Average – exponentiell gewichteter gleitender Durchschnitt. Gibt neueren Kursen mehr Gewicht und reagiert schneller als der SMA.", "order": 6},
    {"term": "RSI", "definition": "Relative Strength Index – Momentum-Indikator (0–100). Werte > 70 gelten als überkauft, Werte < 30 als überverkauft.", "order": 7},
    {"term": "Stop-Loss", "definition": "Schutzorder, die eine Position automatisch verkauft, wenn der Kurs unter einen definierten Schwellenwert fällt. Begrenzt Verluste.", "order": 8},
    {"term": "Diversifikation", "definition": "Streuung von Kapital auf verschiedene Anlagen, die nicht perfekt miteinander korreliert sind, um das Risiko zu senken.", "order": 9},
    {"term": "Position Sizing", "definition": "Bestimmung der optimalen Investitionsgröße pro Trade, basierend auf Kapital, Risikotoleranz und Stop-Loss-Abstand.", "order": 10},
    {"term": "Candlestick", "definition": "Kerzendiagramm – zeigt für jeden Zeitraum Eröffnung, Schluss, Hoch und Tief eines Wertpapiers. Grün = gestiegen, Rot = gefallen.", "order": 11},
    {"term": "Bullish / Bearish", "definition": "Bullish bedeutet steigende Kurse/positiver Ausblick (wie ein Stier, der nach oben stößt). Bearish bedeutet fallende Kurse/negativer Ausblick (wie ein Bär, der nach unten schlägt).", "order": 12},
    {"term": "Market Cap", "definition": "Marktkapitalisierung – Gesamtwert aller ausgegebenen Aktien eines Unternehmens. Berechnung: Kurs × Anzahl der Aktien.", "order": 13},
    {"term": "P/E-Ratio", "definition": "Kurs-Gewinn-Verhältnis (KGV). Zeigt, wie teuer eine Aktie im Verhältnis zum Gewinn des Unternehmens ist. Formel: Kurs / Gewinn je Aktie.", "order": 14},
    {"term": "Volatilität", "definition": "Maß für die Schwankungsbreite eines Wertpapiers. Hohe Volatilität bedeutet starke Kursschwankungen und damit höheres Risiko, aber auch höhere Chancen.", "order": 15},
    {"term": "Liquidität", "definition": "Wie leicht ein Wertpapier ohne Kursbeeinflussung ge- oder verkauft werden kann. Hochliquide Aktien (z.B. Apple, Microsoft) haben enge Spreads.", "order": 16},
    {"term": "Spread", "definition": "Differenz zwischen dem besten Kaufangebot (Ask) und dem besten Verkaufsangebot (Bid). Kleiner Spread = hohe Liquidität.", "order": 17},
    {"term": "CRV", "definition": "Chance-Risiko-Verhältnis – Verhältnis von potenziellem Gewinn zu potenziellem Verlust eines Trades. Ein CRV von 2:1 bedeutet doppelter Gewinn bei gleichem Verlustrisiko.", "order": 18},
]


async def seed_learning_data(db: AsyncSession) -> None:
    result = await db.execute(select(LearningModule).limit(1))
    if result.scalar_one_or_none() is not None:
        return

    for mod_data in MODULES:
        module = LearningModule(
            title=mod_data["title"],
            description=mod_data["description"],
            order=mod_data["order"],
        )
        db.add(module)
        await db.flush()

        for lesson_data in mod_data["lessons"]:
            lesson = Lesson(
                module_id=module.id,
                title=lesson_data["title"],
                content=lesson_data["content"],
                order=lesson_data["order"],
            )
            db.add(lesson)

        for q_data in mod_data["quiz"]:
            question = QuizQuestion(
                module_id=module.id,
                question=q_data["question"],
                options=q_data["options"],
                correct_index=q_data["correct_index"],
                explanation=q_data["explanation"],
                order=q_data["order"],
            )
            db.add(question)

    result = await db.execute(select(GlossaryEntry).limit(1))
    if result.scalar_one_or_none() is None:
        for entry_data in GLOSSARY:
            entry = GlossaryEntry(
                term=entry_data["term"],
                definition=entry_data["definition"],
                order=entry_data["order"],
            )
            db.add(entry)

    await db.commit()
