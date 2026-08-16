"use client";

import { WinBanner } from "../WinBanner";
import { ShieldCheck, HelpCircle } from "lucide-react";
import { CSSProperties } from "react";

interface WheelFieldProps {
  payouts: number[];
  rotation: number;
  isSpinning: boolean;
  winMultiplier: number | null;
  winSegmentIndex: number | null;
  betAmount: string;
  lastBet: string | null;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
}

const STAKE_COLORS = [
  "#2f4553", // 0x (gray)
  "#00e701", // green
  "#e2e8f0", // silver
  "#ffdf00", // yellow
  "#a855f7", // purple
  "#f97316", // orange
  "#ef4444", // red
  "#ec4899", // pink
  "#06b6d4"  // cyan
];

export function WheelField({
  payouts,
  rotation,
  isSpinning,
  winMultiplier,
  winSegmentIndex,
  betAmount,
  lastBet,
}: WheelFieldProps) {
  const segmentsCount = payouts.length;
  const sliceAngle = 360 / segmentsCount;
  const center = 220; // 220x220 canvas -> center at 220 => total 440px box
  
  const outerRingRadius = 190;
  const segmentsRadius = 170; 
  const innerRadius = 150; 
  
  const uniquePayouts = Array.from(new Set(payouts)).sort((a, b) => a - b);
  const getColor = (multiplier: number) => {
    const index = uniquePayouts.indexOf(multiplier);
    return STAKE_COLORS[Math.min(Math.max(0, index), STAKE_COLORS.length - 1)];
  };

  return (
    <div className="md:col-span-8 order-1 md:order-2 flex flex-col items-center justify-center p-2 sm:p-6 bg-slate-950/20 border border-slate-900/60 rounded-lg min-h-[350px] sm:min-h-[450px]">
      <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
        {winMultiplier !== null && winMultiplier > 0 && lastBet && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <WinBanner
              multiplier={winMultiplier}
              winAmount={Number(lastBet) * winMultiplier}
            />
          </div>
        )}

          <div className="relative w-full h-full flex items-center justify-center">
          {/* Pointer/Indicator at the top (Map Pin style) */}
          <div className="absolute top-0 z-10 -mt-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
              <circle cx="12" cy="9" r="2.5" fill="#ffffff" />
            </svg>
          </div>

          <div
            className="w-full h-full transition-transform duration-[3000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${center * 2} ${center * 2}`}
              className="drop-shadow-2xl"
            >
              <g className="drop-shadow-xl">
                {/* Outer decorative ring background */}
                <circle cx={center} cy={center} r={outerRingRadius} fill="#1e293b" />
                
                {payouts.map((multiplier, i) => {
                  const startAngle = i * sliceAngle;
                  const endAngle = (i + 1) * sliceAngle;
                  const color = getColor(multiplier);
                  const isWinningSegment = !isSpinning && winSegmentIndex === i;
                  const isDimmed = !isSpinning && winSegmentIndex !== null && !isWinningSegment;
                  
                  return (
                    <path
                      key={i}
                      d={describeArc(center, center, segmentsRadius, startAngle, endAngle)}
                      fill={color}
                      stroke={color}
                      strokeWidth="1"
                      className="transition-opacity duration-500 ease-out"
                      style={{ opacity: isDimmed ? 0.2 : 1 }}
                    />
                  );
                })}

                {/* Giant inner center circle to create the donut shape */}
                <circle cx={center} cy={center} r={innerRadius} fill="#0f172a" />
                
                {/* Additional inner decorative lines (like Stake) */}
                <circle cx={center} cy={center} r={65} fill="none" stroke="#ffffff" opacity="0.03" strokeWidth="1" />
                <circle cx={center} cy={center} r={55} fill="none" stroke="#ffffff" opacity="0.03" strokeWidth="1" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-2xl px-2">
        {uniquePayouts.map(multiplier => (
          <div 
            key={multiplier}
            className="flex-1 min-w-[70px] bg-[#1e293b] rounded flex items-center justify-center py-2.5 px-3 border-b-4 transition-transform hover:-translate-y-0.5"
            style={{ borderBottomColor: getColor(multiplier) }}
          >
            <span className="text-slate-100 font-bold text-xs sm:text-sm">
              {multiplier.toFixed(2)}x
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-6 text-[11px] font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Provably Fair
        </span>
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> Game Rules
        </span>
      </div>
    </div>
  );
}
