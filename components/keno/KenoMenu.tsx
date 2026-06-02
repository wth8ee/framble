"use client";

import { Coins, Play } from "lucide-react";
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
}: KenoMenuProps) {
  return (
    <div className="md:col-span-4 flex flex-col justify-start bg-slate-950/60 border border-slate-900 rounded-lg p-4 gap-4">
      <div className="gap-4 flex flex-col">
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
              type="number"
              value={bet}
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

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="risk-level"
            className="text-xs font-semibold text-slate-400"
          >
            Risk
          </Label>
          <Select disabled={gameRunning} defaultValue="classic">
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

        <Button
          disabled={gameRunning}
          onClick={clearTable}
          className="w-full h-12 sm:h-12 font-bold text-md bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          Clear Table
        </Button>
      </div>

      <div className="pt-4 md:pt-0">
        <Button
          disabled={gameRunning || userCells.length === 0}
          onClick={() => {
            if (!gameRunning && userCells.length > 0) {
              startGame();
            }
          }}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-md font-black h-12 uppercase tracking-wide shadow-lg shadow-emerald-500/10"
        >
          {userCells.length > 0 ? "Bet" : "Pick A Tile"}
        </Button>
      </div>
    </div>
  );
}
