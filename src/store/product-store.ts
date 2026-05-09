'use client';

import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  categorySlug: string;
  imageUrl: string | null;
  images: string | null;
  description: string | null;
  specifications: string | null;
  rating: number;
  reviewCount: number;
  tag: string | null;
  brand: string | null;
  inStock: boolean;
  stockCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  description: string | null;
  productCount: number;
  createdAt: string;
}

interface ProductStore {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchProducts: (force?: boolean) => Promise<void>;
  fetchCategories: (force?: boolean) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  getProductsByCategory: (categorySlug: string) => Product[];
  getCategory: (slug: string) => Category | undefined;
  clearCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProductStore = create<ProductStore>()((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchProducts: async (force = false) => {
    const { lastFetched, isLoading } = get();
    if (isLoading) return;
    if (!force && lastFetched && Date.now() - lastFetched < CACHE_DURATION) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      set({
        products: data.products || [],
        lastFetched: Date.now(),
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  fetchCategories: async (force = false) => {
    const { categories, isLoading } = get();
    if (isLoading) return;
    if (!force && categories.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      set({
        categories: data.categories || [],
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  getProduct: (id) => {
    return get().products.find((p) => p.id === id);
  },

  getProductsByCategory: (categorySlug) => {
    return get().products.filter((p) => p.categorySlug === categorySlug);
  },

  getCategory: (slug) => {
    return get().categories.find((c) => c.slug === slug);
  },

  clearCache: () => {
    set({
      products: [],
      categories: [],
      lastFetched: null,
      error: null,
    });
  },
}));
