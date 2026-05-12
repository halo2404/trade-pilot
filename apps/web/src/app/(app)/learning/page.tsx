"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";
import { useLearningStore } from "@/lib/learning-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function LearningPage() {
  const { modules, modulesLoading, fetchModules } = useLearningStore();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const totalLessons = modules.reduce((s, m) => s + m.lesson_count, 0);
  const totalCompleted = modules.reduce((s, m) => s + m.completed_count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <GraduationCap className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Lernmodule</h1>
          <p className="text-sm text-muted-foreground">
            Strukturiertes Wissen für deinen Handelserfolg
          </p>
        </div>
      </div>

      {/* Overall progress */}
      {!modulesLoading && modules.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Gesamtfortschritt</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {totalCompleted} / {totalLessons} Lektionen
              </span>
            </div>
            <ProgressBar value={totalCompleted} max={totalLessons} />
          </CardContent>
        </Card>
      )}

      {/* Module grid */}
      {modulesLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => {
            const done = mod.completed_count === mod.lesson_count && mod.lesson_count > 0;
            return (
              <Link key={mod.id} href={`/learning/${mod.id}`}>
                <Card className="h-full hover:border-primary/60 transition-colors cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
                        {mod.title}
                      </CardTitle>
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <Badge variant="outline" className="text-xs shrink-0">
                          Modul {mod.order}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {mod.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {mod.lesson_count} Lektionen
                      </span>
                      <span className={cn(done && "text-green-600 dark:text-green-400")}>
                        {mod.completed_count} / {mod.lesson_count} abgeschlossen
                      </span>
                    </div>
                    <ProgressBar value={mod.completed_count} max={mod.lesson_count} />
                    <div className="flex items-center justify-between">
                      {mod.has_quiz && (
                        <span className="text-xs text-muted-foreground">+ Quiz verfügbar</span>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Glossary link */}
      <Link href="/learning/glossar">
        <Card className="hover:border-primary/60 transition-colors cursor-pointer group">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm group-hover:text-primary transition-colors">
                  Finanzglossar
                </p>
                <p className="text-xs text-muted-foreground">
                  Alle wichtigen Begriffe auf einen Blick
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
