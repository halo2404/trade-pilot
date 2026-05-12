import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AuthInitializer } from "@/components/auth-initializer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInitializer />
      <AppNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground space-x-3">
        <span>TradePilot © {new Date().getFullYear()}</span>
        <span>·</span>
        <span>Nur für Bildungszwecke · Keine Anlageberatung</span>
        <span>·</span>
        <Link href="/impressum" className="hover:text-foreground">Impressum</Link>
        <Link href="/datenschutz" className="hover:text-foreground">Datenschutz</Link>
        <Link href="/agb" className="hover:text-foreground">AGB</Link>
      </footer>
    </>
  );
}
