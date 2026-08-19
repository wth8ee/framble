import { useState, useEffect } from "react";
import { useBalance } from "@/context/balanceContext";
import { playTickSound, playWinSound } from "@/utils/sound";

export type DiceCondition = "Roll Over" | "Roll Under";

export function useDice() {
  const { balance, setBalance, setBalanceStats, winGame } = useBalance();
  const [betAmount, setBetAmount] = useState<string>("1.00");
  
  const [winChance, setWinChance] = useState<number>(50.00);
  const [multiplier, setMultiplier] = useState<number>(1.98);
  const [condition, setCondition] = useState<DiceCondition>("Roll Over");
  
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [winStatus, setWinStatus] = useState<boolean | null>(null);
  const [lastBet, setLastBet] = useState<string | null>(null);

  // Sync multiplier and win chance
  const updateWinChance = (newChance: number) => {
    const clamped = Math.max(0.01, Math.min(98.00, newChance));
    setWinChance(clamped);
    setMultiplier(Number((99 / clamped).toFixed(4)));
  };

  const updateMultiplier = (newMult: number) => {
    const clamped = Math.max(1.0102, Math.min(9900, newMult)); // 99/98 to 99/0.01
    setMultiplier(clamped);
    setWinChance(Number((99 / clamped).toFixed(2)));
  };

  const targetValue = condition === "Roll Over" 
    ? (100.00 - winChance) 
    : winChance;

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleBetBlur = () => {
    let val = parseFloat(betAmount);
    if (isNaN(val) || val < 0.1) val = 0.1;
    if (val > balance && balance >= 0.1) val = balance;
    setBetAmount(val.toFixed(2));
  };

  const roll = () => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0 || (bet > balance && betAmount !== balance.toFixed(2)) || isRolling) return;

    setBalance((b) => b - bet);
    setLastBet(betAmount);
    // Generate result immediately so UI can animate towards it
    const rollValue = Number((Math.random() * 100).toFixed(2));
    setResult(rollValue);
    setWinStatus(null);
    setIsRolling(true);

    playTickSound();

    // Constant speed for the animation (e.g., 250 units per second)
    // Distance is from 0 to rollValue
    const speed = 250; 
    const duration = (rollValue / speed) * 1000;

    setTimeout(() => {
      setIsRolling(false);
      
      let isWin = false;
      if (condition === "Roll Over" && rollValue > targetValue) isWin = true;
      if (condition === "Roll Under" && rollValue < targetValue) isWin = true;

      setWinStatus(isWin);

      if (isWin) {
        const winAmount = bet * multiplier;
        winGame(winAmount, "Dice", multiplier);
        playWinSound(multiplier);
        
        const profit = winAmount - bet;
        setBalanceStats((prev) => {
          const last = prev.length > 0 ? prev[prev.length - 1] : 0;
          return [...prev, last + profit];
        });
      } else {
        playWinSound(0);
        setBalanceStats((prev) => {
          const last = prev.length > 0 ? prev[prev.length - 1] : 0;
          return [...prev, last - bet];
        });
      }
    }, duration);
  };

  return {
    betAmount,
    setBetAmount,
    handleBetChange,
    handleBetBlur,
    winChance,
    updateWinChance,
    multiplier,
    updateMultiplier,
    condition,
    setCondition,
    targetValue,
    isRolling,
    result,
    winStatus,
    lastBet,
    roll,
    balance
  };
}
