import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-background/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              R
            </span>
            <div>
              <div className="text-sm font-semibold">Rotaract Club of KIT Sunshine</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Service · Leadership · Impact
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            A student-led service club at KIT College of Engineering, Kolhapur — affiliated
            with Rotaract International. We build leaders, run community projects, and turn
            ideas into impact.
          </p>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Explore
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/about", "About"],
              ["/team", "Team"],
              ["/events", "Events"],
              ["/gallery", "Gallery"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-muted-foreground hover:text-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Reach us
          </div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>KIT College of Engineering, Kolhapur, Maharashtra</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href="mailto:rotaract.kit@example.com" className="hover:text-foreground">
                rotaract.kit@example.com
              </a>
            </li>
            <li className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-muted/40 hover:bg-muted"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-muted/40 hover:bg-muted"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-xs text-muted-foreground/80">
          <span>© {new Date().getFullYear()} Rotaract Club of KIT Sunshine</span>
          <span>Made with care by the club team</span>
        </div>
      </div>
    </footer>
  );
}
