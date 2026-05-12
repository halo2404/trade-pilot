"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BarChart2, BookOpen, Star, TrendingDown, TrendingUp } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useWatchlistStore } from "@/lib/watchlist-store";
import { usePortfolioStore } from "@/lib/portfolio-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function fCurrency(v: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { items, fetch: fetchWatchlist } = useWatchlistStore();
  const { portfolio, trades, fetch: fetchPortfolio, fetchTrades } = usePortfolioStore();

  useEffect(() => {
    fetchWatchlist();
    fetchPortfolio();
    fetchTrades();
  }, [fetchWatchlist, fetchPortfolio, fetchTrades]);

  const portfolioValue = portfolio?.total_value ?? 10000;
  const portfolioPnl = portfolio?.total_pnl ?? 0;
  const portfolioPnlPct = portfolio?.total_pnl_pct ?? 0;
  const pnlPositive = portfolioPnl >= 0;
  const tradeCount = trades.length;

  const STAT_CARDS = [
    {
      title: "Portfolio-Wert",
      value: fCurrency(portfolioValue),
      sub: portfolioPnl !== 0
        ? `${pnlPositive ? "+" : ""}${portfolioPnl.toFixed(2)} (${pnlPositive ? "+" : ""}${portfolioPnlPct.toFixed(2)}%)`
        : "Virtuelles Startkapital",
      icon: pnlPositive ? TrendingUp : TrendingDown,
      color: pnlPositive ? "text-green-500" : "text-red-500",
    },
    {
      title: "Watchlist",
      value: `${items.length} ${items.length === 1 ? "Asset" : "Assets"}`,
      sub: items.length === 0 ? "Noch keine hinzugefügt" : "In deiner Watchlist",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Paper Trades",
      value: `${tradeCount} ${tradeCount === 1 ? "Trade" : "Trades"}`,
      sub: portfolio ? `${portfolio.positions.length} offene Position${portfolio.positions.length !== 1 ? "en" : ""}` : "Noch keine simuliert",
      icon: BarChart2,
      color: "text-blue-500",
    },
    {
      title: "Lernfortschritt",
      value: "0 %",
      sub: "Module abgeschlossen",
      icon: BookOpen,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Willkommen{user?.full_name ? `, ${user.full_name}` : ""}!
        </h1>
        <p className="text-muted-foreground">Hier ist deine Übersicht.</p>
      </div>

      {/* Simulation banner */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 flex items-start gap-3">
        <span className="text-amber-600 dark:text-amber-400 text-lg">⚠️</span>
        <div>
          <p className="font-medium text-amber-800 dark:text-amber-200">Paper Trading aktiv</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Alle Trades sind Simulationen. Es wird kein echtes Geld eingesetzt.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ title, value, sub, icon: Icon, color }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className={cn(
                "text-xs mt-1",
                title === "Portfolio-Wert" && portfolioPnl !== 0
                  ? pnlPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
              )}>{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Watchlist + Portfolio preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Watchlist */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4 text-yellow-500" /> Watchlist
            </CardTitle>
            <Link href="/watchlist">
              <Button variant="ghost" size="sm" className="text-xs">Alle anzeigen →</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">Noch keine Assets in der Watchlist.</p>
                <Link href="/watchlist">
                  <Button size="sm" variant="outline">Asset hinzufügen</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {items.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    href={`/chart/${item.symbol}`}
                    className="flex items-center justify-between py-1 hover:opacity-80 transition-opacity"
                  >
                    <div>
                      <span className="font-mono font-semibold text-sm">{item.symbol}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{item.asset?.name}</span>
                    </div>
                    {item.asset && (
                      <span className={`text-xs font-medium ${item.asset.change_24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {item.asset.change_24h >= 0 ? "+" : ""}{item.asset.change_24h.toFixed(2)}%
                      </span>
                    )}
                  </Link>
                ))}
                {items.length > 5 && (
                  <p className="text-xs text-muted-foreground pt-1">+{items.length - 5} weitere</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" /> Paper Portfolio
            </CardTitle>
            <Link href="/paper-trading">
              <Button variant="ghost" size="sm" className="text-xs">Öffnen →</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!portfolio || portfolio.positions.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Noch keine offenen Positionen.
                </p>
                <Link href="/paper-trading">
                  <Button size="sm" variant="outline">Ersten Trade starten</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {portfolio.positions.slice(0, 5).map((pos) => {
                  const posPositive = (pos.pnl ?? 0) >= 0;
                  return (
                    <div key={pos.id} className="flex items-center justify-between py-1">
                      <div>
                        <span className="font-mono font-semibold text-sm">{pos.symbol}</span>
                        <span className="ml-2 text-xs text-muted-foreground">×{Number(pos.quantity).toFixed(4)}</span>
                      </div>
                      {pos.pnl != null && (
                        <span className={cn("text-xs font-medium", posPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                          {posPositive ? "+" : ""}{pos.pnl.toFixed(2)}
                        </span>
                      )}
                    </div>
                  );
                })}
                {portfolio.positions.length > 5 && (
                  <p className="text-xs text-muted-foreground pt-1">+{portfolio.positions.length - 5} weitere</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lernmodule placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" /> Lernmodule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Starte mit dem ersten Modul: „Was ist eine Aktie?"
          </p>
          <Badge variant="outline" className="mt-3">Kommt in Phase 7</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
