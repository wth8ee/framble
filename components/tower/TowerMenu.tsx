"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coins } from "lucide-react";

interface TowerMenuProps {
  gameRunning: boolean;
  gameEnded: boolean;
  startGame: () => void;
  minesNumber: number;
  setMinesNumber: (minesNumber: number) => void;
  gridCols: number;
  setGridCols: (cols: number) => void;
  coefficient: number;
  nextCoefficient: number;
  bet: string;
  setBet: (bet: string) => void;
  handleBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBetBlur: () => void;
  balance: number;
  cashOut: () => void;
  lastBet: string | null;
  activeRow: number;
}

export function TowerMenu({
  gameRunning,
  gameEnded,
  startGame,
  minesNumber,
  setMinesNumber,
  gridCols,
  setGridCols,
  coefficient,
  nextCoefficient,
  bet,
  setBet,
  handleBetChange,
  handleBetBlur,
  balance,
  cashOut,
  lastBet,
  activeRow,
}: TowerMenuProps) {
  const buttonState = !gameRunning
    ? "Bet"
    : activeRow > 0
      ? "Cash Out"
      : "Pick a Tile";

  return (
    <div className="md:col-span-4 order-2 md:order-1 flex flex-col justify-between bg-slate-950/60 border border-slate-900 rounded-lg p-4 space-y-6 h-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <Label htmlFor="bet-amount">Bet Amount</Label>
            <span className="text-emerald-400 flex items-center gap-1">
              <Coins className="w-3 h-3" /> USD
            </span>
          </div>
          <div className="relative flex items-center">
            <Input
              disabled={gameRunning}
              id="bet-amount"
              type="text" inputMode="decimal"
              value={bet}
              onChange={handleBetChange}
              onBlur={handleBetBlur}
              className="bg-slate-900 border-slate-800 text-slate-100 font-bold pl-3 pr-28 h-10 focus-visible:ring-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="absolute right-1 flex gap-1">
              <Button
                disabled={gameRunning}
                onClick={() => {
                  if (parseFloat(bet) / 2 >= 1) {
                    setBet((parseFloat(bet) / 2).toFixed(2));
                  } else {
                    setBet("1.00");
                  }
                }}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                ½
              </Button>
              <Button
                onClick={() => {
                  if (Number(bet) * 2 <= 100000) {
                    if (Number(bet) * 2 <= balance) {
                      setBet((Number(bet) * 2).toFixed(2));
                    } else {
                      if (balance >= 1) {
                        setBet(balance.toFixed(2));
                      } else {
                        setBet("1.00");
                      }
                    }
                  } else {
                    setBet("100000.00");
                  }
                }}
                disabled={gameRunning}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                2x
              </Button>
              <Button
                onClick={() => {
                  if (balance > 100000) {
                    setBet("100000.00");
                  } else if (balance >= 1) {
                    setBet(balance.toFixed(2));
                  } else {
                    setBet("1.00");
                  }
                }}
                disabled={gameRunning}
                variant="ghost"
                size="sm"
                className="h-8 px-1.5 text-[10px] font-extrabold text-emerald-400 hover:bg-slate-800 hover:text-emerald-300"
              >
                MAX
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="grid-cols"
              className="text-xs font-semibold text-slate-400"
            >
              Width
            </Label>
            <Select
              disabled={gameRunning}
              onValueChange={(value) => setGridCols(Number(value))}
              value={String(gridCols)}
            >
              <SelectTrigger
                id="grid-cols"
                className="bg-slate-900 border-slate-800 text-slate-100 font-bold h-10 focus:ring-emerald-500"
              >
                <SelectValue placeholder="Width" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={4}
                className="bg-slate-900 border-slate-800 text-slate-100 max-h-50 overflow-y-auto"
              >
                {[2, 3, 4, 5].map((i) => (
                  <SelectItem
                    key={i}
                    value={i.toString()}
                    className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer"
                  >
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="mines-count"
              className="text-xs font-semibold text-slate-400"
            >
              Mines
            </Label>
            <Select
              disabled={gameRunning}
              onValueChange={(value) => setMinesNumber(Number(value))}
              value={String(minesNumber)}
            >
              <SelectTrigger
                id="mines-count"
                className="bg-slate-900 border-slate-800 text-slate-100 font-bold h-10 focus:ring-emerald-500"
              >
                <SelectValue placeholder="Select risk" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={4}
                className="bg-slate-900 border-slate-800 text-slate-100 max-h-50 overflow-y-auto"
              >
                {Array.from({ length: gridCols - 1 }, (_, i) => i + 1).map((i) => (
                  <SelectItem
                    key={i}
                    value={i.toString()}
                    className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer"
                  >
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-2 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Current Profit:</span>
            <span className="text-emerald-400 font-bold">
              {activeRow > 0 && lastBet
                ? `+$${(Number(lastBet) * (coefficient - 1)).toFixed(2)} (${coefficient.toFixed(2)}x)`
                : "$0.00 (1.00x)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Next Row:</span>
            <span className="text-slate-200 font-semibold">
              {nextCoefficient.toFixed(2)}x
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 md:pt-0">
        <Button
          disabled={buttonState === "Pick a Tile"}
          onClick={() => {
            if (!gameRunning) {
              startGame();
            } else {
              if (buttonState === "Cash Out") {
                cashOut();
              }
            }
          }}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-md font-black h-12 uppercase tracking-wide shadow-lg shadow-emerald-500/10"
        >
          {buttonState}
        </Button>
      </div>
    </div>
  );
}

