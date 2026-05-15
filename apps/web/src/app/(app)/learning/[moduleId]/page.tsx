"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Circle,
} from "lucide-react";
import { useLearningStore } from "@/lib/learning-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { currentModule, moduleLoading, fetchModule } = useLearningStore();

  useEffect(() => {
    fetchModule(moduleId);
  }, [moduleId, fetchModule]);

  if (moduleLoading || !currentModule) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const allDone =
    currentModule.completed_count === currentModule.lesson_count &&
    currentModule.lesson_count > 0;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/learning"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Alle Module
      </Link>

      {/* Module header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge variant="outline" className="mb-2 text-xs">
                Modul {currentModule.order}
              </Badge>
              <CardTitle className="text-xl">{currentModule.title}</CardTitle>
              <p className="text-muted-foreground text-sm mt-1.5">
                {currentModule.description}
              </p>
            </div>
            {allDone && (
              <CheckCircle2 className="h-7 w-7 text-green-500 shrink-0" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {currentModule.lesson_count} Lektionen
            </span>
            <span
              className={cn(
                "font-medium tabular-nums text-sm",
                allDone && "text-green-600 dark:text-green-400"
              )}
            >
              {currentModule.completed_count} / {currentModule.lesson_count} abgeschlossen
            </span>
          </div>
          <ProgressBar value={currentModule.completed_count} max={currentModule.lesson_count} />
        </CardContent>
      </Card>

      {/* Lessons */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Lektionen
        </h2>
        <Card>
          <CardContent className="p-0 divide-y">
            {currentModule.lessons.map((lesson, idx) => (
              <Link
                key={lesson.id}
                href={`/learning/${moduleId}/${lesson.id}`}
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-accent/50 transition-colors group"
              >
                <div className="flex-shrink-0">
                  {lesson.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground">Lektion {idx + 1}</span>
                  <p
                    className={cn(
                      "text-sm font-medium leading-snug group-hover:text-primary transition-colors",
                      lesson.completed && "text-muted-foreground line-through"
                    )}
                  >
                    {lesson.title}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quiz */}
      {currentModule.has_quiz && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Wissenstest
          </h2>
          <Card className="hover:border-primary/60 transition-colors">
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Quiz: {currentModule.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Teste dein Wissen aus diesem Modul
                    </p>
                  </div>
                </div>
                <Link
                  href={`/learning/${moduleId}/quiz`}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Quiz starten
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
