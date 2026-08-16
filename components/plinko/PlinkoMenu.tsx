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
import { RiskLevel } from "@/lib/plinko/multipliers";
import { Coins } from "lucide-react";

interface PlinkoMenuProps {
  bet: string;
  handleBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBetBlur: () => void;
  setBet: (bet: string) => void;
  balance: number;
  risk: RiskLevel;
  setRisk: (risk: RiskLevel) => void;
  rows: number;
  setRows: (rows: number) => void;
  dropBall: () => void;
  balls: any[];
}

export function PlinkoMenu({
  bet,
  handleBetChange,
  handleBetBlur,
  setBet,
  balance,
  risk,
  setRisk,
  rows,
  setRows,
  dropBall,
  balls,
}: PlinkoMenuProps) {
  const isPlaying = balls && balls.length > 0;
  return (
    <div className="md:col-span-4 order-2 md:order-1 flex flex-col justify-start bg-slate-950/60 border border-slate-900 rounded-lg p-4 space-y-6 h-fit">
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
              id="bet-amount"
              type="number"
              value={bet}
              onChange={handleBetChange}
              onBlur={handleBetBlur}
              className="bg-slate-900 border-slate-800 text-slate-100 font-bold pl-3 pr-20 h-10 focus-visible:ring-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="absolute right-1 flex gap-1">
              <Button
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
                        setBet((Math.floor(balance * 100) / 100).toFixed(2));
                      } else {
                        setBet("1.00");
                      }
                    }
                  } else {
                    setBet("100000.00");
                  }
                }}
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
                    setBet((Math.floor(balance * 100) / 100).toFixed(2));
                  } else {
                    setBet("1.00");
                  }
                }}
                variant="ghost"
                size="sm"
                className="h-8 px-1.5 text-[10px] font-extrabold text-emerald-400 hover:bg-slate-800 hover:text-emerald-300"
              >
                MAX
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="risk-level" className="text-xs font-semibold text-slate-400">
            Risk
          </Label>
          <Select value={risk} onValueChange={(v) => setRisk(v as RiskLevel)} disabled={isPlaying}>
            <SelectTrigger id="risk-level" className="bg-slate-900 border-slate-800 text-slate-100 font-bold h-10 focus:ring-emerald-500 disabled:opacity-50">
              <SelectValue placeholder="Select risk" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4} className="bg-slate-900 border-slate-800 text-slate-100">
              <SelectItem value="low" className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer">Low</SelectItem>
              <SelectItem value="medium" className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer">Medium</SelectItem>
              <SelectItem value="high" className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rows-count" className="text-xs font-semibold text-slate-400">
            Rows
          </Label>
          <Select value={String(rows)} onValueChange={(v) => setRows(Number(v))} disabled={isPlaying}>
            <SelectTrigger id="rows-count" className="bg-slate-900 border-slate-800 text-slate-100 font-bold h-10 focus:ring-emerald-500 disabled:opacity-50">
              <SelectValue placeholder="Select rows" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4} className="bg-slate-900 border-slate-800 text-slate-100 max-h-50 overflow-y-auto">
              {Array.from({ length: 9 }).map((_, i) => (
                <SelectItem key={i + 8} value={String(i + 8)} className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer">
                  {i + 8}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-2 md:pt-4">
        <Button
          onClick={dropBall}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-md font-black h-12 uppercase tracking-wide shadow-lg shadow-emerald-500/10"
        >
          Play
        </Button>
      </div>
    </div>
  );
}
