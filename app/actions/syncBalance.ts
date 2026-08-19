"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function syncBalance(newBalance: number, betData?: { game: string, payout: number, multiplier: number }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { balance: newBalance },
  });

  if (betData && betData.multiplier > 1) {
    await prisma.bet.create({
      data: {
        userId: session.user.id,
        game: betData.game,
        payout: betData.payout,
        multiplier: betData.multiplier,
      }
    });
  }
}
