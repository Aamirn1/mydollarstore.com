'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouterStore } from '@/store/router-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  productId?: string;
}

interface Order {
  id: string;
  items: string | OrderItem[];
  subtotal: number;
  status: string;
  customerName: string;
  createdAt: string;
  trackingNumber?: string;
  parsedItems?: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  processing: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  shipped: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
  delivered: 'bg-green-500/10 text-green-500 border-green-500/30',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/30',
  refunded: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  'on-hold': 'bg-gray-500/10 text-gray-500 border-gray-500/30',
};

const MyOrdersView = () => {
  const { goBack } = useRouterStore();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`/api/orders?userId=${user.id}`);
          const data = await res.json();
          const parsedOrders = (data.orders || []).map((order: Order) => {
            let parsedItems: OrderItem[] = [];
            try {
              parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            } catch {
              parsedItems = [];
            }
            return { ...order, parsedItems };
          });
          setOrders(parsedOrders);
        } catch {
          // ignore fetch errors
        }
      }
      setLoading(false);
    };
    loadOrders();
  }, [user?.id]);

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-sans text-lg mb-4">Please log in to view orders</p>
          <Button onClick={() => useRouterStore.getState().navigate({ page: 'auth', mode: 'login' })}>Sign In</Button>
        </div>
      </div>
    );
  }

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

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl font-bold mb-8"
        >
          My <span className="text-accent-gradient">Orders</span>
        </motion.h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-sans text-lg mb-4">No orders yet</p>
            <Button onClick={() => useRouterStore.getState().navigate({ page: 'shop' })}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div>
                    <p className="font-heading text-sm font-semibold">
                      Order #{order.id.slice(-8)}
                    </p>
                    <p className="text-xs text-muted-foreground font-sans mt-1">
                      {new Date(order.createdAt).toLocaleDateString()} · {formatPrice(order.subtotal)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[order.status] || 'bg-muted text-muted-foreground border-border'} variant="outline">
                      {order.status}
                    </Badge>
                    {expanded === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {expanded === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-border"
                  >
                    <div className="p-4 space-y-3">
                      {order.parsedItems?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          )}
                          <div className="flex-1">
                            <p className="font-sans text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground font-sans">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-sans text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                      {order.trackingNumber && (
                        <div className="pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground font-sans">
                            Tracking: <span className="text-primary">{order.trackingNumber}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersView;
