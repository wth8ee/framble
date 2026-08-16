import { useState, useCallback } from "react";
import { useBalance } from "@/context/balanceContext";
import { RiskLevel, plinkoMultipliers } from "@/lib/plinko/multipliers";

export type PlinkoBall = {
  id: string;
  path: number[]; // e.g. [-1, 1, -1, 1, 1...] where -1 is left, 1 is right
  binIndex: number;
  multiplier: number;
  betAmount: number;
  startTime: number;
};

export type RecentWin = {
  id: string;
  multiplier: number;
};

export function usePlinko() {
  const { balance, setBalance, setBalanceStats, balanceStats } = useBalance();
  const [bet, setBet] = useState("1.00");
  const [risk, setRisk] = useState<RiskLevel>("medium");
  const [rows, setRows] = useState(16);
  const [balls, setBalls] = useState<PlinkoBall[]>([]);
  const [recentWins, setRecentWins] = useState<RecentWin[]>([]);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBet(e.target.value);
  };

  const handleBetBlur = () => {
    const val = parseFloat(bet);
    if (isNaN(val) || val < 0.01) {
      setBet("0.01");
    } else {
      setBet(val.toFixed(2));
    }
  };

  const dropBall = useCallback(() => {
    const betNum = Number(bet);
    // Allow a small epsilon for floating point inaccuracies
    if (balance + 0.0001 < betNum || betNum <= 0) return;

    setBalance((b) => Math.max(0, b - betNum));
    
    // Calculate path (50/50 for each row)
    const path: number[] = [];
    let binIndex = 0;
    for (let i = 0; i < rows; i++) {
      const isRight = Math.random() > 0.5;
      path.push(isRight ? 1 : -1);
      if (isRight) binIndex++;
    }

    const multiplier = plinkoMultipliers[risk][rows][binIndex];
    
    const newBall: PlinkoBall = {
      id: Math.random().toString(36).substring(7) + Date.now(),
      path,
      binIndex,
      multiplier,
      betAmount: betNum,
      startTime: Date.now(),
    };

    setBalls((prev) => [...prev, newBall]);
  }, [balance, bet, rows, risk, setBalance]);

  const onBallLand = useCallback((ballId: string, multiplier: number, betAmount: number) => {
    // When ball finishes animation
    const winAmount = betAmount * multiplier;
    if (winAmount > 0) {
      setBalance((b) => b + winAmount);
    }
    // Record stat
    const profit = winAmount - betAmount;
    setBalanceStats((prev) => {
      const last = prev.length > 0 ? prev[prev.length - 1] : 0;
      return [...prev.slice(-49), last + profit];
    });
    
    // Add to recent wins
    setRecentWins((prev) => [{ id: ballId, multiplier }, ...prev].slice(0, 30));
    
    // Remove ball
    setBalls((prev) => prev.filter((b) => b.id !== ballId));
  }, [setBalance, setBalanceStats]);

  return {
    balance,
    bet,
    setBet,
    handleBetChange,
    handleBetBlur,
    risk,
    setRisk,
    rows,
    setRows,
    balls,
    recentWins,
    dropBall,
    onBallLand,
  };
}
