import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, Users, Sparkles } from "lucide-react";
import { upcomingEventsQuery } from "@/lib/query-options";
import { EventCard } from "@/components/event-card";

const HeroParticles = lazy(() => import("@/components/hero-particles"));

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(upcomingEventsQuery),
  component: Index,
});

function Index() {
  const { data: events } = useSuspenseQuery(upcomingEventsQuery);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!active) return;

      ctx = gsap.context(() => {
        gsap.from(".hero-line", {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
        });
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
      }, heroRef);

      // Recalculate ScrollTrigger positions after animations are registered
      ScrollTrigger.refresh();
    })();

    return () => {
      active = false;
      if (ctx) {
        ctx.revert();
      }
    };
  }, []);

  return (
    <div ref={heroRef}>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Suspense fallback={<div className="absolute inset-0" style={{ background: "var(--gradient-brand-soft)" }} />}>
            <HeroParticles />
          </Suspense>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(11,11,15,0.85) 90%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-5 pt-20 pb-32 md:pt-32 md:pb-44">
          <div className="hero-line inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs tracking-wide text-foreground/80 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand-gold-hex)]" />
            Rotaract International · Club of KIT Sunshine
          </div>

          <h1 className="hero-line mt-6 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Service that <span className="text-gradient-brand">shines</span>.
            <br />
            Leaders in the making.
          </h1>
          <p className="hero-line mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            We are the Rotaract Club at KIT College of Engineering, Kolhapur —
            students turning empathy into projects, projects into impact, and impact
            into a community that shines.
          </p>

          <div className="hero-line mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:brightness-110"
              style={{ background: "var(--gradient-brand)" }}
            >
              Explore events
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/about"
              className="glass inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/90 hover:bg-muted"
            >
              About the club
            </Link>
          </div>

          <div className="hero-line mt-16 grid max-w-3xl grid-cols-3 gap-4">
            {[
              { k: "12+", v: "Projects a year" },
              { k: "80+", v: "Active members" },
              { k: "5k+", v: "Lives touched" },
            ].map((s) => (
              <div key={s.v} className="glass px-5 py-4 text-center">
                <div className="text-2xl font-bold text-gradient-brand md:text-3xl">
                  {s.k}
                </div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="reveal max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-gold-hex)]">
            What we do
          </div>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            Four avenues. One mission: <span className="text-gradient-brand">impact</span>.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Community Service", body: "Health camps, drives, and outreach in and around Kolhapur." },
            { title: "Professional Development", body: "Workshops, industry visits, and career-building sessions." },
            { title: "Club Service", body: "A tight-knit community of student leaders and doers." },
            { title: "International Service", body: "Global rotaract collaborations and cultural exchange." },
          ].map((p, i) => (
            <div key={p.title} className="reveal glass p-6">
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl text-sm font-bold text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UPCOMING */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-gold-hex)]">
              What's next
            </div>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">Upcoming events</h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="reveal glass grid place-items-center px-6 py-16 text-center">
            <Calendar className="h-8 w-8 text-white/40" />
            <p className="mt-3 text-muted-foreground">No events scheduled yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <div key={e.id} className="reveal">
                <EventCard event={e} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div
          className="reveal glass-strong relative overflow-hidden px-8 py-14 md:px-14 md:py-20"
          style={{ backgroundImage: "var(--gradient-brand-soft)" }}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs">
              <Users className="h-3.5 w-3.5" /> Join the club
            </div>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Ready to <span className="text-gradient-brand">shine</span> with us?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Whether you want to lead a project, learn new skills, or just meet
              awesome people — Rotaract KIT Sunshine is your place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-xl"
                style={{ background: "var(--gradient-brand)" }}
              >
                Get in touch
              </Link>
              <Link
                to="/team"
                className="glass px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                Meet the team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
