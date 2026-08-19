"use client";

import { useEffect, useState, useRef } from "react";
import { getNumberColor, RouletteColor, NUMBERS } from "@/hooks/useRoulette";
import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";

interface RouletteFieldProps {
  isSpinning: boolean;
  track: number[];
  targetNumber: number | null;
  lastWinMultiplier: number | null;
  history: number[];
  lastBetColor: RouletteColor | null;
  betAmount: string;
}

export function RouletteField({
  isSpinning,
  track,
  targetNumber,
  lastWinMultiplier,
  history,
  lastBetColor,
  betAmount,
}: RouletteFieldProps) {
  const [offsetPx, setOffsetPx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // 64px width + 8px gap = 72px
  const TILE_WIDTH = 64;
  const GAP = 8;
  const TILE_STEP = TILE_WIDTH + GAP;
  const TARGET_INDEX = 50;

  useEffect(() => {
    if (isSpinning) {
      // Calculate offset with a slight random deviation within the tile (± 25px)
      const randomDeviation = (Math.random() - 0.5) * 50;
      const totalShift = TARGET_INDEX * TILE_STEP + randomDeviation;
      setOffsetPx(totalShift);
    } else if (targetNumber === null) {
      // Reset position before first spin
      setOffsetPx(0);
    }
  }, [isSpinning, targetNumber]);

  return (
    <div className="md:col-span-8 order-1 md:order-2 flex flex-col items-center justify-center bg-slate-900/40 border border-slate-800 rounded-lg p-6 relative overflow-hidden min-h-[400px]">
      
      {/* History */}
      <div className="absolute top-4 right-4 flex gap-1 z-10">
        {history.map((num, i) => {
          const color = getNumberColor(num);
          return (
            <div
              key={i}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
                color === "red" && "bg-rose-500",
                color === "black" && "bg-slate-800 border border-slate-700",
                color === "green" && "bg-emerald-500"
              )}
            >
              {num}
            </div>
          );
        })}
      </div>

      {/* Main Wheel Track */}
      <div className="relative w-full max-w-3xl h-32 flex items-center justify-center mt-10">
        {/* Selection pointer */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-emerald-400 z-20 shadow-[0_0_10px_2px_rgba(52,211,153,0.5)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-400 rounded-b-sm z-20"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-400 rounded-t-sm z-20"></div>

        {/* Track container - overflow hidden */}
        <div className="w-full h-full overflow-hidden relative rounded-md border border-slate-800 bg-slate-950/80 shadow-inner">
          <div
            ref={trackRef}
            className="absolute top-0 bottom-0 flex items-center"
            style={{
              left: `calc(50% - ${TILE_WIDTH / 2}px)`, // center the very first tile
              transform: `translateX(-${offsetPx}px)`,
              transition: isSpinning 
                ? "transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)" 
                : "none",
              gap: `${GAP}px`
            }}
          >
            {track.map((num, i) => {
              const color = getNumberColor(num);
              return (
                <div
                  key={i}
                  className={cn(
                    "flex-shrink-0 w-16 h-20 rounded-md flex items-center justify-center text-2xl font-black text-white shadow-lg",
                    color === "red" && "bg-gradient-to-b from-rose-400 to-rose-600 border-b-4 border-rose-700",
                    color === "black" && "bg-gradient-to-b from-slate-700 to-slate-900 border-b-4 border-slate-950",
                    color === "green" && "bg-gradient-to-b from-emerald-400 to-emerald-600 border-b-4 border-emerald-700"
                  )}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Fading edges */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-slate-900/90 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-slate-900/90 to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* Win/Loss Result */}
      <div className="mt-12 min-h-[4rem] flex flex-col items-center justify-center">
        {!isSpinning && lastWinMultiplier !== null && (
          <div className="animate-in zoom-in duration-300 flex flex-col items-center">
            {lastWinMultiplier > 0 ? (
              <>
                <div className="text-emerald-400 font-bold text-lg mb-1 uppercase tracking-wider">
                  You Won!
                </div>
                <div className="text-4xl font-black text-white flex items-center gap-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                  +{(parseFloat(betAmount) * lastWinMultiplier).toFixed(2)} <Coins className="w-8 h-8 text-emerald-400" />
                </div>
              </>
            ) : (
              <>
                <div className="text-rose-400 font-bold text-lg mb-1 uppercase tracking-wider">
                  You Lost
                </div>
                <div className="text-3xl font-black text-slate-300 flex items-center gap-2">
                  -{parseFloat(betAmount).toFixed(2)} <Coins className="w-6 h-6 text-slate-400" />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
