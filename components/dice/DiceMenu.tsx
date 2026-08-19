import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Coins, Dice5 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiceMenuProps {
  betAmount: string;
  setBetAmount: (val: string) => void;
  handleBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBetBlur: () => void;
  isRolling: boolean;
  roll: () => void;
  balance: number;
}

export function DiceMenu({
  betAmount,
  setBetAmount,
  handleBetChange,
  handleBetBlur,
  isRolling,
  roll,
  balance,
}: DiceMenuProps) {
  return (
    <div className="md:col-span-4 order-2 md:order-1 bg-slate-900/50 p-4 sm:p-6 rounded-lg border border-slate-800 flex flex-col justify-between h-full">
      <div className="space-y-6">
        {/* Bet Amount */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-slate-400 text-xs sm:text-sm font-medium">Bet Amount</Label>
            <span className="text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-1">
              <Coins className="w-3 h-3" /> USD
            </span>
          </div>
          <div className="relative flex items-center">
            <Input
              type="text" inputMode="decimal"
              value={betAmount}
              onChange={handleBetChange}
              onBlur={handleBetBlur}
              disabled={isRolling}
              className="bg-slate-950 border-slate-800 text-slate-100 pr-24 h-10 sm:h-12 text-sm sm:text-base font-medium focus-visible:ring-emerald-500/20"
            />
            <div className="absolute right-1 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={isRolling}
                onClick={() => setBetAmount(Math.max(0.1, parseFloat(betAmount || "0") / 2).toFixed(2))}
                className="h-7 w-8 sm:h-8 sm:w-10 px-0 text-slate-400 hover:text-slate-100 bg-slate-900 hover:bg-slate-800 rounded text-[10px] sm:text-xs font-bold"
              >
                ½
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isRolling}
                onClick={() => setBetAmount(Math.min(balance, parseFloat(betAmount || "0") * 2).toFixed(2))}
                className="h-7 w-8 sm:h-8 sm:w-10 px-0 text-slate-400 hover:text-slate-100 bg-slate-900 hover:bg-slate-800 rounded text-[10px] sm:text-xs font-bold"
              >
                2x
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isRolling}
                onClick={() => setBetAmount(balance.toFixed(2))}
                className="h-7 w-9 sm:h-8 sm:w-12 px-0 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded text-[10px] sm:text-xs font-bold"
              >
                MAX
              </Button>
            </div>
          </div>
        </div>

      </div>

      <Button
        className="w-full h-12 sm:h-14 mt-6 sm:mt-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm sm:text-lg uppercase tracking-wide transition-all active:scale-[0.98]"
        onClick={roll}
        disabled={isRolling || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > balance}
      >
        {isRolling ? "Rolling..." : "Bet"}
      </Button>
    </div>
  );
}

