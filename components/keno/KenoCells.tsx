import { Diamond } from "lucide-react";

interface KenoCellsProps {
  cells: any[];
  userCells: number[];
  handleCellClick: (i: number) => void;
  winCells: number[];
  missedCells: number[];
}

export function KenoCells({
  cells,
  userCells,
  handleCellClick,
  winCells,
  missedCells,
}: KenoCellsProps) {
  return (
    <div className="grid grid-cols-8 gap-1.5 sm:gap-2 w-full">
      {Array.from({ length: 40 }).map((cell, i) => {
        const num = i + 1;

        if (winCells.includes(num)) {
          return (
            <button
              onClick={() => handleCellClick(num)}
              key={num}
              className="aspect-square relative rounded-lg font-black text-sm sm:text-base flex items-center justify-center transition-all bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[0.96] border-4 border-purple-500 overflow-hidden"
            >
              <Diamond className="absolute w-6 h-6 text-slate-950/10 fill-slate-950/5 pointer-events-none" />
              <span className="relative z-10">{num}</span>
            </button>
          );
        }

        if (userCells.includes(num)) {
          return (
            <button
              onClick={() => handleCellClick(num)}
              key={num}
              className="aspect-square relative rounded-lg font-black text-sm sm:text-base flex items-center justify-center transition-all bg-purple-600 border border-purple-500 text-slate-50 shadow-md shadow-purple-600/10 scale-[0.96]"
            >
              {num}
            </button>
          );
        }

        if (missedCells.includes(num)) {
          return (
            <button
              onClick={() => handleCellClick(num)}
              key={num}
              className="aspect-square relative rounded-lg font-bold text-sm sm:text-base flex items-center justify-center transition-all bg-rose-500/10 border border-rose-500/20 text-rose-400 opacity-60"
            >
              {num}
            </button>
          );
        }

        if (userCells.length == 10) {
          return (
            <button
              key={num}
              className="aspect-square relative rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center transition-all bg-slate-900/40 border border-slate-800/60 text-slate-600 opacity-80"
            >
              {num}
            </button>
          );
        } else {
          return (
            <button
              onClick={() => handleCellClick(num)}
              key={num}
              className="aspect-square relative rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center transition-all bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:-translate-y-0.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]"
            >
              {num}
            </button>
          );
        }
      })}
    </div>
  );
}
