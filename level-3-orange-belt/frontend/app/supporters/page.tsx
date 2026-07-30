'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Coins, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  RotateCcw, 
  Heart, 
  Search, 
  Award,
  DollarSign,
  Users
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { getSupporters, SupporterTip } from '@/lib/store';

export default function RecentSupporters() {
  const [supporters, setSupporters] = React.useState<SupporterTip[]>([]);
  const [filterType, setFilterType] = React.useState<'latest' | 'top'>('latest');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  // Load supporters on mount
  React.useEffect(() => {
    const data = getSupporters();
    const handle = requestAnimationFrame(() => {
      setSupporters(data);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Compute stats
  const totalXLM = React.useMemo(() => {
    return supporters.reduce((sum, s) => sum + s.amount, 0);
  }, [supporters]);

  const averageTip = React.useMemo(() => {
    if (supporters.length === 0) return 0;
    return Number((totalXLM / supporters.length).toFixed(1));
  }, [supporters, totalXLM]);

  const topSupporter = React.useMemo(() => {
    if (supporters.length === 0) return null;
    return [...supporters].sort((a, b) => b.amount - a.amount)[0];
  }, [supporters]);

  // Handle feed filters
  const processedSupporters = React.useMemo(() => {
    let result = [...supporters];
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => 
          s.name.toLowerCase().includes(q) || 
          (s.message && s.message.toLowerCase().includes(q))
      );
    }

    // Apply sorting
    if (filterType === 'top') {
      result.sort((a, b) => b.amount - a.amount);
    } else {
      // Default to latest (stored array has newest first)
      // Since our saveSupporter adds elements at index 0, this is already newest first.
    }

    return result;
  }, [supporters, filterType, searchQuery]);

  // Clear tips / reset to defaults
  const handleResetFeed = () => {
    localStorage.removeItem('creator_tip_supporters');
    setSupporters(getSupporters());
    setShowResetConfirm(false);
  };

  // Framer motion list container stagger settings
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 220, damping: 20 } },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground flex flex-col">
      {/* Aurora glow backdrops */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none dark:bg-indigo-500/5" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none dark:bg-teal-500/5" />

      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Page Title & Go Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-muted hover:text-foreground transition-colors duration-200 mb-2 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-250 group-hover:-translate-x-1" />
              Back to Profile
            </Link>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-foreground flex items-center gap-2">
              Recent Supporters
              <span className="text-xl sm:text-2xl">💖</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              A dynamic wall of love from fans on the Stellar network
            </p>
          </div>

          {/* Quick Stats Summary Grid (Compact inline) */}
          <div className="flex items-center gap-3 bg-muted/15 p-1.5 rounded-2xl border border-border/40 max-w-full overflow-x-auto">
            <div className="px-4 py-2 text-center border-r border-border/30">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted font-semibold">Total Tipped</p>
              <p className="font-display font-extrabold text-sm sm:text-base text-foreground mt-0.5">{totalXLM} XLM</p>
            </div>
            <div className="px-4 py-2 text-center border-r border-border/30">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted font-semibold">Avg Tip</p>
              <p className="font-display font-extrabold text-sm sm:text-base text-foreground mt-0.5">{averageTip} XLM</p>
            </div>
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted font-semibold">Total Fans</p>
              <p className="font-display font-extrabold text-sm sm:text-base text-foreground mt-0.5">{supporters.length}</p>
            </div>
          </div>
        </div>

        {/* Top Supporter Bento Showcase Card (if exists) */}
        {topSupporter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-panel bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-teal-500/10 rounded-3xl p-5 sm:p-6 mb-8 border border-border shadow-md flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
                <Award className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider mb-1.5">
                  Top Supporter
                </span>
                <h2 className="font-display font-bold text-xl text-foreground tracking-tight">
                  {topSupporter.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {topSupporter.message || 'Supporting Lyra with silent generosity'}
                </p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Generosity Index</p>
              <p className="font-display font-black text-2xl text-amber-500 dark:text-amber-400 mt-0.5">
                {topSupporter.amount} <span className="text-xs font-bold text-foreground">XLM</span>
              </p>
              <p className="text-[9px] font-mono text-muted/70 mt-1">Hash: {topSupporter.txHash}</p>
            </div>
          </motion.div>
        )}

        {/* Filters and Search toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          
          {/* Search bar */}
          <div className="relative flex-grow max-w-md flex items-center">
            <Search className="w-4 h-4 text-muted absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search supporter name or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/15 border border-border/50 focus:border-primary/50 focus:bg-muted/10 outline-none text-sm transition-all duration-200 placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Sort Buttons & Reset Tools */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-1 bg-muted/20 dark:bg-muted/10 p-1 rounded-xl border border-border/30 text-xs font-medium">
              <button
                onClick={() => setFilterType('latest')}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  filterType === 'latest'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Latest Tips
              </button>
              <button
                onClick={() => setFilterType('top')}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  filterType === 'top'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Highest Tips
              </button>
            </div>

            {/* Reset/Clean Feed Button */}
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-9 h-9 rounded-xl border border-border/40 bg-muted/20 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/20 flex items-center justify-center text-muted transition-all duration-200"
                title="Reset feed to mock default state"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 p-1 rounded-xl">
                <button
                  onClick={handleResetFeed}
                  className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold transition-all"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 rounded-lg hover:bg-muted/30 text-muted-foreground text-[11px] font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Supporters feed grid / list */}
        {processedSupporters.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {processedSupporters.map((s) => (
                <motion.div
                  key={s.id}
                  variants={itemVariants}
                  layout
                  className="glass-panel bg-card/65 rounded-2xl p-5 sm:p-6 shadow-md border border-border/80 flex gap-4 relative overflow-hidden group hover:shadow-lg hover:border-border transition-all duration-300"
                >
                  {/* Subtle top-right decorative sparkle on hover */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Fun select badge / icon */}
                  <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center text-2xl shrink-0 border border-border/30 relative">
                    {s.emoji}
                    {s.amount >= 25 && (
                      <div className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-black text-white px-1 py-0.5 rounded-full uppercase scale-85">
                        vip
                      </div>
                    )}
                  </div>

                  {/* Message & core metadata */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-extrabold text-base text-foreground tracking-tight truncate max-w-[140px] sm:max-w-[200px]">
                          {s.name}
                        </h3>
                        <p className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {s.timestamp}
                        </p>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 font-mono font-black text-base text-indigo-600 dark:text-indigo-400">
                          {s.amount} <span className="text-[10px] font-sans font-bold text-foreground">XLM</span>
                        </span>
                        <p className="text-[8px] font-mono text-muted/65 tracking-tight">{s.txHash}</p>
                      </div>
                    </div>

                    {/* Supporter's custom message (rendered in quote bubbles if exists) */}
                    {s.message ? (
                      <div className="mt-4 relative bg-muted/10 dark:bg-muted/5 rounded-xl p-3.5 border border-border/20">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500/30 dark:text-indigo-400/20 absolute top-2 right-2.5" />
                        <p className="text-sm text-foreground/85 leading-relaxed italic pr-4">
                          &ldquo;{s.message}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted/50 italic mt-3.5">No message attached</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty Search / No Supporters Screen */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel bg-card/45 rounded-3xl p-10 text-center max-w-md mx-auto border border-border/50 my-12"
          >
            <div className="w-14 h-14 bg-muted/20 rounded-2xl flex items-center justify-center text-muted mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">No matching supporters</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              We couldn&apos;t find any tips matching your query. Try searching for other terms or send a new tip!
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-5 text-xs font-bold text-primary hover:underline"
              >
                Clear search filter
              </button>
            )}
          </motion.div>
        )}

        {/* Empty State when zero total supporters (e.g. after reset) */}
        {supporters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">The tip jar is currently empty. Be the first to tip Lyra!</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-bold font-display rounded-xl text-xs transition-all"
            >
              <Heart className="w-4.5 h-4.5 fill-current" />
              <span>Send First Tip</span>
            </Link>
          </div>
        )}

      </main>

      {/* Decorative footer */}
      <footer className="py-6 border-t border-border/40 text-center relative z-10 text-xs text-muted bg-background/55 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono">
            Securely simulated over <span className="text-teal-500 font-bold">Stellar Mainnet</span> ledger
          </p>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/10" />
            <span>for creative indie builders</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
