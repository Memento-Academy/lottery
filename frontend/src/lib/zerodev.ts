import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import {
  http,
  createPublicClient,
  type WalletClient,
  type Address,
  type Transport,
  type Chain,
} from "viem";
import { sepolia } from "viem/chains";

// Permissionless v0.2 doesn't export v0.7 entrypoint that ZeroDev v5 uses.
// Hardcoding avoids version conflicts.
const ENTRYPOINT_ADDRESS_V07 =
  "0x0000000071727De22E5E9d8BAf0edAc6f37da032" as Address;
const ENTRYPOINT_VERSION = "0.7" as const;

const ENTRYPOINT_V07 = {
  address: ENTRYPOINT_ADDRESS_V07,
  version: ENTRYPOINT_VERSION,
} as const;

const projectId = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || "";

// ZeroDev API v3 endpoints for Sepolia
const bundlerRpc = `https://rpc.zerodev.app/api/v3/${projectId}/chain/11155111`;
const paymasterRpc = `https://rpc.zerodev.app/api/v3/${projectId}/chain/11155111`;

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

/**
 * Creates a ZeroDev Kernel account from a wallet client (e.g. Privy embedded wallet).
 * Enables gasless transactions via ZeroDev Paymaster.
 */
export async function createGaslessAccount(walletClient: WalletClient) {
  if (!projectId) {
    throw new Error("ZERODEV_PROJECT_ID not configured");
  }

  if (!walletClient.account) {
    throw new Error("Wallet client must have an account connected");
  }

  // Create ECDSA validator from the wallet signer
  // Using 'as any' to bypass strict type checks between viem/permissionless versions
  const ecdsaValidator = await signerToEcdsaValidator(publicClient as any, {
    signer: walletClient as any,
    entryPoint: ENTRYPOINT_V07 as any,
    kernelVersion: "0.3.1" as any,
  });

  // Create the kernel account
  const account = await createKernelAccount(publicClient as any, {
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint: ENTRYPOINT_V07 as any,
    kernelVersion: "0.3.1" as any,
  });

  // Create paymaster client
  const paymasterClient = createZeroDevPaymasterClient({
    chain: sepolia,
    transport: http(paymasterRpc),
  });

  // Create the account client ready for gasless txs
  const kernelClient = createKernelAccountClient({
    account,
    chain: sepolia as Chain,
    bundlerTransport: http(bundlerRpc) as Transport,
    paymaster: {
      getPaymasterData(userOperation) {
        return paymasterClient.sponsorUserOperation({ userOperation });
      },
    },
  });

  return kernelClient;
}

export function useZeroDevConfigured() {
  return Boolean(projectId);
}
