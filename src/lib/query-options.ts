import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const upcomingEventsQuery = queryOptions({
  queryKey: ["events", "upcoming"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(6);
    if (error) throw error;
    return data ?? [];
  },
});

export const allEventsQuery = queryOptions({
  queryKey: ["events", "all"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("starts_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export function eventBySlugQuery(slug: string) {
  return queryOptions({
    queryKey: ["event", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function eventSeatCountQuery(eventId: string) {
  return queryOptions({
    queryKey: ["event-seats", eventId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId);
      if (error) throw error;
      return count ?? 0;
    },
  });
}

export const teamQuery = queryOptions({
  queryKey: ["team"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const albumsWithImagesQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async () => {
    const { data: albums, error } = await supabase
      .from("gallery_albums")
      .select("*, gallery_images(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return albums ?? [];
  },
});

export const reelsQuery = queryOptions({
  queryKey: ["reels"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("reels")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export type EventRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_url: string | null;
  venue: string | null;
  starts_at: string;
  ends_at: string | null;
  category: string | null;
  max_seats: number;
  is_open: boolean;
  created_at: string;
};
