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
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        TradePilot © {new Date().getFullYear()} · Nur für Bildungszwecke · Keine Anlageberatung
      </footer>
    </>
  );
}
