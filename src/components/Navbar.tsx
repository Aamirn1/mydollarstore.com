'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X, ChevronRight, Shield } from 'lucide-react';
import Logo from '@/components/Logo';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useRouterStore } from '@/store/router-store';
import SearchOverlay from '@/components/SearchOverlay';

const navLinks = [
  { label: 'Home', page: 'home' as const },
  { label: 'Shop', page: 'shop' as const },
  { label: 'Categories', page: 'shop' as const },
  { label: 'About', page: 'about' as const },
  { label: 'Contact', page: 'contact' as const },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items, toggleCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { navigate, route } = useRouterStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (page: string) => {
    return route.page === page;
  };

  const handleNavClick = (page: string) => {
    if (page === 'Categories') {
      navigate({ page: 'shop' });
    } else {
      navigate({ page: page as 'home' | 'shop' | 'about' | 'contact' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-background/50'
            : 'bg-background/90 backdrop-blur-xl border-b border-border'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between h-16 lg:h-20">
          <div className="ml-0 shrink-0">
            <div onClick={() => navigate({ page: 'home' })} className="cursor-pointer">
              <Logo size="md" />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.page)}
                className="text-sm font-sans tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${
                    isActive(link.page) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            {user?.role === 'admin' && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => navigate({ page: 'admin' })}
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="Admin Panel"
                >
                  <Shield size={20} />
                </button>
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </motion.button>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => navigate(isAuthenticated ? { page: 'profile' } : { page: 'auth', mode: 'login' })}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Account"
              >
                <User size={20} />
              </button>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="relative text-muted-foreground hover:text-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-sans font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden text-foreground p-2 rounded-lg bg-secondary"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden glass-dark overflow-hidden rounded-b-2xl mx-2 mb-2 border border-border"
            >
              <nav className="flex flex-col py-6 px-4 gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <button
                      onClick={() => handleNavClick(link.page)}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-sans tracking-widest uppercase transition-all duration-200 w-full ${
                        isActive(link.page)
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground hover:text-primary hover:bg-card'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                  </motion.div>
                ))}
                {user?.role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                  >
                    <button
                      onClick={() => { navigate({ page: 'admin' }); setMobileOpen(false); }}
                      className="flex items-center justify-between py-3 px-4 rounded-xl text-sm font-sans tracking-widest uppercase text-primary hover:bg-primary/10 transition-all duration-200 w-full"
                    >
                      <span className="flex items-center gap-2"><Shield size={16} /> Admin</span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.1 }}
                >
                  <button
                    onClick={() => { navigate({ page: 'faq' }); setMobileOpen(false); }}
                    className="flex items-center justify-between py-3 px-4 rounded-xl text-sm font-sans tracking-widest uppercase text-foreground hover:text-primary hover:bg-card transition-all duration-200 w-full"
                  >
                    <span>FAQ</span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </button>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
