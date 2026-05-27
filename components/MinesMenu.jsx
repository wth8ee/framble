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
import { countDiamonds } from "@/lib/mines/countDiamonds";
import { Coins } from "lucide-react";
export function MinesMenu({
  gameRunning,
  startGame,
  setBombsNumber,
  bombsNumber,
  coefficient,
  nextCoefficient,
  cells,
  bet,
  handleBetChange,
  handleBetBlur,
  setBet,
  balance,
  setBalance,
  cashOut,
  lastBet,
}) {
  const diamonds = countDiamonds(cells);

  const buttonState = !gameRunning
    ? "Bet"
    : diamonds
      ? "Cash Out"
      : "Pick a Tile";

  return (
    <div className="md:col-span-4 flex flex-col justify-between bg-slate-950/60 border border-slate-900 rounded-lg p-4 space-y-6">
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
              type="number"
              value={bet}
              onChange={handleBetChange}
              onBlur={handleBetBlur}
              className="bg-slate-900 border-slate-800 text-slate-100 font-bold pl-3 pr-20 h-10 focus-visible:ring-emerald-500"
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
                  if (parseFloat(bet) * 2 <= 100000) {
                    if (parseFloat(bet) * 2 <= balance) {
                      setBet((parseFloat(bet) * 2).toFixed(2));
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
            </div>
          </div>
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
            onValueChange={(value) => setBombsNumber(Number(value))}
            defaultValue={String(bombsNumber)}
          >
            <SelectTrigger
              id="mines-count"
              className="bg-slate-900 border-slate-800 text-slate-100 font-bold h-10 focus:ring-emerald-500"
            >
              <SelectValue placeholder="Select mines" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="bg-slate-900 border-slate-800 text-slate-100 max-h-50 overflow-y-auto"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <SelectItem
                  key={i + 1}
                  value={(i + 1).toString()}
                  className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer"
                >
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-2 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Current Profit:</span>
            <span className="text-emerald-400 font-bold">
              +${(lastBet * (coefficient - 1)).toFixed(2)} (
              {coefficient.toFixed(2)}
              x)
            </span>
          </div>
          <div className="flex justify-between">
            <span>Next Tile:</span>
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
              startGame(balance, setBalance);
            } else {
              if (buttonState === "Cash Out") {
                cashOut(balance, setBalance);
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
