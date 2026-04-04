/**
 * supabase-db.ts
 * Drop-in-Ersatz für firestore.ts — identische Funktionssignaturen, Supabase-Backend.
 * Firebase wird nur noch für Push/FCM genutzt (CLAUDE.md).
 */

import { createBrowserClient } from "@supabase/ssr";
import type {
  UserProfile, TravelPreferences, ChecklistItem, SavedTrip, TravelOffer,
  SavedActivity, TiqetsProduct, PriceAlert, TripPlan, TravelDocument,
  TravelTip, TravelReport, TravelReportComment, CommunityProfile,
  TravelGroup, GroupPost, PriceTrend,
} from "@/types";

function db() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Nutzerprofile
// ══════════════════════════════════════════════════════════════════════════════

export async function createUserProfile(uid: string, email: string, displayName: string | null): Promise<UserProfile> {
  const profile: UserProfile = {
    uid, email, displayName,
    createdAt: new Date().toISOString(),
    savedTrips: [],
    favoriteDestinations: [],
  };
  await db().from("users").upsert({ id: uid, display_name: displayName }, { onConflict: "id", ignoreDuplicates: true });
  await db().from("community_profiles").upsert({
    uid,
    display_name: displayName ?? email.split("@")[0],
    visited_countries: [],
  }, { onConflict: "uid", ignoreDuplicates: true });
  return profile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const { data } = await db()
    .from("users")
    .select("id, display_name, created_at, favorite_destinations, saved_trip_codes, preferences, checklist, notes")
    .eq("id", uid)
    .maybeSingle();
  if (!data) return null;
  return {
    uid: data.id,
    email: "",
    displayName: data.display_name ?? null,
    createdAt: data.created_at,
    savedTrips: (data.saved_trip_codes as string[]) ?? [],
    favoriteDestinations: (data.favorite_destinations as string[]) ?? [],
    preferences: (data.preferences as TravelPreferences | undefined) ?? undefined,
    checklist: (data.checklist as ChecklistItem[] | undefined) ?? undefined,
    notes: data.notes ?? undefined,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Gespeicherte Reisen
// ══════════════════════════════════════════════════════════════════════════════

export async function saveTrip(uid: string, offer: TravelOffer): Promise<string> {
  const { data, error } = await db()
    .from("saved_trips")
    .insert({ user_id: uid, offer })
    .select("id")
    .single();
  if (error) throw error;
  await db().from("users").update({
    saved_trip_codes: db().rpc as unknown as string[],
  });
  // Array-append via rpc
  await db().rpc("array_append_unique", { table_name: "users", col: "saved_trip_codes", row_id: uid, val: offer.product_code }).maybeSingle();
  return data.id;
}

export async function unsaveTrip(uid: string, tripDocId: string, productCode: string): Promise<void> {
  await db().from("saved_trips").update({ deleted: true }).eq("id", tripDocId).eq("user_id", uid);
  // Remove product code from users.saved_trip_codes
  const { data } = await db().from("users").select("saved_trip_codes").eq("id", uid).single();
  const codes = ((data?.saved_trip_codes as string[]) ?? []).filter((c) => c !== productCode);
  await db().from("users").update({ saved_trip_codes: codes }).eq("id", uid);
}

export async function getUserSavedTrips(uid: string): Promise<SavedTrip[]> {
  const { data, error } = await db()
    .from("saved_trips")
    .select("id, user_id, offer, saved_at, notes")
    .eq("user_id", uid)
    .eq("deleted", false)
    .order("saved_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    userId: r.user_id,
    offer: r.offer as TravelOffer,
    savedAt: r.saved_at,
    notes: r.notes ?? undefined,
  }));
}

// ══════════════════════════════════════════════════════════════════════════════
// Favoriten-Urlaubsziele
// ══════════════════════════════════════════════════════════════════════════════

export async function toggleFavoriteDestination(uid: string, slug: string, isFav: boolean): Promise<void> {
  const { data } = await db().from("users").select("favorite_destinations").eq("id", uid).single();
  const current = (data?.favorite_destinations as string[]) ?? [];
  const updated = isFav ? current.filter((s) => s !== slug) : [...new Set([...current, slug])];
  await db().from("users").update({ favorite_destinations: updated }).eq("id", uid);
}

// ══════════════════════════════════════════════════════════════════════════════
// Reise-Präferenzen / Checkliste / Notizen
// ══════════════════════════════════════════════════════════════════════════════

export async function updateTravelPreferences(uid: string, preferences: TravelPreferences): Promise<void> {
  await db().from("users").update({ preferences }).eq("id", uid);
}

