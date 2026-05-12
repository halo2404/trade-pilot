"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  BookOpen,
  Bot,
  LayoutDashboard,
  Star,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavUser } from "./nav-user";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/chart/AAPL", label: "Charts", icon: BarChart2 },
  { href: "/paper-trading", label: "Paper Trading", icon: TrendingUp },
  { href: "/learning", label: "Lernen", icon: BookOpen },
  { href: "/ai-assistant", label: "KI-Assistent", icon: Bot },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>TradePilot</span>
          </Link>

          {/* Main nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavUser />
          </div>
        </div>
      </div>

      {/* Compliance banner */}
      <div className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 px-4 py-1 text-center text-xs text-amber-800 dark:text-amber-200">
        TradePilot ist eine Bildungsplattform. Keine Anlageberatung. Paper Trading ist eine Simulation – kein echtes Geld.
      </div>
    </header>
  );
}
