'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouterStore } from '@/store/router-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Package, LogOut } from 'lucide-react';

const ProfileView = () => {
  const { navigate } = useRouterStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-sans text-lg mb-4">Please log in to view your profile</p>
          <Button onClick={() => navigate({ page: 'auth', mode: 'login' })}>Sign In</Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out', description: 'See you next time!' });
    navigate({ page: 'home' });
  };

  const handleSaveProfile = () => {
    setEditing(false);
    toast({ title: 'Profile updated', description: 'Your profile has been saved.' });
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-3xl font-bold mb-8">
            My <span className="text-accent-gradient">Profile</span>
          </h1>

          {/* User Card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                <User size={28} className="text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground font-sans">{user.email}</p>
                <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-sans capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <Label className="font-sans text-sm">Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-secondary border-border font-sans mt-1"
                  />
                </div>
                <div>
                  <Label className="font-sans text-sm">Email</Label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-secondary border-border font-sans mt-1"
                    disabled
                  />
                </div>
                <div>
                  <Label className="font-sans text-sm">Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-secondary border-border font-sans mt-1"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSaveProfile} className="bg-accent-gradient text-primary-foreground btn-tech-glow">Save</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground font-sans text-sm">Phone</span>
                  <span className="font-sans text-sm">{user.phone || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground font-sans text-sm">Role</span>
                  <span className="font-sans text-sm capitalize">{user.role}</span>
                </div>
                <Button variant="outline" onClick={() => setEditing(true)} className="mt-2">
                  Edit Profile
                </Button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate({ page: 'my-orders' })}
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-primary/30 transition-colors text-left"
            >
              <Package size={24} className="text-primary" />
              <div>
                <p className="font-heading text-sm font-semibold">My Orders</p>
                <p className="text-xs text-muted-foreground font-sans">View order history</p>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-destructive/30 transition-colors text-left"
            >
              <LogOut size={24} className="text-destructive" />
              <div>
                <p className="font-heading text-sm font-semibold text-destructive">Logout</p>
                <p className="text-xs text-muted-foreground font-sans">Sign out of account</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileView;
