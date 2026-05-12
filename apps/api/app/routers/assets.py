from fastapi import APIRouter, HTTPException, Query, status

from app.core.deps import get_current_user  # noqa: F401 – imported for consistency, used via Depends
from app.data.mock_assets import get_asset, search_assets
from app.schemas.watchlist import AssetResponse

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("/search", response_model=list[AssetResponse])
async def search(
    q: str = Query(..., min_length=1, max_length=50, description="Symbol oder Name"),
) -> list[AssetResponse]:
    results = search_assets(q)
    return [AssetResponse(**a) for a in results]


@router.get("/{symbol}", response_model=AssetResponse)
async def get_asset_detail(symbol: str) -> AssetResponse:
    asset = get_asset(symbol)
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset nicht gefunden.")
    return AssetResponse(**asset)
