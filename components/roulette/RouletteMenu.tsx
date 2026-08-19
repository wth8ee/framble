"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins } from "lucide-react";
import { RouletteColor } from "@/hooks/useRoulette";

interface RouletteMenuProps {
  betAmount: string;
  setBetAmount: (bet: string) => void;
  handleBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBetBlur: () => void;
  isSpinning: boolean;
  spin: (color: RouletteColor) => void;
  balance: number;
}

export function RouletteMenu({
  betAmount,
  setBetAmount,
  handleBetChange,
  handleBetBlur,
  isSpinning,
  spin,
  balance,
}: RouletteMenuProps) {
  return (
    <div className="md:col-span-4 order-2 md:order-1 flex flex-col justify-between bg-slate-950/60 border border-slate-900 rounded-lg p-4 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <Label htmlFor="bet-amount">Bet Amount</Label>
            <span className="text-emerald-400 flex items-center gap-1">
              <Coins className="w-3 h-3" /> USD
            </span>
          </div>
          <div className="relative flex items-center">
            <Input
              disabled={isSpinning}
              id="bet-amount"
              type="text" inputMode="decimal"
              value={betAmount}
              onChange={handleBetChange}
              onBlur={handleBetBlur}
              className="bg-slate-900 border-slate-800 text-slate-100 font-bold pl-3 pr-28 h-10 focus-visible:ring-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="absolute right-1 flex gap-1">
              <Button
                disabled={isSpinning}
                onClick={() => {
                  if (parseFloat(betAmount) / 2 >= 1) {
                    setBetAmount((parseFloat(betAmount) / 2).toFixed(2));
                  } else {
                    setBetAmount("1.00");
                  }
                }}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                ½
              </Button>
              <Button
                onClick={() => {
                  if (Number(betAmount) * 2 <= 100000) {
                    if (Number(betAmount) * 2 <= balance) {
                      setBetAmount((Number(betAmount) * 2).toFixed(2));
                    } else {
                      if (balance >= 1) {
                        setBetAmount(balance.toFixed(2));
                      } else {
                        setBetAmount("1.00");
                      }
                    }
                  } else {
                    setBetAmount("100000.00");
                  }
                }}
                disabled={isSpinning}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                2x
              </Button>
              <Button
                onClick={() => {
                  if (balance > 100000) {
                    setBetAmount("100000.00");
                  } else if (balance >= 1) {
                    setBetAmount(balance.toFixed(2));
                  } else {
                    setBetAmount("1.00");
                  }
                }}
                disabled={isSpinning}
                variant="ghost"
                size="sm"
                className="h-8 px-1.5 text-[10px] font-extrabold text-emerald-400 hover:bg-slate-800 hover:text-emerald-300"
              >
                MAX
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-2 grid grid-cols-1 gap-2">
          <Button
            disabled={isSpinning}
            onClick={() => spin("red")}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white text-md font-black h-12 uppercase tracking-wide shadow-lg shadow-rose-500/10"
          >
            Bet Red (2x)
          </Button>
          
          <Button
            disabled={isSpinning}
            onClick={() => spin("green")}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-md font-black h-12 uppercase tracking-wide shadow-lg shadow-emerald-500/10"
          >
            Bet Green (14x)
          </Button>

          <Button
            disabled={isSpinning}
            onClick={() => spin("black")}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white text-md font-black h-12 uppercase tracking-wide shadow-lg border border-slate-700"
          >
            Bet Black (2x)
          </Button>
        </div>
      </div>
    </div>
  );
}
