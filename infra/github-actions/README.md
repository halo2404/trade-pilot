# infra/github-actions

Wiederverwendbare GitHub Actions Workflows für TradePilot.

## Vorhandene Workflows

| Datei | Pfad | Zweck |
|---|---|---|
| `ci.yml` | `.github/workflows/ci.yml` | Haupt-CI: Lint → Test → Build → E2E |

## Reusable Workflows

Wiederverwendbare Workflows liegen in diesem Verzeichnis und werden von
`.github/workflows/` via `uses:` referenziert.

| Datei | Zweck |
|---|---|
| `python-setup.yml` | Python-Umgebung aufsetzen (Cache + Dependencies) |

## CI-Pipeline Übersicht

```
push / PR
    │
    ├── backend-lint   (Ruff + Mypy)
    │       │
    │       └── backend-test   (pytest + PostgreSQL + Redis)
    │
    ├── frontend-lint  (tsc + ESLint)
    │       │
    │       └── frontend-test  (Vitest + Coverage)
    │               │
    │               └── frontend-build  (Next.js)
    │
    └── e2e  (Playwright — nur auf main)
              depends_on: backend-test + frontend-build
```

## Secrets (in GitHub Repository Settings eintragen)

| Secret | Zweck |
|---|---|
| `CODECOV_TOKEN` | Coverage-Upload zu Codecov |
| `ANTHROPIC_API_KEY` | KI-Assistent (optional, Fallback auf Mock) |
