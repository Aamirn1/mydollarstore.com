'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouterStore } from '@/store/router-store';

const line1 = 'Elevate Your';
const line2 = 'Perspective';
const charDelay = 0.06;
const startDelay = 0.5;

const HeroSection = () => {
  const { navigate } = useRouterStore();

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/products/hero-banner.png"
          alt="My Dollar Store - Premium Drones at Unbeatable Prices"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-xs sm:text-base tracking-[0.3em] uppercase text-foreground/80 font-sans mb-4">
              Professional Drone Technology
            </p>
          </motion.div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="block sm:whitespace-nowrap">
              {line1.split('').map((char, i) => (
                <motion.span
                  key={`c1-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: startDelay + i * charDelay, duration: 0.05 }}
                  className="inline-block"
                  style={{ width: char === ' ' ? '0.3em' : undefined }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
            <span className="block text-accent-gradient pb-3">
              {line2.split('').map((char, i) => (
                <motion.span
                  key={`c2-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: startDelay + (line1.length + 1) * charDelay + i * charDelay, duration: 0.05 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-muted-foreground text-xs sm:text-base md:text-lg max-w-2xl mx-auto mb-8 font-sans"
          >
            Discover professional drones, racing quads, and beginner-friendly flyers.
            <span className="hidden sm:inline"> Quality you can trust, prices you&apos;ll love.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="flex flex-row gap-3 sm:gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
              <Button
                onClick={() => navigate({ page: 'shop' })}
                size="lg"
                className="bg-accent-gradient font-sans tracking-widest uppercase text-xs sm:text-sm px-6 sm:px-8 py-5 sm:py-6 transition-all text-primary-foreground font-semibold btn-tech-glow glow-pulse w-full sm:w-auto"
              >
                Shop Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="sm:flex-none">
              <Button
                onClick={() => {
                  const el = document.getElementById('collections');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg"
                variant="outline"
                className="border-primary text-primary font-sans tracking-widest uppercase text-xs sm:text-sm px-6 sm:px-8 py-5 sm:py-6 hover:bg-primary hover:text-primary-foreground transition-all w-full sm:w-auto"
              >
                View Categories
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
