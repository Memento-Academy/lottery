"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { sepolia } from "viem/chains";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

export function Providers({ children }: { children: React.ReactNode }) {
  if (!privyAppId) {
    // Render children without provider if no ID, but warn in console
    // In production this should probably be more robust
    if (typeof window !== "undefined") {
      console.warn("PRIVY_APP_ID not configured");
    }
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        // Create embedded wallets for users who don't have one
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        // We only support Sepolia for this demo
        defaultChain: sepolia,
        supportedChains: [sepolia],
        // Login methods
        loginMethods: ["email", "wallet", "google"],
        // Dark theme with lottery branding
        appearance: {
          theme: "dark",
          accentColor: "#22d3ee", // cyan-400
          logo: "https://auth.privy.io/logos/privy-logo-dark.png", // Placeholder or local asset
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
