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
import { Risk, Segments } from "@/hooks/useWheel";

interface WheelMenuProps {
  betAmount: string;
  setBetAmount: (bet: string) => void;
  handleBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBetBlur: () => void;
  risk: Risk;
  setRisk: (risk: Risk) => void;
  segments: Segments;
  setSegments: (segments: Segments) => void;
  isSpinning: boolean;
  spin: () => void;
  balance: number;
}

export function WheelMenu({
  betAmount,
  setBetAmount,
  handleBetChange,
  handleBetBlur,
  risk,
  setRisk,
  segments,
  setSegments,
  isSpinning,
  spin,
  balance,
}: WheelMenuProps) {
  return (
    <div className="md:col-span-4 order-2 md:order-1 flex flex-col justify-between bg-slate-950/60 border border-slate-900 rounded-lg p-4 space-y-6">
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
              disabled={isSpinning}
              id="bet-amount"
              type="number"
              value={betAmount}
              onChange={handleBetChange}
              onBlur={handleBetBlur}
              className="bg-slate-900 border-slate-800 text-slate-100 font-bold pl-3 pr-20 h-10 focus-visible:ring-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="absolute right-1 flex gap-1">
              <Button
                disabled={isSpinning}
                onClick={() => {
                  if (parseFloat(betAmount) / 2 >= 1) {
                    setBetAmount((parseFloat(betAmount) / 2).toFixed(2));
                  } else {
                    setBetAmount("1.00");
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
                  if (Number(betAmount) * 2 <= 100000) {
                    if (Number(betAmount) * 2 <= balance) {
                      setBetAmount((Number(betAmount) * 2).toFixed(2));
                    } else {
                      if (balance >= 1) {
                        setBetAmount(balance.toFixed(2));
                      } else {
                        setBetAmount("1.00");
                      }
                    }
                  } else {
                    setBetAmount("100000.00");
                  }
                }}
                disabled={isSpinning}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                2x
              </Button>
              <Button
                onClick={() => {
                  if (balance > 100000) {
                    setBetAmount("100000.00");
                  } else if (balance >= 1) {
                    setBetAmount(balance.toFixed(2));
                  } else {
                    setBetAmount("1.00");
                  }
                }}
                disabled={isSpinning}
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
          <Label
            htmlFor="risk-level"
            className="text-xs font-semibold text-slate-400"
          >
            Risk
          </Label>
          <Select
            disabled={isSpinning}
            onValueChange={(value) => setRisk(value as Risk)}
            value={risk}
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
              className="bg-slate-900 border-slate-800 text-slate-100"
            >
              <SelectItem value="Low" className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer">Low</SelectItem>
              <SelectItem value="Medium" className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer">Medium</SelectItem>
              <SelectItem value="High" className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="segments-count"
            className="text-xs font-semibold text-slate-400"
          >
            Segments
          </Label>
          <Select
            disabled={isSpinning}
            onValueChange={(value) => setSegments(Number(value) as Segments)}
            value={String(segments)}
          >
            <SelectTrigger
              id="segments-count"
              className="bg-slate-900 border-slate-800 text-slate-100 font-bold h-10 focus:ring-emerald-500"
            >
              <SelectValue placeholder="Select segments" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="bg-slate-900 border-slate-800 text-slate-100 max-h-50 overflow-y-auto"
            >
              {[10, 20, 30, 40, 50].map((num) => (
                <SelectItem
                  key={num}
                  value={num.toString()}
                  className="focus:bg-emerald-500 focus:text-slate-950 font-semibold cursor-pointer"
                >
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 md:pt-0">
        <Button
          disabled={isSpinning}
          onClick={spin}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-md font-black h-12 uppercase tracking-wide shadow-lg shadow-emerald-500/10"
        >
          {isSpinning ? "Spinning..." : "Bet"}
        </Button>
      </div>
    </div>
  );
}
