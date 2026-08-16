"use client";

import React from "react";
import {
  Crown,
  Zap,
  DollarSign,
  Trophy,
  Flame,
  User,
  Gamepad2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockLeaderboard = [
  { name: "AlphaPhantom", value: 14500.5, detail: "online", isMoney: true },
  { name: "ShadowRunner", value: 8200.0, detail: "offline", isMoney: true },
  { name: "QuantumVortex", value: 4300.15, detail: "online", isMoney: true },
  { name: "CyberGrizzly", value: 250.2, detail: "online", isMoney: true },
];

const mockBigWins = [
  {
    name: "AlphaPhantom",
    game: "Mines",
    value: 6250.0,
    multiplier: 12.5,
    isMoney: true,
  },
  {
    name: "ShadowRunner",
    game: "Keno",
    value: 3600.0,
    multiplier: 18.0,
    isMoney: true,
  },
  {
    name: "NeonFalcon",
    game: "Mines",
    value: 2500.0,
    multiplier: 25.0,
    isMoney: true,
  },
  {
    name: "CyberGrizzly",
    game: "Keno",
    value: 1200.0,
    multiplier: 6.0,
    isMoney: true,
  },
];

const mockLuckyWins = [
  {
    name: "ShadowRunner",
    game: "Keno",
    value: 450.0,
    payout: 900.0,
    isMoney: false,
  },
  {
    name: "QuantumVortex",
    game: "Mines",
    value: 120.0,
    payout: 600.0,
    isMoney: false,
  },
  {
    name: "AlphaPhantom",
    game: "Keno",
    value: 50.0,
    payout: 500.0,
    isMoney: false,
  },
  {
    name: "CyberGrizzly",
    game: "Mines",
    value: 35.0,
    payout: 140.0,
    isMoney: false,
  },
];

export default function StatsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-start">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.04)_0%,rgba(16,185,129,0)_60%)] rounded-full blur-[80px] pointer-events-none -z-10" />

      <main className="max-w-6xl w-full mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase mb-4">
            Platform{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Statistics
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Live leaderboard, biggest payouts, and the luckiest multipliers
            across all games.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/40 border-slate-900 backdrop-blur-sm flex flex-col justify-between">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400">
                  <Crown className="w-5 h-5" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-bold uppercase tracking-wider"
                >
                  Top Balance
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-100">
                Leaders
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Players with the highest current net worth.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-2.5">
              {mockLeaderboard.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-950/40 border border-slate-900/60 rounded-xl px-4 py-3 flex items-center justify-between transition-all hover:border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-black w-4 ${index === 0 ? "text-amber-400" : index === 1 ? "text-slate-400" : index === 2 ? "text-amber-700" : "text-slate-600"}`}
                    >
                      #{index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${item.detail === "online" ? "text-emerald-400" : "text-slate-600"}`}
                      >
                        {item.detail}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    ${item.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-900 backdrop-blur-sm flex flex-col justify-between">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider"
                >
                  Highrollers
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-100">
                Big Wins
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Highest total cash payouts recorded in a single round.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-2.5">
              {mockBigWins.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-950/40 border border-slate-900/60 rounded-xl px-4 py-3 flex items-center justify-between transition-all hover:border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        {item.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 flex items-center gap-1">
                        <Gamepad2 className="w-3 h-3" />
                        {item.game} • {item.multiplier.toFixed(2)}x
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    +${item.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-900 backdrop-blur-sm flex flex-col justify-between">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-rose-400">
                  <Zap className="w-5 h-5" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px] font-bold uppercase tracking-wider"
                >
                  Lucky Hits
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-100">
                Lucky Wins
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Highest multipliers hit, regardless of the bet size.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-2.5">
              {mockLuckyWins.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-950/40 border border-slate-900/60 rounded-xl px-4 py-3 flex items-center justify-between transition-all hover:border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-500" />
                        {item.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 flex items-center gap-1">
                        <Gamepad2 className="w-3 h-3" />
                        {item.game} • Payout: ${item.payout.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-rose-400 font-mono">
                    {item.value.toFixed(2)}x
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
