/**
 * AdSlot — Server Component für admin-verwaltete Werbeplätze.
 *
 * Lädt den Code für einen Slot aus `ad_slots` und rendert ihn als HTML.
 * Der Admin pflegt den Code unter /admin/werbeplaetze/ — kann beliebiger
 * HTML/JS Snippet sein (Adup-tech, GoogleAds, AdSense, eigene Banner …).
 *
 * Sicherheit: Code wird per dangerouslySetInnerHTML eingespielt. Nur
 * vertrauenswürdige Admins (Service-Role-Check in der Save-API) können
 * Code hinterlegen.
 *
 * Caching: ISR mit 5min revalidate, damit Änderungen schnell live sind
 * ohne bei jedem Page-Hit die DB anzupingen.
 */

import { createClient } from "@supabase/supabase-js";

interface Props {
  /** Slot-Key wie in der ad_slots-Tabelle (z.B. "destination_content_top") */
  slotKey: string;
  /** Optional: zusätzliche CSS-Klasse für den Wrapper */
  className?: string;
  /** Optional: Min-Höhe in px (verhindert Layout-Shift während des Ladens) */
  minHeight?: number;
}

// 5 Min Cache pro Page-Render — Admin-Updates landen schnell live,
// aber bei viel Traffic nicht jeder Hit eine DB-Query.
async function loadSlot(slotKey: string): Promise<{ code: string } | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
  const { data, error } = await supabase
    .from("ad_slots")
    .select("code")
    .eq("slot_key", slotKey)
    .eq("enabled", true)
    .maybeSingle();
  if (error || !data?.code || !data.code.trim()) return null;
  return { code: data.code };
}

export default async function AdSlot({ slotKey, className = "", minHeight }: Props) {
  const slot = await loadSlot(slotKey);
  if (!slot) return null;

  return (
    <div
      className={`uf-ad-slot uf-ad-slot--${slotKey} ${className}`.trim()}
      style={minHeight ? { minHeight: `${minHeight}px` } : undefined}
      data-slot={slotKey}
      dangerouslySetInnerHTML={{ __html: slot.code }}
    />
  );
}
