import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            TradePilot
          </Link>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Zur App
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-10">
        {children}
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-3xl px-4 flex flex-wrap gap-4 text-xs text-muted-foreground justify-center">
          <Link href="/impressum" className="hover:text-foreground">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-foreground">Datenschutzerklärung</Link>
          <Link href="/agb" className="hover:text-foreground">AGB</Link>
          <span>© {new Date().getFullYear()} TradePilot</span>
        </div>
      </footer>
    </div>
  );
}
