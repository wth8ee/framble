"use client";

import { useRoulette } from "@/hooks/useRoulette";
import { RouletteMenu } from "@/components/roulette/RouletteMenu";
import { RouletteField } from "@/components/roulette/RouletteField";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RoulettePage() {
  const {
    betAmount,
    setBetAmount,
    handleBetChange,
    handleBetBlur,
    isSpinning,
    track,
    targetNumber,
    lastWinMultiplier,
    lastBetColor,
    history,
    spin,
    balance
  } = useRoulette();

  return (
    <ScrollArea className="h-[calc(100dvh-4rem)] w-full bg-slate-950 text-slate-50 selection:bg-emerald-500 selection:text-slate-950">
      <div className="min-h-[calc(100dvh-4rem)] py-6 pb-20 px-4 sm:px-6 lg:px-8 flex items-start md:items-center justify-center relative overflow-hidden w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-5xl bg-slate-900/40 border border-slate-900 rounded-xl p-4 md:p-6 backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-6 z-10 my-auto">
          <RouletteMenu
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            handleBetChange={handleBetChange}
            handleBetBlur={handleBetBlur}
            isSpinning={isSpinning}
            spin={spin}
            balance={balance}
          />

          <RouletteField
            isSpinning={isSpinning}
            track={track}
            targetNumber={targetNumber}
            lastWinMultiplier={lastWinMultiplier}
            history={history}
            lastBetColor={lastBetColor}
            betAmount={betAmount}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
