import { useState, useEffect, useRef, useCallback } from "react";
import { useBalance } from "@/context/balanceContext";
import { playWinSound } from "@/utils/sound";

export type CrashGameState = "idle" | "playing" | "crashed";

export function useCrash() {
  const { balance, setBalance, setBalanceStats } = useBalance();
  const [betAmount, setBetAmount] = useState<string>("1.00");
  const [autoCashout, setAutoCashout] = useState<string>("2.00");
  
  const [gameState, setGameState] = useState<CrashGameState>("idle");
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [crashPoint, setCrashPoint] = useState<number>(1.00);
  const [hasCashedOut, setHasCashedOut] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);

  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const crashPointRef = useRef<number>(1.00);
  const hasCashedOutRef = useRef<boolean>(false);
  const currentBetRef = useRef<number>(0);
  const autoCashoutRef = useRef<number>(0);
  const currentMultiplierRef = useRef<number>(1.00);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleBetBlur = () => {
    let val = parseFloat(betAmount);
    if (isNaN(val) || val < 0.1) val = 0.1;
    if (val > balance && balance >= 0.1) val = balance;
    setBetAmount(val.toFixed(2));
  };

  const handleAutoCashoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoCashout(e.target.value);
  };

  const handleAutoCashoutBlur = () => {
    let val = parseFloat(autoCashout);
    if (isNaN(val) || val <= 1.01) val = 1.01;
    setAutoCashout(val.toFixed(2));
  };

  const cashOut = useCallback(() => {
    if (hasCashedOutRef.current || gameState !== "playing") return;

    hasCashedOutRef.current = true;
    setHasCashedOut(true);
    
    const currentMult = currentMultiplierRef.current;
    const won = currentBetRef.current * currentMult;
    setWinAmount(won);
    setBalance((b) => b + won);
    playWinSound(currentMult);
    
    setBalanceStats((prev) => {
      const last = prev.length > 0 ? prev[prev.length - 1] : 0;
      return [...prev, last + (won - currentBetRef.current)];
    });
  }, [gameState, setBalance, setBalanceStats]);

  const startGame = useCallback(() => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0 || bet > balance) return;

    setBalance((b) => b - bet);
    currentBetRef.current = bet;
    
    let ac = parseFloat(autoCashout);
    if (isNaN(ac) || ac < 1.01) ac = 1000000;
    autoCashoutRef.current = ac;

    // Generate crash point
    // 1% chance to crash at 1.00 instantly
    // Otherwise standard formula: 0.99 / random
    const isInstantCrash = Math.random() < 0.01;
    const generatedCrash = isInstantCrash 
      ? 1.00 
      : Math.max(1.00, Math.floor((0.99 / Math.random()) * 100) / 100);
      
    crashPointRef.current = generatedCrash;
    setCrashPoint(generatedCrash);
    
    setGameState("playing");
    setMultiplier(1.00);
    setHasCashedOut(false);
    hasCashedOutRef.current = false;
    setWinAmount(0);
    
    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      // Exponential growth: 1.00 * e^(0.06 * time)
      const currentMult = Math.max(1.00, Math.exp(0.06 * (elapsed / 1000)));
      
      if (currentMult >= crashPointRef.current) {
        // Crash
        currentMultiplierRef.current = crashPointRef.current;
        setMultiplier(crashPointRef.current);
        setGameState("crashed");
        
        setHistory((prev) => [crashPointRef.current, ...prev].slice(0, 15));

        if (!hasCashedOutRef.current) {
          playWinSound(0); // Loss sound
          setBalanceStats((prev) => {
            const last = prev.length > 0 ? prev[prev.length - 1] : 0;
            return [...prev, last - currentBetRef.current];
          });
        }
        cancelAnimationFrame(animationRef.current);
        return;
      }

      currentMultiplierRef.current = currentMult;
      setMultiplier(currentMult);

      // Auto cashout check
      if (!hasCashedOutRef.current && currentMult >= autoCashoutRef.current) {
        cashOut();
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
  }, [betAmount, autoCashout, balance, setBalance, setBalanceStats, cashOut]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return {
    betAmount,
    setBetAmount,
    handleBetChange,
    handleBetBlur,
    autoCashout,
    setAutoCashout,
    handleAutoCashoutChange,
    handleAutoCashoutBlur,
    gameState,
    multiplier,
    crashPoint,
    hasCashedOut,
    winAmount,
    history,
    startGame,
    cashOut,
    balance
  };
}
