import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import heic2any from "heic2any";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Album = Database["public"]["Tables"]["gallery_albums"]["Row"];
type Img = Database["public"]["Tables"]["gallery_images"]["Row"];
type Reel = Database["public"]["Tables"]["reels"]["Row"];

export const Route = createFileRoute("/admin/gallery")({ component: AdminGallery });

function AdminGallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [images, setImages] = useState<Img[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  async function loadAll() {
    const [{ data: a }, { data: r }] = await Promise.all([
      supabase.from("gallery_albums").select("*").order("created_at", { ascending: false }),
      supabase.from("reels").select("*").order("display_order"),
    ]);
    setAlbums(a ?? []); setReels(r ?? []);
  }
  async function loadImgs(id: string) {
    const { data } = await supabase.from("gallery_images").select("*").eq("album_id", id).order("display_order");
    setImages(data ?? []);
  }
  useEffect(() => { loadAll(); }, []);
  useEffect(() => { if (selected) loadImgs(selected); else setImages([]); }, [selected]);

  async function addAlbum(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = String(new FormData(form).get("title") ?? "").trim();
    if (!title) return;
    const { error } = await supabase.from("gallery_albums").insert({ title });
    if (error) return toast.error(error.message);
    form.reset(); loadAll();
  }
  async function delAlbum(id: string) {
    if (!confirm("Delete album and images?")) return;
    const { error } = await supabase.from("gallery_albums").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (selected === id) setSelected(null);
    loadAll();
  }
  async function addImage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    
    let image_url = "";
    let file = fd.get("image_file") as File;
    
    if (file && file.size > 0) {
      setUploading(true);
      try {
        let ext = file.name.split('.').pop()?.toLowerCase() || "";
        
        // Convert HEIC to JPEG so browsers can actually render it
        if (ext === "heic" || ext === "heif") {
          toast.info("Optimizing Apple HEIC image...");
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8
          });
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          file = new File([blob], file.name.replace(/\.hei[cf]$/i, ".jpg"), { type: "image/jpeg" });
          ext = "jpg";
        }

        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("public_images").upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("public_images").getPublicUrl(fileName);
        image_url = publicUrlData.publicUrl;
      } catch (err: any) {
        setUploading(false);
        return toast.error("Upload failed: " + err.message);
      }
      setUploading(false);
    }
    
    if (!image_url) return toast.error("Please provide an image file.");

    const { error } = await supabase.from("gallery_images").insert({
      album_id: selected, image_url,
      caption: String(fd.get("caption") ?? "").trim() || null,
    });
    if (error) return toast.error(error.message);
    form.reset(); loadImgs(selected);
  }
  async function delImage(id: string) {
    await supabase.from("gallery_images").delete().eq("id", id);
    if (selected) loadImgs(selected);
  }
  async function addReel(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const embed_url = String(fd.get("embed_url") ?? "").trim();
    if (!embed_url) return;
    const { error } = await supabase.from("reels").insert({
      embed_url, caption: String(fd.get("caption") ?? "").trim() || null,
    });
    if (error) return toast.error(error.message);
    form.reset(); loadAll();
  }
  async function delReel(id: string) {
    await supabase.from("reels").delete().eq("id", id);
    loadAll();
  }

  return (
    <div className="space-y-10">
      <div><h1 className="text-2xl font-bold">Gallery</h1></div>

      <section>
        <h2 className="text-lg font-semibold">Albums</h2>
        <form onSubmit={addAlbum} className="glass mt-3 flex gap-2 p-3">
          <input name="title" placeholder="Album title" className="flex-1 rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm outline-none" />
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}><Plus className="inline h-4 w-4" /> Add</button>
        </form>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((a) => (
            <div key={a.id} onClick={() => setSelected(a.id === selected ? null : a.id)} className={`glass flex cursor-pointer items-center gap-3 p-3 ${selected === a.id ? "ring-2 ring-[color:var(--brand-cranberry-hex)]" : ""}`}>
              <div className="flex-1 truncate text-sm">{a.title}</div>
              <button onClick={(ev) => { ev.stopPropagation(); delAlbum(a.id); }} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <section>
          <h2 className="text-lg font-semibold">Photos in album</h2>
          
          <form onSubmit={addImage} className="glass mt-3 grid gap-2 p-3 md:grid-cols-[1fr_1fr_auto]">
            <input name="image_file" type="file" accept="image/*, .heic" className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20" />
            <input name="caption" placeholder="Caption" className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm outline-none" />
            <button disabled={uploading} className="rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" style={{ background: "var(--gradient-brand)" }}>
              {uploading ? "Uploading..." : "Add"}
            </button>
            {uploading && (
              <div className="md:col-span-3 mt-1 h-1.5 w-full bg-muted overflow-hidden rounded-full">
                <div className="h-full bg-primary animate-pulse" style={{ width: "100%", background: "var(--gradient-brand)" }} />
              </div>
            )}
          </form>
          
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((i) => (
              <div key={i.id} className="glass overflow-hidden">
                <img src={i.image_url} alt="" className="aspect-square w-full object-cover" />
                <div className="flex items-center justify-between p-2 text-xs text-muted-foreground">
                  <span className="truncate">{i.caption ?? "—"}</span>
                  <button onClick={() => delImage(i.id)} className="grid h-7 w-7 place-items-center rounded-full border border-border hover:bg-muted"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold">Reels</h2>
        <form onSubmit={addReel} className="glass mt-3 grid gap-2 p-3 md:grid-cols-[1fr_1fr_auto]">
          <input name="embed_url" placeholder="Embed URL" className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm outline-none" />
          <input name="caption" placeholder="Caption" className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm outline-none" />
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>Add</button>
        </form>
        <div className="mt-3 space-y-2">
          {reels.map((r) => (
            <div key={r.id} className="glass flex items-center gap-3 p-3">
              <div className="flex-1 truncate text-sm text-foreground/80">{r.embed_url}</div>
              <button onClick={() => delReel(r.id)} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}