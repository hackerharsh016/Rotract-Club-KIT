import { createFileRoute } from "@tanstack/react-router";
import { Heart, Target, Compass, Award, Globe, Zap, Users, BookOpen, HeartHandshake } from "lucide-react";
import { useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animations removed to fix content loading delay and visibility issues
  }, []);

  return (
    <div ref={containerRef} className="mx-auto max-w-6xl px-5 py-16 md:py-24 space-y-32">
      {/* 🌟 Who We Are (Hero Section) */}
      <section className="relative">
        <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-[color:var(--brand-gold-hex)]/10 rounded-full blur-3xl" />
        <div className="hero-text text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--brand-gold-hex)]">
          Our Story
        </div>
        <h1 className="hero-text mt-4 max-w-3xl text-5xl font-extrabold leading-tight md:text-7xl">
          We don't just build projects. <br />
          <span className="text-gradient-brand">We build people.</span>
        </h1>
        
        <div className="mt-12 grid gap-10 md:grid-cols-2 text-lg leading-relaxed text-muted-foreground relative z-10">
          <div className="hero-text space-y-6">
            <p>
              <strong className="text-foreground">Rotaract Club of KIT Sunshine</strong> is an institutional-based Rotaract club bringing together young minds who believe in service, leadership, fellowship, and creating meaningful change.
            </p>
            <p>
              Supported by our Parent Rotary Club, <strong className="text-foreground">Rotary Club of Kolhapur Sunrise</strong>, we provide a platform for youth to learn new skills, lead teams, and turn ideas into action.
            </p>
          </div>
          <div className="hero-text">
            <div className="glass p-8 rounded-3xl border-l-4 border-[color:var(--brand-gold-hex)] shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--brand-gold-hex)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Heart className="h-8 w-8 text-[color:var(--brand-gold-hex)] mb-4" />
              <p className="text-foreground font-medium text-xl md:text-2xl italic leading-snug">
                "Every member has something unique to contribute — an idea, a skill, a perspective, or simply the willingness to make a difference."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 WHAT IS ROTARY & ⚡ WHAT IS ROTARACT */}
      <section className="stagger-grid grid gap-8 md:grid-cols-2">
        <div className="stagger-item glass p-8 md:p-12 rounded-3xl group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <Globe className="h-32 w-32" />
          </div>
          <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
            <Globe className="h-7 w-7 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">What is Rotary?</h2>
          <div className="mt-6 space-y-4 text-muted-foreground relative z-10">
            <p>A global network of people united by a shared commitment to <strong className="text-foreground">"Service Above Self."</strong></p>
            <p>Rotarians work together to address community needs, create positive change, and build a better world through service and collaboration.</p>
            <div className="pt-6 mt-6 border-t border-border font-medium text-foreground italic border-l-2 pl-4 border-blue-500/50">
              Rotary gives us the guidance.<br />
              Rotaract brings the energy.<br />
              Together, we create impact.
            </div>
          </div>
        </div>

        <div className="stagger-item glass p-8 md:p-12 rounded-3xl group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <Zap className="h-32 w-32" />
          </div>
          <div className="h-14 w-14 rounded-2xl bg-[color:var(--brand-cranberry-hex)]/10 flex items-center justify-center mb-6">
            <Zap className="h-7 w-7 text-[color:var(--brand-cranberry-hex)]" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">What is Rotaract?</h2>
          <div className="mt-6 space-y-4 text-muted-foreground relative z-10">
            <p>A global movement of young people who <strong className="text-foreground">Learn, Lead, Serve, and Connect.</strong></p>
            <p>Through community service, professional development, fellowship, and international collaborations, Rotaractors step out of their comfort zones to make a difference.</p>
            <div className="pt-6 mt-6 border-t border-border font-medium text-foreground italic border-l-2 pl-4 border-[color:var(--brand-cranberry-hex)]/50">
              Every challenge creates a leader.<br />
              Every team builds a connection.<br />
              Every act of service creates impact.
            </div>
          </div>
        </div>
      </section>

      {/* 💫 WHAT WE DO */}
      <section className="reveal glass-strong p-8 md:p-16 overflow-hidden relative rounded-[3rem]" style={{ backgroundImage: "var(--gradient-brand-soft)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[color:var(--brand-gold-hex)]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 backdrop-blur shadow-inner mb-2 border border-white/10">
            <Target className="h-8 w-8 text-[color:var(--brand-gold-hex)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-brand">Action speaks louder than intention.</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From community initiatives and awareness campaigns to professional development sessions, fellowship events, and skill-building workshops.
          </p>
          
          <div className="pt-8">
            <p className="font-bold text-foreground uppercase tracking-widest text-sm mb-6">We empower our members to:</p>
            <ul className="stagger-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-5xl mx-auto">
              {[
                { icon: Zap, text: "Turn ideas into action" },
                { icon: Users, text: "Work as a cohesive team" },
                { icon: BookOpen, text: "Build confidence & skills" },
                { icon: Target, text: "Develop leadership qualities" },
                { icon: Globe, text: "Understand new perspectives" },
                { icon: HeartHandshake, text: "Serve the community" }
              ].map((item, i) => (
                <li key={i} className="stagger-item flex items-center gap-4 text-foreground/80 bg-background/60 p-4 rounded-2xl border border-border/50 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-background/80 hover:text-foreground hover:border-[color:var(--brand-gold-hex)]/30">
                  <div className="p-2 rounded-xl bg-[color:var(--brand-gold-hex)]/10 text-[color:var(--brand-gold-hex)]">
                    <item.icon className="h-5 w-5 shrink-0" />
                  </div>
                  <span className="font-medium text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 🧭 OUR FOUR AVENUES OF SERVICE */}
      <section>
        <div className="reveal text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/5 mb-6 text-primary">
            <Compass className="h-8 w-8" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">Four Avenues of Service</h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            The four avenues form the core of our Rotaract journey. Each avenue gives us a unique way to connect, contribute, and grow as individuals.
          </p>
        </div>

        <div className="stagger-grid grid gap-6 lg:gap-8 md:grid-cols-2">
          {/* Club Service */}
          <div className="stagger-item glass p-8 md:p-10 rounded-3xl group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">Club Service</h3>
              <div className="text-3xl font-extrabold text-border/40 group-hover:text-[color:var(--brand-gold-hex)]/20 transition-colors">01</div>
            </div>
            <div className="text-lg font-medium text-[color:var(--brand-gold-hex)] mb-4">💙 Building the family within.</div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              From team-building activities to celebrations, this avenue creates an environment where every member feels valued. It is where friendships begin and the club becomes a family.
            </p>
            <ul className="space-y-3 text-sm text-foreground/80">
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Building stronger teams</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Celebrating together</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Strengthening connections</li>
            </ul>
          </div>

          {/* Community Service */}
          <div className="stagger-item glass p-8 md:p-10 rounded-3xl group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">Community Service</h3>
              <div className="text-3xl font-extrabold text-border/40 group-hover:text-[color:var(--brand-gold-hex)]/20 transition-colors">02</div>
            </div>
            <div className="text-lg font-medium text-[color:var(--brand-gold-hex)] mb-4">🌍 Turning compassion into action.</div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Through awareness campaigns, health activities, and environmental projects, we don't just identify problems — we step forward to be part of the solution.
            </p>
            <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 text-sm font-medium italic text-foreground/80">
              "Our goal is to serve with purpose and leave a positive impact wherever we go."
            </div>
          </div>

          {/* Professional Development */}
          <div className="stagger-item glass p-8 md:p-10 rounded-3xl group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">Professional Services</h3>
              <div className="text-3xl font-extrabold text-border/40 group-hover:text-[color:var(--brand-gold-hex)]/20 transition-colors">03</div>
            </div>
            <div className="text-lg font-medium text-[color:var(--brand-gold-hex)] mb-4">💼 Preparing youth for tomorrow.</div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Through workshops, networking, and leadership experiences, members discover and develop their potential beyond the classroom.
            </p>
            <ul className="space-y-3 text-sm text-foreground/80">
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Leadership & Communication</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Skill Development</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Networking & Career Growth</li>
            </ul>
          </div>

          {/* International Service */}
          <div className="stagger-item glass p-8 md:p-10 rounded-3xl group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">International Service</h3>
              <div className="text-3xl font-extrabold text-border/40 group-hover:text-[color:var(--brand-gold-hex)]/20 transition-colors">04</div>
            </div>
            <div className="text-lg font-medium text-[color:var(--brand-gold-hex)] mb-4">🌐 Different cultures. One Rotaract.</div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Through cultural exchanges and international collaborations, we learn that service has no borders. It allows us to exchange ideas and build global friendships.
            </p>
            <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 text-sm font-medium italic text-foreground/80">
              Think global. Connect beyond borders. Serve together.
            </div>
          </div>
        </div>
      </section>

      {/* 💙 WHY KIT SUNSHINE? */}
      <section className="reveal text-center max-w-4xl mx-auto pb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-8">Why KIT Sunshine?</h2>
        <div className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed space-y-6">
          <p>
            Because we believe that youth is not just the future — <strong className="text-foreground">youth can create change today.</strong>
          </p>
          <p>
            We bring together people with different talents and personalities and give them a common purpose: <strong className="text-gradient-brand font-extrabold">To make a difference.</strong>
          </p>
        </div>
        
        <div className="stagger-grid mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-left">
          {[
            { title: "Learn", desc: "Every project is a chance to learn.", icon: BookOpen },
            { title: "Connect", desc: "Every event is a chance to connect.", icon: Users },
            { title: "Lead", desc: "Every challenge is a chance to lead.", icon: Award },
            { title: "Impact", desc: "Every service is a chance to impact.", icon: Heart }
          ].map((item, i) => (
            <div key={i} className="stagger-item glass p-6 rounded-3xl text-center group hover:bg-muted/50 transition-colors">
              <div className="mx-auto w-12 h-12 rounded-full bg-[color:var(--brand-gold-hex)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="h-5 w-5 text-[color:var(--brand-gold-hex)]" />
              </div>
              <div className="text-xl font-bold text-foreground">{item.title}</div>
              <div className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}