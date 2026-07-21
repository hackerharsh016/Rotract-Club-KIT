import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "backdrop-blur-xl bg-background/40 border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white shadow-lg"
            style={{ background: "var(--gradient-brand)" }}
          >
            R
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Rotaract KIT Sunshine</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              KIT College · Kolhapur
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground hover:bg-muted/40"
              activeProps={{ className: "text-foreground bg-muted font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/events"
          className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 md:inline-flex"
          style={{ background: "var(--gradient-brand)" }}
        >
          Register
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-muted/40 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background/70 backdrop-blur-xl md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base text-foreground/85 hover:bg-muted/40"
                activeProps={{ className: "text-foreground bg-muted font-medium" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/events"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-2xl px-4 py-3 text-center text-sm font-semibold text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              Register for an event
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
