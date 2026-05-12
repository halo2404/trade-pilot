from typing import Literal

from fastapi import APIRouter, HTTPException, Query, status

from app.data.mock_assets import get_asset
from app.data.mock_ohlcv import generate_ohlcv
from app.schemas.charts import ChartResponse, OHLCVBar

Period = Literal["1T", "1W", "1M", "3M", "1J", "MAX"]

router = APIRouter(prefix="/assets", tags=["charts"])


@router.get("/{symbol}/chart", response_model=ChartResponse)
async def get_chart(
    symbol: str,
    period: Period = Query(default="1M"),
) -> ChartResponse:
    asset = get_asset(symbol)
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset nicht gefunden.")

    raw_bars = generate_ohlcv(symbol, asset["price"], period)
    bars = [OHLCVBar(**b) for b in raw_bars]
    return ChartResponse(symbol=asset["symbol"], period=period, bars=bars)
