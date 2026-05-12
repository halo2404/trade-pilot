"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { usePortfolioStore } from "@/lib/portfolio-store";
import { useWatchlistStore } from "@/lib/watchlist-store";
import type { TradeSide } from "@/lib/portfolio-types";
import type { Asset } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Formatters ────────────────────────────────────────────────────────

function fCurrency(v: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
}

function fNum(v: number, decimals = 4) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(v);
}

function fPct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

function fDate(iso: string) {
  return new Date(iso).toLocaleString("de-DE", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Stat card ─────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  positive,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  icon?: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-2xl font-bold tabular-nums",
            positive === true && "text-green-600 dark:text-green-400",
            positive === false && "text-red-600 dark:text-red-400"
          )}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ── Order form ────────────────────────────────────────────────────────

function OrderForm() {
  const { portfolio, placeOrder } = usePortfolioStore();
  const { search, searchResults, searching, clearSearch } = useWatchlistStore();

  const [side, setSide] = useState<TradeSide>("buy");
  const [symbol, setSymbol] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSymbolChange = (v: string) => {
    setSymbol(v);
    setSelectedAsset(null);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!v.trim()) { clearSearch(); setShowDropdown(false); return; }
    debounceRef.current = setTimeout(() => { search(v); setShowDropdown(true); }, 280);
  };

  const selectAsset = (a: Asset) => {
    setSelectedAsset(a);
    setSymbol(`${a.symbol} – ${a.name}`);
    clearSearch();
    setShowDropdown(false);
    setError(null);
  };

  const qty = parseFloat(quantity.replace(",", ".")) || 0;
  const totalCost = selectedAsset ? qty * selectedAsset.price : 0;
  const cashAvail = portfolio ? parseFloat(portfolio.cash_balance.toString()) : 0;

  const heldQty = portfolio?.positions.find((p) => p.symbol === selectedAsset?.symbol)?.quantity ?? 0;

  const handleSubmit = async () => {
    if (!selectedAsset) { setError("Bitte ein Asset auswählen."); return; }
    if (qty <= 0) { setError("Ungültige Menge."); return; }
    setError(null); setSuccess(null); setSubmitting(true);
    try {
      await placeOrder({ symbol: selectedAsset.symbol, side, quantity: qty });
      setSuccess(`${side === "buy" ? "Kauf" : "Verkauf"} von ${fNum(qty)} ${selectedAsset.symbol} erfolgreich ausgeführt.`);
      setQuantity("");
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Order fehlgeschlagen."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Order aufgeben</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Buy / Sell toggle */}
        <div className="flex rounded-lg border overflow-hidden">
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5",
              side === "buy"
                ? "bg-green-600 text-white"
                : "bg-background text-muted-foreground hover:text-foreground"
            )}
            onClick={() => { setSide("buy"); setError(null); setSuccess(null); }}
          >
            <ArrowUpRight className="h-3.5 w-3.5" /> Kaufen
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5",
              side === "sell"
                ? "bg-red-600 text-white"
                : "bg-background text-muted-foreground hover:text-foreground"
            )}
            onClick={() => { setSide("sell"); setError(null); setSuccess(null); }}
          >
            <ArrowDownLeft className="h-3.5 w-3.5" /> Verkaufen
          </button>
        </div>

        {/* Asset search */}
        <div ref={dropdownRef} className="relative">
          <Input
            placeholder="Symbol suchen, z.B. AAPL, BTC…"
            value={symbol}
            onChange={(e) => handleSymbolChange(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          />
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border bg-background shadow-md p-1 max-h-56 overflow-y-auto">
              {searching && <p className="px-3 py-2 text-sm text-muted-foreground">Suche…</p>}
              {!searching && searchResults.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">Keine Ergebnisse.</p>
              )}
              {!searching && searchResults.map((a) => (
                <button
                  key={a.symbol}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-accent rounded-md text-sm"
                  onClick={() => selectAsset(a)}
                >
                  <span>
                    <span className="font-mono font-semibold mr-2">{a.symbol}</span>
                    <span className="text-muted-foreground">{a.name}</span>
                  </span>
                  <span className="tabular-nums">{fCurrency(a.price)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <Input
            type="number"
            step="any"
            min="0"
            placeholder="Menge (Anteile)"
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setError(null); setSuccess(null); }}
          />
          {selectedAsset && qty > 0 && (
            <div className="mt-1.5 text-xs text-muted-foreground space-y-0.5">
              <p>Kurswert: <span className="font-medium text-foreground">{fCurrency(selectedAsset.price)} / Anteil</span></p>
              <p>Gesamtvolumen: <span className="font-medium text-foreground">{fCurrency(totalCost)}</span></p>
              {side === "buy" && (
                <p className={cn(totalCost > cashAvail ? "text-red-500" : "")}>
                  Verfügbares Kapital: {fCurrency(cashAvail)}
                  {totalCost > cashAvail && " ⚠ Nicht genug"}
                </p>
              )}
              {side === "sell" && (
                <p>Gehalten: {fNum(Number(heldQty))} {selectedAsset.symbol}</p>
              )}
            </div>
          )}
        </div>

        {/* Feedback */}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={submitting || !selectedAsset || qty <= 0}
          variant={side === "buy" ? "default" : "destructive"}
        >
          {submitting ? "Wird ausgeführt…" : side === "buy" ? "Kauforder aufgeben" : "Verkauforder aufgeben"}
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          Simulation · Ausführung zum aktuellen Mock-Kurs · Kein echtes Geld
        </p>
      </CardContent>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────

export default function PaperTradingPage() {
  const { portfolio, trades, loading, tradesLoading, fetch, fetchTrades, reset } =
    usePortfolioStore();

  const [tab, setTab] = useState<"positions" | "journal">("positions");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch();
    fetchTrades();
  }, [fetch, fetchTrades]);

  const handleReset = useCallback(async () => {
    if (!confirm("Portfolio wirklich zurücksetzen? Alle Trades und Positionen werden gelöscht.")) return;
    setResetting(true);
    try {
      await reset();
      await fetchTrades();
    } finally {
      setResetting(false);
    }
  }, [reset, fetchTrades]);

  const pnlPositive = (portfolio?.total_pnl ?? 0) >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Paper Trading</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={resetting}
          className="gap-1.5 text-muted-foreground"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", resetting && "animate-spin")} />
          Portfolio zurücksetzen
        </Button>
      </div>

      {/* Simulation banner */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3 flex items-start gap-2">
        <span className="text-amber-600 dark:text-amber-400 text-base mt-0.5">⚠️</span>
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <span className="font-semibold">Simulationsmodus:</span> Alle Orders werden mit simulierten Mock-Kursen ausgeführt. Es wird kein echtes Geld eingesetzt.
        </p>
      </div>

      {/* Stats */}
      {loading && !portfolio ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : portfolio ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Gesamtwert"
            value={fCurrency(portfolio.total_value)}
            sub={`Startkapital: ${fCurrency(Number(portfolio.initial_capital))}`}
            icon={Wallet}
          />
          <StatCard
            label="Verfügbares Kapital"
            value={fCurrency(Number(portfolio.cash_balance))}
            sub="Nicht investiert"
          />
          <StatCard
            label="Investiert"
            value={fCurrency(portfolio.invested_value)}
            sub={`${portfolio.positions.length} Position${portfolio.positions.length !== 1 ? "en" : ""}`}
          />
          <StatCard
            label="Gesamt-P&L"
            value={fCurrency(portfolio.total_pnl)}
            sub={fPct(portfolio.total_pnl_pct)}
            positive={pnlPositive}
            icon={pnlPositive ? TrendingUp : TrendingDown}
          />
        </div>
      ) : null}

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: positions + journal */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-0.5 w-fit">
            {(["positions", "journal"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                  tab === t ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "positions" ? "Positionen" : "Trade-Journal"}
              </button>
            ))}
          </div>

          {tab === "positions" && (
            <Card>
              <CardContent className="p-0">
                {!portfolio || portfolio.positions.length === 0 ? (
                  <div className="px-6 py-10 text-center text-muted-foreground">
                    <BarChart2 className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Noch keine offenen Positionen.</p>
                    <p className="text-xs mt-1">Gib eine Kauforder auf, um zu starten.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide gap-2">
                      <span>Asset</span>
                      <span className="text-right w-20">Menge</span>
                      <span className="text-right w-24">Ø Einstand</span>
                      <span className="text-right w-24">Akt. Kurs</span>
                      <span className="text-right w-28">P&L</span>
                    </div>
                    {portfolio.positions.map((pos) => {
                      const posPositive = (pos.pnl ?? 0) >= 0;
                      return (
                        <div
                          key={pos.id}
                          className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center px-4 py-3 hover:bg-accent/40 gap-2"
                        >
                          <div>
                            <Link href={`/chart/${pos.symbol}`} className="font-mono font-semibold text-sm hover:underline">
                              {pos.symbol}
                            </Link>
                            <p className="text-xs text-muted-foreground">{pos.asset_name}</p>
                          </div>
                          <span className="text-sm tabular-nums text-right w-20">
                            {fNum(Number(pos.quantity))}
                          </span>
                          <span className="text-sm tabular-nums text-right w-24">
                            {fCurrency(Number(pos.avg_cost))}
                          </span>
                          <span className="text-sm tabular-nums text-right w-24">
                            {pos.current_price != null ? fCurrency(pos.current_price) : "—"}
                          </span>
                          <div className="text-right w-28">
                            <p className={cn(
                              "text-sm font-medium tabular-nums",
                              posPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            )}>
                              {pos.pnl != null ? fCurrency(pos.pnl) : "—"}
                            </p>
                            {pos.pnl_pct != null && (
                              <p className={cn(
                                "text-xs tabular-nums",
                                posPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                              )}>
                                {fPct(pos.pnl_pct)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {tab === "journal" && (
            <Card>
              <CardContent className="p-0">
                {tradesLoading ? (
                  <div className="px-6 py-8 text-center text-sm text-muted-foreground animate-pulse">Lädt…</div>
                ) : trades.length === 0 ? (
                  <div className="px-6 py-10 text-center text-muted-foreground">
                    <p className="text-sm">Noch keine Trades ausgeführt.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide gap-3">
                      <span className="w-12">Typ</span>
                      <span>Asset</span>
                      <span className="text-right w-20">Menge</span>
                      <span className="text-right w-24">Kurs</span>
                      <span className="text-right w-28">Volumen</span>
                      <span className="text-right w-36">Zeitpunkt</span>
                    </div>
                    {trades.map((t) => (
                      <div
                        key={t.id}
                        className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center px-4 py-3 hover:bg-accent/40 gap-3"
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            "w-12 justify-center text-xs",
                            t.side === "buy"
                              ? "border-green-600 text-green-600"
                              : "border-red-600 text-red-600"
                          )}
                        >
                          {t.side === "buy" ? "Kauf" : "Verk."}
                        </Badge>
                        <span className="font-mono font-semibold text-sm">{t.symbol}</span>
                        <span className="text-sm tabular-nums text-right w-20">{fNum(Number(t.quantity))}</span>
                        <span className="text-sm tabular-nums text-right w-24">{fCurrency(Number(t.price))}</span>
                        <span className="text-sm tabular-nums text-right w-28 font-medium">{fCurrency(Number(t.total_value))}</span>
                        <span className="text-xs text-muted-foreground text-right w-36">{fDate(t.executed_at)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: order form */}
        <OrderForm />
      </div>
    </div>
  );
}
