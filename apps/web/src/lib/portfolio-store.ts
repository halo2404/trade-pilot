import { create } from "zustand";
import { api } from "./api";
import type { OrderRequest, Portfolio, PortfolioTrade } from "./portfolio-types";

interface PortfolioState {
  portfolio: Portfolio | null;
  trades: PortfolioTrade[];
  loading: boolean;
  tradesLoading: boolean;
  fetch: () => Promise<void>;
  fetchTrades: () => Promise<void>;
  placeOrder: (order: OrderRequest) => Promise<void>;
  reset: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: null,
  trades: [],
  loading: false,
  tradesLoading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<Portfolio>("/portfolio");
      set({ portfolio: data });
    } finally {
      set({ loading: false });
    }
  },

  fetchTrades: async () => {
    set({ tradesLoading: true });
    try {
      const { data } = await api.get<PortfolioTrade[]>("/portfolio/trades");
      set({ trades: data });
    } finally {
      set({ tradesLoading: false });
    }
  },

  placeOrder: async (order: OrderRequest) => {
    const { data } = await api.post<Portfolio>("/portfolio/orders", order);
    set({ portfolio: data });
  },

  reset: async () => {
    await api.delete("/portfolio/reset");
    set({ trades: [] });
    // re-fetch portfolio after reset
    const { data } = await api.get<Portfolio>("/portfolio");
    set({ portfolio: data });
  },
}));
