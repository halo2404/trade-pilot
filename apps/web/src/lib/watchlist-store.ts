import { create } from "zustand";
import { api } from "./api";
import type { Asset, WatchlistItem } from "./types";

interface WatchlistState {
  items: WatchlistItem[];
  loading: boolean;
  fetch: () => Promise<void>;
  add: (symbol: string) => Promise<void>;
  remove: (symbol: string) => Promise<void>;
  searchResults: Asset[];
  searching: boolean;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],
  loading: false,
  searchResults: [],
  searching: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<WatchlistItem[]>("/watchlist");
      set({ items: data });
    } finally {
      set({ loading: false });
    }
  },

  add: async (symbol: string) => {
    const { data } = await api.post<WatchlistItem>("/watchlist", { symbol });
    set((s) => ({ items: [data, ...s.items] }));
  },

  remove: async (symbol: string) => {
    await api.delete(`/watchlist/${symbol}`);
    set((s) => ({ items: s.items.filter((i) => i.symbol !== symbol) }));
  },

  search: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ searching: true });
    try {
      const { data } = await api.get<Asset[]>("/assets/search", { params: { q: query } });
      set({ searchResults: data });
    } finally {
      set({ searching: false });
    }
  },

  clearSearch: () => set({ searchResults: [] }),
}));
