"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { useLearningStore } from "@/lib/learning-store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function GlossarPage() {
  const { glossary, glossaryLoading, fetchGlossary } = useLearningStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchGlossary();
  }, [fetchGlossary]);

  const filtered = useMemo(() => {
    if (!query.trim()) return glossary;
    const q = query.toLowerCase();
    return glossary.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q)
    );
  }, [glossary, query]);

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    for (const entry of filtered) {
      const key = entry.term[0].toUpperCase();
      if (!map[key]) map[key] = [];
      map[key].push(entry);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Back */}
      <Link
        href="/learning"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Lernmodule
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Finanzglossar</h1>
          <p className="text-sm text-muted-foreground">
            {glossary.length} Begriffe aus Börse, Analyse & Risikomanagement
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Begriff suchen…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {glossaryLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Kein Eintrag gefunden für „{query}".</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([letter, entries]) => (
            <div key={letter}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg font-bold text-primary">{letter}</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <Card>
                <CardContent className="p-0 divide-y">
                  {entries.map((entry) => (
                    <div key={entry.id} className="px-4 py-3.5">
                      <p className="font-semibold text-sm mb-1">{entry.term}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {entry.definition}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
