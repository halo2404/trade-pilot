"""Deterministic mock OHLCV generator. Seeded by symbol so results are stable."""

import math
import random
from datetime import UTC, datetime, timedelta


class _Rng:
    """Thin wrapper around random.Random so the seed is symbol-specific."""

    def __init__(self, symbol: str, extra: int = 0) -> None:
        self._r = random.Random(hash(symbol.upper()) ^ extra)

    def gauss(self, mu: float, sigma: float) -> float:
        return self._r.gauss(mu, sigma)

    def uniform(self, a: float, b: float) -> float:
        return self._r.uniform(a, b)

    def random(self) -> float:
        return self._r.random()


# period_key -> (n_bars, bar_minutes, volatility_per_bar)
_PERIOD_CONFIG: dict[str, tuple[int, int, float]] = {
    "1T":  (78,  5,    0.003),   # intraday 5-min bars (6.5h)
    "1W":  (35,  60,   0.008),   # hourly bars (~1 week)
    "1M":  (30,  1440, 0.015),   # daily bars (1 month)
    "3M":  (90,  1440, 0.015),   # daily bars (3 months)
    "1J":  (252, 1440, 0.015),   # daily bars (1 trading year)
    "MAX": (260, 10080, 0.025),  # weekly bars (~5 years)
}


def generate_ohlcv(
    symbol: str,
    current_price: float,
    period: str,
) -> list[dict]:
    if period not in _PERIOD_CONFIG:
        period = "1M"

    n_bars, bar_minutes, vol = _PERIOD_CONFIG[period]
    rng = _Rng(symbol, n_bars)

    # Build a random walk forward from an arbitrary start, then scale
    price = current_price * rng.uniform(0.60, 0.95)
    bars: list[dict] = []

    now = datetime.now(UTC).replace(second=0, microsecond=0)
    start_dt = now - timedelta(minutes=n_bars * bar_minutes)

    # slight upward drift so chart doesn't always end lower
    drift = rng.uniform(-0.0002, 0.0005)

    for i in range(n_bars):
        open_ = price
        pct = rng.gauss(drift, vol)
        close = open_ * (1 + pct)

        wick_up = abs(rng.gauss(0, vol * 0.4))
        wick_dn = abs(rng.gauss(0, vol * 0.4))
        high = max(open_, close) * (1 + wick_up)
        low = min(open_, close) * (1 - wick_dn)

        # volume: higher on bigger moves
        base_vol = current_price * 10_000
        volume = abs(rng.gauss(base_vol, base_vol * 0.3 * (1 + abs(pct) * 10)))

        t = start_dt + timedelta(minutes=i * bar_minutes)
        bars.append(
            {
                "t": t.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "o": round(open_, 4),
                "h": round(high, 4),
                "l": round(low, 4),
                "c": round(close, 4),
                "v": round(max(0.0, volume), 2),
            }
        )
        price = close

    # ── Scale so the last close equals current_price ──────────────────
    if price != 0:
        scale = current_price / price
        for bar in bars:
            bar["o"] = round(bar["o"] * scale, 4)
            bar["h"] = round(bar["h"] * scale, 4)
            bar["l"] = round(bar["l"] * scale, 4)
            bar["c"] = round(bar["c"] * scale, 4)

    return bars
