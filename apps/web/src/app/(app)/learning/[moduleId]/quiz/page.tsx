"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useLearningStore } from "@/lib/learning-store";
import type { QuizResult } from "@/lib/learning-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "intro" | "quiz" | "result";

export default function QuizPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const {
    quizQuestions,
    quizLoading,
    fetchQuiz,
    submitQuiz,
    currentModule,
    fetchModule,
  } = useLearningStore();

  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz(moduleId);
    if (!currentModule || currentModule.id !== moduleId) {
      fetchModule(moduleId);
    }
  }, [moduleId, fetchQuiz, fetchModule, currentModule]);

  const startQuiz = useCallback(() => {
    setAnswers(Array(quizQuestions.length).fill(null));
    setCurrentQ(0);
    setResult(null);
    setPhase("quiz");
  }, [quizQuestions.length]);

  const selectAnswer = (idx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = idx;
      return next;
    });
  };

  const goNext = async () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setSubmitting(true);
      try {
        const res = await submitQuiz(moduleId, answers as number[]);
        setResult(res);
        setPhase("result");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const q = quizQuestions[currentQ];
  const selected = answers[currentQ];

  if (quizLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  // ── Intro ──────────────────────────────────────────────────────────

  if (phase === "intro") {
    return (
      <div className="max-w-2xl space-y-5">
        <Link
          href={`/learning/${moduleId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentModule?.title ?? "Modul"}
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Quiz: {currentModule?.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {quizQuestions.length} Fragen · mindestens 70 % für Bestehen
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Teste dein Wissen zu diesem Modul. Du kannst den Quiz beliebig oft wiederholen.
              Nach dem Abschicken erhältst du detailliertes Feedback zu jeder Antwort.
            </p>
            <Button onClick={startQuiz} className="w-full sm:w-auto">
              Quiz starten
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────────

  if (phase === "quiz" && q) {
    return (
      <div className="max-w-2xl space-y-5">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Frage {currentQ + 1} von {quizQuestions.length}</span>
          <div className="flex gap-1">
            {quizQuestions.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-6 rounded-full",
                  i < currentQ
                    ? "bg-primary"
                    : i === currentQ
                    ? "bg-primary/60"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold leading-relaxed">
              {q.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                className={cn(
                  "w-full text-left rounded-lg border px-4 py-3 text-sm transition-all",
                  selected === idx
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border hover:border-primary/50 hover:bg-accent/40"
                )}
              >
                <span className="font-mono text-xs text-muted-foreground mr-2.5">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={goNext}
            disabled={selected === null || submitting}
          >
            {submitting
              ? "Wird ausgewertet…"
              : currentQ < quizQuestions.length - 1
              ? "Weiter"
              : "Quiz abschicken"}
          </Button>
        </div>
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────────────────────

  if (phase === "result" && result) {
    const pct = Math.round((result.score / result.total) * 100);

    return (
      <div className="max-w-2xl space-y-5">
        {/* Score card */}
        <Card
          className={cn(
            "border-2",
            result.passed ? "border-green-500" : "border-red-500"
          )}
        >
          <CardContent className="py-6 text-center space-y-2">
            {result.passed ? (
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            )}
            <h2 className="text-xl font-bold">
              {result.passed ? "Bestanden!" : "Nicht bestanden"}
            </h2>
            <p className="text-4xl font-bold tabular-nums">
              {result.score} / {result.total}
            </p>
            <p className="text-muted-foreground text-sm">{pct} % richtig</p>
            {!result.passed && (
              <p className="text-sm text-muted-foreground">
                Du benötigst mindestens 70 %. Schau dir die Erklärungen an und versuche es erneut.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Detailed results */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Auswertung
          </h2>
          {result.items.map((item, i) => (
            <Card
              key={i}
              className={cn(
                "border",
                item.correct ? "border-green-400/50" : "border-red-400/50"
              )}
            >
              <CardContent className="py-4 space-y-3">
                <div className="flex items-start gap-2">
                  {item.correct ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium text-sm leading-relaxed">{item.question}</p>
                </div>

                <div className="space-y-1.5 pl-7">
                  {item.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "rounded px-3 py-1.5 text-sm",
                        idx === item.correct_index && "bg-green-100 dark:bg-green-950/50 font-medium",
                        idx === item.your_answer && idx !== item.correct_index &&
                          "bg-red-100 dark:bg-red-950/50 line-through text-muted-foreground"
                      )}
                    >
                      <span className="font-mono text-xs text-muted-foreground mr-2">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                      {idx === item.correct_index && (
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Richtig</span>
                      )}
                      {idx === item.your_answer && idx !== item.correct_index && (
                        <span className="ml-2 text-xs text-red-600 dark:text-red-400">✗ Deine Antwort</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pl-7 rounded-lg bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Erklärung: </span>
                    {item.explanation}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={startQuiz} className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Nochmals versuchen
          </Button>
          <Button asChild>
            <Link href={`/learning/${moduleId}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Zurück zum Modul
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
