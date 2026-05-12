# Performance Tests – TradePilot

Lasttests mit [Locust](https://locust.io).

## Installation

```bash
pip install locust
```

## Ausführen (interaktiv)

```bash
# Aus dem Projekt-Root:
locust -f tests/performance/locustfile.py --host http://localhost:8000
# Browser öffnen: http://localhost:8089
```

## Headless (CI / Staging)

```bash
locust -f tests/performance/locustfile.py \
  --host https://api.staging.tradepilot.de \
  --headless \
  -u 100 -r 10 \
  --run-time 120s \
  --csv results/perf_$(date +%Y%m%d)
```

## Ziel-SLAs

| Endpunkt | p95-Latenz | Fehlerquote |
|---|---|---|
| `GET /health` | < 50 ms | 0 % |
| `GET /assets/search` | < 200 ms | < 0,1 % |
| `GET /watchlist` | < 300 ms | < 0,1 % |
| `GET /portfolio` | < 400 ms | < 0,1 % |
| `POST /portfolio/orders` | < 800 ms | < 0,5 % |
| `GET /learning/modules` | < 300 ms | < 0,1 % |

## User-Profile

| Klasse | Beschreibung | Anteil |
|---|---|---|
| `TradePilotUser` | Vollständiger Nutzer (Login + alle Aktionen) | 80 % |
| `ReadOnlyUser` | Nur Health-Checks (Monitoring-Simulation) | 20 % |
