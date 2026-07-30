'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';
import { Sun, Moon, Heart, Users, Sparkles } from 'lucide-react';

import { useWalletStore } from '@/lib/useWalletStore';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { address, connect, disconnect, isConnecting } = useWalletStore();

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const links = [
    { href: '/', label: 'Creator Profile', icon: Heart },
    { href: '/supporters', label: 'Recent Supporters', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel bg-background/65 backdrop-blur-xl border-b border-border transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 text-white shadow-md shadow-indigo-500/10 group-hover:shadow-indigo-500/20 transition-all duration-300">
            {/* SVG Logo icon with clean lines */}
            <svg
              className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          </div>
          <span className="font-display font-bold tracking-tight text-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 dark:from-indigo-400 dark:via-purple-400 dark:to-teal-300 bg-clip-text text-transparent">
            StellarJar
          </span>
        </Link>

        {/* Navigation links & Theme switch */}
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-1 sm:gap-2 bg-muted/20 dark:bg-muted/10 p-1 rounded-xl border border-border/40">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const LinkIcon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted hover:text-foreground hover:bg-muted/30 dark:hover:bg-muted/20'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-primary rounded-lg shadow-sm shadow-primary/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <LinkIcon className="relative z-10 w-4 h-4" />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Connect Wallet Button */}
          {address ? (
            <button
              onClick={disconnect}
              className="px-4 py-2 rounded-xl text-sm font-bold font-mono bg-muted/30 hover:bg-destructive/20 hover:text-destructive text-foreground transition-all duration-200 border border-border"
            >
              {address.slice(0, 4)}...{address.slice(-4)}
            </button>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:brightness-110 transition-all duration-200 shadow-sm"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 rounded-xl glass-panel bg-card hover:bg-muted/10 flex items-center justify-center text-muted hover:text-foreground transition-all duration-300 border border-border"
            aria-label="Toggle Theme"
          >
            {mounted && (
              <motion.div
                initial={{ scale: 0.6, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                key={resolvedTheme}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400 fill-amber-400/10" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600 fill-indigo-600/10" />
                )}
              </motion.div>
            )}
            {!mounted && <div className="w-5 h-5 rounded-full border-2 border-muted border-t-transparent animate-spin" />}
          </button>
        </div>
      </div>
    </header>
  );
}
