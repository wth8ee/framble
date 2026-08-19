"use client";

import { useState } from "react";
import { useBalance } from "@/context/balanceContext";
import { playSound } from "@/lib/playSound";

function generateBombs(rows: number, cols: number, bombsPerRow: number) {
  const allBombs: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const rowBombs: number[] = [];
    while (rowBombs.length < bombsPerRow) {
      const rand = Math.floor(Math.random() * cols);
      if (!rowBombs.includes(rand)) {
        rowBombs.push(rand);
      }
    }
    allBombs.push(rowBombs);
  }
  return allBombs;
}

export function useTower() {
  const { balance, setBalance, balanceStats, setBalanceStats, winGame } = useBalance();

  const [minesNumber, setMinesNumber] = useState(1);
  const [bet, setBet] = useState("1.00");
  const [lastBet, setLastBet] = useState<null | string>(null);

  const [gameRunning, setGameRunning] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [activeRow, setActiveRow] = useState(0);
  
  const [gridCols, setGridColsState] = useState(5);

  function setGridCols(cols: number) {
    if (gameRunning) return;
    setGridColsState(cols);
    setCells(Array(9).fill(null).map(() => Array(cols).fill(null)));
    if (minesNumber >= cols) {
      setMinesNumber(cols - 1);
    }
  }

  // 9 rows, variable cols
  const [cells, setCells] = useState<string[][]>(
    Array(9).fill(null).map(() => Array(5).fill(null))
  );
  const [bombs, setBombs] = useState<number[][]>([]);

  // Calculate multiplier for current state
  // If activeRow is 0, multiplier is 1 (hasn't won anything yet)
  // If activeRow > 0, multiplier is calculated based on risk
  const getMultiplier = (row: number, mines: number, cols: number) => {
    if (row === 0) return 1.0;
    // House edge 4%
    const winProbPerRow = (cols - mines) / cols;
    const fairMult = Math.pow(1 / winProbPerRow, row);
    return fairMult * 0.96;
  };

  const getNextMultiplier = (row: number, mines: number, cols: number) => {
    if (row >= 9) return getMultiplier(row, mines, cols); // Max reached
    const winProbPerRow = (cols - mines) / cols;
    const fairMult = Math.pow(1 / winProbPerRow, row + 1);
    return fairMult * 0.96;
  };

  const coefficient = getMultiplier(activeRow, minesNumber, gridCols);
  const nextCoefficient = getNextMultiplier(activeRow, minesNumber, gridCols);

  function handleBetChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value.replace(",", ".");
    setBet(val);
  }

  function handleBetBlur() {
    const num = parseFloat(bet);
    if (!bet || isNaN(num) || num < 1) {
      setBet("1.00");
      return;
    }
    if (num > 100000) {
      setBet("100000.00");
      return;
    }
    setBet(num.toFixed(2));
  }

  function startGame() {
    if (Number(bet) <= balance || bet === balance.toFixed(2)) {
      setLastBet(bet);
      setBalance(balance - Number(bet));
      setCells(Array(9).fill(null).map(() => Array(gridCols).fill(null)));
      setActiveRow(0);
      setGameRunning(true);
      setGameEnded(false);
      setBombs(generateBombs(9, gridCols, minesNumber));
      if (balanceStats.length === 0) {
        setBalanceStats([0]);
      }
    }
  }

  function handleCellClick(rowIndex: number, colIndex: number) {
    if (!gameRunning || rowIndex !== activeRow) return;
    if (cells[rowIndex][colIndex]) return;

    const newCells = cells.map(row => [...row]);

    if (bombs[rowIndex].includes(colIndex)) {
      // Boom
      newCells[rowIndex][colIndex] = "bomb";
      playSound("bomb.ogg");
      setCells(newCells);
      setGameRunning(false);
      setGameEnded(true);
      
      const currentProfit = balanceStats.length > 0 ? balanceStats[balanceStats.length - 1] : 0;
      setBalanceStats([...balanceStats, currentProfit - Number(lastBet)]);
    } else {
      // Safe
      newCells[rowIndex][colIndex] = "diamond";
      playSound("diamond.ogg");
      setCells(newCells);
      
      if (rowIndex === 8) {
        // Won the top
        setActiveRow(9);
        cashOutTop(9, newCells);
      } else {
        setActiveRow(rowIndex + 1);
      }
    }
  }

  function cashOutTop(finalRow: number, currentCells: string[][]) {
    setGameRunning(false);
    setGameEnded(true);
    const win = parseFloat(lastBet!) * getMultiplier(finalRow, minesNumber, gridCols);
    winGame(win, "Tower", coefficient);
    const profitFromThisRound = win - Number(lastBet);
    const previousProfit = balanceStats.length > 0 ? balanceStats[balanceStats.length - 1] : 0;
    setBalanceStats([...balanceStats, previousProfit + profitFromThisRound]);
  }

  function cashOut() {
    if (!gameRunning || activeRow === 0) return;
    setGameRunning(false);
    setGameEnded(true);
    const win = parseFloat(lastBet!) * coefficient;
    winGame(win, "Tower", coefficient);
    const profitFromThisRound = win - Number(lastBet);
    const previousProfit = balanceStats.length > 0 ? balanceStats[balanceStats.length - 1] : 0;
    setBalanceStats([...balanceStats, previousProfit + profitFromThisRound]);
  }

  return {
    cells,
    bombs,
    gameRunning,
    gameEnded,
    activeRow,
    startGame,
    handleCellClick,
    minesNumber,
    setMinesNumber,
    gridCols,
    setGridCols,
    coefficient,
    nextCoefficient,
    bet,
    setBet,
    handleBetChange,
    handleBetBlur,
    cashOut,
    lastBet,
    balanceStats,
    balance,
  };
}
