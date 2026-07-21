import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
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

const regSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid phone")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Only digits and + - ( ) allowed"),
  department: z.string().trim().min(1, "Required").max(100),
  year: z.string().trim().min(1, "Required").max(20),
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
  const qc = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!event) return null;
  const seatsLeft = Math.max(0, event.max_seats - registered);
  const soldOut = seatsLeft === 0;
  const closed = !event.is_open || soldOut;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!event) return;
    const fd = new FormData(e.currentTarget);
    const parsed = regSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("registrations").insert({
      event_id: event.id,
      ...parsed.data,
    });
    setSubmitting(false);
    if (error) {
      toast.error(
        error.message.includes("row-level")
          ? "Registrations are closed or seats are full."
          : error.message,
      );
      return;
    }
    setDone(true);
    qc.invalidateQueries({ queryKey: ["event-seats", event.id] });
    toast.success("You're registered! We'll be in touch.");
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All events
      </Link>

      <div className="mt-6 glass overflow-hidden">
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
        <div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[color:var(--brand-gold-hex)]" />
              {fmt(event.starts_at)}
            </span>
            {event.venue ? (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[color:var(--brand-gold-hex)]" /> {event.venue}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-[color:var(--brand-gold-hex)]" />
              {registered}/{event.max_seats} registered
            </span>
          </div>

          <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-foreground/80">
            {event.description}
          </div>
        </div>

        <aside className="glass h-fit p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Seats</div>
              <div className="text-2xl font-bold">
                {closed ? "Closed" : `${seatsLeft} left`}
              </div>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-[11px] ${
                closed ? "bg-muted text-muted-foreground" : "text-white"
              }`}
              style={closed ? undefined : { background: "var(--gradient-brand)" }}
            >
              {closed ? "Closed" : "Open"}
            </div>
          </div>

          {done ? (
            <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5 text-sm text-foreground/80">
              <div className="font-semibold text-foreground">You're registered.</div>
              <p className="mt-1">We'll reach out via email with the details.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 grid gap-3">
              <fieldset disabled={closed || submitting} className="grid gap-3 disabled:opacity-60">
                <Field label="Full name" name="name" placeholder="Priya Patil" />
                <Field label="Email" name="email" type="email" placeholder="you@kitcoek.in" />
                <Field label="Phone" name="phone" placeholder="+91 98XXXXXXXX" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Department" name="department" placeholder="CSE" />
                  <Field label="Year" name="year" placeholder="TE" />
                </div>
                <button
                  type="submit"
                  className="mt-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:brightness-110 disabled:cursor-not-allowed"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {submitting ? "Registering…" : closed ? "Registrations closed" : "Register now"}
                </button>
              </fieldset>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        {...rest}
        required
        className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-[color:var(--brand-cranberry-hex)]"
      />
    </label>
  );
}