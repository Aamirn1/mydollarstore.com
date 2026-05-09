'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouterStore } from '@/store/router-store';

const ReturnsView = () => {
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
            Return <span className="text-accent-gradient">Policy</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 sm:p-8 space-y-6"
        >
          {[
            { title: '30-Day Return Window', content: 'You may return unused products in their original, unopened packaging within 30 days of delivery for a full refund. Products must be in the same condition as received, with all accessories and documentation included.' },
            { title: 'Defective Products', content: 'If you receive a defective product, we offer free returns and a full refund or replacement within 30 days. Contact our support team with your order number and a description of the issue, and we\'ll provide a prepaid return label.' },
            { title: 'Used Drones', content: 'Used drones may be returned within 14 days of delivery, subject to a 15% restocking fee. The drone must be in working condition with all original accessories. Cosmetic damage may result in additional deductions.' },
            { title: 'Non-Returnable Items', content: 'The following items cannot be returned: opened software, downloaded digital content, gift cards, and items marked as final sale. Customized or modified drones are also non-returnable.' },
            { title: 'How to Initiate a Return', content: 'To start a return, contact our support team at returns@mydollarstore.com with your order number and reason for return. We\'ll provide return instructions and a shipping label within 24 hours.' },
            { title: 'Refund Process', content: 'Refunds are processed within 5-7 business days after we receive and inspect the returned product. The refund will be issued to your original payment method. Shipping costs are non-refundable unless the return is due to our error.' },
            { title: 'Exchanges', content: 'We currently do not offer direct exchanges. To exchange a product, please return the original item and place a new order. We\'ll expedite shipping on the replacement order at no additional cost.' },
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

export default ReturnsView;
