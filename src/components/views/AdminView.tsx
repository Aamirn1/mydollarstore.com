'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Star, DollarSign,
  Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Eye, Check, X,
  TrendingUp, Clock, AlertCircle, ArrowLeft,
} from 'lucide-react';
import { useRouterStore } from '@/store/router-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  ordersByStatus: Record<string, number>;
}

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  categorySlug: string;
  imageUrl: string | null;
  inStock: boolean;
  rating: number;
  tag: string | null;
  brand: string | null;
}

interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
  trackingNumber: string | null;
  items: Array<{ name: string; price: number; quantity: number }>;
}

interface AdminPartner {
  id: string;
  businessName: string;
  status: string;
  user: { name: string; email: string };
  createdAt: string;
}

interface AdminPayout {
  id: string;
  amount: number;
  status: string;
  partner: { name: string };
  paidAt: string | null;
}

interface AdminReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  isApproved: boolean;
  product: { name: string };
  user: { name: string };
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CHART_COLORS = [
  'oklch(0.72 0.19 195)',
  'oklch(0.75 0.2 180)',
  'oklch(0.65 0.15 220)',
  'oklch(0.6 0.18 160)',
  'oklch(0.55 0.12 250)',
  'oklch(0.5 0.1 300)',
  'oklch(0.45 0.15 30)',
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  confirmed: 'bg-blue-500/10 text-blue-500',
  processing: 'bg-purple-500/10 text-purple-500',
  shipped: 'bg-cyan-500/10 text-cyan-500',
  delivered: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
};

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'partners', label: 'Partners', icon: Users },
  { id: 'payouts', label: 'Payouts', icon: DollarSign },
  { id: 'reviews', label: 'Reviews', icon: Star },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const AdminView = () => {
  const { navigate } = useRouterStore();
  const { user, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);

  // Product dialog
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [productForm, setProductForm] = useState({
    name: '', slug: '', price: '', originalPrice: '', categorySlug: 'camera-drones',
    imageUrl: '', description: '', brand: '', tag: '', inStock: true, stockCount: '10',
  });

  // Order status update
  const [orderStatusUpdate, setOrderStatusUpdate] = useState<Record<string, string>>({});

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const authHeaders: Record<string, string> = user?.id
    ? { 'Authorization': `Bearer ${user.id}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };

  /* ---- Data fetching ---- */
  useEffect(() => {
    if (!isAdmin || !user?.id) return;
    const loadData = async () => {
      try {
        const statsRes = await fetch('/api/admin/stats', { headers: authHeaders });
        if (statsRes.ok) setStats(await statsRes.json());
      } catch { /* ignore */ }
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) { const d = await prodRes.json(); setProducts(d.products || []); }
      } catch { /* ignore */ }
      try {
        const ordRes = await fetch(`/api/orders?userId=${user.id}`, { headers: authHeaders });
        if (ordRes.ok) { const d = await ordRes.json(); setOrders(d.orders || []); }
      } catch { /* ignore */ }
      try {
        const partRes = await fetch('/api/partners', { headers: authHeaders });
        if (partRes.ok) { const d = await partRes.json(); setPartners(d.applications || []); }
      } catch { /* ignore */ }
      try {
        const payRes = await fetch('/api/payouts', { headers: authHeaders });
        if (payRes.ok) { const d = await payRes.json(); setPayouts(d.payouts || []); }
      } catch { /* ignore */ }
      try {
        const revRes = await fetch('/api/reviews', { headers: authHeaders });
        if (revRes.ok) { const d = await revRes.json(); setReviews(d.reviews || []); }
      } catch { /* ignore */ }
    };
    loadData();
  }, [isAdmin, user?.id]);

  /* ---- Auth check ---- */
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground font-sans text-lg mb-4">Admin access required</p>
          <Button onClick={() => navigate({ page: 'auth', mode: 'login' })}>Sign In</Button>
        </div>
      </div>
    );
  }

  /* ---- Refresh helpers ---- */
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) { const d = await res.json(); setProducts(d.products || []); }
    } catch { /* ignore */ }
  };

  const refreshOrders = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/orders?userId=${user.id}`, { headers: authHeaders });
      if (res.ok) { const d = await res.json(); setOrders(d.orders || []); }
    } catch { /* ignore */ }
  };

  const refreshStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', { headers: authHeaders });
      if (res.ok) setStats(await res.json());
    } catch { /* ignore */ }
  };

  const refreshPartners = async () => {
    try {
      const res = await fetch('/api/partners', { headers: authHeaders });
      if (res.ok) { const d = await res.json(); setPartners(d.applications || []); }
    } catch { /* ignore */ }
  };

  /* ---- Product CRUD ---- */
  const handleSaveProduct = async () => {
    const payload = {
      name: productForm.name,
      slug: productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
      categorySlug: productForm.categorySlug,
      imageUrl: productForm.imageUrl || null,
      description: productForm.description || null,
      brand: productForm.brand || null,
      tag: productForm.tag || null,
      inStock: productForm.inStock,
      stockCount: parseInt(productForm.stockCount) || 10,
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setProductDialogOpen(false);
        setEditingProduct(null);
        refreshProducts();
      }
    } catch { /* ignore */ }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders });
      refreshProducts();
    } catch { /* ignore */ }
  };

  const openEditProduct = (product: AdminProduct) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: product.price.toString(),
      originalPrice: '',
      categorySlug: product.categorySlug,
      imageUrl: product.imageUrl || '',
      description: '',
      brand: product.brand || '',
      tag: product.tag || '',
      inStock: product.inStock,
      stockCount: '10',
    });
    setProductDialogOpen(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', slug: '', price: '', originalPrice: '', categorySlug: 'camera-drones',
      imageUrl: '', description: '', brand: '', tag: '', inStock: true, stockCount: '10',
    });
    setProductDialogOpen(true);
  };

  /* ---- Order status update ---- */
  const handleOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      refreshOrders();
      refreshStats();
    } catch { /* ignore */ }
  };

  const handleOrderTracking = async (orderId: string) => {
    const tracking = orderStatusUpdate[orderId];
    if (!tracking) return;
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ trackingNumber: tracking }),
      });
      refreshOrders();
    } catch { /* ignore */ }
  };

  /* ---- Partner actions ---- */
  const handlePartnerAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      await fetch(`/api/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      refreshPartners();
    } catch { /* ignore */ }
  };

  /* ---- Format helpers ---- */
  const fmtPrice = formatPrice;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString();

  /* ================================================================== */
  /*  RENDER                                                            */
  /* ================================================================== */

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-56' : 'w-16'
        } bg-card border-r border-border flex flex-col transition-all duration-300 shrink-0`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <span className="font-heading text-sm font-bold text-accent-gradient">ADMIN</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <button
            onClick={() => navigate({ page: 'home' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft size={18} />
            {sidebarOpen && <span>Back to Store</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl">
          {/* ---- DASHBOARD ---- */}
          {activeTab === 'dashboard' && stats && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-heading text-2xl font-bold mb-6">Dashboard</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Revenue', value: fmtPrice(stats.totalRevenue), icon: DollarSign, color: 'text-green-500' },
                  { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'text-primary' },
                  { label: 'Active Products', value: stats.totalProducts.toString(), icon: Package, color: 'text-purple-500' },
                  { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users, color: 'text-cyan-500' },
                ].map((card) => (
                  <div key={card.label} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-sans">{card.label}</span>
                      <card.icon size={18} className={card.color} />
                    </div>
                    <p className="font-heading text-xl font-bold">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-heading text-sm font-semibold mb-4">Orders by Status</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={Object.entries(stats.ordersByStatus).map(([name, value]) => ({ name, value }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.015 250)" />
                      <XAxis dataKey="name" tick={{ fill: 'oklch(0.6 0.02 250)', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'oklch(0.6 0.02 250)', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'oklch(0.17 0.015 250)',
                          border: '1px solid oklch(0.28 0.015 250)',
                          borderRadius: '8px',
                          color: 'oklch(0.95 0.01 250)',
                        }}
                      />
                      <Bar dataKey="value" fill="oklch(0.72 0.19 195)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-heading text-sm font-semibold mb-4">Revenue Breakdown</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={Object.entries(stats.ordersByStatus).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {Object.entries(stats.ordersByStatus).map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-heading text-sm font-semibold mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-sans">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-muted-foreground">Order</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Customer</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Total</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Status</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-2 px-3">#{order.id.slice(-8)}</td>
                          <td className="py-2 px-3">{order.customerName}</td>
                          <td className="py-2 px-3">{fmtPrice(order.total)}</td>
                          <td className="py-2 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs ${statusColors[order.status] || ''}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-muted-foreground">{fmtDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---- PRODUCTS ---- */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-heading text-2xl font-bold">Products</h1>
                <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openNewProduct} className="bg-accent-gradient text-primary-foreground btn-tech-glow">
                      <Plus size={16} className="mr-1" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-heading">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                      <div>
                        <Label className="font-sans text-sm">Name</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                          className="bg-secondary border-border font-sans mt-1"
                        />
                      </div>
                      <div>
                        <Label className="font-sans text-sm">Slug</Label>
                        <Input
                          value={productForm.slug}
                          onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                          className="bg-secondary border-border font-sans mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="font-sans text-sm">Price</Label>
                          <Input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            className="bg-secondary border-border font-sans mt-1"
                          />
                        </div>
                        <div>
                          <Label className="font-sans text-sm">Original Price</Label>
                          <Input
                            type="number"
                            value={productForm.originalPrice}
                            onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                            className="bg-secondary border-border font-sans mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="font-sans text-sm">Category</Label>
                        <select
                          value={productForm.categorySlug}
                          onChange={(e) => setProductForm({ ...productForm, categorySlug: e.target.value })}
                          className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm font-sans mt-1"
                        >
                          <option value="camera-drones">Camera Drones</option>
                          <option value="racing-drones">Racing Drones</option>
                          <option value="beginner-drones">Beginner Drones</option>
                          <option value="mini-drones">Mini Drones</option>
                        </select>
                      </div>
                      <div>
                        <Label className="font-sans text-sm">Image URL</Label>
                        <Input
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                          className="bg-secondary border-border font-sans mt-1"
                          placeholder="/products/example.png"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="font-sans text-sm">Brand</Label>
                          <Input
                            value={productForm.brand}
                            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                            className="bg-secondary border-border font-sans mt-1"
                          />
                        </div>
                        <div>
                          <Label className="font-sans text-sm">Tag</Label>
                          <Input
                            value={productForm.tag}
                            onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                            className="bg-secondary border-border font-sans mt-1"
                            placeholder="Best Seller, New, etc."
                          />
                        </div>
                      </div>
                      <Button onClick={handleSaveProduct} className="w-full bg-accent-gradient text-primary-foreground btn-tech-glow">
                        {editingProduct ? 'Update Product' : 'Create Product'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-sans">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground">Product</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Price</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Category</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {product.imageUrl && (
                                <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover" />
                              )}
                              <div>
                                <p className="font-semibold text-sm">{product.name}</p>
                                {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{fmtPrice(product.price)}</td>
                          <td className="py-3 px-4 capitalize">{product.categorySlug.replace('-', ' ')}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs ${product.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEditProduct(product)} className="text-muted-foreground hover:text-primary">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---- ORDERS ---- */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-heading text-2xl font-bold mb-6">Orders</h1>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-sans">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground">Order</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Total</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Tracking</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-3 px-4">#{order.id.slice(-8)}</td>
                          <td className="py-3 px-4">{order.customerName}</td>
                          <td className="py-3 px-4">{fmtPrice(order.total)}</td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                              className="bg-secondary border border-border rounded px-2 py-1 text-xs font-sans"
                            >
                              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Tracking #"
                                value={orderStatusUpdate[order.id] || order.trackingNumber || ''}
                                onChange={(e) => setOrderStatusUpdate({ ...orderStatusUpdate, [order.id]: e.target.value })}
                                className="bg-secondary border-border text-xs h-7 w-32"
                              />
                              <button
                                onClick={() => handleOrderTracking(order.id)}
                                className="text-primary hover:text-primary/80"
                              >
                                <Check size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-xs">{fmtDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---- PARTNERS ---- */}
          {activeTab === 'partners' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-heading text-2xl font-bold mb-6">Partner Applications</h1>
              {partners.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <Clock size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-sans">No partner applications yet</p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-sans">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-muted-foreground">Applicant</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Business</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Date</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partners.map((partner) => (
                          <tr key={partner.id} className="border-b border-border/50 hover:bg-secondary/30">
                            <td className="py-3 px-4">
                              <p className="font-semibold">{partner.user.name}</p>
                              <p className="text-xs text-muted-foreground">{partner.user.email}</p>
                            </td>
                            <td className="py-3 px-4">{partner.businessName}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className={partner.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/30' : partner.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}>
                                {partner.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground text-xs">{fmtDate(partner.createdAt)}</td>
                            <td className="py-3 px-4">
                              {partner.status === 'pending' && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handlePartnerAction(partner.id, 'approved')}
                                    className="text-green-500 hover:text-green-600"
                                    title="Approve"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={() => handlePartnerAction(partner.id, 'rejected')}
                                    className="text-red-500 hover:text-red-600"
                                    title="Reject"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ---- PAYOUTS ---- */}
          {activeTab === 'payouts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-heading text-2xl font-bold mb-6">Payouts</h1>
              {payouts.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <DollarSign size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-sans">No payouts yet</p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-sans">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-muted-foreground">ID</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Partner</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Amount</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Paid At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payouts.map((payout) => (
                          <tr key={payout.id} className="border-b border-border/50 hover:bg-secondary/30">
                            <td className="py-3 px-4">#{payout.id.slice(-8)}</td>
                            <td className="py-3 px-4">{payout.partner.name}</td>
                            <td className="py-3 px-4">{fmtPrice(payout.amount)}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className={payout.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}>
                                {payout.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground text-xs">
                              {payout.paidAt ? fmtDate(payout.paidAt) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ---- REVIEWS ---- */}
          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-heading text-2xl font-bold mb-6">Reviews</h1>
              {reviews.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <Star size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-sans">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-heading text-sm font-semibold">{review.title}</p>
                          <p className="text-xs text-muted-foreground font-sans">
                            {review.user.name} on {review.product.name} · {fmtDate(review.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}
                              />
                            ))}
                          </div>
                          <Badge variant="outline" className={review.isApproved ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}>
                            {review.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-sans">{review.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Empty dashboard */}
          {activeTab === 'dashboard' && !stats && (
            <div className="flex items-center justify-center py-20">
              <TrendingUp size={32} className="text-muted-foreground animate-pulse" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminView;
