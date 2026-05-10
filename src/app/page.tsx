'use client';

import { useEffect } from 'react';
import { useRouterStore } from '@/store/router-store';
import { useProductStore } from '@/store/product-store';
import { useAuthStore } from '@/store/auth-store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HomeView from '@/components/views/HomeView';
import ShopView from '@/components/views/ShopView';
import ProductDetailView from '@/components/views/ProductDetailView';
import CheckoutView from '@/components/views/CheckoutView';
import PaymentView from '@/components/views/PaymentView';
import AuthView from '@/components/views/AuthView';
import ProfileView from '@/components/views/ProfileView';
import MyOrdersView from '@/components/views/MyOrdersView';
import AboutView from '@/components/views/AboutView';
import ContactView from '@/components/views/ContactView';
import FAQView from '@/components/views/FAQView';
import PrivacyView from '@/components/views/PrivacyView';
import TermsView from '@/components/views/TermsView';
import ReturnsView from '@/components/views/ReturnsView';
import AdminView from '@/components/views/AdminView';
import FloatingButtons from '@/components/FloatingButtons';

export default function Page() {
  const { route } = useRouterStore();
  const { fetchProducts, fetchCategories } = useProductStore();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    checkAuth();
  }, [fetchProducts, fetchCategories, checkAuth]);

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route.page]);

  const isAdmin = route.page === 'admin';

  const renderView = () => {
    switch (route.page) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product':
        return <ProductDetailView />;
      case 'checkout':
        return <CheckoutView />;
      case 'payment':
        return <PaymentView />;
      case 'auth':
        return <AuthView />;
      case 'profile':
        return <ProfileView />;
      case 'my-orders':
        return <MyOrdersView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'faq':
        return <FAQView />;
      case 'privacy':
        return <PrivacyView />;
      case 'terms':
        return <TermsView />;
      case 'returns':
        return <ReturnsView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!isAdmin && <Navbar />}
      {!isAdmin && <CartDrawer />}
      <main className="flex-1">
        {renderView()}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingButtons />}
    </div>
  );
}
