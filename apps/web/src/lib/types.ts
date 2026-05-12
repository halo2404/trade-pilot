export type AssetType = "stock" | "etf" | "crypto";

export interface Asset {
  symbol: string;
  name: string;
  asset_type: AssetType;
  price: number;
  change_24h: number;
  currency: string;
  exchange: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  added_at: string;
  asset: Asset | null;
}
