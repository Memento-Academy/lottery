import { useLottery } from "@/hooks/use-lottery";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2, Ticket, Users, Trophy, Check } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function LotteryCard() {
  const {
    isLotteryActive,
    playersCount,
    totalPrize,
    enterLottery,
    isLoading,
    players,
    smartAccountAddress,
  } = useLottery();

  const { login, authenticated } = usePrivy();

  const hasEntered =
    (smartAccountAddress &&
      players.some(
        (p) => p.toLowerCase() === smartAccountAddress.toLowerCase(),
      )) ??
    false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={`w-full max-w-md border-cyan-500/30 bg-slate-900/60 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl transition-all duration-500 ${
          hasEntered ? "border-green-500/50 shadow-green-900/20" : ""
        }`}
      >
        <CardHeader className="text-center relative overflow-hidden">
          {hasEntered && (
            <div className="absolute inset-0 bg-green-500/5 z-0 animate-pulse" />
          )}
          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/50">
              {hasEntered ? (
                <div className="relative h-16 w-16 animate-in zoom-in duration-500">
                  <Image
                    src="/lottery-logo.png"
                    alt="Ticket Confirmed"
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  />
                </div>
              ) : (
                <Trophy className="h-10 w-10 text-cyan-400" />
              )}
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
              {totalPrize} ETH
            </CardTitle>
            <CardDescription className="text-cyan-200/70">
              Current Prize Pool
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-center">
              <div className="flex justify-center mb-1">
                <Ticket className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="text-xs text-slate-400">Entry</p>
              <p className="font-mono font-medium text-green-400">FREE</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-center">
              <div className="flex justify-center mb-1">
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-xs text-slate-400">Players</p>
              <p className="font-mono font-medium">{playersCount}</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">
                {isLotteryActive ? "Active Round" : "Round Ended"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 relative z-10">
          {!authenticated ? (
            <Button className="w-full" size="lg" onClick={login}>
              Connect Wallet to Play
            </Button>
          ) : hasEntered ? (
            <div className="flex w-full items-center justify-center py-3 text-green-400 font-bold animate-in zoom-in duration-300">
              <Check className="mr-2 h-5 w-5" />
              Entry Confirmed
            </div>
          ) : (
            <Button
              className="w-full bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_-5px_var(--color-cyan-500)] transition-all duration-300"
              size="lg"
              onClick={enterLottery}
              disabled={!isLotteryActive || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Ticket className="mr-2 h-4 w-4" />
                  Enter for FREE
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
