"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, TrendingDown, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import type { Asset } from "@/lib/types";
import type { ChartData, Period } from "@/lib/chart-types";
import { PERIODS } from "@/lib/chart-types";
import { useWatchlistStore } from "@/lib/watchlist-store";
import { AssetChart } from "@/components/asset-chart";
import { RSIChart } from "@/components/rsi-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ASSET_TYPE_LABEL: Record<string, string> = {
  stock: "Aktie",
  etf: "ETF",
  crypto: "Kryptowährung",
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: price >= 1 ? 2 : 4,
    maximumFractionDigits: price >= 1 ? 2 : 4,
  }).format(price);
}

export default function ChartPage() {
  const params = useParams<{ symbol: string }>();
  const router = useRouter();
  const symbol = params.symbol?.toUpperCase() ?? "";

  const [asset, setAsset] = useState<Asset | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [period, setPeriod] = useState<Period>("1M");
  const [chartLoading, setChartLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Indicator toggles
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const smaPeriod = 20;
  const emaPeriod = 20;

  const { items, fetch: fetchWatchlist, add, remove } = useWatchlistStore();
  const isWatched = items.some((i) => i.symbol === symbol);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Fetch asset info
  useEffect(() => {
    if (!symbol) return;
    api
      .get<Asset>(`/assets/${symbol}`)
      .then((r) => setAsset(r.data))
      .catch(() => setNotFound(true));
  }, [symbol]);

  // Fetch chart data whenever period changes
  const loadChart = useCallback(
    async (p: Period) => {
      if (!symbol) return;
      setChartLoading(true);
      try {
        const { data } = await api.get<ChartData>(`/assets/${symbol}/chart`, { params: { period: p } });
        setChartData(data);
      } finally {
        setChartLoading(false);
      }
    },
    [symbol]
  );

  useEffect(() => {
    loadChart(period);
  }, [loadChart, period]);

  const handlePeriod = (p: Period) => {
    setPeriod(p);
  };

  const toggleWatchlist = async () => {
    if (isWatched) await remove(symbol);
    else await add(symbol);
  };

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-muted-foreground">Asset „{symbol}" nicht gefunden.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Zurück
        </Button>
      </div>
    );
  }

  const positive = asset ? asset.change_24h >= 0 : true;

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link
        href="/watchlist"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Zur Watchlist
      </Link>

      {/* Header */}
      {!asset ? (
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold font-mono">{asset.symbol}</h1>
              <Badge variant="secondary">{ASSET_TYPE_LABEL[asset.asset_type] ?? asset.asset_type}</Badge>
            </div>
            <p className="text-muted-foreground mt-0.5">{asset.name}</p>
            <p className="text-xs text-muted-foreground">{asset.exchange}</p>
          </div>
          <Button
            variant={isWatched ? "default" : "outline"}
            size="sm"
            onClick={toggleWatchlist}
            className="gap-2"
          >
            <Star className={cn("h-4 w-4", isWatched && "fill-current")} />
            {isWatched ? "In Watchlist" : "Zur Watchlist"}
          </Button>
        </div>
      )}

      {/* Price */}
      {asset && (
        <div className="flex flex-wrap items-end gap-3">
          <span className="text-4xl font-bold tabular-nums">
            {formatPrice(asset.price, asset.currency)}
          </span>
          <span
            className={cn(
              "flex items-center gap-1 text-lg font-medium mb-0.5",
              positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {positive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            {positive ? "+" : ""}{asset.change_24h.toFixed(2)}% (24h)
          </span>
          <span className="text-xs text-muted-foreground mb-1">Mock-Daten · Keine Echtzeitkurse</span>
        </div>
      )}

      {/* Chart card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Period selector */}
            <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-0.5">
              {PERIODS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handlePeriod(key)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-all",
                    period === key
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Indicator toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              <IndicatorToggle
                label={`SMA ${smaPeriod}`}
                active={showSMA}
                color="text-amber-500"
                onToggle={() => setShowSMA((v) => !v)}
              />
              <IndicatorToggle
                label={`EMA ${emaPeriod}`}
                active={showEMA}
                color="text-purple-500"
                onToggle={() => setShowEMA((v) => !v)}
              />
              <IndicatorToggle
                label="RSI"
                active={showRSI}
                color="text-blue-500"
                onToggle={() => setShowRSI((v) => !v)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1 pb-4">
          {chartLoading || !chartData ? (
            <div className="flex items-center justify-center h-[330px] text-sm text-muted-foreground animate-pulse">
              Lade Chartdaten…
            </div>
          ) : (
            <div className="space-y-3">
              <AssetChart
                bars={chartData.bars}
                currency={asset?.currency ?? "USD"}
                showSMA={showSMA}
                showEMA={showEMA}
                smaPeriod={smaPeriod}
                emaPeriod={emaPeriod}
              />
              {showRSI && <RSIChart bars={chartData.bars} period={14} />}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info grid */}
      {asset && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Symbol",   value: asset.symbol },
            { label: "Typ",      value: ASSET_TYPE_LABEL[asset.asset_type] ?? asset.asset_type },
            { label: "Börse",    value: asset.exchange },
            { label: "Währung",  value: asset.currency },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-semibold mt-0.5">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        ⚠️ TradePilot ist eine Bildungsplattform. Keine Anlageberatung. Alle Kurse und Charts sind simulierte Mock-Daten.
      </p>
    </div>
  );
}

function IndicatorToggle({
  label,
  active,
  color,
  onToggle,
}: {
  label: string;
  active: boolean;
  color: string;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium border transition-all",
        active
          ? `border-current ${color} bg-current/10`
          : "border-border text-muted-foreground hover:border-current hover:text-foreground"
      )}
    >
      <span
        className={cn(
          "inline-block w-3 h-0.5 rounded-full",
          active ? "bg-current" : "bg-muted-foreground"
        )}
      />
      {label}
    </button>
  );
}
