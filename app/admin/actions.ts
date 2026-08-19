"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher";

async function getAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function adjustBalance(userId: string, amount: number) {
  await getAdminSession();
  
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { balance: { increment: amount } }
  });
  
  try {
    await pusherServer.trigger(`user-${userId}`, "balance-update", {
      balance: updated.balance
    });
  } catch (e) {
    console.error("Failed to trigger pusher event", e);
  }
  
  revalidatePath("/admin");
}

export async function setRole(userId: string, role: string) {
  await getAdminSession();
  
  await prisma.user.update({
    where: { id: userId },
    data: { role }
  });
  
  revalidatePath("/admin");
}

export async function setExactBalance(userId: string, balance: number) {
  await getAdminSession();
  
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { balance }
  });
  
  try {
    await pusherServer.trigger(`user-${userId}`, "balance-update", {
      balance: updated.balance
    });
  } catch (e) {
    console.error("Failed to trigger pusher event", e);
  }
  
  revalidatePath("/admin");
}
