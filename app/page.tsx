import Link from "next/link";
import { ArrowRight, Bomb, ShieldCheck, Zap, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <main className="w-full overflow-x-hidden flex flex-col flex-1">
        <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto flex flex-col items-center justify-center flex-1 z-10 w-full">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[320px] sm:max-w-[800px] aspect-square bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,rgba(16,185,129,0)_70%)] rounded-full blur-[40px] sm:blur-[60px] pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] sm:text-xs text-emerald-400 font-medium mb-6 animate-pulse">
            <Zap className="w-3 h-3" /> Instantly Provably Fair Gaming
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight max-w-3xl leading-none mb-6 uppercase">
            Dodge the{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Mines
            </span>
            .<br />
            Multiply your cash.
          </h1>

          <p className="text-slate-400 text-sm sm:text-lg max-w-xl mb-10 font-normal px-2">
            The ultimate game of risk and reward. Uncover the gems, avoid the
            explosives, and cash out before it's too late.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center px-4 sm:px-0">
            <Button
              asChild
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 text-sm sm:text-md shadow-lg shadow-emerald-500/20 group w-full sm:w-auto"
            >
              <Link
                href="/mines"
                className="flex items-center justify-center gap-2"
              >
                Play MINES Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 px-8 text-sm sm:text-md w-full sm:w-auto"
            >
              <Link href="#how-to-play">How it works</Link>
            </Button>
          </div>
        </section>

        <section className="border-y border-slate-900 bg-slate-900/20 backdrop-blur-sm py-4 sm:py-6 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-slate-100">
                $1,249,502
              </div>
              <div className="text-[9px] sm:text-xs text-slate-500 uppercase tracking-wider mt-1">
                Total Won
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-slate-100">
                412,983
              </div>
              <div className="text-[9px] sm:text-xs text-slate-500 uppercase tracking-wider mt-1">
                Bets Placed
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-emerald-400">
                99.00%
              </div>
              <div className="text-[9px] sm:text-xs text-slate-500 uppercase tracking-wider mt-1">
                RTP Rate
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-slate-100">
                1,420
              </div>
              <div className="text-[9px] sm:text-xs text-slate-500 uppercase tracking-wider mt-1">
                Active Players
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-to-play"
          className="py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full z-10"
        >
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight mb-3 uppercase">
              Why Play Our Mines?
            </h2>
            <p className="text-slate-400 text-xs sm:text-base">
              Simple mechanics, massive multipliers, and complete transparency.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="bg-slate-900/40 border-slate-900 backdrop-blur-sm">
              <CardHeader className="p-5 sm:p-6">
                <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-2">
                  <Bomb className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <CardTitle className="text-slate-100 text-base sm:text-lg">
                  Custom Risk
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs sm:text-sm">
                  Choose from 1 to 24 mines on the field. More mines mean higher
                  risk and astronomical multipliers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/40 border-slate-900 backdrop-blur-sm">
              <CardHeader className="p-5 sm:p-6">
                <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-2">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <CardTitle className="text-slate-100 text-base sm:text-lg">
                  100% Provably Fair
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs sm:text-sm">
                  Every round is cryptographically secure. Verify the fairness
                  of your grid generation anytime.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/40 border-slate-900 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <CardHeader className="p-5 sm:p-6">
                <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-2">
                  <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <CardTitle className="text-slate-100 text-base sm:text-lg">
                  Instant Cashout
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs sm:text-sm">
                  Hit one correct tile or ten—it doesn't matter. Take your
                  profit instantly at any point during the game.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="mb-16 md:mb-20 px-4 sm:px-6 max-w-5xl mx-auto w-full z-10">
          <div className="relative rounded-2xl bg-linear-to-r from-emerald-950/40 to-slate-900/40 border border-emerald-500/10 p-6 sm:p-12 overflow-hidden text-center flex flex-col items-center">
            <h3 className="text-lg sm:text-2xl font-bold mb-3 uppercase">
              Ready to test your luck?
            </h3>
            <p className="text-slate-400 max-w-md mb-6 text-[11px] sm:text-sm">
              Configure your mines, set your bet size, and start climbing the
              multiplier ladder.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-slate-50 text-slate-950 hover:bg-slate-200 font-bold px-8 text-sm sm:text-base w-full sm:w-auto"
            >
              <Link href="/mines">Start Playing</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-[11px] text-slate-600 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 MinesCasino. All rights reserved.</p>
          <p className="text-slate-500 font-medium">18+ | Gamble Responsibly</p>
        </div>
      </footer>
    </div>
  );
}
