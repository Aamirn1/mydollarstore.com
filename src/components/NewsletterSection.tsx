'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Subscribed!',
        description: 'You\'ll receive our latest drone deals and updates.',
      });
      setEmail('');
    }
  };

  return (
    <section className="py-20 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
          Stay in the <span className="text-accent-gradient">Loop</span>
        </h2>
        <p className="text-muted-foreground font-sans text-sm mb-6 px-2 sm:px-0">
          Subscribe for exclusive deals, new drone releases, and expert flight tips.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-2 sm:px-0" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border text-foreground font-sans placeholder:text-muted-foreground flex-1"
            required
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit" className="bg-accent-gradient text-primary-foreground font-sans tracking-widest uppercase text-xs px-6 btn-tech-glow">
              Subscribe
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
