'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useProductStore } from '@/store/product-store';
import { useRouterStore } from '@/store/router-store';
import { formatPrice } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { products } = useProductStore();
  const { navigate } = useRouterStore();

  const handleClose = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.categorySlug.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query, products]);

  const handleSelect = (productId: string) => {
    navigate({ page: 'product', productId });
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-[61] bg-card border-b border-border shadow-2xl"
          >
            <div className="max-w-3xl mx-auto p-4 sm:p-6">
              <div className="relative flex items-center gap-2 border border-primary/40 rounded-full px-4 py-2 shadow-[0_0_15px_oklch(0.72_0.19_195/0.15)] transition-shadow focus-within:shadow-[0_0_20px_oklch(0.72_0.19_195/0.3)] bg-card">
                <Search size={20} className="text-primary shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search drones, brands, categories..."
                  className="flex-1 min-w-0 bg-transparent text-foreground font-sans text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none pr-10"
                />
                <button
                  onClick={handleClose}
                  className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </div>

              {results.length > 0 && (
                <div className="mt-4 border-t border-border pt-4 space-y-2">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product.id)}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors w-full text-left"
                    >
                      <img
                        src={product.imageUrl || '/products/placeholder.png'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-semibold truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground font-sans">{product.brand} · {product.categorySlug.replace('-', ' ')}</p>
                      </div>
                      <p className="text-primary font-sans text-sm font-semibold shrink-0">{formatPrice(product.price)}</p>
                    </button>
                  ))}
                </div>
              )}

              {query.length >= 2 && results.length === 0 && (
                <div className="mt-4 border-t border-border pt-6 text-center">
                  <p className="text-muted-foreground font-sans text-sm">No products found for &quot;{query}&quot;</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
