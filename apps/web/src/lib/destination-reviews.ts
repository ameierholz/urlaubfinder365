import { createClient } from "@supabase/supabase-js";

export interface DestinationReview {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  traveled_at: string | null;
  created_at: string;
}

export interface DestinationReviewStats {
  average: number;       // 1.0 - 5.0
  count: number;         // Anzahl veröffentlichter Reviews
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  recent: DestinationReview[]; // max. 5 neueste
}

const EMPTY: DestinationReviewStats = {
  average: 0,
  count: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  recent: [],
};

/**
 * Liest veröffentlichte Bewertungen aus `destination_reviews` für ein Ziel.
 * Gibt bei leerer Tabelle oder Fehler ein Empty-Stats-Objekt zurück –
 * dann wird KEIN AggregateRating JSON-LD gerendert (keine Fake-Reviews).
 */
export async function fetchDestinationReviews(
  slug: string
): Promise<DestinationReviewStats> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("destination_reviews")
      .select("id, rating, title, content, traveled_at, created_at")
      .eq("destination_slug", slug)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error || !data || data.length === 0) return EMPTY;

    const rows = data as DestinationReview[];
    const sum = rows.reduce((acc, r) => acc + r.rating, 0);
    const average = Math.round((sum / rows.length) * 10) / 10;
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of rows) {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    }

    return {
      average,
      count: rows.length,
      distribution,
      recent: rows.slice(0, 5),
    };
  } catch {
    return EMPTY;
  }
}
