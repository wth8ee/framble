import { Bomb, Diamond } from "lucide-react";

export function ActiveCells({
  cells,
  handleCellClick,
}: {
  cells: any[];
  handleCellClick: (index: number) => void;
}) {
  return cells.map((cell, index) => {
    if (cell === "diamond") {
      return (
        <button
          onClick={() => handleCellClick(index)}
          key={index}
          className="relative rounded-xl font-bold flex items-center justify-center transition-all bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-400 scale-[0.98] shadow-lg shadow-emerald-500/20 aspect-square"
        >
          <Diamond className="w-6 h-6 sm:w-8 sm:h-8 text-slate-950 fill-slate-950/20" />
        </button>
      );
    }

    if (cell === "bomb") {
      return (
        <button
          onClick={() => handleCellClick(index)}
          key={index}
          className="relative rounded-xl font-bold flex items-center justify-center transition-all bg-gradient-to-br from-rose-500 to-red-600 border border-rose-400 scale-[0.98] shadow-lg shadow-rose-500/20 aspect-square"
        >
          <Bomb className="w-6 h-6 sm:w-8 sm:h-8 text-slate-950 fill-slate-950/20" />
        </button>
      );
    }

    return (
      <button
        onClick={() => handleCellClick(index)}
        key={index}
        className="relative rounded-xl font-bold flex items-center justify-center transition-all bg-slate-800 border border-slate-700/60 hover:bg-slate-700 hover:-translate-y-0.5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] aspect-square"
      >
        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-slate-900/40 rounded-full" />
      </button>
    );
  });
}
