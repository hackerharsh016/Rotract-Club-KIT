import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Member = Database["public"]["Tables"]["team_members"]["Row"];

export const Route = createFileRoute("/admin/team")({ component: AdminTeam });

function AdminTeam() {
  const [team, setTeam] = useState<Member[]>([]);
  async function load() {
    const { data, error } = await supabase.from("team_members").select("*").order("display_order");
    if (error) return toast.error(error.message);
    setTeam(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const { error } = await supabase.from("team_members").insert({
      name: String(fd.get("name") ?? "").trim(),
      role: String(fd.get("role") ?? "").trim(),
      photo_url: String(fd.get("photo_url") ?? "").trim() || null,
      linkedin_url: String(fd.get("linkedin_url") ?? "").trim() || null,
      instagram_url: String(fd.get("instagram_url") ?? "").trim() || null,
      display_order: Number(fd.get("display_order") ?? 0),
    });
    if (error) return toast.error(error.message);
    form.reset(); load();
  }
  async function remove(id: string) {
    if (!confirm("Remove?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold">Team</h1></div>
      <form onSubmit={onAdd} className="glass grid gap-3 p-6 md:grid-cols-2">
        <div className="flex items-center gap-2 text-sm font-semibold md:col-span-2"><Plus className="h-4 w-4" /> Add member</div>
        {[
          ["name", "Name"], ["role", "Role"], ["photo_url", "Photo URL"],
          ["display_order", "Display order"], ["linkedin_url", "LinkedIn URL"], ["instagram_url", "Instagram URL"],
        ].map(([n, l]) => (
          <label key={n} className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">{l}</span>
            <input name={n} type={n === "display_order" ? "number" : "text"} defaultValue={n === "display_order" ? "0" : ""} className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand-cranberry-hex)]" />
          </label>
        ))}
        <div className="md:col-span-2"><button className="rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>Add member</button></div>
      </form>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m) => (
          <div key={m.id} className="glass flex items-center gap-3 p-4">
            {m.photo_url ? <img src={m.photo_url} alt={m.name} className="h-12 w-12 rounded-full object-cover" /> : <div className="grid h-12 w-12 place-items-center rounded-full text-sm font-bold text-white" style={{ background: "var(--gradient-brand)" }}>{m.name.charAt(0)}</div>}
            <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{m.name}</div><div className="truncate text-xs text-muted-foreground">{m.role}</div></div>
            <button onClick={() => remove(m.id)} className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}