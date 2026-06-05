"use client";

import { BarChart2 } from "lucide-react";
import { useMines } from "@/hooks/useMines";
import { MinesMenu } from "@/components/mines/MinesMenu";
import { MinesField } from "@/components/mines/MinesField";
import { useBalance } from "@/context/balanceContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LiveStatsWindow } from "@/components/LiveStatsWindow";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    balanceStats,
    balance,
  } = useMines();

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full bg-slate-950 text-slate-50 selection:bg-emerald-500 selection:text-slate-950">
      <div className="min-h-[calc(100vh-4rem)] py-6 pb-20 px-4 sm:px-6 lg:px-8 flex items-start md:items-center justify-center relative overflow-hidden w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-5xl bg-slate-900/40 border border-slate-900 rounded-xl p-4 md:p-6 backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-6 z-10 my-auto">
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
    </ScrollArea>
  );
}
