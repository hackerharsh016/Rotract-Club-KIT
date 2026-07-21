import { createFileRoute } from "@tanstack/react-router";
import { Heart, Target, Compass, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Rotaract KIT Sunshine" },
      {
        name: "description",
        content:
          "Learn about the Rotaract Club of KIT Sunshine — our mission, avenues of service, and the values that guide us.",
      },
      { property: "og:title", content: "About · Rotaract KIT Sunshine" },
      {
        property: "og:description",
        content: "Our mission, avenues of service, and the values that guide us.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-gold-hex)]">
        About us
      </div>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-6xl">
        A student club with the heart of{" "}
        <span className="text-gradient-brand">Rotary</span>.
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        The Rotaract Club of KIT Sunshine is a chapter of Rotaract International,
        hosted at KIT College of Engineering, Kolhapur. We are students aged
        18–30, united by a simple belief: young people can change their community
        today, not someday.
      </p>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <div className="glass p-8">
          <div
            className="grid h-12 w-12 place-items-center rounded-2xl text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Target className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Our mission</h2>
          <p className="mt-3 text-muted-foreground">
            To develop leadership and professional skills in students while
            serving our community and connecting with Rotaractors worldwide.
          </p>
        </div>
        <div className="glass p-8">
          <div
            className="grid h-12 w-12 place-items-center rounded-2xl text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Compass className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Our vision</h2>
          <p className="mt-3 text-muted-foreground">
            A campus where every student has an opportunity to lead, to serve,
            and to grow — through action, not just aspiration.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold md:text-3xl">Our values</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-4">
          {[
            { icon: Heart, title: "Service above self", body: "The Rotary motto guides every project we run." },
            { icon: Award, title: "Integrity", body: "We do what we say — on time and with care." },
            { icon: Target, title: "Impact", body: "Measurable good, not just good intentions." },
            { icon: Compass, title: "Fellowship", body: "Friendships that outlast our college years." },
          ].map((v) => (
            <div key={v.title} className="glass p-5">
              <v.icon className="h-5 w-5 text-[color:var(--brand-gold-hex)]" />
              <div className="mt-3 font-semibold">{v.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{v.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 glass-strong overflow-hidden p-8 md:p-14">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Affiliated with{" "}
          <span className="text-gradient-brand">Rotary International</span>
        </h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Rotaract clubs are sponsored by Rotary clubs and share the same values:
          service, leadership, professional development, and international
          understanding. Our sponsoring Rotary club supports and mentors us as we
          grow.
        </p>
      </div>
    </div>
  );
}