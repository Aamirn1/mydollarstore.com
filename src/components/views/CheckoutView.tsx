'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouterStore } from '@/store/router-store';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';

const CheckoutView = () => {
  const { navigate, goBack } = useRouterStore();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'advance'>('full');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotal();
  const shipping = subtotal > 15000 ? 0 : 250;
  const total = subtotal + shipping;
  const advanceAmount = total * 0.25;
  const remainingAmount = total - advanceAmount;
  const amountToPay = paymentMethod === 'full' ? total : advanceAmount;

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email || !form.address || !form.city) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please log in to place an order.',
        variant: 'destructive',
      });
      navigate({ page: 'auth', mode: 'login' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user!.id,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal,
          shipping,
          total,
          advanceAmount: paymentMethod === 'advance' ? advanceAmount : 0,
          remainingAmount: paymentMethod === 'advance' ? remainingAmount : 0,
          paymentMethod: paymentMethod === 'full' ? 'full' : '25_advance',
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          customerAddress: form.address,
          customerCity: form.city,
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create order');
      }

      const data = await res.json();
      clearCart();
      navigate({ page: 'payment', orderId: data.order.id, amount: amountToPay });
    } catch (err) {
      toast({
        title: 'Order failed',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-sans text-lg mb-4">Your cart is empty</p>
          <Button onClick={() => navigate({ page: 'shop' })}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary font-sans text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl font-bold mb-8"
        >
          <span className="text-accent-gradient">Checkout</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="font-heading text-lg font-semibold mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-sans text-sm">Full Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="bg-secondary border-border font-sans mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="font-sans text-sm">Phone *</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className="bg-secondary border-border font-sans mt-1"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="font-sans text-sm">Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="bg-secondary border-border font-sans mt-1"
                  required
                />
              </div>
              <div>
                <Label className="font-sans text-sm">Address *</Label>
                <Input
                  value={form.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  className="bg-secondary border-border font-sans mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-sans text-sm">City *</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    className="bg-secondary border-border font-sans mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="font-sans text-sm">Order Notes</Label>
                  <Input
                    value={form.notes}
                    onChange={(e) => updateForm('notes', e.target.value)}
                    className="bg-secondary border-border font-sans mt-1"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-heading text-sm font-semibold mb-3">Payment Method</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod('full')}
                    className={`flex-1 p-4 rounded-lg border text-left transition-all ${
                      paymentMethod === 'full'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-heading text-sm font-semibold">Full Payment</p>
                    <p className="text-xs text-muted-foreground font-sans mt-1">{formatPrice(total)}</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('advance')}
                    className={`flex-1 p-4 rounded-lg border text-left transition-all ${
                      paymentMethod === 'advance'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-heading text-sm font-semibold">25% Advance</p>
                    <p className="text-xs text-muted-foreground font-sans mt-1">{formatPrice(advanceAmount)} now</p>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="font-heading text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-xs font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-sans">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-sans font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-heading font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
                {paymentMethod === 'advance' && (
                  <div className="text-xs text-muted-foreground font-sans">
                    <p>Pay now: <span className="text-primary font-semibold">{formatPrice(advanceAmount)}</span></p>
                    <p>Remaining: {formatPrice(remainingAmount)} (on delivery)</p>
                  </div>
                )}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-6 bg-accent-gradient text-primary-foreground font-sans tracking-widest uppercase text-sm py-6 btn-tech-glow disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Order...' : `Pay ${formatPrice(amountToPay)}`}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
