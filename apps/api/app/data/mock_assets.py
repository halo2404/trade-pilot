"""Static mock asset catalogue. No real-time data – educational use only."""

from typing import TypedDict


class MockAsset(TypedDict):
    symbol: str
    name: str
    asset_type: str   # "stock" | "etf" | "crypto"
    price: float
    change_24h: float  # percentage
    currency: str
    exchange: str


MOCK_ASSETS: list[MockAsset] = [
    # ── Aktien USA ────────────────────────────────────────────────────
    {"symbol": "AAPL",  "name": "Apple Inc.",                 "asset_type": "stock", "price": 189.30, "change_24h":  1.24, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "MSFT",  "name": "Microsoft Corporation",      "asset_type": "stock", "price": 415.50, "change_24h":  0.87, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "GOOGL", "name": "Alphabet Inc.",               "asset_type": "stock", "price": 176.80, "change_24h": -0.42, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "AMZN",  "name": "Amazon.com Inc.",             "asset_type": "stock", "price": 197.10, "change_24h":  2.10, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "NVDA",  "name": "NVIDIA Corporation",          "asset_type": "stock", "price": 875.40, "change_24h":  3.55, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "META",  "name": "Meta Platforms Inc.",         "asset_type": "stock", "price": 523.20, "change_24h":  1.78, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "TSLA",  "name": "Tesla Inc.",                  "asset_type": "stock", "price": 248.50, "change_24h": -2.30, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "NFLX",  "name": "Netflix Inc.",                "asset_type": "stock", "price": 665.90, "change_24h":  0.55, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "AMD",   "name": "Advanced Micro Devices",      "asset_type": "stock", "price": 168.20, "change_24h":  2.88, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "INTC",  "name": "Intel Corporation",           "asset_type": "stock", "price":  28.40, "change_24h": -1.10, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "JPM",   "name": "JPMorgan Chase & Co.",        "asset_type": "stock", "price": 210.30, "change_24h":  0.33, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "BAC",   "name": "Bank of America Corp.",       "asset_type": "stock", "price":  40.10, "change_24h": -0.25, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "WMT",   "name": "Walmart Inc.",                "asset_type": "stock", "price":  68.90, "change_24h":  0.60, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "DIS",   "name": "The Walt Disney Company",     "asset_type": "stock", "price":  95.20, "change_24h": -0.80, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "V",     "name": "Visa Inc.",                   "asset_type": "stock", "price": 280.60, "change_24h":  0.95, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "MA",    "name": "Mastercard Incorporated",     "asset_type": "stock", "price": 495.80, "change_24h":  1.05, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "PFE",   "name": "Pfizer Inc.",                 "asset_type": "stock", "price":  27.80, "change_24h": -0.50, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "KO",    "name": "The Coca-Cola Company",       "asset_type": "stock", "price":  62.40, "change_24h":  0.20, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "MCD",   "name": "McDonald's Corporation",      "asset_type": "stock", "price": 305.70, "change_24h":  0.45, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "BRKB",  "name": "Berkshire Hathaway Class B",  "asset_type": "stock", "price": 432.50, "change_24h":  0.18, "currency": "USD", "exchange": "NYSE"},
    # ── Aktien Deutschland ────────────────────────────────────────────
    {"symbol": "SAP",   "name": "SAP SE",                      "asset_type": "stock", "price": 218.40, "change_24h":  1.30, "currency": "EUR", "exchange": "XETRA"},
    {"symbol": "SIE",   "name": "Siemens AG",                  "asset_type": "stock", "price": 192.60, "change_24h":  0.70, "currency": "EUR", "exchange": "XETRA"},
    {"symbol": "ALV",   "name": "Allianz SE",                  "asset_type": "stock", "price": 280.90, "change_24h":  0.40, "currency": "EUR", "exchange": "XETRA"},
    {"symbol": "BMW",   "name": "BMW AG",                      "asset_type": "stock", "price":  84.50, "change_24h": -0.60, "currency": "EUR", "exchange": "XETRA"},
    {"symbol": "VOW3",  "name": "Volkswagen AG",               "asset_type": "stock", "price":  96.20, "change_24h": -1.20, "currency": "EUR", "exchange": "XETRA"},
    {"symbol": "DBK",   "name": "Deutsche Bank AG",            "asset_type": "stock", "price":  14.80, "change_24h":  0.85, "currency": "EUR", "exchange": "XETRA"},
    {"symbol": "MBG",   "name": "Mercedes-Benz Group AG",      "asset_type": "stock", "price":  65.30, "change_24h": -0.30, "currency": "EUR", "exchange": "XETRA"},
    {"symbol": "BAS",   "name": "BASF SE",                     "asset_type": "stock", "price":  44.90, "change_24h": -0.90, "currency": "EUR", "exchange": "XETRA"},
    # ── ETFs ──────────────────────────────────────────────────────────
    {"symbol": "SPY",   "name": "SPDR S&P 500 ETF Trust",      "asset_type": "etf",   "price": 527.80, "change_24h":  0.75, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "QQQ",   "name": "Invesco QQQ Trust (NASDAQ)",  "asset_type": "etf",   "price": 448.30, "change_24h":  1.10, "currency": "USD", "exchange": "NASDAQ"},
    {"symbol": "VTI",   "name": "Vanguard Total Stock Market", "asset_type": "etf",   "price": 241.50, "change_24h":  0.60, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "IWDA",  "name": "iShares MSCI World ETF",      "asset_type": "etf",   "price":  95.40, "change_24h":  0.55, "currency": "USD", "exchange": "XETRA"},
    {"symbol": "VWRL",  "name": "Vanguard FTSE All-World ETF", "asset_type": "etf",   "price": 104.20, "change_24h":  0.48, "currency": "USD", "exchange": "XETRA"},
    {"symbol": "EXS1",  "name": "iShares Core DAX UCITS ETF",  "asset_type": "etf",   "price": 148.30, "change_24h":  0.90, "currency": "EUR", "exchange": "XETRA"},
    {"symbol": "GLD",   "name": "SPDR Gold Shares ETF",        "asset_type": "etf",   "price": 228.60, "change_24h":  0.30, "currency": "USD", "exchange": "NYSE"},
    {"symbol": "TLT",   "name": "iShares 20+ Year Treasury",   "asset_type": "etf",   "price":  86.40, "change_24h": -0.20, "currency": "USD", "exchange": "NASDAQ"},
    # ── Kryptowährungen ───────────────────────────────────────────────
    {"symbol": "BTC",   "name": "Bitcoin",                     "asset_type": "crypto", "price": 67420.00, "change_24h":  2.15, "currency": "USD", "exchange": "Crypto"},
    {"symbol": "ETH",   "name": "Ethereum",                    "asset_type": "crypto", "price":  3540.00, "change_24h":  1.80, "currency": "USD", "exchange": "Crypto"},
    {"symbol": "BNB",   "name": "BNB",                         "asset_type": "crypto", "price":   610.00, "change_24h":  0.65, "currency": "USD", "exchange": "Crypto"},
    {"symbol": "SOL",   "name": "Solana",                      "asset_type": "crypto", "price":   178.50, "change_24h":  3.40, "currency": "USD", "exchange": "Crypto"},
    {"symbol": "XRP",   "name": "XRP",                         "asset_type": "crypto", "price":     0.62, "change_24h": -1.20, "currency": "USD", "exchange": "Crypto"},
    {"symbol": "ADA",   "name": "Cardano",                     "asset_type": "crypto", "price":     0.47, "change_24h":  0.90, "currency": "USD", "exchange": "Crypto"},
    {"symbol": "DOGE",  "name": "Dogecoin",                    "asset_type": "crypto", "price":     0.16, "change_24h":  1.50, "currency": "USD", "exchange": "Crypto"},
]

_INDEX: dict[str, MockAsset] = {a["symbol"].upper(): a for a in MOCK_ASSETS}


def search_assets(query: str, limit: int = 20) -> list[MockAsset]:
    q = query.strip().upper()
    if not q:
        return []
    results = [
        a for a in MOCK_ASSETS
        if q in a["symbol"].upper() or q in a["name"].upper()
    ]
    return results[:limit]


def get_asset(symbol: str) -> MockAsset | None:
    return _INDEX.get(symbol.upper())
