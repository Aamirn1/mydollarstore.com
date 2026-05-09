'use client';

import { motion } from 'framer-motion';
import { useRouterStore } from '@/store/router-store';
import { ArrowLeft, Target, Eye, Zap } from 'lucide-react';

const AboutView = () => {
  const { goBack } = useRouterStore();

  const values = [
    {
      icon: <Target size={28} className="text-primary" />,
      title: 'Quality First',
      description: 'We rigorously test every drone we sell to ensure it meets our high standards for performance and reliability.',
    },
    {
      icon: <Eye size={28} className="text-primary" />,
      title: 'Transparency',
      description: 'What you see is what you get. Detailed specs, honest reviews, and real product images — no surprises.',
    },
    {
      icon: <Zap size={28} className="text-primary" />,
      title: 'Innovation',
      description: 'We stay on the cutting edge of drone technology, bringing you the latest features at prices that make sense.',
    },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary font-sans text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-8">
            About <span className="text-accent-gradient">My Dollar Store</span>
          </h1>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-8"
        >
          <h2 className="font-heading text-xl font-semibold mb-4 text-primary">Our Story</h2>
          <div className="space-y-4 text-muted-foreground font-sans text-sm leading-relaxed">
            <p>
              My Dollar Store was born from a simple idea: everyone should have access to professional-grade drone technology
              without breaking the bank. Founded in 2024 by a team of drone enthusiasts and tech veterans, we set out to
              disrupt the overpriced drone market.
            </p>
            <p>
              We partner directly with manufacturers to cut out middlemen and pass the savings on to you. From camera drones
              that capture breathtaking aerial footage to racing quads that push the limits of speed, we curate only the best
              products at prices that make you smile.
            </p>
            <p>
              Today, we serve thousands of customers across the country — from professional photographers and FPV racing
              pilots to hobbyists and first-time flyers. Our commitment to quality, transparency, and customer satisfaction
              remains at the core of everything we do.
            </p>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-8 text-center"
        >
          <h2 className="font-heading text-xl font-semibold mb-4 text-primary">Our Mission</h2>
          <p className="text-lg font-sans text-foreground max-w-2xl mx-auto">
            To make cutting-edge drone technology accessible to everyone, with unbeatable prices,
            exceptional quality, and world-class support.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="font-heading text-xl font-semibold mb-6 text-center">Our <span className="text-accent-gradient">Values</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-card border border-border rounded-lg p-6 text-center card-glow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                  {value.icon}
                </div>
                <h3 className="font-heading text-sm font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground font-sans text-xs leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-6 sm:p-8 text-center"
        >
          <h2 className="font-heading text-xl font-semibold mb-4 text-primary">Founded by Drone Enthusiasts</h2>
          <p className="text-muted-foreground font-sans text-sm leading-relaxed max-w-xl mx-auto">
            Our team combines decades of experience in aerospace engineering, e-commerce, and customer service.
            We fly what we sell — every product in our store has been personally tested by our team.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutView;
