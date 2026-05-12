"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BarChart2, Plus, Search, Star, Trash2, TrendingDown, TrendingUp, X } from "lucide-react";
import { useWatchlistStore } from "@/lib/watchlist-store";
import type { Asset } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ASSET_TYPE_LABEL: Record<string, string> = {
  stock: "Aktie",
  etf: "ETF",
  crypto: "Krypto",
};

const ASSET_TYPE_COLOR: Record<string, string> = {
  stock: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  etf: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  crypto: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: price >= 100 ? 2 : price >= 1 ? 2 : 4,
    maximumFractionDigits: price >= 100 ? 2 : price >= 1 ? 2 : 4,
  }).format(price);
}

function AssetSearchResult({ asset, onAdd }: { asset: Asset; onAdd: (a: Asset) => void }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 hover:bg-accent rounded-md cursor-pointer group">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-mono font-semibold text-sm w-14 shrink-0">{asset.symbol}</span>
        <span className="text-sm text-muted-foreground truncate">{asset.name}</span>
        <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", ASSET_TYPE_COLOR[asset.asset_type])}>
          {ASSET_TYPE_LABEL[asset.asset_type]}
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-2">
        <span className="text-sm font-medium tabular-nums">
          {formatPrice(asset.price, asset.currency)}
        </span>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onAdd(asset)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function WatchlistPage() {
  const { items, loading, fetch, add, remove, searchResults, searching, search, clearSearch } =
    useWatchlistStore();

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      setAddError(null);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim()) {
        clearSearch();
        setShowResults(false);
        return;
      }
      debounceRef.current = setTimeout(() => {
        search(value);
        setShowResults(true);
      }, 300);
    },
    [search, clearSearch]
  );

  const handleAdd = useCallback(
    async (asset: Asset) => {
      setAddError(null);
      try {
        await add(asset.symbol);
        setQuery("");
        clearSearch();
        setShowResults(false);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
          "Fehler beim Hinzufügen.";
        setAddError(msg);
      }
    },
    [add, clearSearch]
  );

  const handleRemove = useCallback(
    async (symbol: string) => {
      await remove(symbol);
    },
    [remove]
  );

  const watchlistSymbols = new Set(items.map((i) => i.symbol));
  const filteredResults = searchResults.filter((a) => !watchlistSymbols.has(a.symbol));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Star className="h-6 w-6 text-yellow-500" />
        <h1 className="text-2xl font-bold">Watchlist</h1>
      </div>

      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Asset hinzufügen</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={searchRef} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-9 pr-8"
                placeholder="Symbol oder Name suchen, z.B. AAPL, Bitcoin…"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
              />
              {query && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setQuery("");
                    clearSearch();
                    setShowResults(false);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Results dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border bg-background shadow-md p-1 max-h-72 overflow-y-auto">
                {searching && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">Suche…</p>
                )}
                {!searching && filteredResults.length === 0 && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">Keine Ergebnisse.</p>
                )}
                {!searching &&
                  filteredResults.map((asset) => (
                    <AssetSearchResult key={asset.symbol} asset={asset} onAdd={handleAdd} />
                  ))}
              </div>
            )}
          </div>
          {addError && <p className="mt-2 text-sm text-destructive">{addError}</p>}
        </CardContent>
      </Card>

      {/* Watchlist table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Meine Watchlist</CardTitle>
            <Badge variant="secondary">{items.length} {items.length === 1 ? "Asset" : "Assets"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">Lädt…</div>
          )}

          {!loading && items.length === 0 && (
            <div className="px-6 py-10 text-center text-muted-foreground">
              <Star className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Deine Watchlist ist leer.</p>
              <p className="text-xs mt-1">Suche nach einem Asset und füge es hinzu.</p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="divide-y">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <span>Asset</span>
                <span className="text-right w-28">Kurs (Mock)</span>
                <span className="text-right w-20">24h</span>
                <span className="w-16" />
              </div>

              {items.map((item) => {
                const asset = item.asset;
                const positive = asset ? asset.change_24h >= 0 : true;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_auto_auto_auto] items-center px-4 py-3 hover:bg-accent/50 transition-colors"
                  >
                    {/* Symbol + Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-sm">{item.symbol}</span>
                          {asset && (
                            <span
                              className={cn(
                                "text-xs px-1.5 py-0.5 rounded font-medium",
                                ASSET_TYPE_COLOR[asset.asset_type]
                              )}
                            >
                              {ASSET_TYPE_LABEL[asset.asset_type]}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {asset?.name ?? "—"}
                          {asset && <span className="ml-1 opacity-60">· {asset.exchange}</span>}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-medium tabular-nums text-right w-28">
                      {asset ? formatPrice(asset.price, asset.currency) : "—"}
                    </span>

                    {/* Change */}
                    <span
                      className={cn(
                        "flex items-center justify-end gap-0.5 text-sm font-medium tabular-nums w-20",
                        positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {positive ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      {asset ? `${positive ? "+" : ""}${asset.change_24h.toFixed(2)}%` : "—"}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 justify-end w-16">
                      <Link href={`/chart/${item.symbol}`}>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Chart">
                          <BarChart2 className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        title="Entfernen"
                        onClick={() => handleRemove(item.symbol)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        ⚠️ Alle Kurse sind simulierte Mock-Daten zu Bildungszwecken. Keine Echtzeitkurse.
      </p>
    </div>
  );
}
