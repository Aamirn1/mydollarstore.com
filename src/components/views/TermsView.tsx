'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouterStore } from '@/store/router-store';

const TermsView = () => {
  const { goBack } = useRouterStore();

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <button onClick={goBack} className="flex items-center gap-2 text-muted-foreground hover:text-primary font-sans text-sm transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold mb-8">
            Terms of <span className="text-accent-gradient">Service</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 sm:p-8 space-y-6"
        >
          {[
            { title: 'Acceptance of Terms', content: 'By accessing and using My Dollar Store\'s website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our services.' },
            { title: 'Products and Pricing', content: 'All product descriptions, images, and specifications are provided in good faith. We reserve the right to correct any errors in pricing or product information. Prices are subject to change without notice, but changes will not affect orders already confirmed.' },
            { title: 'Orders and Payment', content: 'By placing an order, you agree to provide accurate and complete information. We accept major credit cards, PayPal, and bank transfers. The 25% advance payment option requires the remaining balance upon delivery. All payments are processed securely.' },
            { title: 'Shipping and Delivery', content: 'Shipping times are estimates and may vary based on location and product availability. We are not responsible for delays caused by carriers, customs, or unforeseen circumstances. Free shipping applies to orders over $99 within the continental US.' },
            { title: 'Drone Usage Responsibility', content: 'You are solely responsible for the safe and legal operation of any drone purchased from our store. This includes compliance with local aviation regulations, privacy laws, and no-fly zones. My Dollar Store is not liable for any damage, injury, or legal issues arising from drone use.' },
            { title: 'Intellectual Property', content: 'All content on this website, including text, graphics, logos, and images, is the property of My Dollar Store and is protected by intellectual property laws. Unauthorized use or reproduction is prohibited.' },
            { title: 'Limitation of Liability', content: 'My Dollar Store shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the purchase price of the product in question.' },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-sm font-semibold text-primary mb-2">{section.title}</h2>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}

          <p className="text-xs text-muted-foreground font-sans pt-4 border-t border-border">
            Last updated: January 2025
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsView;
