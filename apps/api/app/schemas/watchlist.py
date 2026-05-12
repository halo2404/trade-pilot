import uuid
from datetime import datetime

from pydantic import BaseModel, field_validator


class AssetResponse(BaseModel):
    symbol: str
    name: str
    asset_type: str
    price: float
    change_24h: float
    currency: str
    exchange: str


class WatchlistAddRequest(BaseModel):
    symbol: str

    @field_validator("symbol")
    @classmethod
    def normalize(cls, v: str) -> str:
        return v.strip().upper()


class WatchlistItemResponse(BaseModel):
    id: uuid.UUID
    symbol: str
    added_at: datetime
    asset: AssetResponse | None = None

    model_config = {"from_attributes": True}
