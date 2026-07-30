import { create } from 'zustand';
import { getWalletKit, disconnectWallet } from './wallet-kit';
import { toast } from 'sonner';

interface WalletState {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  setAddress: (address: string | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  isConnecting: false,
  error: null,
  
  connect: async () => {
    set({ isConnecting: true, error: null });
    try {
      const kit = getWalletKit();
      
      // authModal opens the kit UI, lets the user select, and returns the address.
      const { address } = await kit.authModal();
      
      if (address) {
        set({ address, isConnecting: false });
        toast.success(`Wallet connected successfully!`);
      } else {
        set({ isConnecting: false });
        toast.error("Failed to get public key.");
      }
    } catch (e: any) {
      set({ error: e.message || "Connection failed", isConnecting: false });
      toast.error(e.message || "Connection failed");
    }
  },

  disconnect: () => {
    set({ address: null, error: null });
    try {
      disconnectWallet();
    } catch (e) {}
    toast.info("Wallet disconnected.");
  },

  setAddress: (address: string | null) => set({ address })
}));
