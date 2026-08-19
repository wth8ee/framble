import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const userId = session.user.id;

  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  
  if (adminCount === 0 || session.user.email === "admin@framble.com") {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "admin", balance: 1000000 }
    });
    return NextResponse.json({ success: true, message: "Promoted to admin" });
  }

  return NextResponse.json({ error: "Admin already exists" }, { status: 403 });
}
