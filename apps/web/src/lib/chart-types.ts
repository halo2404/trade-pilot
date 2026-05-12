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
  { key: "1T",  label: "1T" },
  { key: "1W",  label: "1W" },
  { key: "1M",  label: "1M" },
  { key: "3M",  label: "3M" },
  { key: "1J",  label: "1J" },
  { key: "MAX", label: "Max" },
];
