"use client";

import {
  getMinesCofficient,
  getNextCofficient,
} from "@/lib/mines/getMinesCoeficcient";
import { selectFromMany } from "@/lib/shared/selectFromMany";
import { playSound } from "@/lib/playSound";
import { useState } from "react";
import { useBalance } from "@/context/balanceContext";

export function useMines() {
  const { balance, setBalance, balanceStats, setBalanceStats } = useBalance();

  const [cells, setCells] = useState(Array(25).fill(null));
  const [bombs, setBombs] = useState<number[]>([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [bombsNumber, setBombsNumber] = useState(3);
  const [bet, setBet] = useState("1.00");
  const [lastBet, setLastBet] = useState<null | string>(null);

  const coefficient = getMinesCofficient(bombsNumber, cells);
  const nextCoefficient = getNextCofficient(bombsNumber, cells);

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

  function handleCellClick(index: number) {
    if (!cells[index] && gameRunning) {
      const newCells = cells.slice();
      if (bombs.includes(index)) {
        newCells[index] = "bomb";
        playSound("bomb.ogg");
        setGameRunning(false);
        const currentProfit =
          balanceStats.length > 0 ? balanceStats[balanceStats.length - 1] : 0;
        setBalanceStats([...balanceStats, currentProfit - Number(lastBet)]);
      } else {
        newCells[index] = "diamond";
        playSound("diamond.ogg");
      }
      setCells(newCells);
    }
  }

  function startGame() {
    if (Number(bet) <= balance || bet === balance.toFixed(2)) {
      setLastBet(bet);
      setBalance(balance - Number(bet));
      setCells(Array(25).fill(null));
      setGameRunning(true);
      const generatedBombs = selectFromMany(bombsNumber, 25);
      setBombs(generatedBombs);
      if (balanceStats.length === 0) {
        setBalanceStats([0]);
      }
    }
  }

  function cashOut() {
    setGameRunning(false);
    const win = parseFloat(bet) * coefficient;
    setBalance(balance + win);
    const profitFromThisRound = win - Number(lastBet);
    const previousProfit =
      balanceStats.length > 0 ? balanceStats[balanceStats.length - 1] : 0;
    setBalanceStats([...balanceStats, previousProfit + profitFromThisRound]);
  }

  return {
    cells,
    bombs,
    gameRunning,
    startGame,
    handleCellClick,
    setBombsNumber,
    bombsNumber,
    coefficient,
    nextCoefficient,
    bet,
    handleBetChange,
    handleBetBlur,
    setBet,
    cashOut,
    lastBet,
    balanceStats,
    balance,
  };
}
