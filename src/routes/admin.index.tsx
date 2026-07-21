import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, MessageSquare, Image } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const [stats, setStats] = useState({ events: 0, regs: 0, messages: 0, images: 0 });

  useEffect(() => {
    (async () => {
      const [{ count: e }, { count: r }, { count: m }, { count: i }] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("registrations").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
      ]);
      setStats({ events: e ?? 0, regs: r ?? 0, messages: m ?? 0, images: i ?? 0 });
    })();
  }, []);

  const cards = [
    { label: "Events", value: stats.events, icon: Calendar },
    { label: "Registrations", value: stats.regs, icon: Users },
    { label: "Messages", value: stats.messages, icon: MessageSquare },
    { label: "Gallery images", value: stats.images, icon: Image },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">Snapshot of your club data.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {c.label}
              </span>
              <c.icon className="h-4 w-4 text-[color:var(--brand-gold-hex)]" />
            </div>
            <div className="mt-3 text-3xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}