"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, Check, Menu, X, LogOut, User } from "lucide-react";
import { useLottery } from "@/hooks/use-lottery";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Header() {
  const { login, authenticated, user, logout } = usePrivy();
  const { smartAccountAddress } = useLottery();
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const truncate = (str: string) => {
    if (!str) return "";
    return `${str.slice(0, 6)}...${str.slice(-4)}`;
  };

  const copyAddress = () => {
    if (smartAccountAddress) {
      navigator.clipboard.writeText(smartAccountAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/lottery-logo.png"
            alt="Lottery Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-extrabold tracking-tight text-white">
            Weekend <span className="text-cyan-400">Lottery</span>
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/faq"
            className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            FAQ
          </Link>

          <div className="h-4 w-px bg-white/10" />

          {authenticated ? (
            <div className="flex items-center gap-6">
              {/* Linear Smart Account Link */}
              <button
                onClick={copyAddress}
                className="flex items-center gap-2 group transition-colors"
                title="Click to copy Smart Account address"
              >
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                  Smart Account:
                </span>
                <span className="text-xs font-mono text-cyan-500/90 group-hover:text-cyan-400">
                  {smartAccountAddress
                    ? truncate(smartAccountAddress)
                    : "Loading..."}
                </span>
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-slate-500 opacity-50 group-hover:opacity-100 group-hover:text-cyan-400" />
                )}
              </button>

              <div className="h-4 w-px bg-white/10" />

              {/* Linear User Info & Logout */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-slate-400">
                  {truncate(user?.wallet?.address || "")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={login}
              className="rounded-full px-8 py-2 border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 gap-2 font-bold tracking-wide"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white p-2" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-950 border-b border-white/10 p-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/faq"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center py-4 text-sm font-bold text-cyan-400 border-b border-white/5 mb-4"
          >
            FAQ
          </Link>
          {authenticated ? (
            <div className="flex flex-col gap-6">
              {/* Mobile Smart Account */}
              <button
                onClick={copyAddress}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-white/5 active:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                    Smart Account:
                  </span>
                  <span className="text-sm font-mono text-cyan-400">
                    {smartAccountAddress
                      ? truncate(smartAccountAddress)
                      : "Loading..."}
                  </span>
                </div>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {/* Mobile User Info & Disconnect */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {truncate(user?.wallet?.address || "")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2 h-8 px-3"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="text-xs">Disconnect</span>
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={login}
              className="w-full gap-2 bg-cyan-600 hover:bg-cyan-500"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
