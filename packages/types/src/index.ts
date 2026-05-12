// ── Assets & Watchlist ────────────────────────────────────────────────

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

// ── Charts ────────────────────────────────────────────────────────────

export interface OHLCVBar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export interface ChartData {
  symbol: string;
  period: string;
  bars: OHLCVBar[];
}

export type Period = "1T" | "1W" | "1M" | "3M" | "1J" | "MAX";

export const PERIODS: { key: Period; label: string }[] = [
  { key: "1T", label: "1T" },
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "3M", label: "3M" },
  { key: "1J", label: "1J" },
  { key: "MAX", label: "Max" },
];

// ── Paper Trading ─────────────────────────────────────────────────────

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

// ── Learning ──────────────────────────────────────────────────────────

export interface LessonSummary {
  id: string;
  title: string;
  order: number;
  completed: boolean;
}

export interface LessonDetail {
  id: string;
  module_id: string;
  title: string;
  content: string;
  order: number;
  completed: boolean;
}

export interface ModuleSummary {
  id: string;
  title: string;
  description: string;
  order: number;
  lesson_count: number;
  completed_count: number;
  has_quiz: boolean;
}

export interface ModuleDetail {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LessonSummary[];
  lesson_count: number;
  completed_count: number;
  has_quiz: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  order: number;
}

export interface QuizResultItem {
  question: string;
  options: string[];
  your_answer: number;
  correct_index: number;
  explanation: string;
  correct: boolean;
}

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  items: QuizResultItem[];
}

export interface QuizAttemptSummary {
  id: string;
  score: number;
  total: number;
  attempted_at: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  order: number;
}

// ── AI Chat ───────────────────────────────────────────────────────────

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}
