'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Phone, Send } from 'lucide-react';

export default function LockPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isUnlockLoading, setIsUnlockLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError(null);
    setEmailSuccess(false);

    try {
      const res = await fetch('/api/lock-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Unable to save your email right now' }));
        setError(data.error || 'Unable to save your email right now');
        return;
      }

      setEmail('');
      setPhone('');
      setEmailSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlockLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Invalid password' }));
        setError(data.error || 'Invalid password');
        return;
      }

      router.replace('/');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsUnlockLoading(false);
    }
  };

  return (
    <section className="relative min-h-[100dvh] sm:h-screen flex items-center justify-center overflow-hidden px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat grayscale"
        style={{
          backgroundImage: 'url(/hundoja-hero.jpg)',
          backgroundPosition: 'left 20% top 30%',
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full px-4">
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-[196px] sm:w-[280px]">
            <Image src="/Hundoja-2025-logo.webp" alt="Hundoja Logo" width={280} height={93} priority />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-md mx-auto"
        >
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h1 className="text-lg font-semibold text-white mb-1">Stay Updated</h1>
              <p className="text-gray-300 text-sm">Get first access to the next Hundoja drop</p>
            </div>

            <div className="relative">
              <label htmlFor="email" className="sr-only">Email address</label>
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                size={18}
              />
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                disabled={isEmailLoading}
                className="w-full pl-10 pr-4 py-3 rounded-lg border bg-black/30 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="phone" className="sr-only">Phone number</label>
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                size={18}
              />
              <input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                disabled={isEmailLoading}
                className="w-full pl-10 pr-4 py-3 rounded-lg border bg-black/30 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {emailSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-lg text-sm bg-green-500/20 text-green-300 border border-green-500/30"
                role="status"
              >
                You are on the list.
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30"
                role="alert"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isEmailLoading || (!email && !phone)}
              aria-busy={isEmailLoading}
              className="w-full py-2 sm:py-3 px-4 sm:px-6 font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-gray-200 transform hover:scale-105 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/30"
              whileHover={{ scale: isEmailLoading || (!email && !phone) ? 1 : 1.05 }}
              whileTap={{ scale: isEmailLoading || (!email && !phone) ? 1 : 0.98 }}
            >
              {isEmailLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>JOIN THE LIST</span>
                </>
              )}
            </motion.button>
          </form>

          <form onSubmit={handleUnlockSubmit} className="mt-6 space-y-3">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-black px-3 py-1 text-xs text-white/60 font-medium">
                  Private access
                </span>
              </div>
            </div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                  size={18}
                />
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  autoCapitalize="none"
                  spellCheck={false}
                  inputMode="text"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-black/30 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 disabled:opacity-50"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={isUnlockLoading || !password}
                aria-busy={isUnlockLoading}
                className="shrink-0 px-4 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: isUnlockLoading || !password ? 1 : 0.98 }}
              >
                {isUnlockLoading ? '...' : 'Unlock'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      <motion.div
        className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
