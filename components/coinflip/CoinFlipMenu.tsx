import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { CoinSide } from "@/hooks/useCoinFlip";
import { cn } from "@/lib/utils";

interface CoinFlipMenuProps {
  betAmount: string;
  setBetAmount: (val: string) => void;
  handleBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBetBlur: () => void;
  selectedSide: CoinSide;
  setSelectedSide: (side: CoinSide) => void;
  isFlipping: boolean;
  flip: () => void;
  balance: number;
}

export function CoinFlipMenu({
  betAmount,
  setBetAmount,
  handleBetChange,
  handleBetBlur,
  selectedSide,
  setSelectedSide,
  isFlipping,
  flip,
  balance,
}: CoinFlipMenuProps) {
  return (
    <div className="md:col-span-4 order-2 md:order-1 bg-slate-900/50 p-4 sm:p-6 rounded-lg border border-slate-800 flex flex-col justify-between">
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
              type="number"
              value={betAmount}
              onChange={handleBetChange}
              onBlur={handleBetBlur}
              disabled={isFlipping}
              className="bg-slate-950 border-slate-800 text-slate-100 pr-24 h-10 sm:h-12 text-sm sm:text-base font-medium focus-visible:ring-emerald-500/20"
            />
            <div className="absolute right-1 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={isFlipping}
                onClick={() => setBetAmount(Math.max(0.1, parseFloat(betAmount || "0") / 2).toFixed(2))}
                className="h-7 w-8 sm:h-8 sm:w-10 px-0 text-slate-400 hover:text-slate-100 bg-slate-900 hover:bg-slate-800 rounded text-[10px] sm:text-xs font-bold"
              >
                ½
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isFlipping}
                onClick={() => setBetAmount(Math.min(balance, parseFloat(betAmount || "0") * 2).toFixed(2))}
                className="h-7 w-8 sm:h-8 sm:w-10 px-0 text-slate-400 hover:text-slate-100 bg-slate-900 hover:bg-slate-800 rounded text-[10px] sm:text-xs font-bold"
              >
                2x
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isFlipping}
                onClick={() => setBetAmount(balance.toFixed(2))}
                className="h-7 w-9 sm:h-8 sm:w-12 px-0 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded text-[10px] sm:text-xs font-bold"
              >
                MAX
              </Button>
            </div>
          </div>
        </div>

        {/* Side Selection */}
        <div className="space-y-2">
          <Label className="text-slate-400 text-xs sm:text-sm font-medium">Select Side</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedSide("Heads")}
              disabled={isFlipping}
              className={cn(
                "flex-1 h-12 font-bold transition-all border flex items-center justify-center gap-2",
                selectedSide === "Heads"
                  ? "bg-[#2f4553] border-[#2f4553] text-white shadow-inner"
                  : "bg-[#213743] border-[#213743] text-slate-300 hover:bg-[#2f4553]/60"
              )}
            >
              Heads
              <div className="w-3 h-3 rounded-full bg-[#ffc800]" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedSide("Tails")}
              disabled={isFlipping}
              className={cn(
                "flex-1 h-12 font-bold transition-all border flex items-center justify-center gap-2",
                selectedSide === "Tails"
                  ? "bg-[#2f4553] border-[#2f4553] text-white shadow-inner"
                  : "bg-[#213743] border-[#213743] text-slate-300 hover:bg-[#2f4553]/60"
              )}
            >
              Tails
              <div className="w-3 h-3 bg-[#a855f7] rotate-45" />
            </Button>
          </div>
        </div>
      </div>

      <Button
        className="w-full h-12 sm:h-14 mt-6 sm:mt-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm sm:text-lg uppercase tracking-wide transition-all active:scale-[0.98]"
        onClick={flip}
        disabled={isFlipping || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > balance}
      >
        {isFlipping ? "Flipping..." : "Flip"}
      </Button>
    </div>
  );
}
