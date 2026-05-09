'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Upload } from 'lucide-react';
import { useRouterStore } from '@/store/router-store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';

const PaymentView = () => {
  const { route, navigate, goBack } = useRouterStore();
  const { toast } = useToast();

  const paymentRoute = route as { page: 'payment'; orderId?: string; amount?: number };
  const orderId = paymentRoute.orderId || '';
  const amount = paymentRoute.amount || 0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Bank details copied to clipboard.' });
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-8">
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
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="font-heading text-2xl font-bold mb-2">Order Placed!</h1>
          <p className="text-muted-foreground font-sans text-sm">Order ID: <span className="text-primary font-semibold">{orderId}</span></p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 mb-6"
        >
          <h2 className="font-heading text-lg font-semibold mb-4">Payment Details</h2>
          <div className="text-center mb-6">
            <p className="text-muted-foreground font-sans text-sm">Amount to Pay</p>
            <p className="font-heading text-4xl font-bold text-primary">{formatPrice(amount)}</p>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-heading text-sm font-semibold mb-3">Bank Transfer Details</h3>
            <div className="space-y-3">
              {[
                { label: 'Bank', value: 'JazzCash / EasyPaisa' },
                { label: 'Account Name', value: 'My Dollar Store' },
                { label: 'Account Number', value: '0328-4872550' },
                { label: 'IBAN', value: 'PK36ABCD00000003284872550' },
                { label: 'Reference', value: `ORDER-${orderId.slice(-8)}` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-secondary/50 rounded px-4 py-2.5">
                  <div>
                    <p className="text-xs text-muted-foreground font-sans">{item.label}</p>
                    <p className="text-sm font-sans font-semibold">{item.value}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.value)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6 mb-8"
        >
          <h3 className="font-heading text-sm font-semibold mb-3">Upload Payment Screenshot</h3>
          <p className="text-xs text-muted-foreground font-sans mb-4">
            After completing the bank transfer, upload a screenshot for verification.
          </p>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-sans text-muted-foreground">Click to upload or drag & drop</p>
            <p className="text-xs font-sans text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
          </div>
        </motion.div>

        <div className="text-center">
          <Button
            onClick={() => navigate({ page: 'home' })}
            className="bg-accent-gradient text-primary-foreground font-sans tracking-widest uppercase text-sm px-8 btn-tech-glow"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
