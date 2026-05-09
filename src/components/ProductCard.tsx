'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useRouterStore } from '@/store/router-store';
import { useProductStore, type Product } from '@/store/product-store';
import { formatPrice } from '@/lib/utils';

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCartStore();
  const { navigate } = useRouterStore();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
    >
      <button
        onClick={() => navigate({ page: 'product', productId: product.id })}
        className="text-left w-full"
      >
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card mb-4 product-glow border border-border">
          <img
            src={product.imageUrl || '/products/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {product.tag && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-wider uppercase font-sans font-semibold px-3 py-1 rounded-sm">
              {product.tag}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-destructive text-white text-[10px] tracking-wider uppercase font-sans font-semibold px-2 py-1 rounded-sm">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <span className="bg-muted text-muted-foreground font-sans text-sm font-semibold px-4 py-2 rounded">
                Out of Stock
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                if (product.inStock) {
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    priceFormatted: formatPrice(product.price),
                    image: product.imageUrl || '/products/placeholder.png',
                  });
                }
              }}
              className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-accent-gradient text-primary-foreground px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase font-sans font-semibold flex items-center gap-2 btn-tech-glow ${
                !product.inStock ? 'pointer-events-none' : ''
              }`}
            >
              <ShoppingBag size={14} /> Add to Cart
            </motion.button>
          </div>
        </div>
      </button>
      <div className="flex items-center gap-1 mb-1">
        {Array.from({ length: 5 }).map((_, si) => (
          <Star
            key={si}
            size={12}
            className={si < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}
          />
        ))}
        <span className="text-xs text-muted-foreground font-sans ml-1">
          {product.rating} ({product.reviewCount})
        </span>
      </div>
      <button
        onClick={() => navigate({ page: 'product', productId: product.id })}
        className="text-left"
      >
        <h3 className="font-heading text-sm font-semibold mb-1 hover:text-primary transition-colors">{product.name}</h3>
      </button>
      <div className="flex items-center gap-2">
        <span className="text-primary font-sans text-sm font-semibold">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className="text-muted-foreground font-sans text-xs line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
