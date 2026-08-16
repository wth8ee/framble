"use client";

import { playSound } from "@/lib/playSound";
import { useEffect } from "react";

interface WinBannerProps {
  multiplier: number;
  winAmount: number;
  setIsWinBannerOpen?: (state: boolean) => void;
}

export function WinBanner({
  multiplier,
  winAmount,
  setIsWinBannerOpen,
}: WinBannerProps) {
  useEffect(() => {
    playSound("cashout.ogg");

    if (setIsWinBannerOpen) {
      const timer = setTimeout(() => {
        setIsWinBannerOpen(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [setIsWinBannerOpen]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200 pointer-events-none">
      <div className="bg-slate-900 border-2 border-emerald-400/80 ring-2 ring-emerald-400/40 p-6 rounded-2xl flex flex-col items-center justify-center text-center max-w-55 w-full relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-4xl font-black tracking-tighter bg-linear-to-r from-emerald-400 via-green-400 to-green-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(16,185,129,0.35)]">
          {Number(multiplier).toFixed(2)}x
        </div>

        <div className="w-16 h-0.5 bg-emerald-400/80 rounded-full my-3" />

        <div className="text-2xl font-black text-slate-50 flex items-center gap-0.5 tracking-tight">
          <span className="text-emerald-400 text-xl font-extrabold">$</span>
          {winAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
