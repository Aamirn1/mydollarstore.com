'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouterStore } from '@/store/router-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AuthView = () => {
  const { navigate } = useRouterStore();
  const { login, register, isLoading } = useAuthStore();
  const { toast } = useToast();

  const route = useRouterStore.getState().route as { page: 'auth'; mode?: 'login' | 'register' };
  const [mode, setMode] = useState<'login' | 'register'>(route.mode || 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      const success = await login(form.email, form.password);
      if (success) {
        toast({ title: 'Welcome back!', description: 'You have been logged in.' });
        navigate({ page: 'home' });
      } else {
        toast({ title: 'Login failed', description: 'Invalid email or password.', variant: 'destructive' });
      }
    } else {
      if (!form.name.trim()) {
        toast({ title: 'Missing field', description: 'Please enter your name.', variant: 'destructive' });
        return;
      }
      const success = await register(form.name, form.email, form.password);
      if (success) {
        toast({ title: 'Account created!', description: 'Welcome to My Dollar Store!' });
        navigate({ page: 'home' });
      } else {
        toast({ title: 'Registration failed', description: 'Email may already be in use.', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="font-heading text-2xl font-bold text-center mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground font-sans text-sm text-center mb-6">
            {mode === 'login' ? 'Sign in to your account' : 'Join My Dollar Store'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <Label className="font-sans text-sm">Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="bg-secondary border-border font-sans mt-1"
                  required
                />
              </div>
            )}
            <div>
              <Label className="font-sans text-sm">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                className="bg-secondary border-border font-sans mt-1"
                required
              />
            </div>
            <div>
              <Label className="font-sans text-sm">Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => updateForm('password', e.target.value)}
                className="bg-secondary border-border font-sans mt-1"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-gradient text-primary-foreground font-sans tracking-widest uppercase text-sm py-5 btn-tech-glow disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground font-sans">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-primary hover:underline font-semibold"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground font-sans">
              Demo admin: admin@mydollarstore.com / admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthView;
