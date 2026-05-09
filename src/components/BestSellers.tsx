'use client';

import { motion } from 'framer-motion';
import { useRouterStore } from '@/store/router-store';
import { useProductStore } from '@/store/product-store';
import ProductCard from '@/components/ProductCard';

const BestSellers = () => {
  const { navigate } = useRouterStore();
  const { products } = useProductStore();

  const bestSellers = products
    .filter((p) => p.tag === 'Best Seller' || p.rating >= 4.5)
    .slice(0, 4);

  // If not enough best sellers, just take top-rated products
  const displayProducts = bestSellers.length >= 4
    ? bestSellers
    : [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 px-6 sm:section-padding max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-14"
      >
        <p className="text-sm tracking-[0.3em] uppercase text-primary font-sans mb-3">Trending</p>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
          Best <span className="text-accent-gradient">Sellers</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-12"
      >
        <button
          onClick={() => navigate({ page: 'shop' })}
          className="border border-primary text-primary font-sans tracking-widest uppercase text-xs px-8 py-3 rounded hover:bg-primary hover:text-primary-foreground transition-all"
        >
          View All Products
        </button>
      </motion.div>
    </section>
  );
};

export default BestSellers;
