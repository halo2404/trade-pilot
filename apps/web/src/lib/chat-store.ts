import { create } from "zustand";
import { api } from "./api";
import type { ChatMessage, ChatSession } from "./chat-types";

interface ChatState {
  sessions: ChatSession[];
  sessionsLoading: boolean;
  activeSessionId: string | null;
  messages: ChatMessage[];
  messagesLoading: boolean;
  streaming: boolean;
  streamingContent: string;

  fetchSessions: () => Promise<void>;
  createSession: () => Promise<ChatSession>;
  deleteSession: (id: string) => Promise<void>;
  selectSession: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  sessionsLoading: false,
  activeSessionId: null,
  messages: [],
  messagesLoading: false,
  streaming: false,
  streamingContent: "",

  fetchSessions: async () => {
    set({ sessionsLoading: true });
    try {
      const { data } = await api.get<ChatSession[]>("/chat/sessions");
      set({ sessions: data });
    } finally {
      set({ sessionsLoading: false });
    }
  },

  createSession: async () => {
    const { data } = await api.post<ChatSession>("/chat/sessions");
    set((state) => ({ sessions: [data, ...state.sessions] }));
    return data;
  },

  deleteSession: async (id: string) => {
    await api.delete(`/chat/sessions/${id}`);
    set((state) => {
      const sessions = state.sessions.filter((s) => s.id !== id);
      const activeSessionId = state.activeSessionId === id ? null : state.activeSessionId;
      const messages = state.activeSessionId === id ? [] : state.messages;
      return { sessions, activeSessionId, messages };
    });
  },

  selectSession: async (id: string) => {
    set({ messagesLoading: true, activeSessionId: id });
    try {
      const { data } = await api.get<ChatMessage[]>(`/chat/sessions/${id}/messages`);
      set({ messages: data });
    } finally {
      set({ messagesLoading: false });
    }
  },

  sendMessage: async (content: string) => {
    const { activeSessionId } = get();
    if (!activeSessionId) return;

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: activeSessionId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, tempUserMsg], streaming: true, streamingContent: "" }));

    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    try {
      const response = await fetch(
        `${API_BASE}/chat/sessions/${activeSessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.type === "token") {
              accumulated += payload.content;
              set({ streamingContent: accumulated });
            } else if (payload.type === "done") {
              // Replace streaming with final message
              const finalMsg: ChatMessage = {
                id: `assistant-${Date.now()}`,
                session_id: activeSessionId,
                role: "assistant",
                content: accumulated,
                created_at: new Date().toISOString(),
              };
              set((state) => ({
                messages: [...state.messages, finalMsg],
                streaming: false,
                streamingContent: "",
              }));
              // Refresh sessions to update title
              get().fetchSessions();
            } else if (payload.type === "error") {
              throw new Error(payload.message);
            }
          } catch {
            // ignore JSON parse errors for incomplete chunks
          }
        }
      }
    } catch (err) {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== tempUserMsg.id),
        streaming: false,
        streamingContent: "",
      }));
      throw err;
    }
  },
}));
