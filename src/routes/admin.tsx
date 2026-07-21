import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Calendar, Users, Image, MessageSquare, UserCircle, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Rotaract KIT Sunshine" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        setErrorMsg(`Auth error: ${userError.message}`);
        setState("denied");
        return;
      }
      if (!user) {
        navigate({ to: "/auth" });
        return;
      }
      setEmail(user.email ?? null);
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (rolesError) {
        setErrorMsg(`Database error: ${rolesError.message} (code: ${rolesError.code})`);
        setState("denied");
        return;
      }

      const isAdmin = roles && roles.length > 0;
      if (!isAdmin) {
        setErrorMsg(`User role check completed, but no 'admin' role was found for user ID: ${user.id}`);
      }
      setState(isAdmin ? "ok" : "denied");
    })();
  }, [navigate]);

  if (state === "loading") {
    return (
      <div className="grid min-h-[60vh] place-items-center text-muted-foreground">Loading admin…</div>
    );
  }
  if (state === "denied") {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-5">
        <div className="glass p-8 text-center w-full">
          <h1 className="text-xl font-semibold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in but not an admin.
          </p>
          {errorMsg && (
            <p className="mt-4 rounded bg-red-500/10 p-3 text-xs text-red-400 font-mono text-left break-all border border-red-500/20">
              {errorMsg}
            </p>
          )}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="mt-5 rounded-full border border-border px-4 py-2 text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const nav: Array<{ to: string; label: string; icon: typeof Home; exact?: boolean }> = [
    { to: "/admin", label: "Overview", icon: Home, exact: true },
    { to: "/admin/events", label: "Events", icon: Calendar },
    { to: "/admin/registrations", label: "Registrations", icon: Users },
    { to: "/admin/team", label: "Team", icon: UserCircle },
    { to: "/admin/gallery", label: "Gallery", icon: Image },
    { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-[240px_1fr]">
      <aside className="glass h-fit p-4 md:sticky md:top-24">
        <div className="mb-4 px-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Signed in</div>
          <div className="mt-0.5 truncate text-sm">{email}</div>
        </div>
        <nav className="grid gap-1">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to as "/admin"}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                  active ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/" });
          }}
          className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}