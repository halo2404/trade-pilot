# infra/docker

Docker-Konfigurationen und Dokumentation für TradePilot.

## Dateien

| Datei | Zweck |
|---|---|
| `../../docker-compose.yml` | Lokale Entwicklung (PostgreSQL + Redis + API + Web) |
| `../../docker-compose.staging.yml` | Staging-Umgebung mit Traefik |
| `../../apps/api/Dockerfile` | Production-Image für das FastAPI-Backend |
| `../../apps/web/Dockerfile` | Production-Image für das Next.js-Frontend |

## Lokale Entwicklung

```bash
# Nur Infrastruktur starten (DB + Redis)
docker compose up -d db redis

# Vollständiger Stack
docker compose up --build
```

## Staging

```bash
docker compose -f docker-compose.staging.yml up -d
```

## Port-Übersicht

| Service | Port |
|---|---|
| FastAPI Backend | 8000 |
| Next.js Frontend | 3000 |
| PostgreSQL | 5432 |
| Redis | 6379 |

## Image-Konventionen

- Multi-Stage Builds für minimale Image-Größe
- Non-root User in Production-Images
- Healthchecks für alle Services
- `.dockerignore` in jedem App-Verzeichnis
