"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Dispatch, SetStateAction } from "react";
import { LiveStatsWindow } from "@/components/LiveStatsWindow";

interface BalanceContextType {
  balance: number;
  setBalance: (val: number) => void;
  balanceStats: number[];
  setBalanceStats: Dispatch<SetStateAction<number[]>>;
  isStatsOpen: boolean;
  setIsStatsOpen: (state: boolean) => void;
}

const BalanceContext = createContext<BalanceContextType>(
  {} as BalanceContextType,
);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(1000);
  const [balanceStats, setBalanceStats] = useState<number[]>([]);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  return (
    <BalanceContext.Provider
      value={{
        balance,
        setBalance,
        balanceStats,
        setBalanceStats,
        isStatsOpen,
        setIsStatsOpen,
      }}
    >
      {children}
      <LiveStatsWindow
        setBalanceStats={setBalanceStats}
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        balanceStats={balanceStats}
      />
    </BalanceContext.Provider>
  );
}

export const useBalance = () => useContext(BalanceContext);
