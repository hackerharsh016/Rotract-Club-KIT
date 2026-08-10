import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { eventBySlugQuery, eventSeatCountQuery } from "@/lib/query-options";

export const Route = createFileRoute("/events/$slug_/register")({
  head: ({ loaderData }) => {
    const ev = loaderData as { title: string } | undefined;
    if (!ev) return { meta: [{ title: "Register · Rotaract KIT Sunshine" }] };
    return {
      meta: [
        { title: `Register for ${ev.title} · Rotaract KIT Sunshine` },
      ],
    };
  },
  loader: async ({ context, params }) => {
    const event = await context.queryClient.ensureQueryData(eventBySlugQuery(params.slug));
    if (!event) throw new Error("Event not found");
    return event;
  },
  component: EventRegister,
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

function EventRegister() {
  const params = Route.useParams();
  const navigate = useNavigate();
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
    setTimeout(() => {
      navigate({ to: "/events/$slug", params: { slug: event.slug } });
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:py-20 flex items-center justify-center min-h-[80vh]">
      <div className="glass p-8 md:p-12 w-full rounded-3xl shadow-2xl">
        {done ? (
          <div className="text-center text-foreground py-10">
            <div className="text-2xl font-bold mb-3 text-gradient-brand">Successfully Registered!</div>
            <p className="text-muted-foreground">Redirecting you back to the event...</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-6">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold mb-2">Registration</h1>
              <p className="text-sm text-muted-foreground">Please fill in your details below.</p>
            </div>
            <fieldset disabled={closed || submitting} className="grid gap-5 disabled:opacity-60">
              <Field label="Full Name" name="name" placeholder="E.g. Priya Patil" />
              <Field label="Email Address" name="email" type="email" placeholder="you@kitcoek.in" />
              <Field label="Phone Number" name="phone" placeholder="+91 98XXXXXXXX" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Department" name="department" placeholder="CSE, IT, etc." />
                <Field label="Year" name="year" placeholder="FY, SY, TY, BTech" />
              </div>
              <button
                type="submit"
                className="mt-6 w-full rounded-full px-5 py-4 text-sm font-bold text-white shadow-xl transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed"
                style={{ background: "var(--gradient-brand)" }}
              >
                {submitting ? "Registering…" : closed ? "Registrations Closed" : "Submit Registration"}
              </button>
            </fieldset>
            {closed && !submitting && (
              <p className="text-center text-sm text-red-500 mt-2 font-medium">
                Unfortunately, registrations are currently closed or the event is sold out.
              </p>
            )}
          </form>
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
    <label className="grid gap-2 text-sm">
      <span className="text-sm font-semibold text-foreground/90">{label}</span>
      <input
        {...rest}
        required
        className="rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-[color:var(--brand-gold-hex)] focus:bg-black/40 focus:ring-1 focus:ring-[color:var(--brand-gold-hex)]/50"
      />
    </label>
  );
}
