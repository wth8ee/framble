"use client";

import { useState } from "react";
import { Rnd } from "react-rnd";
import { X, Move, BarChart2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface LiveStatsWindowProps {
  isOpen: boolean;
  onClose: () => void;
  balanceStats: number[];
}

export function LiveStatsWindow({
  isOpen,
  onClose,
  balanceStats,
}: LiveStatsWindowProps) {
  const [size, setSize] = useState({ width: 360, height: 340 });
  const [position, setPosition] = useState({ x: 100, y: 150 });

  if (!isOpen) return null;

  const chartData = balanceStats.map((val, index) => ({
    betIndex: `Bet ${index}`,
    profit: val,
  }));

  const latestProfit =
    balanceStats.length > 0 ? balanceStats[balanceStats.length - 1] : 0;

  const maxVal = Math.max(...balanceStats, 0);
  const minVal = Math.min(...balanceStats, 0);

  let zeroOffset = 0;
  if (maxVal !== minVal) {
    zeroOffset = (maxVal / (maxVal - minVal)) * 100;
  } else {
    zeroOffset = latestProfit >= 0 ? 100 : 0;
  }

  const roundedOffset = `${zeroOffset.toFixed(2)}%`;

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        setPosition(position);
      }}
      minWidth={360}
      minHeight={280}
      dragHandleClassName="window-drag-handle"
      bounds="window"
      className="z-50"
    >
      <div className="w-full h-full bg-slate-950/95 border border-slate-900 backdrop-blur-md rounded-xl shadow-2xl flex flex-col overflow-hidden select-none">
        <div className="window-drag-handle flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 cursor-move text-slate-400 hover:text-slate-200 transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <BarChart2 className="w-4 h-4" />
            <span>Live Stats</span>
          </div>
          <div className="flex items-center gap-1">
            <Move className="w-3.5 h-3.5 opacity-40 mr-1" />
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-md"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden bg-slate-950/40">
          {chartData.length <= 1 ? (
            <div className="flex-1 border border-dashed border-slate-900 rounded-lg flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
              <TrendingUp className="w-5 h-5 opacity-30" />
              <span className="font-medium tracking-wide uppercase text-[10px]">
                Place a bet to see stats
              </span>
            </div>
          ) : (
            <div className="flex-1 w-full h-full flex flex-col justify-between">
              <div className="flex-1 w-full min-h-45">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="splitColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset={roundedOffset}
                          stopColor="#10b981"
                          stopOpacity={1}
                        />
                        <stop
                          offset={roundedOffset}
                          stopColor="#f43f5e"
                          stopOpacity={1}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="betIndex" hide />
                    <YAxis
                      stroke="#475569"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const val = payload[0].value as number;
                          return (
                            <div className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xl">
                              <span
                                className={
                                  val >= 0
                                    ? "text-emerald-400"
                                    : "text-rose-500"
                                }
                              >
                                {val >= 0
                                  ? `+$${val.toFixed(2)}`
                                  : `-$${Math.abs(val).toFixed(2)}`}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <ReferenceLine
                      y={0}
                      stroke="#334155"
                      strokeDasharray="3 3"
                    />

                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="url(#splitColor)"
                      strokeWidth={2.5}
                      isAnimationActive={false}
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 1.5,
                        stroke: "#f8fafc",
                        fill: latestProfit >= 0 ? "#10b981" : "#f43f5e",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="border-t border-slate-900 pt-3 mt-2 flex justify-between items-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <span>Session Profit</span>
                <span
                  className={`font-bold ${latestProfit >= 0 ? "text-emerald-400" : "text-rose-500"}`}
                >
                  {latestProfit >= 0 ? "+" : ""}${latestProfit.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Rnd>
  );
}
