"""TradePilot – Locust Performance Tests

Testet die kritischen API-Endpunkte unter Last.

Voraussetzungen:
    pip install locust

Ausführen (lokale Instanz auf Port 8000):
    locust -f tests/performance/locustfile.py --host http://localhost:8000

    # Headless (CI/Staging):
    locust -f tests/performance/locustfile.py \
        --host http://localhost:8000 \
        --headless -u 50 -r 5 --run-time 60s \
        --csv results/perf

Zielwerte (SLA):
    - p95-Latenz < 500 ms für GET-Endpunkte
    - p95-Latenz < 1000 ms für POST /portfolio/orders
    - Fehlerquote < 0,5 %
"""
import random
import string

from locust import HttpUser, between, task


def _random_email() -> str:
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"perf_{suffix}@test.example"


class TradePilotUser(HttpUser):
    """Simuliert einen typischen Plattform-Nutzer."""

    wait_time = between(0.5, 2.0)

    def on_start(self) -> None:
        """Registrierung + Login beim Start jedes virtuellen Users."""
        self.email = _random_email()
        self.password = "perf_sicher123"
        self.token: str | None = None

        # Registrieren
        resp = self.client.post(
            "/auth/register",
            json={"email": self.email, "password": self.password},
            name="/auth/register",
        )
        if resp.status_code not in (201, 409):
            return

        # Login
        resp = self.client.post(
            "/auth/login",
            json={"email": self.email, "password": self.password},
            name="/auth/login",
        )
        if resp.status_code == 200:
            self.token = resp.json().get("access_token")

    def _auth(self) -> dict:
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    # ── Häufig aufgerufene Endpunkte (Gewichtung: hoch) ──────────────

    @task(10)
    def get_health(self) -> None:
        self.client.get("/health", name="/health")

    @task(8)
    def search_assets(self) -> None:
        query = random.choice(["AAPL", "BTC", "ETF", "Tesla", "Gold"])
        self.client.get(f"/assets/search?q={query}", headers=self._auth(), name="/assets/search")

    @task(6)
    def get_watchlist(self) -> None:
        self.client.get("/watchlist", headers=self._auth(), name="/watchlist GET")

    @task(5)
    def get_portfolio(self) -> None:
        self.client.get("/portfolio", headers=self._auth(), name="/portfolio GET")

    @task(4)
    def get_chart(self) -> None:
        symbol = random.choice(["AAPL", "MSFT", "TSLA", "BTC-USD", "VOO"])
        period = random.choice(["1d", "1w", "1m", "3m"])
        self.client.get(
            f"/assets/{symbol}/chart?period={period}",
            headers=self._auth(),
            name="/assets/[symbol]/chart",
        )

    @task(4)
    def get_learning_modules(self) -> None:
        self.client.get("/learning/modules", headers=self._auth(), name="/learning/modules")

    @task(3)
    def get_glossary(self) -> None:
        self.client.get("/learning/glossary", headers=self._auth(), name="/learning/glossary")

    # ── Schreibzugriffe (Gewichtung: mittel) ─────────────────────────

    @task(3)
    def place_order(self) -> None:
        symbol = random.choice(["AAPL", "MSFT", "TSLA"])
        qty = round(random.uniform(0.1, 2.0), 2)
        self.client.post(
            "/portfolio/orders",
            json={"symbol": symbol, "side": "buy", "quantity": qty},
            headers=self._auth(),
            name="/portfolio/orders POST",
        )

    @task(2)
    def add_to_watchlist(self) -> None:
        symbol = random.choice(["AAPL", "MSFT", "NVDA", "AMZN", "GOOG"])
        self.client.post(
            "/watchlist",
            json={"symbol": symbol},
            headers=self._auth(),
            name="/watchlist POST",
        )

    @task(2)
    def get_trade_journal(self) -> None:
        self.client.get(
            "/portfolio/trades?limit=20",
            headers=self._auth(),
            name="/portfolio/trades",
        )

    @task(1)
    def create_chat_session(self) -> None:
        self.client.post(
            "/chat/sessions",
            headers=self._auth(),
            name="/chat/sessions POST",
        )


class ReadOnlyUser(HttpUser):
    """Simuliert einen lesenden Nutzer (z.B. für Monitoring-Dashboards)."""

    wait_time = between(1.0, 3.0)

    @task
    def health_check(self) -> None:
        self.client.get("/health")
