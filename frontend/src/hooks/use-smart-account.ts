import { useState, useCallback, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, type Address } from "viem";
import { sepolia } from "viem/chains";
import { createGaslessAccount } from "@/lib/zerodev";

export function useSmartAccount() {
  const { wallets } = useWallets();
  const [kernelClient, setKernelClient] = useState<any>(null);
  const [smartAccountAddress, setSmartAccountAddress] =
    useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSmartAccount = useCallback(async () => {
    if (!wallets || wallets.length === 0) return null;

    // Prefer embedded wallet (Privy)
    const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
    const wallet = embeddedWallet || wallets[0];

    if (!wallet) return null;

    try {
      setIsLoading(true);
      setError(null);

      const provider = await wallet.getEthereumProvider();

      // Ensure on Sepolia
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // 11155111
        });
      } catch (e) {
        console.warn("Chain switch error (might be already on chain)", e);
      }

      const walletClient = createWalletClient({
        account: wallet.address as Address,
        chain: sepolia,
        transport: custom(provider),
      });

      console.log("Creating ZeroDev Smart Account...");
      const client = await createGaslessAccount(walletClient);

      setKernelClient(client);
      setSmartAccountAddress(client.account.address);
      console.log("Smart Account Ready:", client.account.address);

      return client;
    } catch (err: any) {
      console.error("Error creating smart account:", err);
      setError(err.message || "Failed to create smart account");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [wallets]);

  // Optionally auto-create on mount if wallet is ready?
  // For now we'll let the consuming component call getSmartAccount()
  // or we can expose it.

  return {
    getSmartAccount,
    kernelClient,
    smartAccountAddress,
    isLoading,
    error,
  };
}
