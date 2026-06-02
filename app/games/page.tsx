"use client";

import Link from "next/link";
import { Bomb, Grid, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const games = [
  {
    id: "mines",
    title: "Mines",
    description:
      "Uncover the hidden gems and avoid the explosive mines to multiply your bet.",
    href: "/mines",
    icon: Bomb,
    badge: "Popular",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    status: "active",
  },
  {
    id: "keno",
    title: "Keno",
    description:
      "Pick your lucky numbers and watch the draw to win massive multipliers.",
    href: "/keno",
    icon: Grid,
    badge: "New",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    status: "active",
  },
  {
    id: "crash",
    title: "Crash",
    description:
      "Watch the multiplier climb and cash out before the rocket crashes down.",
    href: "#",
    icon: Sparkles,
    badge: "Coming Soon",
    badgeColor: "bg-slate-800 text-slate-500 border-transparent",
    status: "upcoming",
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.05)_0%,rgba(16,185,129,0)_60%)] rounded-full blur-[80px] pointer-events-none -z-10" />

      <main className="max-w-6xl w-full mx-auto flex-1 flex flex-col justify-center">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase mb-4">
            Game{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Lobby
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Select a challenge, adjust your risk, and start winning virtual
            cash.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            const isActive = game.status === "active";

            return (
              <Card
                key={game.id}
                className={`bg-slate-900/40 border-slate-900 backdrop-blur-sm flex flex-col justify-between transition-all duration-300 ${
                  isActive
                    ? "hover:border-emerald-500/20 hover:bg-slate-900/60 group"
                    : "opacity-60 select-none"
                }`}
              >
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 ${isActive && "group-hover:border-emerald-500/30 transition-colors"}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`${game.badgeColor} font-semibold uppercase tracking-wider text-[10px]`}
                    >
                      {game.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-100 mb-2">
                    {game.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm leading-relaxed">
                    {game.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  {isActive ? (
                    <Button
                      asChild
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition-all"
                    >
                      <Link href={game.href}>Play Now</Link>
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="w-full bg-slate-800 text-slate-500 cursor-not-allowed font-medium"
                    >
                      Locked
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
