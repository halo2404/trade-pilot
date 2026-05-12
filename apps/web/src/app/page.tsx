import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, BarChart2, TrendingUp, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: BarChart2,
    title: "Charts & Indikatoren",
    description: "Liniencharts, Candlestick-Charts, SMA, EMA und RSI – einfach erklärt.",
  },
  {
    icon: TrendingUp,
    title: "Paper Trading",
    description: "Übe mit 10.000 € virtuellem Kapital, ohne echtes Geld zu riskieren.",
  },
  {
    icon: BookOpen,
    title: "Lernmodule",
    description: "Strukturierte Lektionen über Aktien, ETFs, Risiko und Diversifikation.",
  },
  {
    icon: ShieldCheck,
    title: "Keine Anlageberatung",
    description: "TradePilot ist ausschließlich für Bildungszwecke – transparent und sicher.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        <Badge variant="secondary">Kostenlos starten</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl">
          Börse verstehen – ohne Risiko.
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          TradePilot ist deine Lernplattform für Aktien, ETFs und Trading.
          Übe mit virtuellem Kapital, analysiere Charts und lerne die Grundlagen der Finanzmärkte.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
            Jetzt kostenlos starten
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Anmelden
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Keine Kreditkarte · Keine echten Trades · Nur Bildung
        </p>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/40 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold mb-10">Was TradePilot bietet</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-lg border bg-background p-5 space-y-2">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance footer */}
      <footer className="border-t py-6 px-4 text-center text-xs text-muted-foreground">
        TradePilot © {new Date().getFullYear()} · Bildungsplattform · Keine Anlageberatung ·
        Paper Trading ist eine Simulation · Historische Daten garantieren keine zukünftigen Ergebnisse.
      </footer>
    </div>
  );
}
