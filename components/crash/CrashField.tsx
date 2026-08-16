import { CrashGameState } from "@/hooks/useCrash";
import { WinBanner } from "@/components/WinBanner";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface CrashFieldProps {
  gameState: CrashGameState;
  multiplier: number;
  crashPoint: number;
  hasCashedOut: boolean;
  winAmount: number;
  history?: number[];
}

export function CrashField({
  gameState,
  multiplier,
  crashPoint,
  hasCashedOut,
  winAmount,
  history,
}: CrashFieldProps) {
  const isCrashed = gameState === "crashed";
  const isPlaying = gameState === "playing";

  // Calculate dynamic coordinates for the curve based on multiplier
  // We use log scale so it doesn't instantly shoot off screen
  const progress = Math.min(100, Math.log(multiplier) * 30); 
  const x = Math.min(100, progress + 10);
  const y = 100 - Math.min(90, progress);

  return (
    <div className="md:col-span-8 order-1 md:order-2 flex flex-col bg-slate-950/20 border border-slate-900/60 rounded-xl relative h-[400px] md:h-full min-h-[400px] overflow-hidden">
      
      {/* History Bar */}
      {history && history.length > 0 && (
        <div className="absolute top-0 left-0 right-0 p-3 flex items-center gap-2 overflow-x-auto scrollbar-hide z-20 bg-slate-950/40 backdrop-blur-sm border-b border-slate-800/50">
          {history.map((val, idx) => (
            <div
              key={idx}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                val < 2.0 
                  ? "bg-slate-800 text-slate-300"
                  : val < 10.0
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              )}
            >
              {val.toFixed(2)}x
            </div>
          ))}
        </div>
      )}

      {/* Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-emerald-100" />
        <div className="absolute top-2/4 left-0 right-0 h-px bg-emerald-100" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-emerald-100" />
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-emerald-100" />
        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-emerald-100" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-emerald-100" />
      </div>

      {/* Animated Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-80 mt-12">
        <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="gradEmerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Fill Area */}
          <path
            d={`M0,100 Q${x * 0.6},100 ${x},${y} L${x},100 Z`}
            fill={isCrashed ? "url(#gradRed)" : "url(#gradEmerald)"}
            className="transition-all duration-[50ms] ease-linear"
          />
          
          {/* Stroke Line */}
          <path
            d={`M0,100 Q${x * 0.6},100 ${x},${y}`}
            fill="none"
            stroke={isCrashed ? "#ef4444" : "#10b981"}
            strokeWidth="1.5"
            strokeLinecap="round"
            className="transition-all duration-[50ms] ease-linear drop-shadow-md"
          />

          {/* Rocket/Dot at the tip */}
          {isPlaying && (
            <circle 
              cx={x} 
              cy={y} 
              r="2" 
              fill="#fff" 
              className="transition-all duration-[50ms] ease-linear shadow-[0_0_10px_#fff]"
            />
          )}
        </svg>
      </div>

      {/* Main Multiplier Display */}
      <div className={cn(
        "relative z-10 flex flex-col items-center justify-center h-full transition-all duration-300",
        isCrashed ? "scale-110" : isPlaying ? "scale-100" : "scale-100"
      )}>
        <div className={cn(
          "text-7xl sm:text-9xl font-black tracking-tighter drop-shadow-2xl transition-colors duration-200",
          isCrashed ? "text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]" : hasCashedOut ? "text-emerald-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]" : isPlaying ? "text-slate-100" : "text-slate-500"
        )}>
          {multiplier.toFixed(2)}x
        </div>
        
        <div className="h-10 mt-4 flex items-center justify-center">
          {isCrashed && (
            <div className="text-red-500 font-bold text-2xl tracking-widest uppercase animate-pulse">
              Crashed
            </div>
          )}
          {hasCashedOut && !isCrashed && isPlaying && (
            <div className="text-emerald-400 font-bold text-2xl tracking-widest uppercase animate-pulse">
              Cashed Out!
            </div>
          )}
        </div>
      </div>

      {hasCashedOut && !isCrashed && gameState === "idle" && (
        <WinBanner 
          multiplier={multiplier} 
          winAmount={winAmount} 
        />
      )}
    </div>
  );
}
