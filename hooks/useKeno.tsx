"use client";

import { useBalance } from "@/context/balanceContext";
import { kenoCoefficients } from "@/lib/keno/getKenoCoefficient";
import { playSound } from "@/lib/playSound";
import { selectFromMany } from "@/lib/shared/selectFromMany";
import { useEffect, useRef, useState } from "react";

export function useKeno() {
  const { balance, setBalance, balanceStats, setBalanceStats } = useBalance();

  const [cells, setCells] = useState(Array(25).fill(null));
  const [gameRunning, setGameRunning] = useState(false);
  const [risk, setRisk] = useState("classic");
  const [bet, setBet] = useState("1.00");
  const [lastBet, setLastBet] = useState<null | string>(null);
  const [userCells, setUserCells] = useState<number[]>([]);
  const [winCells, setWinCells] = useState<number[]>([]);
  const [missedCells, setMissedCells] = useState<number[]>([]);
  const [isWinBannerOpen, setIsWinBannerOpen] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(0);
  const [isAuto, setIsAuto] = useState(false);

  const isAutoRef = useRef(isAuto);
  useEffect(() => {
    isAutoRef.current = isAuto;
  }, [isAuto]);

  const handleCellClick = (i: number) => {
    if (!gameRunning) {
      if (winCells.length > 0 || missedCells.length > 0) {
        setWinCells([]);
        setMissedCells([]);
        setIsWinBannerOpen(false);
      }

      if (userCells.includes(i)) {
        setUserCells(userCells.filter((cell) => cell !== i));
      } else {
        setUserCells([...userCells, i]);
      }
    }
  };

  function handleBetChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value;

    val = val.replace(",", ".");

    setBet(val);
  }

  function handleBetBlur() {
    const num = parseFloat(bet);

    if (!bet || isNaN(num) || num < 1) {
      setBet("1.00");
      return;
    }

    if (num > 100_000) {
      setBet("100000.00");
      return;
    }

    setBet(num.toFixed(2));
  }

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function startAuto() {
    if (
      userCells.length >= 1 &&
      (balance >= Number(bet) || balance.toFixed(2) === bet)
    )
      while (balance >= Number(bet) && isAutoRef.current) {
        setGameRunning(true);
        startGame(50, true);
        await delay(1000);
      }
  }

  function stopAuto() {
    setIsAuto(false);
    setGameRunning(false);
  }

  const startGame = (time: number = 150, auto = false) => {
    if (
      userCells.length >= 1 &&
      (balance >= Number(bet) || balance.toFixed(2) === bet)
    ) {
      const balanceAfterBet = balance - Number(bet);
      const currentBet = Number(bet);
      setGameRunning(true);
      setIsWinBannerOpen(false);
      setLastBet(bet);
      setBalance((prev: number) => prev - Number(bet));
      setBalanceStats((prev) => (prev.length === 0 ? [0] : prev));
      const systemChosenIndexes = selectFromMany(10, 40);
      const systemChosen = systemChosenIndexes.map((index) => index + 1);
      for (let i = 1; i < 11; i++) {
        setTimeout(() => {
          const currentChosen = systemChosen.slice(0, i);
          const newWinCells: number[] = [];
          const newMissedCells: number[] = [];
          for (const cell of currentChosen) {
            if (userCells.includes(cell)) {
              newWinCells.push(cell);
            } else {
              newMissedCells.push(cell);
            }
          }
          setWinCells(newWinCells);
          setMissedCells(newMissedCells);

          const cell = systemChosen[i - 1];
          if (userCells.includes(cell)) {
            playSound("diamond.ogg");
          } else {
            playSound("bong.ogg");
          }
        }, time * i);
      }
      setTimeout(() => {
        if (!auto) {
          setGameRunning(false);
        }
        const finalHits = systemChosen.filter((cell) =>
          userCells.includes(cell),
        ).length;
        const multipliers =
          ((kenoCoefficients as any)[risk]?.[userCells.length] as number[]) ||
          [];

        const finalMultiplier = multipliers[finalHits] || 0;

        if (finalMultiplier > 0) {
          setCurrentMultiplier(finalMultiplier);
          setIsWinBannerOpen(true);
          const win = Number(currentBet) * finalMultiplier;
          setBalance((prev) => prev + win);
          const profitFromThisRound = win - Number(currentBet);
          setBalanceStats((prev) => {
            const previousProfit = prev.length > 0 ? prev[prev.length - 1] : 0;
            return [...prev, previousProfit + profitFromThisRound];
          });
        } else {
          setBalanceStats((prev) => {
            const currentProfit = prev.length > 0 ? prev[prev.length - 1] : 0;
            return [...prev, currentProfit - currentBet];
          });
        }
      }, time * 10);
    }
  };

  function clearTable() {
    setUserCells([]);
    setMissedCells([]);
    setWinCells([]);
    setIsWinBannerOpen(false);
  }

  return {
    cells,
    gameRunning,
    risk,
    setRisk,
    bet,
    setBet,
    lastBet,
    userCells,
    handleCellClick,
    winCells,
    startGame,
    missedCells,
    handleBetBlur,
    handleBetChange,
    currentMultiplier,
    isWinBannerOpen,
    setIsWinBannerOpen,
    clearTable,
    balanceStats,
    balance,
    isAuto,
    setIsAuto,
    startAuto,
    stopAuto,
  };
}
