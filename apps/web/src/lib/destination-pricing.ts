import { createClient } from "@supabase/supabase-js";

export interface DestinationPriceStats {
  lowPrice: number | null;
  highPrice: number | null;
  avgPrice: number | null;
  currency: "EUR";
  sampleSize: number;
  lastUpdated: string | null;
}

/**
 * Liest den Preis-Bereich der letzten 90 Tage aus `price_history`
 * für ein Reiseziel (Profil: pauschal). Wird für Offer/AggregateOffer
 * Schema auf Destination-Seiten genutzt.
 *
 * Gibt bei Fehlern oder fehlenden Daten alle Felder als null zurück.
 */
export async function fetchDestinationPriceStats(
  slug: string
): Promise<DestinationPriceStats> {
  const empty: DestinationPriceStats = {
    lowPrice: null,
    highPrice: null,
    avgPrice: null,
    currency: "EUR",
    sampleSize: 0,
    lastUpdated: null,
  };

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const since = new Date();
    since.setDate(since.getDate() - 90);

    const { data, error } = await supabase
      .from("price_history")
      .select("date, min_price, avg_price")
      .eq("destination_slug", slug)
      .eq("profile", "pauschal")
      .gte("date", since.toISOString().slice(0, 10))
      .order("date", { ascending: true });

    if (error || !data || data.length === 0) return empty;

    const mins = data.map((r) => Number(r.min_price)).filter((n) => Number.isFinite(n) && n > 0);
    const avgs = data.map((r) => Number(r.avg_price)).filter((n) => Number.isFinite(n) && n > 0);

    if (mins.length === 0) return empty;

    return {
      lowPrice: Math.floor(Math.min(...mins)),
      highPrice: Math.ceil(Math.max(...avgs.length ? avgs : mins)),
      avgPrice: Math.round(mins.reduce((a, b) => a + b, 0) / mins.length),
      currency: "EUR",
      sampleSize: data.length,
      lastUpdated: data[data.length - 1]?.date ?? null,
    };
  } catch {
    return empty;
  }
}
