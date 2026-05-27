"use client";

import { Bomb, Diamond, HelpCircle, ShieldCheck } from "lucide-react";
import { ActiveCells } from "./ActiveCells";
import { RevealedCells } from "./RevealedCells";
import { WinBanner } from "./WinBanner";

export function MinesField({
  cells,
  bombs,
  handleCellClick,
  gameRunning,
  coefficient,
  bet,
  lastBet,
}) {
  const gameEnded =
    cells.includes("bomb") || (cells.includes("diamond") && !gameRunning);
  const isWin = gameEnded && !cells.includes("bomb");

  return (
    <div className="md:col-span-8 flex flex-col items-center justify-center p-2 sm:p-6 bg-slate-950/20 border border-slate-900/60 rounded-lg min-h-[350px] sm:min-h-[450px]">
      <div className="relative w-full max-w-100 aspect-square flex items-center justify-center">
        {isWin && (
          <WinBanner
            multiplier={coefficient}
            winAmount={lastBet * coefficient}
          />
        )}

        <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full max-w-100 aspect-square">
          {!gameEnded && (
            <ActiveCells cells={cells} handleCellClick={handleCellClick} />
          )}
          {gameEnded && <RevealedCells cells={cells} bombs={bombs} />}
        </div>
      </div>

      <div className="mt-6 flex gap-6 text-[11px] font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Provably Fair
        </span>
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> Game Rules
        </span>
      </div>
    </div>
  );
}
