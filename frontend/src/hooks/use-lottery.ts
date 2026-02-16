import { useState, useCallback, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  createPublicClient,
  http,
  encodeFunctionData,
  type Address,
  formatEther,
  parseEther,
} from "viem";
import { sepolia } from "viem/chains";
import { LOTTERY_ABI, LOTTERY_ADDRESS } from "@/lib/contracts"; // Assume these exports exist
import { createGaslessAccount } from "@/lib/zerodev";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export function useLottery() {
  const { user } = usePrivy();
  const { wallets } = useWallets();

  // Contract State
  const [ticketPrice, setTicketPrice] = useState<string>("0");
  const [targetPrice, setTargetPrice] = useState<bigint>(0n);
  const [playersCount, setPlayersCount] = useState<number>(0);
  const [totalPrize, setTotalPrize] = useState<string>("0");
  const [isLotteryActive, setIsLotteryActive] = useState<boolean>(false);
  const [owner, setOwner] = useState<Address | null>(null);
  const [players, setPlayers] = useState<Address[]>([]);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Read Contract Data
  const fetchContractData = useCallback(async () => {
    if (!LOTTERY_ADDRESS) return;

    try {
      const [price, count, prize, active, ownerAddr, playersList] =
        await Promise.all([
          publicClient.readContract({
            address: LOTTERY_ADDRESS,
            abi: LOTTERY_ABI,
            functionName: "ticketPrice",
          }),
          publicClient.readContract({
            address: LOTTERY_ADDRESS,
            abi: LOTTERY_ABI,
            functionName: "getPlayersCount",
          }),
          publicClient.readContract({
            address: LOTTERY_ADDRESS,
            abi: LOTTERY_ABI,
            functionName: "getTotalPrize",
          }),
          publicClient.readContract({
            address: LOTTERY_ADDRESS,
            abi: LOTTERY_ABI,
            functionName: "lotteryActive",
          }),
          publicClient.readContract({
            address: LOTTERY_ADDRESS,
            abi: LOTTERY_ABI,
            functionName: "owner",
          }),
          publicClient.readContract({
            address: LOTTERY_ADDRESS,
            abi: LOTTERY_ABI,
            functionName: "getPlayers",
          }),
        ]);

      setTargetPrice(price as bigint);
      setTicketPrice(formatEther(price as bigint));
      setPlayersCount(Number(count));
      setTotalPrize(formatEther(prize as bigint));
      setIsLotteryActive(active as boolean);
      setOwner(ownerAddr as Address);
      setPlayers(playersList as Address[]);
    } catch (err) {
      console.error("Error fetching contract data:", err);
    }
  }, []);

  // Initial fetch + interval
  useEffect(() => {
    fetchContractData();
    const interval = setInterval(fetchContractData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [fetchContractData]);

  // Actions
  const getWallet = useCallback(async () => {
    const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
    return embeddedWallet || wallets[0];
  }, [wallets]);

  const enterLottery = async () => {
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const wallet = await getWallet();
      if (!wallet) throw new Error("No wallet connected");

      // Switch chain
      const provider = await wallet.getEthereumProvider();
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });

      // Create ZeroDev client
      console.log("Creating Gasless Account...");
      const walletClient = await import("viem").then((m) =>
        m.createWalletClient({
          account: wallet.address as Address,
          chain: sepolia,
          transport: m.custom(provider),
        }),
      );

      const kernelClient = await createGaslessAccount(walletClient);

      console.log("Sending Gasless Tx...");
      const hash = await kernelClient.writeContract({
        address: LOTTERY_ADDRESS,
        abi: LOTTERY_ABI,
        functionName: "enterLottery",
        value: targetPrice, // Send exact ticket price
      });

      console.log("Tx Sent:", hash);
      setTxHash(hash);

      // Wait for confirmation
      await publicClient.waitForTransactionReceipt({ hash });
      await fetchContractData(); // Refresh UI
    } catch (err: any) {
      console.error("Enter Lottery Error:", err);
      setError(err.message || "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const pickWinner = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const wallet = await getWallet();
      if (!wallet) throw new Error("No wallet connected");

      const provider = await wallet.getEthereumProvider();
      const walletClient = await import("viem").then((m) =>
        m.createWalletClient({
          account: wallet.address as Address,
          chain: sepolia,
          transport: m.custom(provider),
        }),
      );

      const kernelClient = await createGaslessAccount(walletClient);

      const hash = await kernelClient.writeContract({
        address: LOTTERY_ADDRESS,
        abi: LOTTERY_ABI,
        functionName: "pickWinner",
      });

      setTxHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });
      await fetchContractData();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewLottery = async (priceEth: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const wallet = await getWallet();
      if (!wallet) throw new Error("No wallet connected");

      const provider = await wallet.getEthereumProvider();
      const walletClient = await import("viem").then((m) =>
        m.createWalletClient({
          account: wallet.address as Address,
          chain: sepolia,
          transport: m.custom(provider),
        }),
      );

      const kernelClient = await createGaslessAccount(walletClient);

      const params = parseEther(priceEth);
      const hash = await kernelClient.writeContract({
        address: LOTTERY_ADDRESS,
        abi: LOTTERY_ABI,
        functionName: "startNewLottery",
        args: [params],
      });

      setTxHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });
      await fetchContractData();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    ticketPrice,
    playersCount,
    totalPrize,
    isLotteryActive,
    owner,
    players,
    isLoading,
    txHash,
    error,
    userAddress: user?.wallet?.address,
    // Actions
    enterLottery,
    pickWinner,
    startNewLottery,
    refresh: fetchContractData,
  };
}
