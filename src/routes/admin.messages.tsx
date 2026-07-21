import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Msg = Database["public"]["Tables"]["contact_messages"]["Row"];

export const Route = createFileRoute("/admin/messages")({ component: AdminMessages });

function AdminMessages() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  async function load() {
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setMsgs(data ?? []);
  }
  useEffect(() => { load(); }, []);
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Contact messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">{msgs.length} total</p>
      <div className="mt-6 space-y-3">
        {msgs.map((m) => (
          <div key={m.id} className="glass p-5">
            <div className="flex items-start justify-between gap-3">
              <div><div className="font-semibold">{m.name}</div><a href={`mailto:${m.email}`} className="text-xs text-muted-foreground hover:text-white">{m.email}</a></div>
              <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span><button onClick={() => remove(m.id)} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"><Trash2 className="h-3.5 w-3.5" /></button></div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/80">{m.message}</p>
          </div>
        ))}
        {msgs.length === 0 && (<div className="glass px-6 py-10 text-center text-sm text-muted-foreground">No messages.</div>)}
      </div>
    </div>
  );
}