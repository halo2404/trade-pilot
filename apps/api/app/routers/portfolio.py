from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.data.mock_assets import get_asset
from app.models.portfolio import INITIAL_CAPITAL, Portfolio, Position, Trade
from app.models.user import User
from app.schemas.portfolio import (
    OrderRequest,
    PortfolioResponse,
    PositionResponse,
    TradeResponse,
)

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


# ── Helpers ───────────────────────────────────────────────────────────

async def _get_or_create_portfolio(user: User, db: AsyncSession) -> Portfolio:
    result = await db.execute(select(Portfolio).where(Portfolio.user_id == user.id))
    portfolio = result.scalar_one_or_none()
    if not portfolio:
        portfolio = Portfolio(user_id=user.id)
        db.add(portfolio)
        await db.commit()
        await db.refresh(portfolio)
    return portfolio


def _enrich_position(pos: Position) -> PositionResponse:
    asset = get_asset(pos.symbol)
    current_price = float(asset["price"]) if asset else None
    qty = float(pos.quantity)
    cost = float(pos.avg_cost)

    current_value = qty * current_price if current_price else None
    cost_basis = qty * cost
    pnl = (current_value - cost_basis) if current_value is not None else None
    pnl_pct = (pnl / cost_basis * 100) if (pnl is not None and cost_basis != 0) else None

    return PositionResponse(
        id=pos.id,
        symbol=pos.symbol,
        quantity=pos.quantity,
        avg_cost=pos.avg_cost,
        asset_name=asset["name"] if asset else None,
        current_price=current_price,
        current_value=current_value,
        cost_basis=cost_basis,
        pnl=pnl,
        pnl_pct=pnl_pct,
    )


def _build_portfolio_response(portfolio: Portfolio, positions: list[Position]) -> PortfolioResponse:
    enriched = [_enrich_position(p) for p in positions]

    invested = sum(p.current_value or 0.0 for p in enriched)
    total = float(portfolio.cash_balance) + invested
    initial = float(portfolio.initial_capital)
    pnl = total - initial
    pnl_pct = (pnl / initial * 100) if initial else 0.0

    return PortfolioResponse(
        id=portfolio.id,
        cash_balance=portfolio.cash_balance,
        initial_capital=portfolio.initial_capital,
        positions=enriched,
        invested_value=invested,
        total_value=total,
        total_pnl=pnl,
        total_pnl_pct=pnl_pct,
    )


# ── Endpoints ─────────────────────────────────────────────────────────

@router.get("", response_model=PortfolioResponse)
async def get_portfolio(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PortfolioResponse:
    portfolio = await _get_or_create_portfolio(current_user, db)
    result = await db.execute(select(Position).where(Position.portfolio_id == portfolio.id))
    positions = list(result.scalars().all())
    return _build_portfolio_response(portfolio, positions)


@router.post("/orders", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def place_order(
    body: OrderRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PortfolioResponse:
    asset = get_asset(body.symbol)
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset nicht gefunden.")

    portfolio = await _get_or_create_portfolio(current_user, db)
    exec_price = Decimal(str(asset["price"]))
    total_cost = exec_price * body.quantity

    result = await db.execute(
        select(Position).where(
            Position.portfolio_id == portfolio.id,
            Position.symbol == body.symbol,
        )
    )
    position = result.scalar_one_or_none()

    if body.side == "buy":
        if portfolio.cash_balance < total_cost:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Nicht genug Kapital. Verfügbar: {portfolio.cash_balance:.2f}, Benötigt: {total_cost:.2f}.",
            )
        portfolio.cash_balance -= total_cost

        if position:
            # weighted average cost
            old_total = position.quantity * position.avg_cost
            new_total = body.quantity * exec_price
            position.quantity += body.quantity
            position.avg_cost = (old_total + new_total) / position.quantity
        else:
            position = Position(
                portfolio_id=portfolio.id,
                symbol=body.symbol,
                quantity=body.quantity,
                avg_cost=exec_price,
            )
            db.add(position)

    else:  # sell
        if not position or position.quantity < body.quantity:
            held = float(position.quantity) if position else 0
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Nicht genug Anteile. Gehalten: {held:.4f}, Verkauf: {float(body.quantity):.4f}.",
            )
        portfolio.cash_balance += total_cost
        position.quantity -= body.quantity

        if position.quantity <= Decimal("0"):
            await db.delete(position)

    trade = Trade(
        portfolio_id=portfolio.id,
        symbol=body.symbol,
        side=body.side,  # type: ignore[arg-type]
        quantity=body.quantity,
        price=exec_price,
    )
    db.add(trade)
    await db.commit()
    await db.refresh(portfolio)

    all_positions_result = await db.execute(
        select(Position).where(Position.portfolio_id == portfolio.id)
    )
    return _build_portfolio_response(portfolio, list(all_positions_result.scalars().all()))


@router.get("/trades", response_model=list[TradeResponse])
async def get_trades(
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[TradeResponse]:
    portfolio = await _get_or_create_portfolio(current_user, db)
    result = await db.execute(
        select(Trade)
        .where(Trade.portfolio_id == portfolio.id)
        .order_by(Trade.executed_at.desc())
        .offset(offset)
        .limit(limit)
    )
    trades = result.scalars().all()
    return [
        TradeResponse(
            id=t.id,
            symbol=t.symbol,
            side=t.side.value,
            quantity=t.quantity,
            price=t.price,
            total_value=t.quantity * t.price,
            executed_at=t.executed_at,
        )
        for t in trades
    ]


@router.delete("/reset", status_code=status.HTTP_204_NO_CONTENT)
async def reset_portfolio(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    portfolio = await _get_or_create_portfolio(current_user, db)
    await db.execute(delete(Position).where(Position.portfolio_id == portfolio.id))
    await db.execute(delete(Trade).where(Trade.portfolio_id == portfolio.id))
    portfolio.cash_balance = INITIAL_CAPITAL
    await db.commit()
