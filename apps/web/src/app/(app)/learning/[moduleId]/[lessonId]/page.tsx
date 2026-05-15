"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useLearningStore } from "@/lib/learning-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Minimal markdown renderer — headings, bold, inline code, tables, blockquote, lists, code blocks
function renderMarkdown(text: string): string {
  return text
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    // Tables
    .replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/g, (_match, header, body) => {
      const ths = header
        .split("|")
        .filter(Boolean)
        .map((c: string) => `<th>${c.trim()}</th>`)
        .join("");
      const rows = body
        .trim()
        .split("\n")
        .map((row: string) => {
          const tds = row
            .split("|")
            .filter(Boolean)
            .map((c: string) => `<td>${c.trim()}</td>`)
            .join("");
          return `<tr>${tds}</tr>`;
        })
        .join("");
      return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
    })
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Blockquote
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Paragraphs (double newline)
    .replace(/\n\n(?!<[h|p|l|b|t|p])/g, "</p><p>")
    .replace(/^(?!<)(.+)$/gm, (line) => {
      if (/^<(h[1-3]|li|blockquote|pre|table|tr|th|td)/.test(line)) return line;
      return line;
    });
}

export default function LessonPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const router = useRouter();
  const {
    currentLesson,
    lessonLoading,
    fetchLesson,
    completeLesson,
    currentModule,
    fetchModule,
  } = useLearningStore();
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchLesson(lessonId);
    if (!currentModule || currentModule.id !== moduleId) {
      fetchModule(moduleId);
    }
  }, [lessonId, moduleId, fetchLesson, fetchModule, currentModule]);

  const lessons = currentModule?.lessons ?? [];
  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const handleComplete = useCallback(async () => {
    if (!currentLesson || currentLesson.completed) return;
    setCompleting(true);
    try {
      await completeLesson(lessonId);
    } finally {
      setCompleting(false);
    }
  }, [currentLesson, completeLesson, lessonId]);

  if (lessonLoading || !currentLesson) {
    return (
      <div className="space-y-4 max-w-3xl">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const html = renderMarkdown(currentLesson.content);

  return (
    <div className="max-w-3xl space-y-5">
      {/* Back to module */}
      <Link
        href={`/learning/${moduleId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {currentModule?.title ?? "Modul"}
      </Link>

      {/* Lesson header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          {currentModule && (
            <p className="text-xs text-muted-foreground mb-1">
              Lektion {currentIndex + 1} von {lessons.length}
            </p>
          )}
          <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
        </div>
        {currentLesson.completed && (
          <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
        )}
      </div>

      {/* Content */}
      <Card>
        <CardContent className="py-6">
          <div
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none",
              "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3",
              "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2",
              "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5",
              "[&_p]:my-2 [&_p]:leading-relaxed [&_p]:text-foreground",
              "[&_strong]:font-semibold",
              "[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono",
              "[&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-3",
              "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
              "[&_li]:ml-5 [&_li]:my-1 [&_li]:list-disc [&_li]:text-foreground",
              "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-3",
              "[&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-sm",
              "[&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
              "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Prev */}
        <div>
          {prevLesson && (
            <Link
              href={`/learning/${moduleId}/${prevLesson.id}`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Vorherige
            </Link>
          )}
        </div>

        {/* Complete + Next */}
        <div className="flex items-center gap-2">
          {!currentLesson.completed && (
            <Button
              variant="outline"
              onClick={handleComplete}
              disabled={completing}
              className="gap-1.5 text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <CheckCircle2 className="h-4 w-4" />
              {completing ? "Wird gespeichert…" : "Als abgeschlossen markieren"}
            </Button>
          )}
          {nextLesson ? (
            <Link
              href={`/learning/${moduleId}/${nextLesson.id}`}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Weiter
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          ) : (
            <Button
              variant="default"
              onClick={() => router.push(`/learning/${moduleId}`)}
            >
              Zum Modul
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
