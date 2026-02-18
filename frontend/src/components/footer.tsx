import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-12 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-slate-400">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-bold text-white text-lg tracking-tight">
              Weekend Lottery
            </span>
            <span className="text-slate-500 italic">
              © {new Date().getFullYear()} All rights reserved. Built for the
              community.
            </span>
          </div>

          <div className="flex items-center gap-8 font-medium">
            <Link href="/faq" className="hover:text-cyan-400 transition-colors">
              FAQ
            </Link>
            <a
              href="https://sepolia.etherscan.io/address/0x96763E51756E02ED907E15648c7E70a9bED8696F"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              Contract
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://github.com/Memento-Academy/weekend-lottery"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="opacity-60 text-xs">Powered by</span>
            <a
              href="https://memento-academy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors text-xs"
            >
              aprender web3 gratis
              <ExternalLink className="h-2 w-2" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
