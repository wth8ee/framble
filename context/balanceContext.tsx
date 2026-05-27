"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const BalanceContext = createContext({
  balance: 1000,
  setBalance: (val: number) => {},
});

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(1000);
  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export const useBalance = () => useContext(BalanceContext);
