import { TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <Link href="/" className="mb-8 flex items-center gap-2 font-bold text-xl">
        <TrendingUp className="h-6 w-6 text-primary" />
        TradePilot
      </Link>
      {children}
      <p className="mt-6 text-center text-xs text-muted-foreground max-w-xs">
        TradePilot ist eine Bildungsplattform. Keine Anlageberatung. Paper Trading ist eine Simulation.
      </p>
    </div>
  );
}
