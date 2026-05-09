'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Truck, Shield, RotateCcw, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useRouterStore } from '@/store/router-store';
import { useProductStore, type Product } from '@/store/product-store';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { formatPrice } from '@/lib/utils';

const ProductDetailInner = ({ product, related }: { product: Product; related: Product[] }) => {
  const { navigate, goBack } = useRouterStore();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Parse images
  let imageList: string[] = [];
  if (product.images) {
    try {
      imageList = JSON.parse(product.images);
    } catch {
      imageList = [];
    }
  }
  if (imageList.length === 0 && product.imageUrl) {
    imageList = [product.imageUrl];
  }
  if (imageList.length === 0) {
    imageList = ['/products/placeholder.png'];
  }

  // Parse specifications
  let specs: Record<string, string> = {};
  if (product.specifications) {
    try {
      specs = JSON.parse(product.specifications);
    } catch {
      specs = {};
    }
  }

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        priceFormatted: formatPrice(product.price),
        image: imageList[0],
      },
      quantity
    );
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary font-sans text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-card mb-4 border border-border">
              <img
                src={imageList[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {imageList.length > 1 && (
              <div className="flex gap-3">
                {imageList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {product.brand && (
              <p className="text-sm tracking-[0.2em] uppercase text-primary font-sans mb-2">{product.brand}</p>
            )}
            <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-sans">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary font-heading">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through font-sans">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-destructive/10 text-destructive text-sm font-sans font-semibold px-2 py-1 rounded">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="mb-6">
                <h3 className="font-heading text-sm font-semibold mb-3">Specifications</h3>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  {Object.entries(specs).map(([key, value], i) => (
                    <div
                      key={key}
                      className={`flex justify-between px-4 py-2.5 text-sm font-sans ${
                        i % 2 === 0 ? 'bg-card' : 'bg-secondary/30'
                      }`}
                    >
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-sans text-sm font-semibold min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-accent-gradient text-primary-foreground font-sans tracking-widest uppercase text-sm py-6 btn-tech-glow disabled:opacity-50"
              >
                <ShoppingBag size={16} className="mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                <Truck size={16} className="text-primary shrink-0" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                <Shield size={16} className="text-primary shrink-0" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                <RotateCcw size={16} className="text-primary shrink-0" />
                <span>Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold mb-8">
              Related <span className="text-accent-gradient">Products</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetailView = () => {
  const { route, navigate } = useRouterStore();
  const { products, getProduct } = useProductStore();

  const productId = (route as { page: 'product'; productId: string }).productId;
  const product = getProduct(productId);

  if (!product) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-sans text-lg mb-4">Product not found</p>
          <Button onClick={() => navigate({ page: 'shop' })}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailInner key={product.id} product={product} related={related} />;
};

export default ProductDetailView;
