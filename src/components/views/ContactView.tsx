'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { useRouterStore } from '@/store/router-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ContactView = () => {
  const { goBack } = useRouterStore();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message sent!', description: 'We\'ll get back to you within 24 hours.' });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
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
          className="font-heading text-3xl sm:text-4xl font-bold mb-8"
        >
          Contact <span className="text-accent-gradient">Us</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div>
                <Label className="font-sans text-sm">Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="bg-secondary border-border font-sans mt-1"
                  required
                />
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
                <Label className="font-sans text-sm">Subject *</Label>
                <Input
                  value={form.subject}
                  onChange={(e) => updateForm('subject', e.target.value)}
                  className="bg-secondary border-border font-sans mt-1"
                  required
                />
              </div>
              <div>
                <Label className="font-sans text-sm">Message *</Label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateForm('message', e.target.value)}
                  rows={5}
                  className="w-full bg-secondary border border-border rounded-md px-3 py-2 font-sans text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent-gradient text-primary-foreground font-sans tracking-widest uppercase text-sm py-5 btn-tech-glow"
              >
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-heading text-lg font-semibold mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm font-semibold">Email</p>
                    <a href="mailto:support@mydollarstore.com" className="text-muted-foreground hover:text-primary font-sans text-sm transition-colors">support@mydollarstore.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm font-semibold">Phone / WhatsApp</p>
                    <a href="https://wa.me/923284872550" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary font-sans text-sm transition-colors">+92 328 4872550</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm font-semibold">Address</p>
                    <p className="text-muted-foreground font-sans text-sm">
                      Rawalpindi, Punjab<br />
                      Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-heading text-lg font-semibold mb-2">Business Hours</h2>
              <div className="space-y-1 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Saturday</span>
                  <span>10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span>12:00 PM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
