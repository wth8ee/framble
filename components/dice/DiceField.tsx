import { useState, useEffect } from "react";
import { WinBanner } from "@/components/WinBanner";
import { DiceCondition } from "@/hooks/useDice";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DiceFieldProps {
  isRolling: boolean;
  result: number | null;
  winStatus: boolean | null;
  multiplier: number;
  betAmount: string;
  winChance: number;
  updateWinChance: (val: number) => void;
  updateMultiplier: (val: number) => void;
  condition: DiceCondition;
  setCondition: (cond: DiceCondition) => void;
  targetValue: number;
}

export function DiceField({
  isRolling,
  result,
  winStatus,
  multiplier,
  betAmount,
  winChance,
  updateWinChance,
  updateMultiplier,
  condition,
  setCondition,
  targetValue,
}: DiceFieldProps) {
  
  // Custom Slider implementation to match Stake's UI
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    // If condition is Roll Over, slider goes from 2 to 99.99, WinChance = 100 - val
    // If condition is Roll Under, slider goes from 0.01 to 98, WinChance = val
    if (condition === "Roll Over") {
      updateWinChance(100 - val);
    } else {
      updateWinChance(val);
    }
  };

  const [visualResult, setVisualResult] = useState(50);
  
  useEffect(() => {
    if (isRolling && result !== null) {
      let startTime: number | null = null;
      const startValue = 0;
      const targetValue = result;
      const duration = (targetValue / 250) * 1000;
      
      let animationFrame: number;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = duration > 0 ? Math.min((timestamp - startTime) / duration, 1) : 1;
        
        const currentVal = startValue + (targetValue - startValue) * progress;
        setVisualResult(currentVal);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    } else if (!isRolling && result !== null) {
      setVisualResult(result);
    } else if (result === null) {
      setVisualResult(50);
    }
  }, [isRolling, result]);

  const sliderValue = condition === "Roll Over" ? (100 - winChance) : winChance;

  const isVisualWin = condition === "Roll Over" ? visualResult > targetValue : visualResult < targetValue;
  const borderColor = result !== null ? (isVisualWin ? '#10b981' : '#f43f5e') : 'transparent';
  const textColorClass = result !== null ? (isVisualWin ? "text-emerald-500" : "text-rose-500") : "text-slate-800";

  return (
    <div className="md:col-span-8 order-1 md:order-2 flex flex-col p-4 sm:p-8 bg-slate-950/20 border border-slate-900/60 rounded-lg relative h-full min-h-[450px]">
      
      {/* Slider Area */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full mb-8 mt-12">
        
        {/* The Track with Indicator */}
        <div className="relative w-full h-3 sm:h-4 rounded-full bg-slate-800 flex items-center cursor-pointer mb-8">
           
           {/* Roll Result Indicator */}
           <div 
             className="absolute bottom-full mb-4 w-16 h-12 sm:w-20 sm:h-14 -ml-8 sm:-ml-10 bg-slate-50 rounded-lg shadow-xl flex flex-col items-center justify-center border-2 z-20"
             style={{ 
               left: `${visualResult}%`,
               borderColor: borderColor
             }}
           >
             <span className={cn(
               "text-sm sm:text-lg font-black",
               textColorClass
             )}>
               {visualResult.toFixed(2)}
             </span>
             
             {/* Caret pointing down */}
             <div 
               className="absolute top-full w-3 h-3 border-b-2 border-r-2 bg-slate-50 rotate-45 -mt-1.5"
               style={{
                 borderColor: borderColor
               }}
             />
           </div>

           {/* Over/Under Colors */}
           <div 
             className="absolute h-full rounded-full transition-all duration-200 pointer-events-none"
             style={{
               left: condition === "Roll Over" ? '0%' : '0%',
               width: condition === "Roll Over" ? `${targetValue}%` : `${targetValue}%`,
               backgroundColor: condition === "Roll Over" ? '#e11d48' : '#10b981', // Rose if Over (left is bad), Emerald if Under (left is good)
             }}
           />
           <div 
             className="absolute h-full rounded-full transition-all duration-200 pointer-events-none"
             style={{
               left: condition === "Roll Over" ? `${targetValue}%` : `${targetValue}%`,
               width: condition === "Roll Over" ? `${100 - targetValue}%` : `${100 - targetValue}%`,
               backgroundColor: condition === "Roll Over" ? '#10b981' : '#e11d48', // Emerald if Over (right is good), Rose if Under (right is bad)
             }}
           />
           
           {/* Draggable Slider */}
           <input
             type="range"
             min="0.01"
             max="99.99"
             step="0.01"
             value={sliderValue}
             onChange={handleSliderChange}
             disabled={isRolling}
             className="absolute w-full h-full opacity-0 cursor-ew-resize z-30 disabled:cursor-not-allowed"
           />

           {/* Thumb visual */}
           <div 
             className="absolute w-8 h-6 sm:w-10 sm:h-7 bg-slate-50 rounded shadow-lg border border-slate-300 pointer-events-none z-20 flex items-center justify-center -ml-4 sm:-ml-5 transition-none"
             style={{ left: `${sliderValue}%` }}
           >
             <div className="flex gap-1">
               <div className="w-0.5 h-3 bg-slate-300 rounded-full" />
               <div className="w-0.5 h-3 bg-slate-300 rounded-full" />
             </div>
           </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-4 text-xs sm:text-sm font-bold text-slate-500">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* Controls Container */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
        
        {/* Multiplier Input */}
        <div className="space-y-1.5">
          <Label className="text-slate-400 text-xs sm:text-sm font-medium">Multiplier</Label>
          <div className="relative">
            <Input
              type="number"
              value={multiplier}
              onChange={(e) => updateMultiplier(parseFloat(e.target.value))}
              disabled={isRolling}
              className="bg-slate-950 border-slate-800 text-slate-100 font-bold h-10 sm:h-12"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">x</div>
          </div>
        </div>

        {/* Roll Under/Over Toggle */}
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <Label className="text-slate-400 text-xs sm:text-sm font-medium opacity-0 hidden md:block">Swap</Label>
          <Button
            variant="outline"
            onClick={() => setCondition(condition === "Roll Over" ? "Roll Under" : "Roll Over")}
            disabled={isRolling}
            className="w-full h-10 sm:h-12 bg-slate-800 border-slate-700 text-slate-100 font-bold hover:bg-slate-700 hover:text-white flex items-center justify-center gap-2"
          >
            {condition} <RefreshCcw className="w-4 h-4 text-slate-400" />
          </Button>
        </div>

        {/* Win Chance Input */}
        <div className="space-y-1.5">
          <Label className="text-slate-400 text-xs sm:text-sm font-medium">Win Chance</Label>
          <div className="relative">
            <Input
              type="number"
              value={winChance}
              onChange={(e) => updateWinChance(parseFloat(e.target.value))}
              disabled={isRolling}
              className="bg-slate-950 border-slate-800 text-slate-100 font-bold h-10 sm:h-12"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</div>
          </div>
        </div>

      </div>

      {winStatus && !isRolling && (
        <WinBanner 
          multiplier={multiplier} 
          winAmount={parseFloat(betAmount) * multiplier} 
        />
      )}
    </div>
  );
}
