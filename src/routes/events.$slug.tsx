import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Users, ArrowLeft, Trophy } from "lucide-react";
import { eventBySlugQuery, eventSeatCountQuery } from "@/lib/query-options";

export const Route = createFileRoute("/events/$slug")({
  head: ({ loaderData }) => {
    const ev = loaderData as
      | { title: string; description: string; cover_url: string | null }
      | undefined;
    if (!ev) return { meta: [{ title: "Event · Rotaract KIT Sunshine" }] };
    const desc = ev.description.slice(0, 155);
    return {
      meta: [
        { title: `${ev.title} · Rotaract KIT Sunshine` },
        { name: "description", content: desc },
        { property: "og:title", content: ev.title },
        { property: "og:description", content: desc },
        ...(ev.cover_url
          ? [
              { property: "og:image", content: ev.cover_url },
              { name: "twitter:image", content: ev.cover_url },
            ]
          : []),
      ],
    };
  },
  loader: async ({ context, params }) => {
    const event = await context.queryClient.ensureQueryData(eventBySlugQuery(params.slug));
    if (!event) throw notFound();
    return event;
  },
  component: EventDetail,
});

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventDetail() {
  const params = Route.useParams();
  const { data: event } = useSuspenseQuery(eventBySlugQuery(params.slug));
  const { data: registered } = useSuspenseQuery(eventSeatCountQuery(event!.id));

  if (!event) return null;
  const seatsLeft = Math.max(0, event.max_seats - registered);
  const soldOut = seatsLeft === 0;
  const closed = !event.is_open || soldOut;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All events
      </Link>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          {event.cover_url ? (
            <img src={event.cover_url} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: "var(--gradient-brand-soft)" }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            {event.category ? (
              <span className="inline-block rounded-full border border-border bg-background/40 px-3 py-1 text-[11px] uppercase tracking-wider text-foreground/90 backdrop-blur">
                {event.category}
              </span>
            ) : null}
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-12">
          {/* Details Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Event Details</h2>
            <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground/80">
              {event.description}
            </div>
          </section>

          {/* Rules & Regulations Section */}
          {(event.rules || true) && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Rules &amp; Regulations</h2>
              <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl bg-background/40">
                {event.rules ? (
                  <div className="whitespace-pre-wrap text-foreground/80">{event.rules}</div>
                ) : (
                  <ul className="space-y-4 text-foreground/80">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--brand-gold-hex)]"></div>
                      <p>Participants must carry their valid college ID card or any valid identity proof.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--brand-gold-hex)]"></div>
                      <p>Registration is mandatory for all attendees prior to the event start.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--brand-gold-hex)]"></div>
                      <p>The decision of the organizers and judges will be final and binding.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--brand-gold-hex)]"></div>
                      <p>Any form of misbehavior will lead to immediate disqualification.</p>
                    </li>
                  </ul>
                )}
              </div>
            </section>
          )}

          {/* Prize Pool Section */}
          {(event.prize_pool || true) && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Prize Pool</h2>
              <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl bg-background/40 flex items-center gap-6">
                <div className="h-16 w-16 shrink-0 rounded-full flex items-center justify-center bg-yellow-500/20 text-yellow-500 shadow-inner">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Rewards &amp; Recognition</div>
                  <div className="text-2xl font-bold text-gradient-brand">
                    {event.prize_pool ? event.prize_pool : "Exciting Goodies & Certificates"}
                  </div>
                  <p className="text-sm text-foreground/60 mt-1">For all winners and active participants.</p>
                </div>
              </div>
            </section>
          )}
        </div>

        <aside className="glass h-fit p-6 lg:sticky lg:top-24 space-y-6 rounded-3xl border border-white/10 shadow-xl">
          <div className="space-y-5 pb-6 border-b border-border/50">
             <div className="flex items-start gap-4 text-foreground/90">
               <div className="p-2 rounded-xl bg-primary/10">
                 <Calendar className="h-5 w-5 text-[color:var(--brand-gold-hex)]" />
               </div>
               <div>
                 <div className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider">Date &amp; Time</div>
                 <div className="text-sm font-semibold">{fmt(event.starts_at)}</div>
               </div>
             </div>
             {event.venue && (
               <div className="flex items-start gap-4 text-foreground/90">
                 <div className="p-2 rounded-xl bg-primary/10">
                   <MapPin className="h-5 w-5 text-[color:var(--brand-gold-hex)]" />
                 </div>
                 <div>
                   <div className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider">Venue</div>
                   <div className="text-sm font-semibold">{event.venue}</div>
                 </div>
               </div>
             )}
             <div className="flex items-start gap-4 text-foreground/90">
               <div className="p-2 rounded-xl bg-primary/10">
                 <Users className="h-5 w-5 text-[color:var(--brand-gold-hex)]" />
               </div>
               <div>
                 <div className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider">Registrations</div>
                 <div className="text-sm font-semibold">{registered} / {event.max_seats} Booked</div>
               </div>
             </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Remaining Seats</div>
              <div className="text-3xl font-bold text-gradient-brand">
                {closed ? "0" : seatsLeft}
              </div>
            </div>
            <div
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide ${
                closed ? "bg-muted text-muted-foreground" : "text-white shadow-lg shadow-primary/20"
              }`}
              style={closed ? undefined : { background: "var(--gradient-brand)" }}
            >
              {closed ? "CLOSED" : "OPEN"}
            </div>
          </div>

          <Link
            to="/events/$slug/register"
            params={{ slug: event.slug }}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-bold text-white shadow-xl transition-all duration-300 ${closed ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:brightness-110 hover:scale-[1.02] hover:shadow-primary/30 active:scale-95'}`}
            style={{ background: "var(--gradient-brand)" }}
            disabled={closed}
            onClick={(e) => { if (closed) e.preventDefault(); }}
          >
            {closed ? "Registrations Closed" : "Register Now"}
          </Link>
        </aside>
      </div>
    </div>
  );
}