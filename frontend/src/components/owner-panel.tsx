import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLottery } from "@/hooks/use-lottery";
import { Loader2, Trophy, RefreshCw } from "lucide-react";

export function OwnerPanel() {
  const {
    isLotteryActive,
    playersCount,
    pickWinner,
    startNewLottery,
    isLoading,
    totalPrize,
  } = useLottery();

  const [newPrice, setNewPrice] = useState("0.01");

  return (
    <Card className="border-cyan-500/20 bg-cyan-950/10">
      <CardHeader>
        <CardTitle className="text-cyan-400">Admin Panel</CardTitle>
        <CardDescription>Only visible to the contract owner</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLotteryActive ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400">Current Prize Pool</p>
              <p className="text-2xl font-bold text-white mb-2">
                {totalPrize} ETH
              </p>
              <p className="text-sm text-slate-400">Players: {playersCount}</p>
            </div>

            <Button
              onClick={pickWinner}
              disabled={isLoading || playersCount === 0}
              className="w-full bg-cyan-600 hover:bg-cyan-500"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trophy className="mr-2 h-4 w-4" />
              )}
              Pick Winner
            </Button>
            {playersCount === 0 && (
              <p className="text-xs text-center text-slate-500">
                Need at least 1 player
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                New Ticket Price (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="flex h-10 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <Button
              onClick={() => startNewLottery(newPrice)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Start New Lottery
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
