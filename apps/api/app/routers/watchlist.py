import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.data.mock_assets import get_asset
from app.models.user import User
from app.models.watchlist import WatchlistItem
from app.schemas.watchlist import AssetResponse, WatchlistAddRequest, WatchlistItemResponse

router = APIRouter(prefix="/watchlist", tags=["watchlist"])


def _enrich(item: WatchlistItem) -> WatchlistItemResponse:
    asset_data = get_asset(item.symbol)
    return WatchlistItemResponse(
        id=item.id,
        symbol=item.symbol,
        added_at=item.added_at,
        asset=AssetResponse(**asset_data) if asset_data else None,
    )


@router.get("", response_model=list[WatchlistItemResponse])
async def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[WatchlistItemResponse]:
    result = await db.execute(
        select(WatchlistItem)
        .where(WatchlistItem.user_id == current_user.id)
        .order_by(WatchlistItem.added_at.desc())
    )
    items = result.scalars().all()
    return [_enrich(item) for item in items]


@router.post("", response_model=WatchlistItemResponse, status_code=status.HTTP_201_CREATED)
async def add_to_watchlist(
    body: WatchlistAddRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> WatchlistItemResponse:
    if not get_asset(body.symbol):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset nicht gefunden.")

    existing = await db.execute(
        select(WatchlistItem).where(
            WatchlistItem.user_id == current_user.id,
            WatchlistItem.symbol == body.symbol,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Asset bereits in der Watchlist.")

    item = WatchlistItem(user_id=current_user.id, symbol=body.symbol)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return _enrich(item)


@router.delete("/{symbol}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_watchlist(
    symbol: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    result = await db.execute(
        delete(WatchlistItem).where(
            WatchlistItem.user_id == current_user.id,
            WatchlistItem.symbol == symbol.upper(),
        )
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset nicht in der Watchlist.")
    await db.commit()
