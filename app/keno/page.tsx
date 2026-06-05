"use client";

import { KenoMenu } from "@/components/keno/KenoMenu";
import { KenoField } from "@/components/keno/KenoField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useKeno } from "@/hooks/useKeno";
import { KenoCells } from "@/components/keno/KenoCells";
import { useState } from "react";
import { LiveStatsWindow } from "@/components/LiveStatsWindow";

export default function KenoPage() {
  const {
    cells,
    gameRunning,
    bet,
    setBet,
    lastBet,
    userCells,
    handleCellClick,
    winCells,
    startGame,
    missedCells,
    handleBetBlur,
    handleBetChange,
    currentMultiplier,
    isWinBannerOpen,
    setIsWinBannerOpen,
    clearTable,
    balanceStats,
    balance,
    risk,
    setRisk,
    isAuto,
    setIsAuto,
    startAuto,
    stopAuto,
  } = useKeno();

  const [isStatsOpen, setIsStatsOpen] = useState(false);

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full bg-slate-950 text-slate-50 selection:bg-emerald-500 selection:text-slate-950">
      <div className="min-h-[calc(100vh-4rem)] py-6 pb-20 px-4 sm:px-6 lg:px-8 flex items-start md:items-center justify-center relative overflow-hidden w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-5xl bg-slate-900/40 border border-slate-900 rounded-xl p-4 md:p-6 backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-6 z-10 my-auto">
          <KenoMenu
            stopAuto={stopAuto}
            isAuto={isAuto}
            setIsAuto={setIsAuto}
            risk={risk}
            setRisk={setRisk}
            bet={bet}
            setBet={setBet}
            handleBetBlur={handleBetBlur}
            handleBetChange={handleBetChange}
            gameRunning={gameRunning}
            startGame={startGame}
            balance={balance}
            userCells={userCells}
            clearTable={clearTable}
            startAuto={startAuto}
          />
          <KenoField
            risk={risk}
            gameRunning={gameRunning}
            winCells={winCells}
            userCells={userCells}
            lastBet={lastBet}
            currentMultiplier={currentMultiplier}
            isWinBannerOpen={isWinBannerOpen}
            setIsWinBannerOpen={setIsWinBannerOpen}
          >
            <KenoCells
              winCells={winCells}
              handleCellClick={handleCellClick}
              cells={cells}
              userCells={userCells}
              missedCells={missedCells}
            />
          </KenoField>
        </div>
      </div>
    </ScrollArea>
  );
}
