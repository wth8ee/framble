import { WinBanner } from "@/components/WinBanner";
import { CoinSide, CoinFlipHistoryItem } from "@/hooks/useCoinFlip";
import { cn } from "@/lib/utils";
import { Coins, CircleDollarSign } from "lucide-react";

interface CoinFlipFieldProps {
  isFlipping: boolean;
  rotation: number;
  result: CoinSide | null;
  winStatus: boolean | null;
  multiplier: number;
  betAmount: string;
  history?: CoinFlipHistoryItem[];
}

export function CoinFlipField({
  isFlipping,
  rotation,
  result,
  winStatus,
  multiplier,
  betAmount,
  history,
}: CoinFlipFieldProps) {
  return (
    <div className="md:col-span-8 order-1 md:order-2 flex flex-col p-4 sm:p-6 bg-slate-950/20 border border-slate-900/60 rounded-lg min-h-[350px] sm:min-h-[450px] relative overflow-hidden">
      
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center perspective-[1000px]">
          {/* The Coin */}
          <div 
            className="relative w-40 h-40 sm:w-56 sm:h-56 rounded-full transition-all duration-[1500ms] ease-out [transform-style:preserve-3d]"
            style={{ transform: `rotateX(${rotation}deg) scale(${isFlipping ? 1.1 : 1})` }}
          >
            {/* Heads Side (Front) - Yellow */}
            <div className="absolute inset-0 [backface-visibility:hidden] rounded-full bg-[#ffc800] flex items-center justify-center shadow-[inset_0_-8px_16px_rgba(0,0,0,0.3)]">
               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0f172a] shadow-inner" />
            </div>

            {/* Tails Side (Back) - Blue */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)] rounded-full bg-[#5570FF] flex items-center justify-center shadow-[inset_0_-8px_16px_rgba(0,0,0,0.3)]">
               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#0f172a] rotate-45 shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      {history && history.length > 0 && (
        <div className="w-full mt-auto pt-6 flex items-center justify-end gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {history.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-black text-sm sm:text-base shrink-0 animate-in slide-in-from-right-4 duration-300 shadow-md",
                item.side === "Heads" 
                  ? "bg-[#ffc800]/10 text-[#ffc800] border-2 border-[#ffc800]/50 shadow-[#ffc800]/10" 
                  : "bg-[#5570FF]/10 text-[#5570FF] border-2 border-[#5570FF]/50 shadow-[#5570FF]/10",
                idx === 0 ? "opacity-100 scale-110" : "opacity-50 hover:opacity-100 transition-all scale-100"
              )}
            >
              {item.side === "Heads" ? "H" : "T"}
            </div>
          ))}
        </div>
      )}

      {winStatus && !isFlipping && (
        <WinBanner 
          multiplier={multiplier} 
          winAmount={parseFloat(betAmount) * multiplier} 
        />
      )}
    </div>
  );
}
