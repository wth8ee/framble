"use client";

import Link from "next/link";
import { Bomb, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useBalance } from "@/context/balanceContext";

export function Navbar() {
  const { balance } = useBalance();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950">
      <div className="flex h-16 items-center justify-between px-6 md:px-10">
        {/* Логотип и Навигация */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-black tracking-wider text-xl text-slate-50 hover:opacity-90 transition"
          >
            <Bomb className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
            <span>
              MINES<span className="text-emerald-500">X</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link
              href="/"
              className={`hover:text-emerald-400 transition-colors ${usePathname() === "/" ? "text-slate-200" : "text-slate-400"}`}
            >
              Home
            </Link>
            <Link
              href="/mines"
              className={`${usePathname() === "/mines" ? "text-slate-200" : "text-slate-400"} hover:text-emerald-400 transition-colors flex items-center gap-1.5`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Mines
            </Link>
          </nav>
        </div>

        {/* Правая часть — Баланс / Кнопка профиля (для наполнения) */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-sm font-bold text-emerald-400">
            <span>${balance.toFixed(2)}</span>
          </div>
          <Button
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            <span>Connect</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
