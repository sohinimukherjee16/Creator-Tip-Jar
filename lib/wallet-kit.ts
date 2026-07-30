import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';

export const WALLET_CONNECT_PROJECT_ID = 'b7327f1c1f6b3b55ceb96fa1a1170732';

let isInitialized = false;

export function getWalletKit() {
  if (typeof window === 'undefined') {
    throw new Error('Cannot get wallet kit on server');
  }
  
  if (!isInitialized) {
    StellarWalletsKit.init({
      network: Networks.TESTNET,
      selectedModuleId: 'freighter',
      modules: [
        new FreighterModule()
      ],
    });
    isInitialized = true;
  }
  return StellarWalletsKit;
}

export async function disconnectWallet() {
  isInitialized = false;
  await StellarWalletsKit.disconnect();
}

export async function signWalletKitTx(xdr: string, publicKey: string) {
  const wk = getWalletKit();
  const result = await wk.signTransaction(xdr, {
    address: publicKey,
    networkPassphrase: Networks.TESTNET
  });
  return result.signedTxXdr;
}
