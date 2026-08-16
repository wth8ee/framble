"use client";

import { Bomb, Diamond, HelpCircle, ShieldCheck } from "lucide-react";
import { WinBanner } from "../WinBanner";
import { cn } from "@/lib/utils";

interface TowerFieldProps {
  cells: string[][];
  bombs: number[][];
  handleCellClick: (row: number, col: number) => void;
  gameRunning: boolean;
  gameEnded: boolean;
  activeRow: number;
  coefficient: number;
  bet: string;
  lastBet: string | null;
  gridCols: number;
}

export function TowerField({
  cells,
  bombs,
  handleCellClick,
  gameRunning,
  gameEnded,
  activeRow,
  coefficient,
  bet,
  lastBet,
  gridCols,
}: TowerFieldProps) {
  // Check if player won (game ended and they reached the end or cashed out without hitting a bomb)
  const isWin = gameEnded && cells.flat().every(cell => cell !== "bomb") && activeRow > 0;

  return (
    <div className="md:col-span-8 order-1 md:order-2 flex flex-col items-center justify-center p-2 sm:p-6 bg-slate-950/20 border border-slate-900/60 rounded-lg min-h-[450px]">
      <div className="relative w-full max-w-lg flex flex-col items-center justify-center">
        {isWin && (
          <WinBanner
            multiplier={coefficient}
            winAmount={Number(lastBet) * coefficient}
          />
        )}

        <div className="flex flex-col gap-2 w-full max-w-sm">
          {[...Array(9)].map((_, i) => {
            const rowIndex = 8 - i;
            const isActive = gameRunning && activeRow === rowIndex;
            const isPassed = activeRow > rowIndex;

            const gridColsClass = {
              2: "grid-cols-2",
              3: "grid-cols-3",
              4: "grid-cols-4",
              5: "grid-cols-5",
            }[gridCols] || "grid-cols-5";

            return (
              <div 
                key={rowIndex} 
                className={cn(
                  `grid ${gridColsClass} gap-2 transition-all duration-300`,
                  isActive ? "scale-[1.02] opacity-100" : "opacity-80 scale-100",
                  isPassed && "opacity-60"
                )}
              >
                {[...Array(gridCols)].map((_, colIndex) => {
                  const cellState = cells[rowIndex][colIndex];
                  const isFadedBomb = gameEnded && !cellState && bombs[rowIndex]?.includes(colIndex);
                  
                  return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        disabled={!isActive || !!cellState}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={cn(
                          "relative h-10 sm:h-14 w-full rounded-md flex items-center justify-center overflow-hidden transition-all duration-300",
                          !cellState && !isFadedBomb
                            ? isActive 
                              ? "bg-slate-800 hover:bg-slate-700 cursor-pointer shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.4)] hover:shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.4)] hover:translate-y-0.5" 
                              : "bg-slate-800/80 cursor-not-allowed shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.2)]"
                            : "",
                          cellState === "diamond" && "bg-emerald-500/20 border-2 border-emerald-500/50 scale-95 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
                          cellState === "bomb" && "bg-red-500/20 border-2 border-red-500/50 scale-95 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
                          isFadedBomb && "bg-slate-800/40 border border-slate-700/50"
                        )}
                      >
                      {/* Inner highlight for empty active tiles */}
                      {!cellState && !isFadedBomb && isActive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                      )}

                      {/* Diamond */}
                      {cellState === "diamond" && (
                        <div className="animate-in zoom-in spin-in-12 duration-500 relative z-10">
                          <Diamond className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] fill-emerald-400/20" />
                        </div>
                      )}

                      {/* Bomb */}
                      {cellState === "bomb" && (
                        <div className="animate-in zoom-in duration-300 relative z-10">
                          <Bomb className="w-6 h-6 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
                        </div>
                      )}

                      {/* Faded Bomb (when game ends) */}
                      {isFadedBomb && (
                        <div className="opacity-30 relative z-10">
                          <Bomb className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex gap-6 text-[11px] font-medium text-slate-500">
        <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer transition-colors">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Provably Fair
        </span>
        <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer transition-colors">
          <HelpCircle className="w-3.5 h-3.5" /> Game Rules
        </span>
      </div>
    </div>
  );
}
