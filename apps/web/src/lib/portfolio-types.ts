export type TradeSide = "buy" | "sell";

export interface PortfolioPosition {
  id: string;
  symbol: string;
  quantity: number;
  avg_cost: number;
  asset_name: string | null;
  current_price: number | null;
  current_value: number | null;
  cost_basis: number | null;
  pnl: number | null;
  pnl_pct: number | null;
}

export interface Portfolio {
  id: string;
  cash_balance: number;
  initial_capital: number;
  positions: PortfolioPosition[];
  invested_value: number;
  total_value: number;
  total_pnl: number;
  total_pnl_pct: number;
}

export interface PortfolioTrade {
  id: string;
  symbol: string;
  side: TradeSide;
  quantity: number;
  price: number;
  total_value: number;
  executed_at: string;
}

export interface OrderRequest {
  symbol: string;
  side: TradeSide;
  quantity: number;
}
