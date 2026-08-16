"use client";

import { useDice } from "@/hooks/useDice";
import { DiceMenu } from "@/components/dice/DiceMenu";
import { DiceField } from "@/components/dice/DiceField";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DicePage() {
  const {
    betAmount,
    setBetAmount,
    handleBetChange,
    handleBetBlur,
    winChance,
    updateWinChance,
    multiplier,
    updateMultiplier,
    condition,
    setCondition,
    targetValue,
    isRolling,
    result,
    winStatus,
    lastBet,
    roll,
    balance
  } = useDice();

  return (
    <ScrollArea className="h-[calc(100dvh-4rem)] w-full bg-slate-950 text-slate-50 selection:bg-emerald-500 selection:text-slate-950">
      <div className="min-h-[calc(100dvh-4rem)] py-6 pb-20 px-4 sm:px-6 lg:px-8 flex items-start md:items-center justify-center relative overflow-hidden w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-5xl bg-slate-900/40 border border-slate-900 rounded-xl p-4 md:p-6 backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-6 z-10 my-auto">
          <DiceMenu
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            handleBetChange={handleBetChange}
            handleBetBlur={handleBetBlur}
            isRolling={isRolling}
            roll={roll}
            balance={balance}
          />

          <DiceField
            isRolling={isRolling}
            result={result}
            winStatus={winStatus}
            multiplier={multiplier}
            betAmount={lastBet || betAmount}
            winChance={winChance}
            updateWinChance={updateWinChance}
            updateMultiplier={updateMultiplier}
            condition={condition}
            setCondition={setCondition}
            targetValue={targetValue}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
