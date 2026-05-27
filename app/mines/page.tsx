"use client";

import { Bomb, Diamond, HelpCircle, ShieldCheck } from "lucide-react";
import { useMines } from "@/hooks/useMines";
import { MinesMenu } from "@/components/MinesMenu";
import { MinesField } from "@/components/MinesField";
import { useBalance } from "@/context/balanceContext";

export default function MinesPage() {
  const {
    cells,
    bombs,
    gameRunning,
    startGame,
    handleCellClick,
    setBombsNumber,
    bombsNumber,
    coefficient,
    nextCoefficient,
    bet,
    handleBetChange,
    handleBetBlur,
    setBet,
    cashOut,
    lastBet,
  } = useMines();

  const { balance, setBalance } = useBalance();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl bg-slate-900/40 border border-slate-900 rounded-xl p-4 md:p-6 backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-6 z-10">
        <MinesMenu
          gameRunning={gameRunning}
          startGame={startGame}
          setBombsNumber={setBombsNumber}
          bombsNumber={bombsNumber}
          coefficient={coefficient}
          nextCoefficient={nextCoefficient}
          cells={cells}
          bet={bet}
          handleBetChange={handleBetChange}
          handleBetBlur={handleBetBlur}
          setBet={setBet}
          balance={balance}
          setBalance={setBalance}
          cashOut={cashOut}
          lastBet={lastBet}
        />

        <MinesField
          gameRunning={gameRunning}
          cells={cells}
          bombs={bombs}
          handleCellClick={handleCellClick}
          bet={bet}
          coefficient={coefficient}
          lastBet={lastBet}
        />
      </div>
    </div>
  );
}
