"use client";

import { HelpCircle, ShieldCheck, Layers } from "lucide-react";
import React, { useEffect, useState } from "react";
import { kenoCoefficients } from "@/lib/keno/getKenoCoefficient";
import { WinBanner } from "@/components/WinBanner";

interface KenoFieldProps {
  children: React.ReactNode;
  userCells: number[];
  winCells: number[];
  lastBet: number | string | null;
  gameRunning: boolean;
  isWinBannerOpen: boolean;
  currentMultiplier: number;
  setIsWinBannerOpen: (state: boolean) => void;
  risk: string;
}

export function KenoField({
  children,
  userCells,
  winCells,
  lastBet,
  gameRunning,
  isWinBannerOpen,
  currentMultiplier,
  setIsWinBannerOpen,
  risk,
}: KenoFieldProps) {
  const multipliersDemo =
    userCells.length > 0
      ? ((kenoCoefficients as any)[risk]?.[userCells.length] as number[]) || []
      : [];

  return (
    <div className="md:col-span-8 order-1 md:order-2 flex flex-col items-center justify-center p-2 sm:p-6 bg-slate-950/20 border border-slate-900/60 rounded-lg min-h-[350px] sm:min-h-[450px]">
      <div className="w-full space-y-5">
        <div className="relative w-full flex items-center justify-center">
          {isWinBannerOpen && currentMultiplier > 0 && (
            <WinBanner
              multiplier={currentMultiplier}
              winAmount={Number(lastBet) * currentMultiplier}
              // setIsWinBannerOpen={setIsWinBannerOpen}
            />
          )}

          {children}
        </div>

        <div className="w-full space-y-2 border-t border-slate-900 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Payout Table</span>
          </div>

          {multipliersDemo.length === 0 ? (
            <div className="w-full py-4 text-center text-xs font-medium text-slate-600 bg-slate-900/20 rounded-xl border border-dashed border-slate-900">
              Select numbers on the grid to view payouts
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:flex lg:flex-wrap gap-2 w-full">
              {multipliersDemo.map((item, index) => {
                const isActive = index === winCells.length && gameRunning;
                return (
                  <div
                    key={index}
                    className={`lg:min-w-16 lg:flex-1 h-13 rounded-[10px] p-1.5 flex flex-col justify-center text-center border transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-500 border-emerald-400 text-slate-950 font-black scale-105 shadow-md shadow-emerald-500/20 z-10"
                        : "bg-slate-900 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div
                      className={`text-[9px] font-bold uppercase tracking-tight ${
                        isActive ? "text-slate-950/60" : "text-slate-500"
                      }`}
                    >
                      {index}x
                    </div>
                    <div className="text-xs font-black mt-0.5 tracking-wide truncate">
                      {Number(item).toFixed(2)}x
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-6 text-[11px] font-medium text-slate-500">
        <span className="flex items-center gap-1.5 cursor-pointer hover:text-slate-400 transition">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Provably Fair
        </span>
        <span className="flex items-center gap-1.5 cursor-pointer hover:text-slate-400 transition">
          <HelpCircle className="w-3.5 h-3.5" /> Game Rules
        </span>
      </div>
    </div>
  );
}
