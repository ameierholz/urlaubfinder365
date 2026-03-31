import type { SupabaseClient } from "@supabase/supabase-js";

// Untyped Client bis `supabase gen types` die echten Typen generiert.
// Danach: SupabaseClient<Database> verwenden.
type Client = SupabaseClient;

// ── Destinations ─────────────────────────────────────────────────

export async function getDestinations(supabase: Client) {
  return supabase
    .from("destinations")
    .select("*")
    .eq("is_active", true)
    .order("name");
}

export async function getDestinationBySlug(
  supabase: Client,
  slug: string
) {
  return supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
}

export async function getDestinationsByContinent(
  supabase: Client,
  continent: string
) {
  return supabase
    .from("destinations")
    .select("*")
    .eq("continent", continent)
    .eq("is_active", true)
    .order("name");
}

// ── Offers ───────────────────────────────────────────────────────

export async function getOffersByDestination(
  supabase: Client,
  destinationId: string,
  limit = 12
) {
  return supabase
    .from("offers")
    .select("*")
    .eq("destination_id", destinationId)
    .eq("is_active", true)
    .order("price_cents", { ascending: true })
    .limit(limit);
}

export async function getLatestOffers(supabase: Client, limit = 12) {
  return supabase
    .from("offers")
    .select("*, destinations(name, slug, country)")
    .eq("is_active", true)
    .order("collected_at", { ascending: false })
    .limit(limit);
}

export async function getLastMinuteOffers(supabase: Client, limit = 20) {
  return supabase
    .from("offers")
    .select("*, destinations(name, slug, country)")
    .eq("type", "lastminute")
    .eq("is_active", true)
    .order("price_cents", { ascending: true })
    .limit(limit);
}

// ── Favorites ────────────────────────────────────────────────────

export async function getUserFavorites(supabase: Client, userId: string) {
  return supabase
    .from("favorites")
    .select("*, destinations(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function toggleFavorite(
  supabase: Client,
  userId: string,
  destinationId: string
) {
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("destination_id", destinationId)
    .maybeSingle();

  if (existing) {
    return supabase.from("favorites").delete().eq("id", existing.id);
  }
  return supabase
    .from("favorites")
    .insert({ user_id: userId, destination_id: destinationId });
}

// ── Price Alerts ─────────────────────────────────────────────────

export async function getUserPriceAlerts(
  supabase: Client,
  userId: string
) {
  return supabase
    .from("price_alerts")
    .select("*, destinations(name, slug)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

// ── Reports ──────────────────────────────────────────────────────

export async function getPublishedReports(
  supabase: Client,
  limit = 20
) {
  return supabase
    .from("reports")
    .select("*, users(display_name, avatar_url), destinations(name, slug)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);
}

export async function getReportsByDestination(
  supabase: Client,
  destinationId: string
) {
  return supabase
    .from("reports")
    .select("*, users(display_name, avatar_url)")
    .eq("destination_id", destinationId)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
}
