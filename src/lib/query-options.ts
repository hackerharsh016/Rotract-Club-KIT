import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const upcomingEventsQuery = queryOptions({
  queryKey: ["events", "upcoming"],
  queryFn: async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(6);
      if (error) {
        console.warn("[upcomingEventsQuery] Failed to fetch upcoming events:", error);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.warn("[upcomingEventsQuery] Error caught:", err);
      return [];
    }
  },
});

export const allEventsQuery = queryOptions({
  queryKey: ["events", "all"],
  queryFn: async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("starts_at", { ascending: false });
      if (error) {
        console.warn("[allEventsQuery] Failed to fetch all events:", error);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.warn("[allEventsQuery] Error caught:", err);
      return [];
    }
  },
});

export function eventBySlugQuery(slug: string) {
  return queryOptions({
    queryKey: ["event", slug],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error) {
          console.warn(`[eventBySlugQuery] Failed for slug ${slug}:`, error);
          return null;
        }
        return data;
      } catch (err) {
        console.warn(`[eventBySlugQuery] Error caught for slug ${slug}:`, err);
        return null;
      }
    },
  });
}

export function eventSeatCountQuery(eventId: string) {
  return queryOptions({
    queryKey: ["event-seats", eventId],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from("registrations")
          .select("id", { count: "exact", head: true })
          .eq("event_id", eventId);
        if (error) {
          console.warn(`[eventSeatCountQuery] Failed for event ${eventId}:`, error);
          return 0;
        }
        return count ?? 0;
      } catch (err) {
        console.warn(`[eventSeatCountQuery] Error caught for event ${eventId}:`, err);
        return 0;
      }
    },
  });
}

export const teamQuery = queryOptions({
  queryKey: ["team"],
  queryFn: async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) {
        console.warn("[teamQuery] Failed to fetch team members:", error);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.warn("[teamQuery] Error caught:", err);
      return [];
    }
  },
});

export const albumsWithImagesQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async () => {
    try {
      const { data: albums, error } = await supabase
        .from("gallery_albums")
        .select("*, gallery_images(*)")
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("[albumsWithImagesQuery] Failed to fetch albums:", error);
        return [];
      }
      return albums ?? [];
    } catch (err) {
      console.warn("[albumsWithImagesQuery] Error caught:", err);
      return [];
    }
  },
});

export const reelsQuery = queryOptions({
  queryKey: ["reels"],
  queryFn: async () => {
    try {
      const { data, error } = await supabase
        .from("reels")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) {
        console.warn("[reelsQuery] Failed to fetch reels:", error);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.warn("[reelsQuery] Error caught:", err);
      return [];
    }
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
  rules: string | null;
  prize_pool: string | null;
  created_at: string;
};
