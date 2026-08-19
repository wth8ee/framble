"use client";

import Link from "next/link";
import { Dices, User, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useBalance } from "@/context/balanceContext";
import { useSession, signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";

export function Navbar() {
  const {
    balance,
    isStatsOpen,
    setIsStatsOpen,
  } = useBalance();
  const { data: session } = useSession();
  const pathname = usePathname();

  function handleBalanceReset() {
    // Top-up disabled unless handled via server action for admins or specific deposits
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950">
      <div className="flex h-16 items-center justify-between px-4 md:px-10">
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-black tracking-wider text-lg md:text-xl text-slate-50 hover:opacity-90 transition"
          >
            <Dices className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 fill-emerald-500/20" />
            <span>
              FRAMBLE<span className="text-emerald-500">X</span>
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
              href="/games"
              className={`${pathname === "/games" ? "text-slate-50 font-bold" : "text-slate-400"} hover:text-emerald-400 transition-colors hidden sm:inline`}
            >
              Games
            </Link>

            <Link
              href="/stats"
              className={`${pathname === "/stats" ? "text-slate-50 font-bold" : "text-slate-400"} hover:text-emerald-400 transition-colors hidden sm:inline`}
            >
              Stats
            </Link>

            {(session?.user as any)?.role === "admin" && (
              <Link
                href="/admin"
                className={`${pathname === "/admin" ? "text-slate-50 font-bold" : "text-slate-400"} hover:text-red-400 transition-colors hidden sm:inline`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button
            onClick={() => setIsStatsOpen(!isStatsOpen)}
            variant="outline"
            size="sm"
            className={`h-8 md:h-9 border-slate-800 bg-slate-900 hover:bg-slate-800/80 hover:text-emerald-300 text-emerald-400 gap-1.5 px-2.5 md:px-3 text-xs md:text-sm transition-all duration-200`}
          >
            <BarChart2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 fill-emerald-500/10" />
            <span>Stats</span>
          </Button>

          <Button
            onClick={handleBalanceReset}
            className="flex h-8 md:h-9 items-center gap-1 bg-slate-900 border border-slate-800 px-2 md:px-3 rounded-lg text-xs md:text-sm font-bold text-emerald-400 select-none transition-all duration-200 hover:bg-slate-800/80 hover:text-emerald-300 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
          >
            <span>${balance.toFixed(2)}</span>
          </Button>

          {session ? (
            <Button
              onClick={() => signOut()}
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex h-8 md:h-9 items-center gap-1 px-2.5 md:px-3 text-xs md:text-sm"
            >
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Link href="/auth">
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex h-8 md:h-9 items-center gap-1 px-2.5 md:px-3 text-xs md:text-sm"
              >
                <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Connect</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
