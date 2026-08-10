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
    <div className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500 pointer-events-none ${scrolled ? "pt-3 px-3 md:pt-5" : "pt-0 px-0"}`}>
      <header
        className={`pointer-events-auto w-full transition-all duration-500 overflow-hidden ${
          scrolled
            ? "max-w-6xl rounded-3xl border border-border bg-background/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl"
            : "max-w-full rounded-none border-b border-transparent bg-transparent"
        }`}
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 ${scrolled ? "py-2.5 md:py-3" : "py-4"}`}>
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <img
              src="/Rotract_logo.png"
              alt="Rotaract Logo"
              className={`object-contain drop-shadow-md transition-all duration-500 ${scrolled ? "h-8 w-8" : "h-10 w-10"}`}
            />
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
          <div className="border-t border-border/50 bg-background/50 backdrop-blur-xl md:hidden">
            <nav className="mx-auto grid max-w-7xl gap-1 px-5 py-4 pb-6">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-foreground/85 hover:bg-muted/60"
                  activeProps={{ className: "text-foreground bg-muted font-semibold" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/events"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-2xl px-4 py-3.5 text-center text-sm font-semibold text-white shadow-lg"
                style={{ background: "var(--gradient-brand)" }}
              >
                Register for an event
              </Link>
            </nav>
          </div>
        ) : null}
      </header>
    </div>
  );
}
