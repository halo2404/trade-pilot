"use client";

import { useAuthStore } from "@/lib/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, BookOpen, Star, TrendingUp } from "lucide-react";

const STAT_CARDS = [
  { title: "Portfolio-Wert", value: "10.000,00 €", sub: "Virtuelles Startkapital", icon: TrendingUp, color: "text-green-500" },
  { title: "Watchlist", value: "0 Assets", sub: "Noch keine hinzugefügt", icon: Star, color: "text-yellow-500" },
  { title: "Paper Trades", value: "0 Trades", sub: "Noch keine simuliert", icon: BarChart2, color: "text-blue-500" },
  { title: "Lernfortschritt", value: "0 %", sub: "Module abgeschlossen", icon: BookOpen, color: "text-purple-500" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Willkommen{user?.full_name ? `, ${user.full_name}` : ""}! 👋
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
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4" /> Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Du hast noch keine Assets in deiner Watchlist.
            </p>
            <Badge variant="outline" className="mt-3">Kommt in Phase 4</Badge>
          </CardContent>
        </Card>

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
    </div>
  );
}
