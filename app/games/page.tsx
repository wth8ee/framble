"use client";

import { GameCards } from "@/components/GameCards";

export default function GamesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-50 py-12 px-0 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.05)_0%,rgba(16,185,129,0)_60%)] rounded-full blur-[80px] pointer-events-none -z-10" />

      <main className="max-w-6xl w-full mx-auto flex-1 flex flex-col pt-10">
        <div className="text-center mb-12 px-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase mb-4">
            Game{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Lobby
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Select a challenge, adjust your risk, and start winning virtual cash.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <GameCards />
        </div>
      </main>
    </div>
  );
}
