import uuid
from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, field_validator


# ── Requests ──────────────────────────────────────────────────────────

class OrderRequest(BaseModel):
    symbol: str
    side: Literal["buy", "sell"]
    quantity: Decimal

    @field_validator("symbol")
    @classmethod
    def normalize(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("quantity")
    @classmethod
    def positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Menge muss größer als 0 sein.")
        return v


# ── Responses ─────────────────────────────────────────────────────────

class PositionResponse(BaseModel):
    id: uuid.UUID
    symbol: str
    quantity: Decimal
    avg_cost: Decimal
    # enriched fields (computed in router)
    current_price: float | None = None
    asset_name: str | None = None
    current_value: float | None = None
    cost_basis: float | None = None
    pnl: float | None = None
    pnl_pct: float | None = None

    model_config = {"from_attributes": True}


class TradeResponse(BaseModel):
    id: uuid.UUID
    symbol: str
    side: str
    quantity: Decimal
    price: Decimal
    total_value: Decimal
    executed_at: datetime

    model_config = {"from_attributes": True}


class PortfolioResponse(BaseModel):
    id: uuid.UUID
    cash_balance: Decimal
    initial_capital: Decimal
    positions: list[PositionResponse]
    # computed
    invested_value: float
    total_value: float
    total_pnl: float
    total_pnl_pct: float

    model_config = {"from_attributes": True}
