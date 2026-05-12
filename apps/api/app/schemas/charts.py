from pydantic import BaseModel


class OHLCVBar(BaseModel):
    t: str   # ISO-8601 timestamp
    o: float
    h: float
    l: float
    c: float
    v: float


class ChartResponse(BaseModel):
    symbol: str
    period: str
    bars: list[OHLCVBar]
