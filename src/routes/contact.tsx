import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, MapPin, Instagram, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · Rotaract KIT Sunshine" },
      {
        name: "description",
        content:
          "Get in touch with Rotaract Club of KIT Sunshine — collaborations, sponsorships, or just to say hi.",
      },
      { property: "og:title", content: "Contact · Rotaract KIT Sunshine" },
      { property: "og:description", content: "Get in touch with our club." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
});

function Contact() {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    form.reset();
    toast.success("Message sent. We'll get back to you soon!");
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-gold-hex)]">
        Contact
      </div>
      <h1 className="mt-3 text-4xl font-bold md:text-6xl">
        Let's <span className="text-gradient-brand">talk</span>.
      </h1>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="glass p-8">
          <form onSubmit={onSubmit} className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs text-muted-foreground">Your name</span>
              <input
                name="name"
                required
                maxLength={100}
                className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand-cranberry-hex)]"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs text-muted-foreground">Email</span>
              <input
                name="email"
                type="email"
                required
                maxLength={255}
                className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand-cranberry-hex)]"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs text-muted-foreground">Message</span>
              <textarea
                name="message"
                required
                maxLength={2000}
                rows={6}
                className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand-cranberry-hex)]"
              />
            </label>
            <button
              disabled={submitting}
              className="mt-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:brightness-110 disabled:opacity-70"
              style={{ background: "var(--gradient-brand)" }}
            >
              {submitting ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>

        <div className="space-y-5">
          <div className="glass p-6">
            <div className="flex items-start gap-3">
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Where we are</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  KIT College of Engineering, Kolhapur, Maharashtra 416234
                </div>
              </div>
            </div>
          </div>
          <div className="glass p-6">
            <div className="flex items-start gap-3">
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <a
                  href="mailto:rotaract.kit@example.com"
                  className="mt-1 block text-sm text-muted-foreground hover:text-foreground"
                >
                  rotaract.kit@example.com
                </a>
              </div>
            </div>
          </div>
          <div className="glass p-6">
            <div className="font-semibold">Follow the club</div>
            <div className="mt-3 flex gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-muted"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-muted"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}