"use client";

import { getCofficient, getNextCofficient } from "@/lib/mines/getCoeficcient";
import { selectFromMany } from "@/lib/mines/selectFromMany";
import { playSound } from "@/lib/playSound";
import { ChangeEvent, useState } from "react";

export function useMines() {
  const [cells, setCells] = useState(Array(25).fill(null));
  const [bombs, setBombs] = useState<number[]>([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [bombsNumber, setBombsNumber] = useState(3);
  const [bet, setBet] = useState("1.00");
  const [lastBet, setLastBet] = useState<null | string>(null);

  const coefficient = getCofficient(bombsNumber, cells);
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
      } else {
        newCells[index] = "diamond";
        playSound("diamond.ogg");
      }
      setCells(newCells);
    }
  }

  function startGame(balance: number, setBalance: (val: number) => void) {
    if (parseFloat(bet) <= balance) {
      setLastBet(bet);
      setBalance(balance - parseFloat(bet));
      setCells(Array(25).fill(null));
      setGameRunning(true);
      const generatedBombs = selectFromMany(bombsNumber, 25);
      setBombs(generatedBombs);
    }
  }

  function cashOut(balance: number, setBalance: (val: number) => void) {
    setGameRunning(false);
    const win = parseFloat(bet) * coefficient;
    setBalance(balance + win);
    playSound("cashout.ogg");
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
  };
}
