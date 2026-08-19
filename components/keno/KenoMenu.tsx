"use client";

import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KenoMenuProps {
  gameRunning: boolean;
  bet: string;
  handleBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBetBlur: () => void;
  setBet: (val: string) => void;
  balance: number;
  startGame: () => void;
  userCells: number[];
  clearTable: () => void;
  risk: string;
  setRisk: (risk: string) => void;
  isAuto: boolean;
  setIsAuto: (val: boolean) => void;
  startAuto: () => void;
  stopAuto: () => void;
}

export function KenoMenu({
  gameRunning,
  bet,
  startGame,
  handleBetChange,
  handleBetBlur,
  setBet,
  balance,
  userCells,
  clearTable,
  risk,
  setRisk,
  isAuto,
  setIsAuto,
  startAuto,
  stopAuto,
}: KenoMenuProps) {
  return (
    <div className="md:col-span-4 order-2 md:order-1 flex flex-col justify-start bg-slate-950/60 border border-slate-900 rounded-lg p-4 gap-4">
      <div className="gap-4 flex flex-col w-full">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <Label htmlFor="bet-amount">Bet Amount</Label>
            <span className="text-emerald-400 flex items-center gap-1">
              <Coins className="w-3 h-3" /> USD
            </span>
          </div>
          <div className="relative flex items-center">
            <Input
              onChange={handleBetChange}
              onBlur={handleBetBlur}
              disabled={gameRunning}
              id="bet-amount"
              type="text" inputMode="decimal"
              value={bet}
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

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="risk-level"
            className="text-xs font-semibold text-slate-400"
          >
            Risk
          </Label>
          <Select
            disabled={gameRunning}
            value={risk}
            onValueChange={(value) => setRisk(value)}
          >
            <SelectTrigger
              id="risk-level"
              className="bg-slate-900 border-slate-800 text-slate-100 font-bold h-10 focus:ring-emerald-500"
            >
              <SelectValue placeholder="Select risk" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="bg-slate-900 border-slate-800 text-slate-100 max-h-50 overflow-y-auto"
            >
              <SelectItem
                value="classic"
                className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer"
              >
                Classic
              </SelectItem>
              <SelectItem
                value="medium"
                className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer"
              >
                Medium
              </SelectItem>
              <SelectItem
                value="high"
                className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer"
              >
                High
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5">
          <Label
            htmlFor="auto-bet-switch"
            className="text-xs font-semibold text-slate-400 cursor-pointer"
          >
            Auto Bet Mode
          </Label>
          <Switch
            checked={isAuto}
            onCheckedChange={(checked) => setIsAuto(checked)}
            id="auto-bet-switch"
            disabled={gameRunning}
            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-800"
          />
        </div>

        <Button
          disabled={gameRunning}
          onClick={clearTable}
          className="w-full h-10 font-bold text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all uppercase tracking-wide"
        >
          Clear Table
        </Button>

        <Button
          disabled={gameRunning && !isAuto}
          onClick={() => {
            if (!gameRunning && userCells.length > 0) {
              if (isAuto) {
                startAuto();
              } else {
                startGame();
              }
            } else {
              if (isAuto && gameRunning) {
                stopAuto();
              }
            }
          }}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-md font-black h-12 uppercase tracking-wide shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
        >
          {isAuto && gameRunning
            ? "Stop"
            : userCells.length > 0
              ? "Bet"
              : "Pick A Tile"}
        </Button>
      </div>
    </div>
  );
}

