import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, Users, Sparkles, Image as ImageIcon } from "lucide-react";
import { upcomingEventsQuery, albumsWithImagesQuery } from "@/lib/query-options";
import { EventCard } from "@/components/event-card";

const HeroParticles = lazy(() => import("@/components/hero-particles"));

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(upcomingEventsQuery),
      context.queryClient.ensureQueryData(albumsWithImagesQuery),
    ]);
  },
  component: Index,
});

const timelineEvents = [
  { year: "2018", title: "Club Chartered", description: "Rotaract Club of KIT Sunshine was officially chartered, igniting a new era of youth leadership and service on campus." },
  { year: "2020", title: "First Mega Project", description: "Successfully executed our first large-scale community initiative, providing relief and resources to over 1,000 lives." },
  { year: "2022", title: "Best Club Award", description: "Recognized as the 'Best Institutional Club' by our Rotary District for our unwavering dedication and impactful initiatives." },
  { year: "2024", title: "Global Reach", description: "Expanded our impact through international collaborations, youth exchanges, and global Rotaract partnerships." },
];

function Index() {
  const { data: events } = useSuspenseQuery(upcomingEventsQuery);
  const { data: albums } = useSuspenseQuery(albumsWithImagesQuery);
  const galleryImages = albums.flatMap((a) => a.gallery_images || []).slice(0, 8);
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
      {/* HERO SECTION WITH FULL-PAGE 3D ROTARACT EMBLEM */}
      <section className="relative isolate min-h-[92vh] flex items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-5 pt-28 pb-12 md:pt-36 md:pb-16 lg:pt-40 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* LEFT: Text Content */}
          <div className="z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
        

            <h1 className="hero-line max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
              Rotaract Club of <br />
              <span className="text-gradient-brand">KIT Sunshine</span>
            </h1>
            <p className="hero-line mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl font-normal">
              We are the Rotaract Club at KIT College of Engineering, Kolhapur —
              students turning empathy into projects, projects into impact, and impact
              into a community that shines.
            </p>

            <div className="hero-line mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/events"
                className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                style={{ background: "var(--gradient-brand)" }}
              >
                Explore events
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="glass inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-foreground/90 transition-all hover:scale-[1.02] hover:bg-muted/80 active:scale-[0.98]"
              >
                About the club
              </Link>
            </div>

            <div className="hero-line mt-16 grid w-full max-w-md grid-cols-3 gap-4">
              {[
                { k: "12+", v: "Projects" },
                { k: "80+", v: "Members" },
                { k: "5k+", v: "Lives" },
              ].map((s) => (
                <div key={s.v} className="glass px-3 py-4 text-center transition-transform hover:-translate-y-0.5">
                  <div className="text-2xl font-bold text-gradient-brand md:text-3xl">
                    {s.k}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground font-medium md:text-xs uppercase tracking-wider">{s.v}</div>
                </div>
              ))}
            </div>

            
          </div>

          {/* RIGHT: 3D Logo (Mobile: Absolute Center Background, Desktop: Right Column) */}
          <div className="absolute inset-0 -z-10 lg:relative lg:inset-auto lg:z-0 lg:h-[650px] lg:w-full flex items-center justify-center opacity-30 lg:opacity-100 pointer-events-auto lg:-mt-12">
            <Suspense fallback={null}>
              <HeroParticles />
            </Suspense>
            <div
              className="absolute inset-0 pointer-events-none lg:hidden"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, transparent 35%, var(--background) 92%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* WHO WE ARE (Brief About) */}
      <section className="mx-auto max-w-7xl px-5 pt-24 pb-12">
        <div className="reveal glass-strong p-8 md:p-14 rounded-3xl" style={{ backgroundImage: "var(--gradient-brand-soft)" }}>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-gold-hex)]">
              Who We Are
            </div>
            <h2 className="text-3xl font-bold md:text-5xl">
              A community of young minds creating <span className="text-gradient-brand">meaningful change</span>.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Rotaract Club of KIT Sunshine is a platform where young people can learn new skills, take initiative, lead teams, build connections, and turn ideas into action. 
              We don't just build projects. We build people, leaders, friendships and memories.
            </p>
            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-105"
                style={{ background: "var(--gradient-brand)" }}
              >
                Discover our story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
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
            { title: "Club Service", body: "Building the family within. Focused on team-building, celebrations, and member engagement." },
            { title: "Community Service", body: "Turning compassion into action. Serving needs through health, education, and social initiatives." },
            { title: "Professional Development", body: "Preparing youth for tomorrow. Building skills, confidence, and leadership for career growth." },
            { title: "International Service", body: "Different cultures. One Rotaract. Connecting globally to learn that service has no borders." },
          ].map((p, i) => (
            <div key={p.title} className="reveal glass p-6 group transition-transform hover:-translate-y-1">
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl text-sm font-bold text-white shadow-sm"
                style={{ background: "var(--gradient-brand)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground group-hover:text-[color:var(--brand-gold-hex)] transition-colors">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE / JOURNEY */}
      <section className="mx-auto max-w-7xl px-5 py-20 relative">
        <div className="reveal text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-gold-hex)]">
            Our Journey
          </div>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            A legacy of <span className="text-gradient-brand">service</span>.
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[28px] md:left-1/2 top-4 bottom-4 w-px bg-border/70 -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {timelineEvents.map((item, index) => (
              <div key={item.year} className={`reveal relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Center Node */}
                <div className="absolute left-[28px] md:left-1/2 w-4 h-4 rounded-full bg-[color:var(--brand-gold-hex)] -translate-x-1/2 mt-[26px] md:mt-0 z-10 shadow-[0_0_15px_var(--brand-gold-hex)]"></div>
                
                {/* Content Box */}
                <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                  <div className="glass p-6 rounded-2xl group transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[color:var(--brand-gold-hex)]/10">
                    <div className="text-3xl font-bold text-gradient-brand mb-2">{item.year}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[color:var(--brand-gold-hex)] transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
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

      {/* GALLERY */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-gold-hex)]">
              Our Memories
            </div>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">Photo Gallery</h2>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {galleryImages.length === 0 ? (
          <div className="reveal glass grid place-items-center px-6 py-16 text-center">
            <ImageIcon className="h-8 w-8 text-white/40 mb-3" />
            <p className="text-muted-foreground">No photos in gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {galleryImages.map((img) => (
              <div key={img.id} className="reveal group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <img
                  src={img.image_url}
                  alt={img.title || "Gallery image"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-background/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
