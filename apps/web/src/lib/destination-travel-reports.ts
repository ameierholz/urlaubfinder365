import { createClient } from "@supabase/supabase-js";

export interface DestTravelReport {
  id: string;
  displayName: string;
  title: string;
  highlights: string | null;
  rating: number;
  coverImageUrl: string | null;
  visitedAt: string | null;
  createdAt: string;
  likesCount: number;
}

/**
 * Holt veröffentlichte Reiseberichte aus `travel_reports`, deren
 * `destination`-Feld den Stadtnamen enthält (z.B. "Antalya, Türkei").
 * Gibt bei Fehler/Leere ein leeres Array zurück – kein Fake-Content.
 */
export async function fetchDestinationTravelReports(
  destinationName: string,
  limit = 4
): Promise<DestTravelReport[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("travel_reports")
      .select("id, display_name, title, highlights, rating, cover_image_url, visited_at, created_at, likes_count")
      .eq("is_published", true)
      .ilike("destination", `%${destinationName}%`)
      .order("likes_count", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((r) => ({
      id: r.id as string,
      displayName: (r.display_name as string) ?? "Reisender",
      title: (r.title as string) ?? "",
      highlights: (r.highlights as string) ?? null,
      rating: Number(r.rating) || 0,
      coverImageUrl: (r.cover_image_url as string) ?? null,
      visitedAt: (r.visited_at as string) ?? null,
      createdAt: (r.created_at as string) ?? new Date().toISOString(),
      likesCount: Number(r.likes_count) || 0,
    }));
  } catch {
    return [];
  }
}
