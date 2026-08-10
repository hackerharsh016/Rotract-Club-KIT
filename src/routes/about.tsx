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
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24 space-y-24">
      {/* 🌟 Who We Are */}
      <section>
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-gold-hex)]">
          About Us 💙
        </div>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold md:text-6xl">
          🌟 Who We Are
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2 text-lg leading-relaxed text-muted-foreground">
          <div className="space-y-6">
            <p>
              <strong className="text-foreground">Rotaract Club of KIT Sunshine</strong> is an institutional-based Rotaract club that brings together young minds who believe in service, leadership, fellowship, and creating meaningful change.
            </p>
            <p>
              As a part of the Rotaract movement, we provide a platform where young people can learn new skills, take initiative, lead teams, build connections, and turn ideas into action.
            </p>
            <p>
              We are proudly supported by our Parent Rotary Club, <strong className="text-foreground">Rotary Club of Kolhapur Sunrise</strong>, whose guidance and support strengthen our journey of service.
            </p>
          </div>
          <div className="space-y-6">
            <p>
              At KIT Sunshine, we believe that every member has something unique to contribute — an idea, a skill, a perspective, or simply the willingness to make a difference.
            </p>
            <div className="glass p-6 text-foreground font-medium text-xl border-l-4 border-[color:var(--brand-gold-hex)]">
              "We don't just build projects. We build people, leaders, friendships and memories."
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 WHAT IS ROTARY & ⚡ WHAT IS ROTARACT */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="glass p-8 md:p-10">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">🌍 What is Rotary?</h2>
          <div className="mt-6 space-y-5 text-muted-foreground">
            <p>Rotary is a global network of people who come together with a shared commitment to <strong className="text-foreground">"Service Above Self."</strong></p>
            <p>Rotarians work together to address community needs, create positive change, and build a better world through service and collaboration.</p>
            <p>Rotaract works alongside Rotary, carrying forward the same spirit of service while giving young people the opportunity to lead, innovate and create their own impact.</p>
            <div className="pt-4 border-t border-border font-medium text-foreground italic">
              Rotary gives us the guidance.<br />
              Rotaract brings the energy.<br />
              Together, we create impact.
            </div>
          </div>
        </div>

        <div className="glass p-8 md:p-10">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">⚡ What is Rotaract?</h2>
          <div className="mt-6 space-y-5 text-muted-foreground">
            <p>Rotaract is a global movement of young people who <strong className="text-foreground">Learn, Lead, Serve, and Connect.</strong></p>
            <p>It is more than just a club — it is a community where young people come together to discover their potential and use it for something bigger than themselves.</p>
            <p>Through community service, professional development, fellowship, leadership opportunities, and international collaborations, Rotaractors get the chance to step out of their comfort zones and make a difference.</p>
            <div className="pt-4 border-t border-border font-medium text-foreground italic">
              Every project teaches us something.<br />
              Every team builds a connection.<br />
              Every challenge creates a leader.<br />
              And every act of service creates an impact.
            </div>
          </div>
        </div>
      </section>

      {/* 💫 WHAT WE DO */}
      <section className="glass-strong p-8 md:p-14 overflow-hidden relative rounded-3xl" style={{ backgroundImage: "var(--gradient-brand-soft)" }}>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-gradient-brand">💫 What We Do</h2>
          <p className="text-lg text-muted-foreground">
            At Rotaract Club of KIT Sunshine, we believe that <strong className="text-foreground">action speaks louder than intention.</strong>
          </p>
          <p className="text-muted-foreground">
            Our activities range from community initiatives and awareness campaigns to professional development sessions, fellowship events, skill-building workshops and collaborations with Rotaract clubs beyond our community.
          </p>
          <p className="font-semibold text-foreground pt-4">We aim to create experiences that allow our members to:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto pt-2">
            {[
              "Turn ideas into action",
              "Work as a team",
              "Build confidence and communication skills",
              "Develop leadership qualities",
              "Understand different perspectives",
              "Serve the community",
              "Grow personally and professionally"
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-muted-foreground bg-background/50 p-3.5 rounded-xl border border-border/50 shadow-sm backdrop-blur-sm">
                <Target className="h-4 w-4 text-[color:var(--brand-gold-hex)] shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <p className="text-lg font-medium text-foreground pt-6 italic">
            "Because every small action can become part of something bigger."
          </p>
        </div>
      </section>

      {/* 🧭 OUR FOUR AVENUES OF SERVICE */}
      <section>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">🧭 Our Four Avenues of Service</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The four avenues of service form an important part of our Rotaract journey. Each avenue gives us a different way to connect, contribute and grow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Club Service */}
          <div className="glass p-8 group transition-transform hover:-translate-y-1">
            <div className="text-sm font-bold text-[color:var(--brand-gold-hex)] mb-2">01 — CLUB SERVICE</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">💙 Building the family within.</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>Club Service focuses on creating a strong, connected and active club.</p>
              <p>From team-building activities and fellowship to meetings, celebrations and member engagement, this avenue helps create an environment where every member feels involved and valued. It is where friendships begin, teams are built, and the club becomes a family.</p>
              <div className="pt-4 border-t border-border/60">
                <strong className="text-foreground">We focus on:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Building stronger teams</li>
                  <li>Celebrating together</li>
                  <li>Strengthening member connections</li>
                  <li>Creating a sense of belonging</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Community Service */}
          <div className="glass p-8 group transition-transform hover:-translate-y-1">
            <div className="text-sm font-bold text-[color:var(--brand-gold-hex)] mb-2">02 — COMMUNITY SERVICE</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">🌍 Turning compassion into action.</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>Community Service is about looking beyond ourselves and responding to the needs around us.</p>
              <p>Through awareness campaigns, social initiatives, health activities, educational drives, environmental projects and other community-focused initiatives, we work towards creating a meaningful difference. We don't just identify problems — we step forward to be part of the solution.</p>
              <div className="pt-4 border-t border-border/60 italic font-medium">
                Our goal is to serve with purpose, create awareness, and leave a positive impact wherever we go.
              </div>
            </div>
          </div>

          {/* Professional Development */}
          <div className="glass p-8 group transition-transform hover:-translate-y-1">
            <div className="text-sm font-bold text-[color:var(--brand-gold-hex)] mb-2">03 — PROFESSIONAL DEVELOPMENT</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">💼 Preparing today's youth for tomorrow's world.</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>Rotaract is also a place to learn beyond classrooms. Professional Development helps members build the skills, confidence and mindset needed to grow in their academic, professional and personal lives.</p>
              <p>Through workshops, training sessions, networking opportunities, expert interactions and leadership experiences, members get opportunities to discover and develop their potential. <span className="italic">Because a degree may open a door, but skills and confidence help you walk through it.</span></p>
              <div className="pt-4 border-t border-border/60">
                <strong className="text-foreground">We focus on:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Leadership & Communication</li>
                  <li>Skill Development</li>
                  <li>Networking & Career Growth</li>
                </ul>
              </div>
            </div>
          </div>

          {/* International Service */}
          <div className="glass p-8 group transition-transform hover:-translate-y-1">
            <div className="text-sm font-bold text-[color:var(--brand-gold-hex)] mb-2">04 — INTERNATIONAL SERVICE</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">🌐 Different cultures. One Rotaract.</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>International Service gives us the opportunity to connect beyond our own community and experience the global side of Rotaract.</p>
              <p>Through collaborations, cultural exchanges, international projects and interactions with Rotaractors from different parts of the world, we learn that service has no borders. It allows us to exchange ideas, understand different cultures and build friendships that go beyond geography.</p>
              <div className="pt-4 border-t border-border/60 italic font-medium">
                Think global. Connect beyond borders. Serve together.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💙 WHY KIT SUNSHINE? */}
      <section className="text-center max-w-4xl mx-auto pb-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-8">💙 Why KIT Sunshine?</h2>
        <div className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed space-y-6">
          <p>
            Because we believe that youth is not just the future — <strong className="text-foreground">youth can create change today.</strong>
          </p>
          <p>
            At KIT Sunshine, we bring together people with different talents, ideas and personalities and give them a common purpose: <strong className="text-gradient-brand">To make a difference.</strong>
          </p>
          <p className="text-lg">
            Here, you can be a volunteer, a leader, a creator, a speaker, a planner, a problem-solver — sometimes all at once.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="glass p-5 rounded-2xl text-center">
            <div className="text-lg font-bold text-foreground">Learn</div>
            <div className="text-sm text-muted-foreground mt-1">Every project is a chance to learn.</div>
          </div>
          <div className="glass p-5 rounded-2xl text-center">
            <div className="text-lg font-bold text-foreground">Connect</div>
            <div className="text-sm text-muted-foreground mt-1">Every event is a chance to connect.</div>
          </div>
          <div className="glass p-5 rounded-2xl text-center">
            <div className="text-lg font-bold text-foreground">Lead</div>
            <div className="text-sm text-muted-foreground mt-1">Every challenge is a chance to lead.</div>
          </div>
          <div className="glass p-5 rounded-2xl text-center">
            <div className="text-lg font-bold text-foreground">Impact</div>
            <div className="text-sm text-muted-foreground mt-1">Every service is a chance to impact.</div>
          </div>
        </div>
      </section>
    </div>
  );
}