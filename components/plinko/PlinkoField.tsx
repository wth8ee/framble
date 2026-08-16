"use client";

import { useEffect, useRef } from "react";
import { PlinkoBall, RecentWin } from "@/hooks/usePlinko";
import { RiskLevel, plinkoMultipliers } from "@/lib/plinko/multipliers";
import { playSound as playAudioFile } from "@/lib/playSound";

interface PlinkoFieldProps {
  rows: number;
  risk: RiskLevel;
  balls: PlinkoBall[];
  recentWins: RecentWin[];
  onBallLand: (ballId: string, multiplier: number, betAmount: number) => void;
}

let audioCtx: AudioContext | null = null;
const playSound = (type: 'bounce' | 'win', mult?: number) => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'bounce') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + Math.random() * 50, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'win') {
      if (mult && mult <= 1) {
        osc.type = 'triangle';
        const safeMult = Math.min(mult || 1, 100);
        const baseFreq = 300 + safeMult * 10;
        osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else {
        playAudioFile("diamond.ogg");
      }
    }
  } catch (e) {}
};

export function PlinkoField({ rows, risk, balls, recentWins, onBallLand }: PlinkoFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const ballsRef = useRef(balls);
  const onBallLandRef = useRef(onBallLand);
  
  const ballRowMap = useRef<Map<string, number>>(new Map());
  const ripplesRef = useRef<{x: number, y: number, startTime: number}[]>([]);
  
  const binHitMap = useRef<Set<string>>(new Set());
  const binEffectsRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    ballsRef.current = balls;
    onBallLandRef.current = onBallLand;
    
    const currentBallIds = new Set(balls.map(b => b.id));
    for (const id of ballRowMap.current.keys()) {
      if (!currentBallIds.has(id)) {
        ballRowMap.current.delete(id);
        binHitMap.current.delete(id);
      }
    }
  }, [balls, onBallLand]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const width = rect.width;
      const height = rect.height;
      
      const pinRadius = 4.5;
      const ballRadius = 8;
      const bottomSpace = 80; 
      const topSpace = 180; // MUCH larger gap for recent wins!
      
      const pinSpacingY = (height - bottomSpace - topSpace) / rows;
      const maxPinsInRow = rows + 2; 
      const pinSpacingX = Math.min(pinSpacingY * 1.5, width / maxPinsInRow);

      const getPinPos = (row: number, col: number) => {
        const y = topSpace + row * pinSpacingY;
        const x = width / 2 + (col - row / 2) * pinSpacingX;
        return { x, y };
      };

      // Draw pins
      ctx.fillStyle = "#cbd5e1"; 
      for (let r = 0; r < rows; r++) {
        for (let c = -1; c <= r + 1; c++) {
          const { x, y } = getPinPos(r, c);
          ctx.beginPath();
          ctx.arc(x, y, pinRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const now = Date.now();

      // Draw ripples
      const rippleDuration = 400;
      ripplesRef.current = ripplesRef.current.filter(r => now - r.startTime < rippleDuration);
      ripplesRef.current.forEach(r => {
        const p = (now - r.startTime) / rippleDuration;
        ctx.beginPath();
        ctx.arc(r.x, r.y, pinRadius + p * 20, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * (1 - p)})`;
        ctx.fill();
      });

      const binWidth = pinSpacingX * 0.94;
      const binHeight = 36;
      const multipliers = plinkoMultipliers[risk][rows];

      const dropTimeMs = 350; 
      
      ballsRef.current.forEach((ball) => {
        const elapsed = now - ball.startTime;
        const totalTime = (rows + 1) * dropTimeMs;
        
        if (elapsed > totalTime) {
          const { x, y } = getPinPos(rows, ball.binIndex);
          
          if (!binHitMap.current.has(ball.id)) {
            binHitMap.current.add(ball.id);
            binEffectsRef.current.set(ball.binIndex, now);
            playSound('win', ball.multiplier);
          }
          
          if (elapsed < totalTime + 150) {
            ctx.beginPath();
            ctx.arc(x, y + binHeight / 2, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#10b981"; 
            ctx.shadowColor = "#10b981";
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          
          if (elapsed > totalTime + 150) { 
            onBallLandRef.current(ball.id, ball.multiplier, ball.betAmount);
          }
          return;
        }
        
        const r = Math.floor(elapsed / dropTimeMs) - 1;
        const p = (elapsed % dropTimeMs) / dropTimeMs;
        
        let startPos, endPos, bounceHeight;
        
        if (r === -1) {
          const topPin = getPinPos(0, 0);
          startPos = { x: topPin.x, y: topPin.y - 120 }; // Starts WAY above the first pin
          endPos = { ...topPin };
          bounceHeight = 0;
        } else {
          let c = 0;
          for (let i = 0; i < r; i++) {
            if (ball.path[i] === 1) c++;
          }
          const nextC = c + (ball.path[r] === 1 ? 1 : 0);
          startPos = getPinPos(r, c);
          endPos = getPinPos(r + 1, nextC);
          bounceHeight = pinSpacingY * 0.5;

          if (ballRowMap.current.get(ball.id) !== r) {
            playSound('bounce');
            ballRowMap.current.set(ball.id, r);
            ripplesRef.current.push({ x: startPos.x, y: startPos.y, startTime: now });
          }
        }
        
        const x = startPos.x + (endPos.x - startPos.x) * p;
        let y = startPos.y + (endPos.y - startPos.y) * p;
        
        if (bounceHeight > 0) {
          y -= Math.sin(p * Math.PI) * bounceHeight;
        } else {
          // Quadratic ease-in for realistic falling gravity
          y = startPos.y + (endPos.y - startPos.y) * (p * p);
        }
        
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#10b981"; 
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      for (let c = 0; c <= rows; c++) {
        const { x, y } = getPinPos(rows, c);
        const m = multipliers[c];
        
        let color = "#ef4444"; 
        if (m <= 1) color = "#eab308"; 
        else if (m <= 5) color = "#f97316"; 
        
        const effectTime = now - (binEffectsRef.current.get(c) || 0);
        const isHit = effectTime < 300;
        let currentBinY = y - 4;
        
        if (isHit) {
           const ep = effectTime / 300;
           // Bin is pressed down and bounces back
           currentBinY += Math.sin(ep * Math.PI) * 6;
        }
        
        const binX = x - binWidth / 2;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(binX, currentBinY, binWidth, binHeight, 6);
        ctx.fill();
        
        if (isHit) {
           ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * Math.sin((effectTime / 300) * Math.PI)})`;
           ctx.beginPath();
           ctx.roundRect(binX, currentBinY, binWidth, binHeight, 6);
           ctx.fill();
        }
        
        ctx.fillStyle = "#0f172a"; 
        ctx.font = "900 13px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${m}x`, x, currentBinY + binHeight / 2);
      }
      
      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rows, risk]);

  return (
    <div className="md:col-span-8 order-1 md:order-2 bg-slate-950/60 border border-slate-900 rounded-lg p-4 flex flex-col relative min-h-[500px] h-[75vh]">
      <div 
        className="absolute top-6 right-6 z-10 overflow-hidden max-w-[calc(100%-3rem)]"
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%)', maskImage: 'linear-gradient(to right, transparent, black 15%)' }}
      >
        <div className="flex gap-2 justify-end items-center">
          {recentWins.slice().reverse().map((win, i) => {
            let color = "bg-red-500 text-slate-950";
            if (win.multiplier <= 1) color = "bg-yellow-500 text-slate-950";
            else if (win.multiplier <= 5) color = "bg-orange-500 text-slate-950";
            
            return (
              <div 
                key={win.id + i} 
                className={`shrink-0 px-3 py-1.5 rounded-md font-bold text-sm shadow-lg animate-in fade-in zoom-in-75 ${color}`}
              >
                {win.multiplier.toFixed(2)}x
              </div>
            );
          })}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full block flex-1"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
