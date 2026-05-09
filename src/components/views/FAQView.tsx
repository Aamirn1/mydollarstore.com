'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouterStore } from '@/store/router-store';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'What types of drones do you sell?',
    answer: 'We sell four main categories of drones: Camera Drones for aerial photography and videography, Racing Drones for FPV speed enthusiasts, Beginner Drones for those just getting started, and Mini Drones for portable fun. Each category features carefully curated products at unbeatable prices.',
  },
  {
    question: 'Do I need a license to fly a drone?',
    answer: 'In most countries, drones weighing over 250g require registration and potentially a license. Our Mini Drones category includes several models under this threshold. For larger drones, we recommend checking your local aviation authority\'s regulations. Our customer support team can help guide you through the process.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for all unused products in their original packaging. For defective items, we provide free returns and full refunds. Used drones can be returned within 14 days with a 15% restocking fee. Please visit our Returns page for full details.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-7 business days. Express shipping (1-3 business days) is available for an additional fee. Orders over $99 qualify for free standard shipping. We ship to all 50 US states and select international destinations.',
  },
  {
    question: 'Do your drones come with warranties?',
    answer: 'Yes! All our drones come with a manufacturer\'s warranty ranging from 6 months to 2 years depending on the model. We also offer extended warranty plans for up to 3 years of coverage, including accidental damage protection.',
  },
  {
    question: 'Can I get spare parts for my drone?',
    answer: 'Absolutely. We stock a wide range of spare parts including propellers, batteries, chargers, and camera gimbals. If you need a part not listed on our site, contact our support team and we\'ll source it for you.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. We also offer a 25% advance payment option for bank transfers, with the remainder due upon delivery.',
  },
  {
    question: 'Do you offer drone repair services?',
    answer: 'Yes, we offer repair services for all drones purchased from our store. Our certified technicians can handle everything from motor replacements to camera calibration. Contact support to initiate a repair request.',
  },
];

const FAQView = () => {
  const { goBack } = useRouterStore();

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary font-sans text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
            Frequently Asked <span className="text-accent-gradient">Questions</span>
          </h1>
          <p className="text-muted-foreground font-sans text-sm">
            Everything you need to know about our drones and services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border border-border rounded-lg px-4 overflow-hidden"
              >
                <AccordionTrigger className="font-heading text-sm font-semibold text-left hover:text-primary hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans text-sm leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQView;
