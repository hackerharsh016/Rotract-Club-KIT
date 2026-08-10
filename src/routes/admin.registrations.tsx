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
  const [eventFilter, setEventFilter] = useState("All");

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
    const rows = filtered.map((r) => [r.events?.title ?? "", r.name, r.email, r.phone, r.department, r.year, r.attended ? "yes" : "no", new Date(r.created_at).toISOString()]);
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const uniqueEvents = Array.from(new Set(regs.map((r) => r.events?.title).filter(Boolean))) as string[];

  const filtered = regs.filter((r) => {
    const matchesSearch = (r.name + r.email + (r.events?.title ?? "")).toLowerCase().includes(q.toLowerCase());
    const matchesEvent = eventFilter === "All" || (r.events?.title === eventFilter);
    return matchesSearch && matchesEvent;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Registrations</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} total</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="rounded-full border border-border bg-muted/40 px-4 py-2 text-sm outline-none focus:border-[color:var(--brand-gold-hex)]"
          >
            <option value="All">All Events</option>
            {uniqueEvents.map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
          <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="rounded-full border border-border bg-muted/40 px-4 py-2 text-sm outline-none focus:border-[color:var(--brand-gold-hex)]" />
          <button onClick={exportCSV} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted/40 transition-colors">Export CSV</button>
        </div>
      </div>
      <div className="glass mt-6 overflow-x-auto rounded-xl">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Event</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Dept · Year</th><th className="px-4 py-3">Attended</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3">{r.events?.title ?? "—"}</td>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.department} · {r.year}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleAttended(r)} className={`rounded-full px-3 py-1 text-xs transition-colors ${r.attended ? "text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`} style={r.attended ? { background: "var(--gradient-brand)" } : undefined}>{r.attended ? "Yes" : "No"}</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (<tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No registrations found.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}