'use client';

import { create } from 'zustand';

export type Route =
  | { page: 'home' }
  | { page: 'shop'; categorySlug?: string }
  | { page: 'product'; productId: string }
  | { page: 'cart' }
  | { page: 'checkout' }
  | { page: 'about' }
  | { page: 'contact' }
  | { page: 'faq' }
  | { page: 'blog' }
  | { page: 'auth'; mode?: 'login' | 'register' }
  | { page: 'profile' }
  | { page: 'my-orders' }
  | { page: 'payment'; orderId?: string; amount?: number }
  | { page: 'admin'; tab?: string }
  | { page: 'privacy' }
  | { page: 'terms' }
  | { page: 'returns' };

interface RouterStore {
  route: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
  history: Route[];
}

export const useRouterStore = create<RouterStore>()((set, get) => ({
  route: { page: 'home' },
  history: [{ page: 'home' }],

  navigate: (route) => {
    set((state) => ({
      route,
      history: [...state.history, route],
    }));
    // Scroll to top on navigation
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  goBack: () => {
    const { history } = get();
    if (history.length <= 1) {
      set({ route: { page: 'home' }, history: [{ page: 'home' }] });
      return;
    }
    const newHistory = history.slice(0, -1);
    const previousRoute = newHistory[newHistory.length - 1];
    set({
      route: previousRoute,
      history: newHistory,
    });
  },
}));
