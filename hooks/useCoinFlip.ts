import { useState } from "react";
import { useBalance } from "@/context/balanceContext";
import { playTickSound, playWinSound } from "@/utils/sound";

export type CoinSide = "Heads" | "Tails";

export type CoinFlipHistoryItem = {
  id: string;
  side: CoinSide;
};

export function useCoinFlip() {
  const { balance, setBalance, setBalanceStats, winGame } = useBalance();
  const [betAmount, setBetAmount] = useState<string>("1.00");
  const [selectedSide, setSelectedSide] = useState<CoinSide>("Heads");
  
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<CoinSide | null>(null);
  const [winStatus, setWinStatus] = useState<boolean | null>(null);
  const [lastBet, setLastBet] = useState<string | null>(null);
  const [history, setHistory] = useState<CoinFlipHistoryItem[]>([]);

  const multiplier = 1.98; // 99% RTP

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleBetBlur = () => {
    let val = parseFloat(betAmount);
    if (isNaN(val) || val < 0.1) val = 0.1;
    if (val > balance && balance >= 0.1) val = balance;
    setBetAmount(val.toFixed(2));
  };

  const flip = () => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0 || (bet > balance && betAmount !== balance.toFixed(2)) || isFlipping) return;

    setBalance((b) => b - bet);
    setLastBet(betAmount);
    setResult(null);
    setWinStatus(null);
    setIsFlipping(true);

    playTickSound(); // initial spin sound

    // Decide result
    const isWin = Math.random() < 0.5;
    const finalSide: CoinSide = isWin ? selectedSide : (selectedSide === "Heads" ? "Tails" : "Heads");

    // Calculate rotation so it always spins forward
    const baseSpins = 1800; // 5 full spins
    const currentRotMod = rotation % 360;
    
    // We want the final rotation to be either 0 (Heads) or 180 (Tails) mod 360
    const targetAngle = finalSide === "Heads" ? 0 : 180;
    
    let rotationToTarget = targetAngle - currentRotMod;
    if (rotationToTarget <= 0) {
      rotationToTarget += 360;
    }
    
    setRotation(rotation + baseSpins + rotationToTarget);

    setTimeout(() => {
      setIsFlipping(false);
      setResult(finalSide);
      setWinStatus(isWin);
      
      setHistory(prev => [{ id: Math.random().toString(), side: finalSide }, ...prev].slice(0, 10));

      if (isWin) {
        const winAmount = bet * multiplier;
        winGame(winAmount, "Coin Flip", 2.0);
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
    }, 1500); // 1.5 seconds flip animation
  };

  return {
    betAmount,
    setBetAmount,
    handleBetChange,
    handleBetBlur,
    selectedSide,
    setSelectedSide,
    isFlipping,
    rotation,
    result,
    winStatus,
    lastBet,
    multiplier,
    history,
    flip,
    balance
  };
}
