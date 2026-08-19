import { useState, useEffect } from "react";
import { useBalance } from "@/context/balanceContext";
import { playWheelTicking, playWinSound } from "@/utils/sound";

export type RouletteColor = "red" | "black" | "green";

export const NUMBERS = 15; // 0 to 14 (0 is Green, 1-7 Red, 8-14 Black)

export function getNumberColor(num: number): RouletteColor {
  if (num === 0) return "green";
  if (num >= 1 && num <= 7) return "red";
  return "black";
}

export function useRoulette() {
  const { balance, setBalance, setBalanceStats, winGame } = useBalance();
  const [betAmount, setBetAmount] = useState<string>("1.00");
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [lastWinMultiplier, setLastWinMultiplier] = useState<number | null>(null);
  const [track, setTrack] = useState<number[]>([]);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [lastBetColor, setLastBetColor] = useState<RouletteColor | null>(null);

  useEffect(() => {
    // Generate initial track for visual appeal before playing
    const initialTrack = Array.from({ length: 60 }, () => Math.floor(Math.random() * NUMBERS));
    setTrack(initialTrack);
  }, []);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleBetBlur = () => {
    let val = parseFloat(betAmount);
    if (isNaN(val) || val < 0.1) val = 0.1;
    if (val > balance && balance >= 0.1) val = balance;
    setBetAmount(val.toFixed(2));
  };

  const spin = (selectedColor: RouletteColor) => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0 || (bet > balance && betAmount !== balance.toFixed(2)) || isSpinning) return;

    setBalance((b) => b - bet);
    setIsSpinning(true);
    setLastWinMultiplier(null);
    setLastBetColor(selectedColor);

    // Random winner
    const winningNumber = Math.floor(Math.random() * NUMBERS);
    
    // We will build a track. The center is usually the winner.
    // Let's create an array where the winner is at index 50
    const newTrack = Array.from({ length: 50 }, () => Math.floor(Math.random() * NUMBERS));
    newTrack.push(winningNumber); // index 50
    newTrack.push(...Array.from({ length: 15 }, () => Math.floor(Math.random() * NUMBERS))); // padding after
    
    setTrack(newTrack);
    setTargetNumber(winningNumber);

    playWheelTicking(4000);

    setTimeout(() => {
      setIsSpinning(false);
      
      const winningColor = getNumberColor(winningNumber);
      let multiplier = 0;
      
      if (selectedColor === winningColor) {
        multiplier = winningColor === "green" ? 14 : 2;
      }
      
      setLastWinMultiplier(multiplier);
      setHistory(prev => [winningNumber, ...prev].slice(0, 10));
      
      playWinSound(multiplier);

      if (multiplier > 0) {
        const winAmount = bet * multiplier;
        winGame(winAmount, "Roulette", multiplier);
        const profit = winAmount - bet;
        setBalanceStats(prev => [...prev, (prev.length > 0 ? prev[prev.length - 1] : 0) + profit]);
      } else {
        setBalanceStats(prev => [...prev, (prev.length > 0 ? prev[prev.length - 1] : 0) - bet]);
      }
    }, 4500); // 4.5s animation total (including settling)
  };

  return {
    betAmount,
    setBetAmount,
    handleBetChange,
    handleBetBlur,
    isSpinning,
    track,
    targetNumber,
    lastWinMultiplier,
    lastBetColor,
    history,
    spin,
    balance
  };
}
