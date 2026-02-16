import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export function Header() {
  const { login, authenticated, user, logout } = usePrivy();

  const truncate = (str: string) => {
    if (!str) return "";
    return `${str.slice(0, 6)}...${str.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <span className="text-xl font-bold">L</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Sepolia Lottery
          </span>
        </div>

        <div>
          {authenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden rounded-full bg-slate-900 px-3 py-1 text-sm text-slate-400 md:block">
                {user?.email
                  ? user.email.address
                  : truncate(user?.wallet?.address || "")}
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={login} className="gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
