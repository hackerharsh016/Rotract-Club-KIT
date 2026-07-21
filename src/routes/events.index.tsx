import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { allEventsQuery } from "@/lib/query-options";
import { EventCard } from "@/components/event-card";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events · Rotaract KIT Sunshine" },
      {
        name: "description",
        content:
          "Upcoming and past events by Rotaract Club of KIT Sunshine — workshops, community projects, and more.",
      },
      { property: "og:title", content: "Events · Rotaract KIT Sunshine" },
      {
        property: "og:description",
        content: "Workshops, community projects, and campus events.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(allEventsQuery),
  component: Events,
});

function Events() {
  const { data: events } = useSuspenseQuery(allEventsQuery);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const now = Date.now();
  const { upcoming, past } = useMemo(() => {
    const upcoming = events.filter((e) => new Date(e.starts_at).getTime() >= now);
    const past = events.filter((e) => new Date(e.starts_at).getTime() < now);
    return { upcoming, past };
  }, [events, now]);

  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-gold-hex)]">
        Events
      </div>
      <h1 className="mt-3 text-4xl font-bold md:text-6xl">
        Come <span className="text-gradient-brand">build with us</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Workshops, drives, and events run by the club — throughout the year.
      </p>

      <div className="mt-10 inline-flex rounded-full border border-border bg-muted/40 p-1">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm capitalize transition ${
              tab === t ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="glass mt-10 grid place-items-center px-6 py-20 text-center text-muted-foreground">
          No {tab} events right now.
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}