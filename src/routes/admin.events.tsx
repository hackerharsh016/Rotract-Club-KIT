import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

export const Route = createFileRoute("/admin/events")({ component: AdminEvents });

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

function AdminEvents() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [creating, setCreating] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("starts_at", { ascending: false });
    if (error) return toast.error(error.message);
    setEvents(data ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return;
    setCreating(true);
    const payload = {
      title,
      slug: slugify(title) + "-" + Math.random().toString(36).slice(2, 6),
      description: String(fd.get("description") ?? "").trim(),
      venue: String(fd.get("venue") ?? "").trim() || null,
      category: String(fd.get("category") ?? "").trim() || null,
      starts_at: new Date(String(fd.get("starts_at"))).toISOString(),
      ends_at: fd.get("ends_at") ? new Date(String(fd.get("ends_at"))).toISOString() : null,
      max_seats: Number(fd.get("max_seats") ?? 100),
      cover_url: String(fd.get("cover_url") ?? "").trim() || null,
      is_open: true,
    };
    const { error } = await supabase.from("events").insert(payload);
    setCreating(false);
    if (error) return toast.error(error.message);
    form.reset();
    toast.success("Event created");
    load();
  }

  async function toggleOpen(ev: EventRow) {
    const { error } = await supabase
      .from("events")
      .update({ is_open: !ev.is_open })
      .eq("id", ev.id);
    if (error) return toast.error(error.message);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this event and all its registrations?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create and manage club events.</p>
      </div>

      <form onSubmit={onCreate} className="glass grid gap-3 p-6 md:grid-cols-2">
        <div className="md:col-span-2 flex items-center gap-2 text-sm font-semibold">
          <Plus className="h-4 w-4" /> New event
        </div>
        <Field label="Title" name="title" required />
        <Field label="Category" name="category" placeholder="Workshop, Drive, Social..." />
        <Field label="Starts at" name="starts_at" type="datetime-local" required />
        <Field label="Ends at (optional)" name="ends_at" type="datetime-local" />
        <Field label="Venue" name="venue" />
        <Field label="Max seats" name="max_seats" type="number" defaultValue="100" required />
        <Field label="Cover image URL" name="cover_url" placeholder="https://…" />
        <label className="grid gap-1.5 md:col-span-2">
          <span className="text-xs text-muted-foreground">Description</span>
          <textarea
            name="description"
            rows={4}
            className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand-cranberry-hex)]"
          />
        </label>
        <div className="md:col-span-2">
          <button
            disabled={creating}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
            style={{ background: "var(--gradient-brand)" }}
          >
            {creating ? "Creating…" : "Create event"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.id} className="glass flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{e.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(e.starts_at).toLocaleString()} · {e.venue ?? "—"}
              </div>
            </div>
            <button
              onClick={() => toggleOpen(e)}
              className={`rounded-full px-3 py-1 text-xs ${
                e.is_open ? "text-white" : "bg-muted text-muted-foreground"
              }`}
              style={e.is_open ? { background: "var(--gradient-brand)" } : undefined}
            >
              {e.is_open ? "Open" : "Closed"}
            </button>
            <button
              onClick={() => remove(e.id)}
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {events.length === 0 && (
          <div className="glass px-6 py-10 text-center text-sm text-muted-foreground">
            No events yet.
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        {...rest}
        className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand-cranberry-hex)]"
      />
    </label>
  );
}