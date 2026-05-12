"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  Loader2,
  MessageSquarePlus,
  Send,
  Trash2,
} from "lucide-react";
import { useChatStore } from "@/lib/chat-store";
import type { ChatMessage } from "@/lib/chat-types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Markdown renderer (same minimal version as lessons) ───────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/```[\w]*\n?([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n\n/g, "<br/><br/>");
}

// ── Message bubble ────────────────────────────────────────────────────

function MessageBubble({ msg, streaming }: { msg: ChatMessage; streaming?: boolean }) {
  const isUser = msg.role === "user";
  const html = isUser ? msg.content : renderMarkdown(msg.content);

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground border"
        )}
      >
        {isUser ? "Du" : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted rounded-tl-sm"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
        ) : (
          <div
            className={cn(
              "[&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-1 [&_h1]:mt-2",
              "[&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mb-1 [&_h2]:mt-2",
              "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-1",
              "[&_strong]:font-semibold",
              "[&_em]:italic",
              "[&_code]:bg-background [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono",
              "[&_pre]:bg-background [&_pre]:rounded [&_pre]:p-2 [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre]:my-1",
              "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
              "[&_li]:ml-4 [&_li]:list-disc",
              "[&_blockquote]:border-l-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-2 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
              "break-words"
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        {streaming && (
          <span className="inline-block h-4 w-0.5 bg-current animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────

function SessionSidebar({
  onSelect,
  onNew,
}: {
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const { sessions, sessionsLoading, activeSessionId, deleteSession } = useChatStore();

  return (
    <div className="w-60 shrink-0 border-r flex flex-col h-full">
      <div className="p-3 border-b">
        <Button size="sm" className="w-full gap-1.5" onClick={onNew}>
          <MessageSquarePlus className="h-4 w-4" />
          Neue Unterhaltung
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {sessionsLoading ? (
          <div className="p-3 text-center text-xs text-muted-foreground animate-pulse">Lädt…</div>
        ) : sessions.length === 0 ? (
          <p className="p-3 text-xs text-muted-foreground text-center">
            Noch keine Unterhaltungen.
          </p>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              className={cn(
                "group flex items-center gap-1 rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                activeSessionId === s.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
              onClick={() => onSelect(s.id)}
            >
              <p className="flex-1 text-xs truncate">{s.title}</p>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(s.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────

export default function AiAssistantPage() {
  const {
    messages,
    messagesLoading,
    streaming,
    streamingContent,
    activeSessionId,
    fetchSessions,
    createSession,
    selectSession,
    sendMessage,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleNewSession = useCallback(async () => {
    const session = await createSession();
    await selectSession(session.id);
  }, [createSession, selectSession]);

  const handleSelectSession = useCallback(
    async (id: string) => {
      await selectSession(id);
    },
    [selectSession]
  );

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || streaming) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      const session = await createSession();
      sessionId = session.id;
      await selectSession(sessionId);
    }

    setInput("");
    setSendError(null);
    try {
      await sendMessage(content);
    } catch {
      setSendError("Fehler beim Senden. Bitte versuche es erneut.");
    }
  }, [input, streaming, activeSessionId, createSession, selectSession, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Combine persisted messages with currently streaming content
  const streamingMsg: ChatMessage | null = streaming
    ? {
        id: "streaming",
        session_id: activeSessionId ?? "",
        role: "assistant",
        content: streamingContent,
        created_at: new Date().toISOString(),
      }
    : null;

  const allMessages = streamingMsg ? [...messages, streamingMsg] : messages;

  return (
    <div className="flex h-[calc(100vh-8rem)] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden border rounded-lg">
      {/* Sidebar */}
      <SessionSidebar onSelect={handleSelectSession} onNew={handleNewSession} />

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b px-4 py-3 flex items-center gap-2 shrink-0">
          <Bot className="h-5 w-5 text-primary" />
          <div>
            <h1 className="font-semibold text-sm">TradePilot KI-Assistent</h1>
            <p className="text-xs text-muted-foreground">
              Bildungs-Assistent · Keine Anlageberatung
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {!activeSessionId ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <Bot className="h-12 w-12 text-muted-foreground/30" />
              <div>
                <p className="font-medium text-sm">Wie kann ich dir helfen?</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Frag mich nach Börsenkonzepten, technischen Indikatoren oder den Lernmodulen der Plattform.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                {[
                  "Was ist ein gleitender Durchschnitt?",
                  "Erkläre mir den RSI-Indikator",
                  "Was bedeutet Diversifikation?",
                  "Wie lese ich einen Candlestick-Chart?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={async () => {
                      const session = await createSession();
                      await selectSession(session.id);
                      setInput(prompt);
                    }}
                    className="rounded-full border px-3 py-1.5 text-xs hover:bg-accent transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : allMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2">
              <p className="text-sm text-muted-foreground">Starte die Unterhaltung mit einer Frage.</p>
            </div>
          ) : (
            allMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                streaming={msg.id === "streaming"}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Disclaimer */}
        <div className="px-4 py-1.5 bg-amber-50 dark:bg-amber-950/30 border-t border-amber-200 dark:border-amber-800 text-center text-[10px] text-amber-800 dark:text-amber-300 shrink-0">
          Der KI-Assistent dient ausschließlich Bildungszwecken. Keine Anlageberatung.
          Bei Anlageentscheidungen wende dich an einen zugelassenen Finanzberater.
        </div>

        {/* Input */}
        <div className="border-t px-4 py-3 shrink-0">
          {sendError && (
            <p className="text-xs text-destructive mb-2">{sendError}</p>
          )}
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              className={cn(
                "flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "max-h-32 overflow-y-auto"
              )}
              placeholder="Frage stellen… (Enter zum Senden, Shift+Enter für Zeilenumbruch)"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
              }}
              onKeyDown={handleKeyDown}
              disabled={streaming}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || streaming}
              className="shrink-0"
            >
              {streaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
