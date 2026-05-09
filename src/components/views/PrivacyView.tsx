'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouterStore } from '@/store/router-store';

const PrivacyView = () => {
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
            Privacy <span className="text-accent-gradient">Policy</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 sm:p-8 space-y-6"
        >
          {[
            { title: 'Information We Collect', content: 'We collect personal information such as your name, email address, phone number, shipping address, and payment information when you create an account, place an order, or contact us. We also collect browsing data including IP address, browser type, and pages visited.' },
            { title: 'How We Use Your Information', content: 'Your information is used to process orders, provide customer support, send order updates, and improve our services. With your consent, we may also send promotional emails about new products and special offers.' },
            { title: 'Data Security', content: 'We implement industry-standard security measures to protect your personal information, including SSL encryption for all transactions and secure storage of payment data. We never store your credit card information on our servers.' },
            { title: 'Cookies', content: 'We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences.' },
            { title: 'Third-Party Sharing', content: 'We do not sell your personal information to third parties. We may share data with trusted partners who assist in order fulfillment, payment processing, and site analytics — all bound by confidentiality agreements.' },
            { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. You can also opt out of marketing communications. Contact us at privacy@mydollarstore.com for any data-related requests.' },
            { title: 'Updates', content: 'We may update this policy periodically. Changes will be posted on this page with an updated effective date. Continued use of our site constitutes acceptance of any changes.' },
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

export default PrivacyView;
