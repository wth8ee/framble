import { useState } from "react";
import { useBalance } from "@/context/balanceContext";
import { playWheelTicking, playWinSound } from "@/utils/sound";

export type Risk = "Low" | "Medium" | "High";
export type Segments = 10 | 20 | 30 | 40 | 50;

function getWheelPayouts(risk: Risk, segments: Segments): number[] {
  const basePatterns = {
    Low: [1.2, 1.5, 1.2, 1.0, 1.5, 0, 1.2, 1.5, 1.2, 1.7],
    Medium: [0, 1.5, 0, 1.7, 0, 2.0, 0, 3.0, 0, 4.0],
    High: [0, 0, 2.0, 0, 3.0, 0, 0, 4.0, 0, 5.0],
  };
  const pattern = basePatterns[risk];
  const result = [];
  for (let i = 0; i < segments; i++) {
    result.push(pattern[i % pattern.length]);
  }
  return result;
}

export function useWheel() {
  const { balance, setBalance, setBalanceStats, balanceStats } = useBalance();
  const [betAmount, setBetAmount] = useState<string>("1.00");
  const [risk, setRisk] = useState<Risk>("Medium");
  const [segments, setSegments] = useState<Segments>(20);

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winMultiplier, setWinMultiplier] = useState<number | null>(null);
  const [winSegmentIndex, setWinSegmentIndex] = useState<number | null>(null);
  const [lastBet, setLastBet] = useState<string | null>(null);

  const payouts = getWheelPayouts(risk, segments);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleBetBlur = () => {
    let val = parseFloat(betAmount);
    if (isNaN(val) || val < 0.1) val = 0.1;
    if (val > balance && balance >= 0.1) val = balance;
    setBetAmount(val.toFixed(2));
  };

  const spin = () => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0 || (bet > balance && betAmount !== balance.toFixed(2)) || isSpinning) return;

    setBalance((b) => b - bet);
    setLastBet(betAmount);
    setWinMultiplier(null);
    setWinSegmentIndex(null);
    setIsSpinning(true);

    const segmentIndex = Math.floor(Math.random() * segments);
    const sliceAngle = 360 / segments;
    const offsetInSlice = (Math.random() - 0.5) * (sliceAngle * 0.8);
    const targetSegmentAngle = 360 - (segmentIndex * sliceAngle + sliceAngle / 2) + offsetInSlice;

    const baseSpins = 1800;
    
    const currentRotMod = rotation % 360;
    let rotationToTarget = targetSegmentAngle - currentRotMod;
    if (rotationToTarget < 0) {
      rotationToTarget += 360;
    }

    const nextRotation = rotation + baseSpins + rotationToTarget;
    setRotation(nextRotation);
    
    // Play sounds
    playWheelTicking(3000);

    setTimeout(() => {
      setIsSpinning(false);
      const wonMultiplier = payouts[segmentIndex];
      setWinMultiplier(wonMultiplier);
      setWinSegmentIndex(segmentIndex);
      
      playWinSound(wonMultiplier);

      const winAmount = bet * wonMultiplier;
      if (winAmount > 0) {
        setBalance((b) => b + winAmount);
      }
      const profit = winAmount - bet;
      setBalanceStats((prev) => {
        const last = prev.length > 0 ? prev[prev.length - 1] : 0;
        return [...prev, last + profit];
      });
    }, 3000);
  };

  return {
    betAmount,
    setBetAmount,
    handleBetChange,
    handleBetBlur,
    risk,
    setRisk,
    segments,
    setSegments,
    isSpinning,
    rotation,
    winMultiplier,
    winSegmentIndex,
    lastBet,
    payouts,
    spin,
    balance
  };
}
