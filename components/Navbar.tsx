"use client";

import Link from "next/link";
import { Bomb, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useBalance } from "@/context/balanceContext";

export function Navbar() {
  const { balance } = useBalance();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950">
      <div className="flex h-16 items-center justify-between px-4 md:px-10">
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-black tracking-wider text-lg md:text-xl text-slate-50 hover:opacity-90 transition"
          >
            <Bomb className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 fill-emerald-500/20" />
            <span>
              MINES<span className="text-emerald-500">X</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-semibold">
            <Link
              href="/"
              className={`hover:text-emerald-400 transition-colors ${pathname === "/" ? "text-slate-50 font-bold" : "text-slate-400"}`}
            >
              Home
            </Link>
            <Link
              href="/mines"
              className={`${pathname === "/mines" ? "text-slate-50 font-bold" : "text-slate-400"} hover:text-emerald-400 transition-colors flex items-center gap-1.5`}
            >
              <span
                className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500 ${pathname === "/mines" ? "animate-pulse opacity-100" : "opacity-40"}`}
              />
              Mines
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-bold text-emerald-400">
            <span>${balance.toFixed(2)}</span>
          </div>
          <Button
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex items-center gap-1 px-2.5 md:px-3 py-1 md:py-1.5 text-xs md:text-sm"
          >
            <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Connect</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
