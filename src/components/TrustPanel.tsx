'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, RotateCcw, Headphones, Check } from 'lucide-react';

const TrustIconAnimated = ({ type }: { type: string }) => {
  switch (type) {
    case 'shield':
      return (
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <Shield size={22} className="text-primary" />
            <motion.div
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check size={9} className="text-primary" />
            </motion.div>
          </motion.div>
        </div>
      );
    case 'truck':
      return (
        <div className="relative flex items-center justify-center w-full h-full">
          <motion.div
            animate={{ x: [0, 2, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1 flex flex-col gap-0.5"
          >
            <div className="w-1.5 h-0.5 bg-primary/60 rounded" />
            <div className="w-2 h-0.5 bg-primary/40 rounded" />
            <div className="w-1.5 h-0.5 bg-primary/60 rounded" />
          </motion.div>
          <motion.div
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Truck size={20} className="text-primary" />
          </motion.div>
        </div>
      );
    case 'returns':
      return (
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <RotateCcw size={22} className="text-primary" />
        </motion.div>
      );
    case 'support':
      return (
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
        >
          <Headphones size={22} className="text-primary" />
        </motion.div>
      );
    default:
      return null;
  }
};

const trustItems = [
  { type: 'truck', title: 'Free Shipping', desc: 'On orders over $99' },
  { type: 'shield', title: 'Secure Payment', desc: '100% safe & encrypted' },
  { type: 'returns', title: 'Easy Returns', desc: '30-day return policy' },
  { type: 'support', title: 'Expert Support', desc: 'Drone specialists 24/7' },
];

const TrustPanel = () => {
  return (
    <section className="py-16 border-y border-border bg-secondary">
      <div className="max-w-7xl mx-auto px-6 sm:section-padding">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30 mb-4 shadow-[0_0_20px_oklch(0.72_0.19_195/0.15)] overflow-hidden"
              >
                <TrustIconAnimated type={item.type} />
              </motion.div>
              <h3 className="font-heading text-base font-semibold mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground font-sans">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustPanel;
