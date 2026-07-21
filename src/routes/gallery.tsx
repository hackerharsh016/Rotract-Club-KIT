import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { albumsWithImagesQuery, reelsQuery } from "@/lib/query-options";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery · Rotaract KIT Sunshine" },
      {
        name: "description",
        content:
          "Photos and reels from Rotaract KIT Sunshine events, projects, and campus life.",
      },
      { property: "og:title", content: "Gallery · Rotaract KIT Sunshine" },
      { property: "og:description", content: "Photos and reels from our club." },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(albumsWithImagesQuery),
      context.queryClient.ensureQueryData(reelsQuery),
    ]);
  },
  component: Gallery,
});

function Gallery() {
  const { data: albums } = useSuspenseQuery(albumsWithImagesQuery);
  const { data: reels } = useSuspenseQuery(reelsQuery);
  const [lb, setLb] = useState<{ open: boolean; slides: { src: string }[]; index: number }>(
    { open: false, slides: [], index: 0 },
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-gold-hex)]">
        Gallery
      </div>
      <h1 className="mt-3 text-4xl font-bold md:text-6xl">
        Moments that <span className="text-gradient-brand">matter</span>.
      </h1>

      {reels.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold">Reels</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {reels.map((r) => (
              <div key={r.id} className="glass overflow-hidden">
                <div className="relative aspect-[9/16]">
                  <iframe
                    src={r.embed_url}
                    title={r.caption ?? "Reel"}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                {r.caption ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">{r.caption}</div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 space-y-16">
        {albums.length === 0 ? (
          <div className="glass grid place-items-center px-6 py-20 text-center text-muted-foreground">
            Photos will appear here soon.
          </div>
        ) : null}
        {albums.map((album) => {
          const imgs = ((album as unknown as { gallery_images: { id: string; image_url: string; caption: string | null }[] }).gallery_images) ?? [];
          const slides = imgs.map((i) => ({ src: i.image_url }));
          return (
            <div key={album.id}>
              <h2 className="text-xl font-semibold">{album.title}</h2>
              <div className="mt-5 columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
                {imgs.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setLb({ open: true, slides, index: i })}
                    className="mb-4 block w-full overflow-hidden rounded-2xl border border-border bg-muted/40"
                  >
                    <img
                      src={img.image_url}
                      alt={img.caption ?? album.title}
                      loading="lazy"
                      className="w-full transition duration-500 hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <Lightbox
        open={lb.open}
        close={() => setLb((s) => ({ ...s, open: false }))}
        slides={lb.slides}
        index={lb.index}
      />
    </div>
  );
}