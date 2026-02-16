"use client";

import { Header } from "@/components/header";
import { LotteryCard } from "@/components/lottery-card";
import { OwnerPanel } from "@/components/owner-panel";
import { useLottery } from "@/hooks/use-lottery";
import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
  const { user } = usePrivy();
  const { owner, players, userAddress } = useLottery();

  // Check if current user is owner (case-insensitive)
  const isOwner =
    userAddress && owner && userAddress.toLowerCase() === owner.toLowerCase();

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <Header />

      <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-12">
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Win Big on the <span className="text-cyan-400">Sepolia</span>{" "}
            Lottery
          </h1>
          <p className="text-lg text-slate-400">
            A transparent, decentralized lottery built with Foundry & Next.js.
            Gasless transactions powered by ZeroDev.
          </p>
        </div>

        <div className="w-full max-w-md space-y-8">
          <LotteryCard />

          {isOwner && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <OwnerPanel />
            </div>
          )}
        </div>

        {/* Recent Players / Live Feed could go here */}
        {players.length > 0 && (
          <div className="w-full max-w-2xl mt-8">
            <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider text-center">
              Recent Entries
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {players
                .slice(-5)
                .reverse()
                .map((player, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400"
                  >
                    {player.slice(0, 6)}...{player.slice(-4)}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
