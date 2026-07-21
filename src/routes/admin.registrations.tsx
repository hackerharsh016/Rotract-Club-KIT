import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Reg = Database["public"]["Tables"]["registrations"]["Row"] & { events: { title: string } | null };

export const Route = createFileRoute("/admin/registrations")({ component: AdminRegs });

function AdminRegs() {
  const [regs, setRegs] = useState<Reg[]>([]);
  const [q, setQ] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("registrations")
      .select("*, events(title)")
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setRegs((data ?? []) as Reg[]);
  }
  useEffect(() => { load(); }, []);

  async function toggleAttended(r: Reg) {
    const { error } = await supabase.from("registrations").update({ attended: !r.attended }).eq("id", r.id);
    if (error) return toast.error(error.message);
    load();
  }

  function exportCSV() {
    const header = ["Event", "Name", "Email", "Phone", "Dept", "Year", "Attended", "When"];
    const rows = regs.map((r) => [r.events?.title ?? "", r.name, r.email, r.phone, r.department, r.year, r.attended ? "yes" : "no", new Date(r.created_at).toISOString()]);
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = regs.filter((r) => (r.name + r.email + (r.events?.title ?? "")).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Registrations</h1>
          <p className="mt-1 text-sm text-muted-foreground">{regs.length} total</p>
        </div>
        <div className="flex gap-2">
          <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="rounded-full border border-border bg-muted/40 px-4 py-2 text-sm outline-none" />
          <button onClick={exportCSV} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted/40">Export CSV</button>
        </div>
      </div>
      <div className="glass mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Event</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Dept · Year</th><th className="px-4 py-3">Attended</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3">{r.events?.title ?? "—"}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.department} · {r.year}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleAttended(r)} className={`rounded-full px-3 py-1 text-xs ${r.attended ? "text-white" : "bg-muted text-muted-foreground"}`} style={r.attended ? { background: "var(--gradient-brand)" } : undefined}>{r.attended ? "Yes" : "No"}</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (<tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No registrations.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}