import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CrashGameState } from "@/hooks/useCrash";

interface CrashMenuProps {
  betAmount: string;
  setBetAmount: (val: string) => void;
  handleBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBetBlur: () => void;
  autoCashout: string;
  setAutoCashout: (val: string) => void;
  handleAutoCashoutChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAutoCashoutBlur: () => void;
  gameState: CrashGameState;
  hasCashedOut: boolean;
  startGame: () => void;
  cashOut: () => void;
  balance: number;
}

export function CrashMenu({
  betAmount,
  setBetAmount,
  handleBetChange,
  handleBetBlur,
  autoCashout,
  setAutoCashout,
  handleAutoCashoutChange,
  handleAutoCashoutBlur,
  gameState,
  hasCashedOut,
  startGame,
  cashOut,
  balance,
}: CrashMenuProps) {
  const halfBet = () => {
    const val = Math.max(0.1, parseFloat(betAmount) / 2);
    setBetAmount(val.toFixed(2));
  };

  const doubleBet = () => {
    const val = Math.min(balance, parseFloat(betAmount) * 2);
    setBetAmount(val.toFixed(2));
  };

  const isPlaying = gameState === "playing";
  const canCashOut = isPlaying && !hasCashedOut;

  return (
    <div className="md:col-span-4 bg-slate-900/60 p-4 sm:p-6 rounded-lg border border-slate-800 flex flex-col gap-6 order-2 md:order-1 h-full">
      <div className="space-y-4 flex-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-slate-400 text-xs sm:text-sm font-bold">Bet Amount</Label>
            <span className="text-slate-500 text-[10px] sm:text-xs font-medium">${balance.toFixed(2)}</span>
          </div>
          <div className="relative flex items-center">
            <Input
              type="text" inputMode="decimal"
              value={betAmount}
              onChange={handleBetChange}
              onBlur={handleBetBlur}
              disabled={isPlaying}
              className="bg-slate-950 border-slate-800 text-slate-100 font-bold pl-8 h-10 sm:h-12"
            />
            <span className="absolute left-3 text-slate-500 font-bold">$</span>
            <div className="absolute right-1 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={halfBet}
                disabled={isPlaying}
                className="h-8 px-2 text-xs font-bold text-slate-400 hover:text-slate-100 bg-slate-900"
              >
                1/2
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={doubleBet}
                disabled={isPlaying}
                className="h-8 px-2 text-xs font-bold text-slate-400 hover:text-slate-100 bg-slate-900"
              >
                2x
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400 text-xs sm:text-sm font-bold">Auto Cashout</Label>
          <div className="relative flex items-center">
            <Input
              type="text" inputMode="decimal"
              value={autoCashout}
              onChange={handleAutoCashoutChange}
              onBlur={handleAutoCashoutBlur}
              disabled={isPlaying}
              className="bg-slate-950 border-slate-800 text-slate-100 font-bold pr-8 h-10 sm:h-12"
            />
            <span className="absolute right-3 text-slate-500 font-bold">x</span>
          </div>
        </div>
      </div>

      {canCashOut ? (
        <Button
          size="lg"
          onClick={cashOut}
          className="w-full h-12 sm:h-14 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-base sm:text-lg uppercase tracking-wider transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          Cashout
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={startGame}
          disabled={isPlaying || balance < parseFloat(betAmount)}
          className="w-full h-12 sm:h-14 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-base sm:text-lg uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {isPlaying ? "Playing..." : "Play"}
        </Button>
      )}
    </div>
  );
}

