'use client';

export interface SupporterTip {
  id: string;
  name: string;
  amount: number;
  message?: string;
  timestamp: string;
  emoji: string;
  txHash: string;
}

const DEFAULT_SUPPORTERS: SupporterTip[] = [
  {
    id: 'tip_1',
    name: 'StellarDave',
    amount: 10,
    message: 'Your pixel shaders are pure magic! Keep building! 🌟',
    timestamp: '2 hours ago',
    emoji: '🎨',
    txHash: 'g8a1...f3d9',
  },
  {
    id: 'tip_2',
    name: 'CosmoGirl',
    amount: 25,
    message: 'Loving the progress on the cozy adventure game! Can\'t wait for the beta.',
    timestamp: '1 day ago',
    emoji: '🎮',
    txHash: 'e2b4...9a8c',
  },
  {
    id: 'tip_3',
    name: 'NebulaNodes',
    amount: 5,
    message: 'A small contribution for the awesome open source tools! ☕',
    timestamp: '2 days ago',
    emoji: '☕',
    txHash: 'a7b8...4c2d',
  },
  {
    id: 'tip_4',
    name: 'GalacticCode',
    amount: 50,
    message: 'Incredible attention to detail in your art. Truly inspiring. 🚀',
    timestamp: '4 days ago',
    emoji: '🚀',
    txHash: 'f0e1...2d3c',
  },
];

export function getSupporters(): SupporterTip[] {
  if (typeof window === 'undefined') return DEFAULT_SUPPORTERS;
  const stored = localStorage.getItem('creator_tip_supporters');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored supporters:', e);
    }
  }
  // Initialize with defaults if not present
  localStorage.setItem('creator_tip_supporters', JSON.stringify(DEFAULT_SUPPORTERS));
  return DEFAULT_SUPPORTERS;
}

export function saveSupporter(name: string, amount: number, message?: string, emoji?: string) {
  if (typeof window === 'undefined') return;
  
  const current = getSupporters();
  const emojis = ['💖', '☕', '🚀', '🎨', '🎮', '🌟', '🍩', '🍕', '🐱', '🦄'];
  const selectedEmoji = emoji || emojis[Math.floor(Math.random() * emojis.length)];
  
  // Generate a random mock Stellar transaction hash for flavor
  const chars = 'abcdef0123456789';
  let txStart = '';
  let txEnd = '';
  for (let i = 0; i < 4; i++) {
    txStart += chars[Math.floor(Math.random() * chars.length)];
    txEnd += chars[Math.floor(Math.random() * chars.length)];
  }
  const txHash = `${txStart}...${txEnd}`;

  const newTip: SupporterTip = {
    id: `tip_${Date.now()}`,
    name: name.trim() || 'Anonymous Supporter',
    amount: Number(amount),
    message: message?.trim() || undefined,
    timestamp: 'Just now',
    emoji: selectedEmoji,
    txHash,
  };

  const updated = [newTip, ...current];
  localStorage.setItem('creator_tip_supporters', JSON.stringify(updated));
  return newTip;
}
