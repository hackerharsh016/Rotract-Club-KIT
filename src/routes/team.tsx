import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Instagram, Linkedin } from "lucide-react";
import { teamQuery } from "@/lib/query-options";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team · Rotaract KIT Sunshine" },
      {
        name: "description",
        content:
          "Meet the office bearers and directors of Rotaract Club of KIT Sunshine.",
      },
      { property: "og:title", content: "Team · Rotaract KIT Sunshine" },
      {
        property: "og:description",
        content: "The office bearers behind Rotaract KIT Sunshine.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(teamQuery),
  component: Team,
});

function Team() {
  const { data: team } = useSuspenseQuery(teamQuery);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-gold-hex)]">
        Our team
      </div>
      <h1 className="mt-3 text-4xl font-bold md:text-6xl">
        The people who <span className="text-gradient-brand">make it happen</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Meet the current office bearers and directors leading Rotaract KIT
        Sunshine.
      </p>

      {team.length === 0 ? (
        <div className="glass mt-14 grid place-items-center px-6 py-20 text-center">
          <p className="text-muted-foreground">
            The team roster is being finalized. Please check back soon.
          </p>
        </div>
      ) : (
        <div className="mt-14 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.id} className="glass overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden">
                {m.photo_url ? (
                  <img
                    src={m.photo_url}
                    alt={m.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 grid place-items-center text-4xl font-bold text-muted-foreground"
                    style={{ background: "var(--gradient-brand-soft)" }}
                  >
                    {m.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                  <div className="text-base font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.role}</div>
                </div>
              </div>
              {(m.linkedin_url || m.instagram_url) && (
                <div className="flex items-center gap-2 px-4 py-3">
                  {m.linkedin_url ? (
                    <a
                      href={m.linkedin_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${m.name} on LinkedIn`}
                      className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  {m.instagram_url ? (
                    <a
                      href={m.instagram_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${m.name} on Instagram`}
                      className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted"
                    >
                      <Instagram className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}