export async function updateChecklist(uid: string, checklist: ChecklistItem[]): Promise<void> {
  await db().from("users").update({ checklist }).eq("id", uid);
}

export async function updateNotes(uid: string, notes: string): Promise<void> {
  await db().from("users").update({ notes }).eq("id", uid);
}

export async function updateUserProfile(uid: string, data: { displayName?: string }): Promise<void> {
  if (data.displayName !== undefined) {
    await db().from("users").update({ display_name: data.displayName }).eq("id", uid);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Gespeicherte Aktivitäten
// ══════════════════════════════════════════════════════════════════════════════

export async function saveActivity(uid: string, activity: TiqetsProduct): Promise<string> {
  const { data, error } = await db()
    .from("saved_activities")
    .insert({ user_id: uid, activity })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function unsaveActivity(uid: string, activityDocId: string): Promise<void> {
  await db().from("saved_activities").update({ deleted: true }).eq("id", activityDocId).eq("user_id", uid);
}

export async function getUserSavedActivities(uid: string): Promise<SavedActivity[]> {
  const { data, error } = await db()
    .from("saved_activities")
    .select("id, user_id, activity, saved_at")
    .eq("user_id", uid)
    .eq("deleted", false)
    .order("saved_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    userId: r.user_id,
    activity: r.activity as TiqetsProduct,
    savedAt: r.saved_at,
  }));
}

// ══════════════════════════════════════════════════════════════════════════════
// Preisalarme
// ══════════════════════════════════════════════════════════════════════════════

export async function createPriceAlert(
  uid: string,
  alert: Omit<PriceAlert, "id" | "userId" | "createdAt">
): Promise<string> {
  const { data, error } = await db()
    .from("price_alerts")
    .insert({
      user_id: uid,
      destination: alert.destination,
      destination_name: alert.destinationName,
      max_price: alert.maxPrice,
      adults: alert.adults,
      nights: alert.nights,
      enabled: alert.enabled,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function getPriceAlerts(uid: string): Promise<PriceAlert[]> {
  const { data, error } = await db()
    .from("price_alerts")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    userId: r.user_id,
    destination: r.destination,
    destinationName: r.destination_name,
    maxPrice: r.max_price,
    adults: r.adults,
    nights: r.nights,
    enabled: r.enabled,
    createdAt: r.created_at,
    matchedPrice: r.matched_price ?? undefined,
    matchedAt: r.matched_at ?? undefined,
    matchedDealCount: r.matched_deal_count ?? undefined,
  }));
}

export async function updatePriceAlert(
  uid: string,
  docId: string,
  updates: Partial<Omit<PriceAlert, "id" | "userId" | "createdAt">>
): Promise<void> {
  const mapped: Record<string, unknown> = {};
  if (updates.maxPrice !== undefined) mapped.max_price = updates.maxPrice;
  if (updates.adults !== undefined) mapped.adults = updates.adults;
  if (updates.nights !== undefined) mapped.nights = updates.nights;
  if (updates.enabled !== undefined) mapped.enabled = updates.enabled;
  if (updates.destinationName !== undefined) mapped.destination_name = updates.destinationName;
  await db().from("price_alerts").update(mapped).eq("id", docId).eq("user_id", uid);
}

export async function deletePriceAlert(uid: string, docId: string): Promise<void> {
  await db().from("price_alerts").delete().eq("id", docId).eq("user_id", uid);
}

// ══════════════════════════════════════════════════════════════════════════════
// Urlaubspläne
// ══════════════════════════════════════════════════════════════════════════════

export async function createTripPlan(
  uid: string,
  plan: Omit<TripPlan, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> {
  const { data, error } = await db()
    .from("trip_plans")
    .insert({
      user_id: uid,
      title: plan.title,
      destination: plan.destination,
      destination_name: plan.destinationName,
      start_date: plan.startDate,
      end_date: plan.endDate,
      adults: plan.adults,
      children: plan.children,
      budget: plan.budget,
      notes: plan.notes,
      status: plan.status,
      linked_trip_ids: plan.linkedTripIds,
      linked_activity_ids: plan.linkedActivityIds,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function getTripPlans(uid: string): Promise<TripPlan[]> {
  const { data, error } = await db()
    .from("trip_plans")
    .select("*")
    .eq("user_id", uid)
    .order("start_date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    userId: r.user_id,
    title: r.title,
    destination: r.destination,
    destinationName: r.destination_name,
    startDate: r.start_date,
    endDate: r.end_date,
    adults: r.adults,
    children: r.children,
    budget: r.budget,
    notes: r.notes ?? "",
    status: r.status as TripPlan["status"],
    linkedTripIds: (r.linked_trip_ids as string[]) ?? [],
    linkedActivityIds: (r.linked_activity_ids as string[]) ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function updateTripPlan(
  uid: string,
  docId: string,
  updates: Partial<Omit<TripPlan, "id" | "userId" | "createdAt">>
): Promise<void> {
  const mapped: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) mapped.title = updates.title;
  if (updates.destination !== undefined) mapped.destination = updates.destination;
  if (updates.destinationName !== undefined) mapped.destination_name = updates.destinationName;
  if (updates.startDate !== undefined) mapped.start_date = updates.startDate;
  if (updates.endDate !== undefined) mapped.end_date = updates.endDate;
  if (updates.adults !== undefined) mapped.adults = updates.adults;
  if (updates.children !== undefined) mapped.children = updates.children;
  if (updates.budget !== undefined) mapped.budget = updates.budget;
  if (updates.notes !== undefined) mapped.notes = updates.notes;
  if (updates.status !== undefined) mapped.status = updates.status;
  if (updates.linkedTripIds !== undefined) mapped.linked_trip_ids = updates.linkedTripIds;
  if (updates.linkedActivityIds !== undefined) mapped.linked_activity_ids = updates.linkedActivityIds;
  await db().from("trip_plans").update(mapped).eq("id", docId).eq("user_id", uid);
}

export async function deleteTripPlan(uid: string, docId: string): Promise<void> {
  await db().from("trip_plans").delete().eq("id", docId).eq("user_id", uid);
}

// ══════════════════════════════════════════════════════════════════════════════
// Reisedokumente
// ══════════════════════════════════════════════════════════════════════════════

export async function saveTravelDocument(
  uid: string,
  document: Omit<TravelDocument, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> {
  const { data, error } = await db()
    .from("travel_documents")
    .insert({
      user_id: uid,
      document_type: document.documentType,
      label: document.label,
      passport_number: document.passportNumber,
      expiry_date: document.expiryDate,
      issued_date: document.issuedDate,
      nationality: document.nationality,
      insurance_provider: document.insuranceProvider,
      policy_number: document.policyNumber,
      insurance_expiry_date: document.insuranceExpiryDate,
      emergency_phone: document.emergencyPhone,
      visa_country: document.visaCountry,
      visa_expiry_date: document.visaExpiryDate,
      vaccination_type: document.vaccinationType,
      vaccination_date: document.vaccinationDate,
      contact_name: document.contactName,
      contact_phone: document.contactPhone,
      contact_email: document.contactEmail,
      contact_relationship: document.contactRelationship,
      notes: document.notes,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function getTravelDocuments(uid: string): Promise<TravelDocument[]> {
  const { data, error } = await db()
    .from("travel_documents")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    userId: r.user_id,
    documentType: r.document_type as TravelDocument["documentType"],
    label: r.label ?? undefined,
    passportNumber: r.passport_number ?? undefined,
    expiryDate: r.expiry_date ?? undefined,
    issuedDate: r.issued_date ?? undefined,
    nationality: r.nationality ?? undefined,
    insuranceProvider: r.insurance_provider ?? undefined,
    policyNumber: r.policy_number ?? undefined,
    insuranceExpiryDate: r.insurance_expiry_date ?? undefined,
    emergencyPhone: r.emergency_phone ?? undefined,
    visaCountry: r.visa_country ?? undefined,
    visaExpiryDate: r.visa_expiry_date ?? undefined,
    vaccinationType: r.vaccination_type ?? undefined,
    vaccinationDate: r.vaccination_date ?? undefined,
    contactName: r.contact_name ?? undefined,
    contactPhone: r.contact_phone ?? undefined,
    contactEmail: r.contact_email ?? undefined,
    contactRelationship: r.contact_relationship ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function updateTravelDocument(
  uid: string,
  docId: string,
  updates: Partial<Omit<TravelDocument, "id" | "userId" | "createdAt">>
): Promise<void> {
  const mapped: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.documentType !== undefined) mapped.document_type = updates.documentType;
  if (updates.label !== undefined) mapped.label = updates.label;
  if (updates.passportNumber !== undefined) mapped.passport_number = updates.passportNumber;
  if (updates.expiryDate !== undefined) mapped.expiry_date = updates.expiryDate;
  if (updates.issuedDate !== undefined) mapped.issued_date = updates.issuedDate;
  if (updates.nationality !== undefined) mapped.nationality = updates.nationality;
  if (updates.insuranceProvider !== undefined) mapped.insurance_provider = updates.insuranceProvider;
  if (updates.policyNumber !== undefined) mapped.policy_number = updates.policyNumber;
  if (updates.insuranceExpiryDate !== undefined) mapped.insurance_expiry_date = updates.insuranceExpiryDate;
  if (updates.emergencyPhone !== undefined) mapped.emergency_phone = updates.emergencyPhone;
  if (updates.visaCountry !== undefined) mapped.visa_country = updates.visaCountry;
  if (updates.visaExpiryDate !== undefined) mapped.visa_expiry_date = updates.visaExpiryDate;
  if (updates.vaccinationType !== undefined) mapped.vaccination_type = updates.vaccinationType;
  if (updates.vaccinationDate !== undefined) mapped.vaccination_date = updates.vaccinationDate;
  if (updates.contactName !== undefined) mapped.contact_name = updates.contactName;
  if (updates.contactPhone !== undefined) mapped.contact_phone = updates.contactPhone;
  if (updates.contactEmail !== undefined) mapped.contact_email = updates.contactEmail;
  if (updates.contactRelationship !== undefined) mapped.contact_relationship = updates.contactRelationship;
  if (updates.notes !== undefined) mapped.notes = updates.notes;
  await db().from("travel_documents").update(mapped).eq("id", docId).eq("user_id", uid);
}

export async function deleteTravelDocument(uid: string, docId: string): Promise<void> {
  await db().from("travel_documents").delete().eq("id", docId).eq("user_id", uid);
}

// ══════════════════════════════════════════════════════════════════════════════
// Travel Tips (Reisenden-Karte)
// ══════════════════════════════════════════════════════════════════════════════

// ── Bild-Upload für Travel Tips ───────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadTravelTipImage(uid: string, file: File): Promise<string> {
  // Server-seitige Validierung: MIME-Typ und Groesse
  if (!ALLOWED_IMAGE_TYPES[file.type]) {
    throw new Error("Nur JPEG, PNG, WebP und GIF Bilder sind erlaubt.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Bild darf maximal 5 MB groß sein.");
  }

  // Extension aus MIME-Typ ableiten (nicht vom Dateinamen!)
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  const path = `${uid}/${Date.now()}.${ext}`;
  const { error } = await db().storage.from("travel-tip-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = db().storage.from("travel-tip-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function getTravelTips(): Promise<TravelTip[]> {
  // RLS filtert bereits: nur approved + eigene Tipps sichtbar
  const { data, error } = await db()
    .from("travel_tips")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapTip);
}

export async function addTravelTip(
  uid: string,
  tip: Omit<TravelTip, "id" | "userId" | "createdAt" | "status">
): Promise<string> {
  const { data, error } = await db()
    .from("travel_tips")
    .insert({
      user_id: uid,
      display_name: tip.displayName,
      title: tip.title,
      description: tip.description,
      category: tip.category,
      location_name: tip.locationName,
      lat: tip.lat,
      lng: tip.lng,
      image_url: tip.imageUrl ?? null,
      status: "pending",
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function deleteTravelTip(uid: string, tipId: string): Promise<void> {
  await db().from("travel_tips").delete().eq("id", tipId).eq("user_id", uid);
}

// ── Eigene Tipps (alle Status) ────────────────────────────────────────────────
export async function getMyTravelTips(uid: string): Promise<TravelTip[]> {
  const { data, error } = await db()
    .from("travel_tips")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapTip);
}

// ── Community Feed: neueste freigegebene Tipps ────────────────────────────────
export async function getLatestApprovedTips(limit = 12): Promise<TravelTip[]> {
  const { data, error } = await db()
    .from("travel_tips")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapTip);
}

// ── Admin: Ausstehende Tipps ──────────────────────────────────────────────────
export async function getPendingTravelTips(): Promise<TravelTip[]> {
  const { data, error } = await db()
    .from("travel_tips")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapTip);
}

export async function approveTravelTip(tipId: string): Promise<void> {
  const { error } = await db()
    .from("travel_tips")
    .update({ status: "approved", admin_note: null })
    .eq("id", tipId);
  if (error) throw error;
}

export async function rejectTravelTip(tipId: string, note: string): Promise<void> {
  const { error } = await db()
    .from("travel_tips")
    .update({ status: "rejected", admin_note: note })
    .eq("id", tipId);
  if (error) throw error;
}

function mapTip(r: Record<string, unknown>): TravelTip {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    displayName: r.display_name as string,
    title: r.title as string,
    description: r.description as string,
    category: r.category as TravelTip["category"],
    locationName: r.location_name as string,
    lat: Number(r.lat),
    lng: Number(r.lng),
    createdAt: r.created_at,
    imageUrl: (r.image_url as string) ?? undefined,
    status: (r.status as TravelTip["status"]) ?? "pending",
    adminNote: (r.admin_note as string) ?? undefined,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Bereiste Länder
// ══════════════════════════════════════════════════════════════════════════════

export async function getVisitedCountries(uid: string): Promise<string[]> {
  const { data } = await db().from("visited_countries").select("countries").eq("user_id", uid).maybeSingle();
  return (data?.countries as string[]) ?? [];
}

export async function saveVisitedCountries(uid: string, countries: string[]): Promise<void> {
  await db().from("visited_countries").upsert({ user_id: uid, countries, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
}

// ══════════════════════════════════════════════════════════════════════════════
// Preisverläufe (öffentlich, vom Cron-Job befüllt)
// ══════════════════════════════════════════════════════════════════════════════

export async function getPriceTrend(slug: string): Promise<PriceTrend | null> {
  const { data } = await db().from("price_trends").select("*").eq("slug", slug).maybeSingle();
  if (!data) return null;
  return {
    slug: data.slug,
    destinationName: data.destination_name,
    lastUpdated: data.last_updated,
    currentMinPrice: data.current_min_price,
    currentDealCount: data.current_deal_count,
    snapshots: (data.snapshots as PriceTrend["snapshots"]) ?? [],
    pauschal: data.pauschal ?? undefined,
    hotel: data.hotel ?? undefined,
    ai: data.ai ?? undefined,
  };
}

export async function getPriceTrends(slugs: string[]): Promise<Record<string, PriceTrend>> {
  const results: Record<string, PriceTrend> = {};
  await Promise.all(slugs.map(async (slug) => {
    const t = await getPriceTrend(slug);
    if (t) results[slug] = t;
  }));
  return results;
}

// ══════════════════════════════════════════════════════════════════════════════
// Community: Urlaubsberichte
// ══════════════════════════════════════════════════════════════════════════════

function mapReport(r: Record<string, unknown>): TravelReport {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    displayName: r.display_name as string,
    destination: r.destination as string,
    country: r.country as string,
    title: r.title as string,
    highlights: r.highlights as string,
    lowlights: r.lowlights as string,
    tips: r.tips as string,
    priceRange: r.price_range as TravelReport["priceRange"],
    rating: r.rating as number,
    recommendation: r.recommendation as boolean,
    coverImageUrl: (r.cover_image_url as string) ?? undefined,
    visitedAt: r.visited_at as string,
    createdAt: r.created_at,
    likesCount: r.likes_count as number,
    likedBy: (r.liked_by as string[]) ?? [],
    commentsCount: r.comments_count as number,
    isPublished: r.is_published as boolean,
  };
}

export async function getTravelReports(limitN = 20): Promise<TravelReport[]> {
  const { data, error } = await db()
    .from("travel_reports")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limitN);
  if (error) throw error;
  return (data ?? []).map((r) => mapReport(r as unknown as Record<string, unknown>));
}

export async function getTravelReportsByUser(uid: string): Promise<TravelReport[]> {
  const { data, error } = await db()
    .from("travel_reports")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => mapReport(r as unknown as Record<string, unknown>));
}

export async function getTravelReport(id: string): Promise<TravelReport | null> {
  const { data } = await db().from("travel_reports").select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  return mapReport(data as unknown as Record<string, unknown>);
}

export async function createTravelReport(
  uid: string,
  data: Omit<TravelReport, "id" | "userId" | "createdAt" | "likesCount" | "likedBy" | "commentsCount" | "isPublished">
): Promise<string> {
  const { data: row, error } = await db()
    .from("travel_reports")
    .insert({
      user_id: uid,
      display_name: data.displayName,
      destination: data.destination,
      country: data.country,
      title: data.title,
      highlights: data.highlights,
      lowlights: data.lowlights,
      tips: data.tips,
      price_range: data.priceRange,
      rating: data.rating,
      recommendation: data.recommendation,
      cover_image_url: data.coverImageUrl,
      visited_at: data.visitedAt,
      is_published: false,
      likes_count: 0,
      liked_by: [],
      comments_count: 0,
    })
    .select("id")
    .single();
  if (error) throw error;
  return row.id;
}

export async function updateTravelReport(uid: string, id: string, data: Partial<TravelReport>): Promise<void> {
  const mapped: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (data.title !== undefined) mapped.title = data.title;
  if (data.highlights !== undefined) mapped.highlights = data.highlights;
  if (data.lowlights !== undefined) mapped.lowlights = data.lowlights;
  if (data.tips !== undefined) mapped.tips = data.tips;
  if (data.priceRange !== undefined) mapped.price_range = data.priceRange;
  if (data.rating !== undefined) mapped.rating = data.rating;
  if (data.recommendation !== undefined) mapped.recommendation = data.recommendation;
  if (data.coverImageUrl !== undefined) mapped.cover_image_url = data.coverImageUrl;
  if (data.visitedAt !== undefined) mapped.visited_at = data.visitedAt;
  await db().from("travel_reports").update(mapped).eq("id", id).eq("user_id", uid);
}

export async function deleteTravelReport(uid: string, id: string): Promise<void> {
  await db().from("travel_reports").delete().eq("id", id).eq("user_id", uid);
}

export async function publishTravelReport(uid: string, id: string): Promise<void> {
  await db().from("travel_reports").update({ is_published: true }).eq("id", id).eq("user_id", uid);
}

export async function likeTravelReport(uid: string, reportId: string, hasLiked: boolean): Promise<void> {
  const { data } = await db().from("travel_reports").select("likes_count, liked_by").eq("id", reportId).single();
  if (!data) return;
  const likedBy = (data.liked_by as string[]) ?? [];
  if (hasLiked) {
    await db().from("travel_reports").update({
      liked_by: likedBy.filter((u) => u !== uid),
      likes_count: Math.max(0, (data.likes_count as number) - 1),
    }).eq("id", reportId);
  } else {
    await db().from("travel_reports").update({
      liked_by: [...new Set([...likedBy, uid])],
      likes_count: (data.likes_count as number) + 1,
    }).eq("id", reportId);
  }
}

// ── Kommentare ────────────────────────────────────────────────────────────────

export async function getComments(reportId: string): Promise<TravelReportComment[]> {
  const { data, error } = await db()
    .from("travel_report_comments")
    .select("*")
    .eq("report_id", reportId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    reportId: r.report_id,
    userId: r.user_id,
    displayName: r.display_name,
    text: r.text,
    createdAt: r.created_at,
  }));
}

export async function addComment(reportId: string, uid: string, displayName: string, text: string): Promise<string> {
  const { data, error } = await db()
    .from("travel_report_comments")
    .insert({ report_id: reportId, user_id: uid, display_name: displayName, text })
    .select("id")
    .single();
  if (error) throw error;
  // Increment comments_count
  const { data: rep } = await db().from("travel_reports").select("comments_count").eq("id", reportId).single();
  await db().from("travel_reports").update({ comments_count: ((rep?.comments_count as number) ?? 0) + 1 }).eq("id", reportId);
  return data.id;
}

// ══════════════════════════════════════════════════════════════════════════════
// Community: Profile
// ══════════════════════════════════════════════════════════════════════════════

function mapCommunityProfile(r: Record<string, unknown>): CommunityProfile {
  return {
    uid: r.uid as string,
    displayName: r.display_name as string,
    photoURL: (r.photo_url as string) ?? undefined,
    bio: (r.bio as string) ?? undefined,
    location: (r.location as string) ?? undefined,
    nationality: (r.nationality as string) ?? undefined,
    visitedCountries: (r.visited_countries as string[]) ?? [],
    followersCount: (r.followers_count as number) ?? 0,
    followingCount: (r.following_count as number) ?? 0,
    reportsCount: (r.reports_count as number) ?? 0,
    tipsCount: (r.tips_count as number) ?? 0,
    groupsCount: (r.groups_count as number) ?? 0,
    travelFrequency: (r.travel_frequency as CommunityProfile["travelFrequency"]) ?? undefined,
    travelerType: (r.traveler_type as CommunityProfile["travelerType"]) ?? undefined,
    languages: (r.languages as string[]) ?? [],
    travelInterests: (r.travel_interests as string[]) ?? [],
  };
}

export async function getCommunityProfile(uid: string): Promise<CommunityProfile | null> {
  const { data } = await db().from("community_profiles").select("*").eq("uid", uid).maybeSingle();
  if (!data) return null;
  return mapCommunityProfile(data as unknown as Record<string, unknown>);
}

export async function updateCommunityProfile(
  uid: string,
  data: Partial<Omit<CommunityProfile, "uid">>
): Promise<void> {
  const mapped: Record<string, unknown> = {};
  if (data.displayName !== undefined) mapped.display_name = data.displayName;
  if (data.photoURL !== undefined) mapped.photo_url = data.photoURL;
  if (data.bio !== undefined) mapped.bio = data.bio;
  if (data.location !== undefined) mapped.location = data.location;
  if (data.nationality !== undefined) mapped.nationality = data.nationality;
  if (data.visitedCountries !== undefined) mapped.visited_countries = data.visitedCountries;
  if (data.travelFrequency !== undefined) mapped.travel_frequency = data.travelFrequency;
  if (data.travelerType !== undefined) mapped.traveler_type = data.travelerType;
  if (data.languages !== undefined) mapped.languages = data.languages;
  if (data.travelInterests !== undefined) mapped.travel_interests = data.travelInterests;
  await db().from("community_profiles").upsert({ uid, ...mapped }, { onConflict: "uid" });
}

export async function getCommunityProfiles(limitN = 24): Promise<CommunityProfile[]> {
  const { data, error } = await db()
    .from("community_profiles")
    .select("*")
    .order("reports_count", { ascending: false })
    .limit(limitN);
  if (error) throw error;
  return (data ?? []).map((r) => mapCommunityProfile(r as unknown as Record<string, unknown>));
}

// ── Follower-System ───────────────────────────────────────────────────────────

export async function followUser(uid: string, targetUid: string): Promise<void> {
  await db().from("user_follows").upsert({ follower_id: uid, following_id: targetUid }, { onConflict: "follower_id,following_id", ignoreDuplicates: true });
  await db().rpc("increment_follow_counts", { p_follower: uid, p_following: targetUid });
}

export async function unfollowUser(uid: string, targetUid: string): Promise<void> {
  await db().from("user_follows").delete().eq("follower_id", uid).eq("following_id", targetUid);
  await db().rpc("decrement_follow_counts", { p_follower: uid, p_following: targetUid });
}

export async function isFollowing(uid: string, targetUid: string): Promise<boolean> {
  const { data } = await db().from("user_follows").select("id").eq("follower_id", uid).eq("following_id", targetUid).maybeSingle();
  return !!data;
}

// ══════════════════════════════════════════════════════════════════════════════
// Community: Gruppen
// ══════════════════════════════════════════════════════════════════════════════

function mapGroup(r: Record<string, unknown>): TravelGroup {
  return {
    id: r.id as string,
    creatorId: r.creator_id as string,
    creatorName: r.creator_name as string,
    name: r.name as string,
    description: r.description as string,
    destination: r.destination as string | undefined,
    country: r.country as string | undefined,
    travelMonth: r.travel_month as string | undefined,
    category: (r.category as string ?? "destination") as import("@/types").GroupCategory,
    isPublic: r.is_public as boolean,
    membersCount: r.members_count as number,
    memberIds: (r.member_ids as string[]) ?? [],
    postsCount: r.posts_count as number,
    coverImageUrl: r.cover_image_url as string | undefined,
    tags: (r.tags as string[]) ?? [],
    createdAt: r.created_at,
  };
}

export async function getTravelGroups(limitN = 20): Promise<TravelGroup[]> {
  const { data, error } = await db()
    .from("travel_groups")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limitN);
  if (error) throw error;
  return (data ?? []).map((r) => mapGroup(r as unknown as Record<string, unknown>));
}

export async function getUserGroups(uid: string): Promise<TravelGroup[]> {
  const { data, error } = await db()
    .from("travel_groups")
    .select("*")
    .contains("member_ids", [uid]);
  if (error) throw error;
  return (data ?? []).map((r) => mapGroup(r as unknown as Record<string, unknown>));
}

export async function getTravelGroup(id: string): Promise<TravelGroup | null> {
  const { data } = await db().from("travel_groups").select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  return mapGroup(data as unknown as Record<string, unknown>);
}

export async function createGroup(
  uid: string,
  displayName: string,
  data: Omit<TravelGroup, "id" | "creatorId" | "creatorName" | "membersCount" | "memberIds" | "postsCount" | "createdAt">
): Promise<string> {
  const { data: row, error } = await db()
    .from("travel_groups")
    .insert({
      creator_id: uid,
      creator_name: displayName,
      name: data.name,
      description: data.description,
      destination: data.destination,
      tags: data.tags,
      is_public: data.isPublic,
      members_count: 1,
      member_ids: [uid],
      posts_count: 0,
    })
    .select("id")
    .single();
  if (error) throw error;
  return row.id;
}

export async function joinGroup(uid: string, groupId: string): Promise<void> {
  const { data } = await db().from("travel_groups").select("member_ids, members_count").eq("id", groupId).single();
  if (!data) return;
  const ids = [...new Set([...(data.member_ids as string[]), uid])];
  await db().from("travel_groups").update({ member_ids: ids, members_count: ids.length }).eq("id", groupId);
}

export async function leaveGroup(uid: string, groupId: string): Promise<void> {
  const { data } = await db().from("travel_groups").select("member_ids").eq("id", groupId).single();
  if (!data) return;
  const ids = (data.member_ids as string[]).filter((id) => id !== uid);
  await db().from("travel_groups").update({ member_ids: ids, members_count: ids.length }).eq("id", groupId);
}

export async function getGroupPosts(groupId: string): Promise<GroupPost[]> {
  const { data, error } = await db()
    .from("group_posts")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    groupId: r.group_id,
    userId: r.user_id,
    displayName: r.display_name,
    text: r.text,
    likesCount: r.likes_count,
    createdAt: r.created_at,
  }));
}

export async function addGroupPost(uid: string, displayName: string, groupId: string, text: string): Promise<string> {
  const { data, error } = await db()
    .from("group_posts")
    .insert({ group_id: groupId, user_id: uid, display_name: displayName, text, likes_count: 0 })
    .select("id")
    .single();
  if (error) throw error;
  const { data: grp } = await db().from("travel_groups").select("posts_count").eq("id", groupId).single();
  await db().from("travel_groups").update({ posts_count: ((grp?.posts_count as number) ?? 0) + 1 }).eq("id", groupId);
  return data.id;
}

// ══════════════════════════════════════════════════════════════════════════════
// Daily Streaks & Travel Coins
// ══════════════════════════════════════════════════════════════════════════════

export interface UserStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalCoins: number;
  lastCheckinDate: string | null;
  checkinHistory: string[];
}

export interface CoinTransaction {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function getUserStreak(userId: string): Promise<UserStreak | null> {
  const { data } = await db().from("user_streaks").select("*").eq("user_id", userId).maybeSingle();
  if (!data) return null;
  return {
    userId: data.user_id,
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
    totalCoins: data.total_coins,
    lastCheckinDate: data.last_checkin_date,
    checkinHistory: (data.checkin_history as string[]) ?? [],
  };
}

/** Returns { alreadyDone, coinsEarned, streak } */
export async function performDailyCheckin(userId: string): Promise<{
  alreadyDone: boolean;
  coinsEarned: number;
  streak: UserStreak;
}> {
  const today = todayISO();
  const existing = await getUserStreak(userId);

  if (existing?.lastCheckinDate === today) {
    return { alreadyDone: true, coinsEarned: 0, streak: existing };
  }

  // Calculate new streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yestISO = yesterday.toISOString().slice(0, 10);

  const prevStreak = existing?.currentStreak ?? 0;
  const newStreak = existing?.lastCheckinDate === yestISO ? prevStreak + 1 : 1;
  const longestStreak = Math.max(existing?.longestStreak ?? 0, newStreak);

  // Coins: 10 base + 5 bonus per week milestone
  const coinsEarned = 10 + (newStreak % 7 === 0 ? 50 : 0);
  const totalCoins = (existing?.totalCoins ?? 0) + coinsEarned;

  const history = [...(existing?.checkinHistory ?? []), today].slice(-90);

  const row = {
    user_id: userId,
    current_streak: newStreak,
    longest_streak: longestStreak,
    total_coins: totalCoins,
    last_checkin_date: today,
    checkin_history: history,
    updated_at: new Date().toISOString(),
  };

  await db().from("user_streaks").upsert(row, { onConflict: "user_id" });

  // Record coin transaction
  await db().from("coin_transactions").insert({
    user_id: userId,
    amount: coinsEarned,
    reason: newStreak % 7 === 0 ? `${newStreak}-Tage-Streak-Bonus!` : "Täglicher Check-in",
  });

  const streak: UserStreak = {
    userId,
    currentStreak: newStreak,
    longestStreak,
    totalCoins,
    lastCheckinDate: today,
    checkinHistory: history,
  };
  return { alreadyDone: false, coinsEarned, streak };
}

export async function getCoinHistory(userId: string): Promise<CoinTransaction[]> {
  const { data } = await db()
    .from("coin_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []).map((r) => ({
    id: r.id,
    amount: r.amount,
    reason: r.reason,
    createdAt: r.created_at,
  }));
}
