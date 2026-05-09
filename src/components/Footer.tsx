'use client';

import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import Logo from '@/components/Logo';
import { useRouterStore } from '@/store/router-store';

const Footer = () => {
  const { navigate } = useRouterStore();

  return (
    <footer className="border-t border-border bg-card py-12 px-6 sm:section-padding mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-muted-foreground text-xs font-sans leading-relaxed">
              Your one-stop shop for professional drones, racing quads, and beginner-friendly flyers. Quality tech at unbeatable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Shop All', page: 'shop' as const },
                { label: 'Camera Drones', page: 'shop' as const, slug: 'camera-drones' },
                { label: 'Racing Drones', page: 'shop' as const, slug: 'racing-drones' },
                { label: 'Beginner Drones', page: 'shop' as const, slug: 'beginner-drones' },
                { label: 'Mini Drones', page: 'shop' as const, slug: 'mini-drones' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate({ page: link.page, ...(link.slug ? { categorySlug: link.slug } : {}) })}
                    className="text-xs text-muted-foreground hover:text-primary font-sans transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary">Support</h4>
            <ul className="space-y-2">
              {[
                { label: 'Contact Us', page: 'contact' as const },
                { label: 'FAQ', page: 'faq' as const },
                { label: 'About', page: 'about' as const },
                { label: 'Returns', page: 'returns' as const },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate({ page: link.page })}
                    className="text-xs text-muted-foreground hover:text-primary font-sans transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary">Legal</h4>
            <ul className="space-y-2 mb-6">
              {[
                { label: 'Privacy Policy', page: 'privacy' as const },
                { label: 'Terms of Service', page: 'terms' as const },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate({ page: link.page })}
                    className="text-xs text-muted-foreground hover:text-primary font-sans transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter"><Twitter size={18} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-sans">
            © {new Date().getFullYear()} My Dollar Store. All rights reserved.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate({ page: 'privacy' })} className="text-[10px] text-muted-foreground hover:text-primary font-sans transition-colors">Privacy</button>
            <button onClick={() => navigate({ page: 'terms' })} className="text-[10px] text-muted-foreground hover:text-primary font-sans transition-colors">Terms</button>
            <button onClick={() => navigate({ page: 'returns' })} className="text-[10px] text-muted-foreground hover:text-primary font-sans transition-colors">Returns</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
