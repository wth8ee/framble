import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adjustBalance, setRole, setExactBalance } from "./actions";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { balance: "desc" },
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-50 p-8">
      <div className="max-w-6xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-black text-slate-50 mb-8">Admin Dashboard</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4 font-mono font-bold text-emerald-400">${u.balance.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === "admin" ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-400"}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <form action={async () => {
                      "use server";
                      await adjustBalance(u.id, 1000);
                    }}>
                      <Button size="sm" type="submit" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                        + $1000
                      </Button>
                    </form>
                    <form action={async () => {
                      "use server";
                      await adjustBalance(u.id, -1000);
                    }}>
                      <Button size="sm" type="submit" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                        - $1000
                      </Button>
                    </form>
                    <form action={async () => {
                      "use server";
                      await setRole(u.id, u.role === "admin" ? "user" : "admin");
                    }}>
                      <Button size="sm" type="submit" className="bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
                        Toggle Admin
                      </Button>
                    </form>
                    <form action={async (formData) => {
                      "use server";
                      const balanceStr = formData.get("balance") as string;
                      const balance = parseFloat(balanceStr.replace(',', '.'));
                      if (!isNaN(balance)) await setExactBalance(u.id, balance);
                    }} className="flex items-center gap-1 ml-4 border-l border-slate-700 pl-4">
                      <input 
                        type="text" 
                        inputMode="decimal"
                        name="balance" 
                        defaultValue={u.balance} 
                        className="w-20 px-2 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200" 
                      />
                      <Button size="sm" type="submit" className="h-7 text-xs bg-slate-800 text-slate-200 hover:bg-slate-700">
                        Set
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
