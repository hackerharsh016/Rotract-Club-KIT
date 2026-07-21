import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import type { EventRow } from "@/lib/query-options";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventCard({ event }: { event: EventRow }) {
  return (
    <Link
      to="/events/$slug"
      params={{ slug: event.slug }}
      className="group glass block overflow-hidden transition hover:-translate-y-0.5 hover:bg-muted"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {event.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.cover_url}
            alt={event.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-brand-soft)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {event.category ? (
          <span className="absolute left-4 top-4 rounded-full border border-border bg-background/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-foreground/90 backdrop-blur">
            {event.category}
          </span>
        ) : null}
        <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold leading-tight">{event.title}</h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {fmtDate(event.starts_at)}
          </span>
          {event.venue ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {event.venue}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
