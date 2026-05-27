import { Bomb, Diamond } from "lucide-react";

export function RevealedCells({
  cells,
  handleCellClick,
  bombs,
}: {
  cells: any[];
  handleCellClick: (index: number) => void;
  bombs: number[];
}) {
  return cells.map((cell, index) => {
    if (cell === "diamond") {
      return (
        <button
          key={index}
          className="relative rounded-xl font-bold flex items-center justify-center transition-all bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-400 scale-[0.98] shadow-lg shadow-emerald-500/20 aspect-square"
        >
          <Diamond className="w-6 h-6 sm:w-8 sm:h-8 text-slate-950 fill-slate-950/20" />
        </button>
      );
    } else if (cell === "bomb") {
      return (
        <button
          key={index}
          className="relative rounded-xl font-bold flex items-center justify-center transition-all bg-gradient-to-br from-rose-500 to-red-600 border border-rose-400 scale-[0.98] shadow-lg shadow-rose-500/20 aspect-square"
        >
          <Bomb className="w-6 h-6 sm:w-8 sm:h-8 text-slate-950 fill-slate-950/20" />
        </button>
      );
    } else if (bombs.includes(index)) {
      return (
        <button
          disabled
          key={index}
          className="relative rounded-xl font-bold flex items-center justify-center bg-rose-500/20 border border-rose-500/40 scale-[0.98] aspect-square cursor-not-allowed"
        >
          <Bomb className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 opacity-40" />
        </button>
      );
    } else {
      return (
        <button
          disabled
          key={index}
          className="relative rounded-xl font-bold flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 scale-[0.98] aspect-square cursor-not-allowed"
        >
          <Diamond className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 opacity-40" />
        </button>
      );
    }
  });
}
