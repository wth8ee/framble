"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { Dispatch, SetStateAction } from "react";
import { LiveStatsWindow } from "@/components/LiveStatsWindow";
import { useSession } from "@/lib/auth-client";
import { syncBalance } from "@/app/actions/syncBalance";
import { pusherClient } from "@/lib/pusher-client";

interface BalanceContextType {
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>;
  balanceStats: number[];
  setBalanceStats: Dispatch<SetStateAction<number[]>>;
  isStatsOpen: boolean;
  setIsStatsOpen: (state: boolean) => void;
  recordGameResult: (newBalance: number, game: string, payout: number, multiplier: number) => void;
  winGame: (winAmount: number, game: string, multiplier: number) => void;
}

const BalanceContext = createContext<BalanceContextType>(
  {} as BalanceContextType,
);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [balance, setBalanceState] = useState(0);
  const [balanceStats, setBalanceStats] = useState<number[]>([]);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if ((session?.user as any)?.balance !== undefined && !initialized.current) {
      setBalanceState((session?.user as any).balance);
      initialized.current = true;
    }

    if ((session?.user as any)?.id) {
      const channel = pusherClient.subscribe(`user-${(session.user as any).id}`);
      channel.bind("balance-update", (data: { balance: number }) => {
        setBalanceState(data.balance);
      });
      return () => {
        pusherClient.unsubscribe(`user-${(session.user as any).id}`);
      };
    }
  }, [session]);

  const setBalance: Dispatch<SetStateAction<number>> = (value) => {
    setBalanceState((prev) => {
      const newValue = typeof value === "function" ? value(prev) : value;
      if (initialized.current) {
        // Sync to server in the background
        setTimeout(() => {
          syncBalance(newValue).catch(console.error);
        }, 0);
      }
      return newValue;
    });
  };

  const recordGameResult = (newBalance: number, game: string, payout: number, multiplier: number) => {
    setBalanceState(newBalance);
    if (initialized.current) {
      syncBalance(newBalance, { game, payout, multiplier }).catch(console.error);
    }
  };

  const winGame = (winAmount: number, game: string, multiplier: number) => {
    setBalanceState(prev => {
      const newBalance = prev + winAmount;
      if (initialized.current) {
        setTimeout(() => {
          syncBalance(newBalance, { game, payout: winAmount, multiplier }).catch(console.error);
        }, 0);
      }
      return newBalance;
    });
  };

  return (
    <BalanceContext.Provider
      value={{
        balance,
        setBalance,
        balanceStats,
        setBalanceStats,
        isStatsOpen,
        setIsStatsOpen,
        recordGameResult,
        winGame,
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
