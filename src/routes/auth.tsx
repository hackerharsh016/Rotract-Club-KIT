import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Rotaract KIT Sunshine" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
    }
    navigate({ to: "/admin" });
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-5 py-16">
      <div className="glass w-full p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-gold-hex)]">
          Admin
        </div>
        <h1 className="mt-2 text-2xl font-bold">
          {mode === "signin" ? "Sign in" : "Create admin account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup"
            ? "The first account created becomes the club admin."
            : "Restricted to club administrators."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs text-muted-foreground">Email</span>
            <input
              name="email"
              type="email"
              required
              className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand-cranberry-hex)]"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs text-muted-foreground">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand-cranberry-hex)]"
            />
          </label>
          <button
            disabled={busy}
            className="mt-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl disabled:opacity-70"
            style={{ background: "var(--gradient-brand)" }}
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-5 text-xs text-muted-foreground hover:text-white"
        >
          {mode === "signin"
            ? "Need an admin account? Create one"
            : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}