'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Coins, 
  Send, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  Twitter, 
  Github, 
  MessageCircle,
  Coffee,
  Flame,
  Award
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { saveSupporter } from '@/lib/store';

export default function CreatorProfile() {
  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(5);
  const [customAmount, setCustomAmount] = React.useState<string>('');
  const [supporterName, setSupporterName] = React.useState<string>('');
  const [supporterMessage, setSupporterMessage] = React.useState<string>('');
  
  const [isCopied, setIsCopied] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [latestTx, setLatestTx] = React.useState<{ amount: number; txHash: string } | null>(null);

  // Quick select tip presets
  const presets = [1, 5, 10, 25];

  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setCustomAmount(val);
      setSelectedAmount(null);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('GCSYR6C5EMWT4ZYJYEP4GH3JXXJDXLXKWD655IMRRR3NBS5HR7OXU6FY');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getActiveAmount = (): number => {
    if (selectedAmount !== null) return selectedAmount;
    const parsed = parseFloat(customAmount);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleSendTip = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getActiveAmount();
    if (amount <= 0) return;

    // We must lazily import these so they only run on client side
    const { useWalletStore } = await import('@/lib/useWalletStore');
    const { toast } = await import('sonner');
    
    const { address, connect } = useWalletStore.getState();

    if (!address) {
      toast.info("Please connect your wallet first.");
      connect();
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Preparing transaction...");

    try {
      const { Server, TransactionBuilder, Networks, PaymentOperation, Asset } = await import('@stellar/stellar-sdk');
      const { signWalletKitTx } = await import('@/lib/wallet-kit');
      
      const server = new Server('https://horizon-testnet.stellar.org');
      const REAL_TESTNET_DEST = 'GCSYR6C5EMWT4ZYJYEP4GH3JXXJDXLXKWD655IMRRR3NBS5HR7OXU6FY'; 

      toast.loading("Fetching account sequence...", { id: toastId });
      const sourceAccount = await server.loadAccount(address);
      
      const tx = new TransactionBuilder(sourceAccount, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
      })
      .addOperation(PaymentOperation({
        destination: REAL_TESTNET_DEST,
        asset: Asset.native(),
        amount: amount.toString()
      }))
      .setTimeout(30)
      .build();

      toast.loading("Waiting for wallet signature...", { id: toastId });
      const signedXdr = await signWalletKitTx(tx.toXDR(), address);
      
      toast.loading("Submitting to Stellar network...", { id: toastId });
      const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
      const result = await server.submitTransaction(signedTx);
      
      toast.success("Transaction successful!", { id: toastId });

      const saved = saveSupporter(
        supporterName || 'Anonymous Supporter',
        amount,
        supporterMessage,
        undefined
      );
      
      if (saved) {
        setLatestTx({
          amount: saved.amount,
          txHash: result.hash,
        });
        setShowSuccess(true);
      }
      
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Transaction failed", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSupporterName('');
    setSupporterMessage('');
    setSelectedAmount(5);
    setCustomAmount('');
    setShowSuccess(false);
    setLatestTx(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground flex flex-col">
      {/* Decorative Aurora background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none dark:bg-indigo-500/5" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none dark:bg-teal-500/5" />
      <div className="absolute top-[40%] left-[35%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none dark:bg-purple-500/5" />

      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Creator Profile Bento Card (Columns 1-5) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Main Profile glass card */}
            <div className="glass-panel bg-card rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden group">
              {/* Card top sparkle accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/15 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="flex flex-col items-center text-center relative z-10">
                {/* Stylized Vector Avatar */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-5 group">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-teal-500 animate-spin-slow opacity-85 blur-[2px] scale-105" />
                  <div className="absolute inset-[3px] rounded-[22px] bg-background flex items-center justify-center overflow-hidden">
                    {/* SVG Avatar representation of Lyra Vance */}
                    <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
                      {/* Background */}
                      <rect width="100" height="100" fill="#1e1b4b" />
                      {/* Hair Back */}
                      <path d="M20,60 Q10,35 30,15 T70,15 T90,35 Q80,60 80,85 Z" fill="#6366f1" />
                      {/* Hair bangs */}
                      <path d="M15,45 Q10,15 50,12 T85,45" fill="#818cf8" />
                      {/* Face */}
                      <path d="M30,35 C30,35 25,65 50,72 C75,65 70,35 70,35 Z" fill="#fed7aa" />
                      {/* Eyes */}
                      <ellipse cx="42" cy="45" rx="3" ry="5" fill="#0f172a" />
                      <ellipse cx="58" cy="45" rx="3" ry="5" fill="#0f172a" />
                      {/* Eye Sparkles */}
                      <circle cx="43" cy="43" r="1.2" fill="#ffffff" />
                      <circle cx="59" cy="43" r="1.2" fill="#ffffff" />
                      {/* Cheeks */}
                      <circle cx="38" cy="52" r="4" fill="#f43f5e" opacity="0.4" />
                      <circle cx="62" cy="52" r="4" fill="#f43f5e" opacity="0.4" />
                      {/* Mouth */}
                      <path d="M45,56 Q50,60 55,56" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      {/* Hair Front Bangs */}
                      <path d="M22,25 Q45,28 42,42" fill="#818cf8" />
                      <path d="M78,25 Q55,28 58,42" fill="#818cf8" />
                      {/* Star Headpiece / Sparkle */}
                      <path d="M50,8 L52,14 L58,16 L52,18 L50,24 L48,18 L42,16 L48,14 Z" fill="#38bdf8" />
                      {/* Cute Clothes */}
                      <path d="M30,72 L70,72 L80,100 L20,100 Z" fill="#14b8a6" />
                      <path d="M42,72 L50,82 L58,72" fill="#f8fafc" />
                      {/* Stellar Badge on clothing */}
                      <circle cx="50" cy="85" r="3.5" fill="#fbbf24" />
                    </svg>
                  </div>
                  
                  {/* Interactive Status indicator */}
                  <motion.div 
                    className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full p-1.5 shadow-lg border-2 border-background flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.15 }}
                    title="Lyra is currently active"
                  >
                    <Flame className="w-3.5 h-3.5 fill-white" />
                  </motion.div>
                </div>

                <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
                  Lyra Vance
                </h1>
                <p className="text-sm font-mono text-primary mt-1 font-semibold flex items-center gap-1">
                  @lyra_stellar
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </p>

                <p className="text-muted text-sm sm:text-base mt-4 leading-relaxed max-w-sm">
                  Indie Game Developer & Digital Artist. Crafting cozy atmospheric pixel-art adventures and open-source shader libraries on the Stellar Network. 👾✨
                </p>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-5">
                  {['Game Dev 🎮', 'Pixel Art 🎨', 'Shaders 🔮', 'Stellar 🚀'].map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted/40 text-muted-foreground border border-border/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 mt-6">
                  <a href="#" className="w-9 h-9 rounded-xl bg-muted/20 dark:bg-muted/10 flex items-center justify-center text-muted hover:text-primary transition-all duration-300 hover:scale-105 border border-border/45">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-xl bg-muted/20 dark:bg-muted/10 flex items-center justify-center text-muted hover:text-primary transition-all duration-300 hover:scale-105 border border-border/45">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-xl bg-muted/20 dark:bg-muted/10 flex items-center justify-center text-muted hover:text-primary transition-all duration-300 hover:scale-105 border border-border/45">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Supporter Stats Mini Bento Grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Followers', val: '4.8K', icon: '✨' },
                { label: 'Projects', val: '12', icon: '🎮' },
                { label: 'Tips XLM', val: '2,490', icon: '🪙' },
              ].map((stat, i) => (
                <div key={i} className="glass-panel bg-card/60 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden group">
                  <span className="absolute -top-1 -right-1 text-[10px] opacity-25">{stat.icon}</span>
                  <span className="font-display font-extrabold text-lg text-foreground tracking-tight">{stat.val}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Stellar Wallet Address Card */}
            <div className="glass-panel bg-card/40 rounded-2xl p-4 flex items-center justify-between border border-border shadow-sm text-sm">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Stellar Address</p>
                  <p className="font-mono text-xs text-foreground truncate max-w-[160px] sm:max-w-[180px] md:max-w-[220px]" title="GCSYR6C5EMWT4ZYJYEP4GH3JXXJDXLXKWD655IMRRR3NBS5HR7OXU6FY">
                    GCSYR6C5EMWT4ZYJYEP4GH3JXXJDXLXKWD655IMRRR3NBS5HR7OXU6FY
                  </p>
                </div>
              </div>
              <motion.button
                onClick={copyAddress}
                whileTap={{ scale: 0.92 }}
                className="w-8 h-8 rounded-lg hover:bg-muted/40 dark:hover:bg-muted/15 flex items-center justify-center text-muted hover:text-foreground transition-all duration-200 shrink-0"
                title="Copy address"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </motion.button>
            </div>
          </motion.div>

          {/* Interactive Tip Card (Columns 6-12) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.div
                  key="tip-form"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel bg-card rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500" />
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Coins className="w-5 h-5 animate-bounce-slow" />
                      </div>
                      <div>
                        <h2 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-foreground">
                          Send a Support Tip
                        </h2>
                        <p className="text-xs text-muted-foreground">Payments secure on Stellar blockchain</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      100% Direct
                    </div>
                  </div>

                  <form onSubmit={handleSendTip} className="space-y-5">
                    {/* Supporter Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                        Your Name / Alias
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AstroFan (or leave empty for anonymous)"
                        value={supporterName}
                        onChange={(e) => setSupporterName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-muted/15 border border-border/50 focus:border-primary/50 focus:bg-muted/10 outline-none text-foreground transition-all duration-200 placeholder:text-muted-foreground/60"
                        maxLength={30}
                      />
                    </div>

                    {/* Tip Presets Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                        Select Tip Amount (XLM)
                      </label>
                      <div className="grid grid-cols-4 gap-2.5">
                        {presets.map((amount) => {
                          const isActive = selectedAmount === amount;
                          return (
                            <motion.button
                              key={amount}
                              type="button"
                              onClick={() => handlePresetSelect(amount)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className={`py-3.5 px-2 rounded-xl text-sm font-extrabold font-mono transition-all duration-300 relative overflow-hidden ${
                                isActive
                                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                                  : 'bg-muted/20 hover:bg-muted/30 border border-border/40 text-foreground'
                              }`}
                            >
                              <div className="flex flex-col items-center">
                                <span className="text-base">{amount}</span>
                                <span className="text-[9px] opacity-80 uppercase tracking-widest font-sans mt-0.5">XLM</span>
                              </div>
                              {isActive && (
                                <motion.span 
                                  layoutId="preset-glow"
                                  className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" 
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Amount Input */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">
                          Or Enter Custom Amount
                        </label>
                        {selectedAmount === null && getActiveAmount() > 0 && (
                          <span className="text-xs font-mono font-semibold text-primary">Custom amount active</span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="0.0"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className="w-full pl-4 pr-16 py-3.5 rounded-xl bg-muted/15 border border-border/50 focus:border-primary/50 focus:bg-muted/10 outline-none text-foreground font-mono text-base transition-all duration-200 placeholder:text-muted-foreground/55"
                        />
                        <span className="absolute right-4 font-mono text-xs font-bold tracking-widest text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                          XLM
                        </span>
                      </div>
                    </div>

                    {/* Support Message */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                        Optional Message (Supportive words)
                      </label>
                      <textarea
                        placeholder="Say something inspiring to Lyra... (e.g. Love your shaders!)"
                        value={supporterMessage}
                        onChange={(e) => setSupporterMessage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-muted/15 border border-border/50 focus:border-primary/50 focus:bg-muted/10 outline-none text-foreground transition-all duration-200 resize-none h-24 placeholder:text-muted-foreground/60"
                        maxLength={140}
                      />
                      <div className="flex justify-end text-[10px] font-mono text-muted-foreground/75 mt-1">
                        {supporterMessage.length}/140 chars
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || getActiveAmount() <= 0}
                      whileHover={{ scale: getActiveAmount() > 0 ? 1.01 : 1 }}
                      whileTap={{ scale: getActiveAmount() > 0 ? 0.99 : 1 }}
                      className={`w-full py-4 rounded-xl font-bold font-display text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all duration-300 relative overflow-hidden ${
                        getActiveAmount() > 0 
                          ? 'bg-gradient-to-r from-indigo-600 to-teal-500 text-white shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:brightness-[1.03] cursor-pointer'
                          : 'bg-muted/20 text-muted-foreground border border-border/20 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Validating on Stellar Ledger...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Tip of {getActiveAmount() || 0} XLM</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                /* Spectacular Success Screen */
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className="glass-panel bg-card rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center border-2 border-teal-500/30"
                >
                  {/* Glowing success accents */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-teal-500/20 rounded-full blur-[40px]" />
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px]" />

                  {/* Fun SVG check ring and celebration particles */}
                  <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-teal-500/10 border border-teal-500/30"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.4, 1] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    />
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-xl shadow-teal-500/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.15 }}
                    >
                      <Check className="w-8 h-8 stroke-[3]" />
                    </motion.div>

                    {/* Float up supportive stars */}
                    {[1, 2, 3, 4].map((star, i) => (
                      <motion.span
                        key={i}
                        className="absolute text-xl"
                        initial={{ 
                          x: 0, 
                          y: 0, 
                          scale: 0.2, 
                          opacity: 1 
                        }}
                        animate={{ 
                          x: (i === 0 ? -33 : i === 1 ? 38 : i === 2 ? -18 : 27),
                          y: (i === 0 ? -42 : i === 1 ? -47 : i === 2 ? 33 : 38),
                          scale: 1.2,
                          opacity: 0
                        }}
                        transition={{ duration: 1.5, delay: 0.3 + (i * 0.15), repeat: Infinity, repeatDelay: 1 }}
                      >
                        {['✨', '💖', '⭐', '🪙'][i]}
                      </motion.span>
                    ))}
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl text-foreground tracking-tight">
                    Tip Successfully Sent!
                  </h3>
                  <p className="text-sm text-teal-600 dark:text-teal-400 font-mono mt-1 flex items-center justify-center gap-1.5 font-bold">
                    <Sparkles className="w-4 h-4 fill-teal-500/20" />
                    Transaction Confirmed
                  </p>

                  <div className="my-6 max-w-md mx-auto glass-panel bg-muted/15 dark:bg-muted/5 rounded-2xl p-5 border border-border/30 text-left">
                    <div className="flex justify-between items-center pb-3 border-b border-border/30">
                      <span className="text-xs text-muted font-bold uppercase tracking-wider">Amount Paid</span>
                      <span className="font-mono text-lg font-black text-foreground">
                        {latestTx?.amount} <span className="text-xs text-primary font-bold">XLM</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-border/30 text-xs">
                      <span className="text-muted font-bold uppercase tracking-wider">Recipient</span>
                      <span className="font-semibold text-foreground">Lyra Vance</span>
                    </div>

                    <div className="flex justify-between items-center pt-3 text-xs">
                      <span className="text-muted font-bold uppercase tracking-wider">Ledger Hash</span>
                      <span className="font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded flex items-center gap-1 select-all">
                        {latestTx?.txHash}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </span>
                    </div>
                  </div>

                  <p className="text-muted text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                    Thank you so much! Your generous tip will help fuel new pixel masterpieces and cozy game adventures. ☕🎮
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/supporters"
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold font-display text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/25 transition-all duration-300"
                    >
                      <span>View Recent Supporters</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={resetForm}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-muted/20 hover:bg-muted/35 text-foreground font-bold font-display text-sm flex items-center justify-center gap-2 border border-border/50 transition-all duration-300"
                    >
                      <span>Tip Again</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>

      {/* Decorative Footer */}
      <footer className="py-6 border-t border-border/40 text-center relative z-10 text-xs text-muted bg-background/55">
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
