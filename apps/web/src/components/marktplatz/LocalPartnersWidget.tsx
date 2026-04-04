/**
 * LocalPartnersWidget – zeigt lokale Werbepartner als reichhaltige Karten in der Sidebar.
 * Jede Karte enthält: Titelbild, Avatar, Name, Kategorie, Beschreibung, Google Maps & Website.
 * Wenn keine aktiven Partner in der DB → Demo-Daten zeigen (Social Proof).
 */

import { createSupabaseServer } from "@/lib/supabase-server";
import Link from "next/link";
import { BadgeCheck, Megaphone, MapPin, ExternalLink } from "lucide-react";
import { DEMO_LOKALE_PARTNER } from "@/data/demo-partners";

type Partner = {
  id: string;
  name: string;
  kategorie?: string | null;
  bio: string | null;
  beschreibung?: string | null;
  avatar_url: string | null;
  titelbild_url?: string | null;
  google_maps_url?: string | null;
  website_url?: string | null;
  verifiziert: boolean;
  href?: string;
};

export default async function LocalPartnersWidget({ compact = false }: { compact?: boolean }) {
  let partners: Partner[] = [];

  try {
    const supabase = await createSupabaseServer();
    const { data: raw } = await supabase
      .from("werbeplaetze_buchungen")
      .select(`
        anbieter_profile:anbieter_id (
          id, name, bio, beschreibung, avatar_url, titelbild_url,
          google_maps_url, website_url, verifiziert
        )
      `)
      .eq("paket", "lokaler_partner")
      .eq("status", "aktiv")
      .limit(2);

    const fetched = ((raw ?? []) as Array<{ anbieter_profile: Partner | null }>)
      .map((b) => b.anbieter_profile)
      .filter(Boolean) as Partner[];

    partners = fetched.length > 0 ? fetched : [...DEMO_LOKALE_PARTNER];
  } catch {
    partners = [...DEMO_LOKALE_PARTNER];
  }

  // ── Compact-Modus (eingebettet in RightSidebar-Karte) ──────────────
  if (compact) {
    return (
      <div className="divide-y divide-gray-100">
        {partners.slice(0, 2).map((p) => (
          <div key={p.id}>
            {/* Banner */}
            {p.titelbild_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.titelbild_url}
                alt={p.name}
                className="w-full h-20 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-16 bg-linear-to-br from-[#1db682]/20 to-[#6991d8]/20 flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
            )}

            <div className="px-4 pt-2.5 pb-3">
              {/* Name + Kategorie + Badge */}
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-black text-gray-900">{p.name}</span>
                {p.verifiziert && <BadgeCheck className="w-3 h-3 text-[#1db682] shrink-0" />}
                {p.kategorie && (
                  <span className="text-[10px] text-[#1db682] font-semibold ml-auto shrink-0">{p.kategorie}</span>
                )}
              </div>

              {/* Beschreibung 2-zeilig */}
              {(p.beschreibung ?? p.bio) && (
                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-2.5">
                  {p.beschreibung ?? p.bio}
                </p>
              )}

              {/* Links */}
              <div className="flex items-center gap-3">
                {p.google_maps_url && (
                  <a
                    href={p.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 font-semibold"
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    Google Maps
                  </a>
                )}
                {p.website_url && (
                  <a
                    href={p.website_url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center gap-1 text-[11px] text-[#1db682] hover:text-[#18a270] font-semibold"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Megaphone className="w-3.5 h-3.5 text-[#1db682]" />
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Lokale Partner
          </p>
        </div>
        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
          Anzeige
        </span>
      </div>

      {partners.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Titelbild */}
          {p.titelbild_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.titelbild_url}
              alt={p.name}
              className="w-full h-24 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-16 bg-linear-to-br from-[#1db682]/20 to-[#6991d8]/20 flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          )}

          <div className="p-3">
            {/* Avatar + Name + Badge */}
            <div className="flex items-center gap-2 mb-2">
              <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm -mt-5 ring-2 ring-gray-100">
                {p.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.avatar_url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1db682] text-white text-xs font-black">
                    {p.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs font-black text-gray-900 truncate">{p.name}</span>
                  {p.verifiziert && <BadgeCheck className="w-3 h-3 text-[#1db682] shrink-0" />}
                </div>
                {p.kategorie && (
                  <span className="text-[10px] text-[#1db682] font-semibold">{p.kategorie}</span>
                )}
              </div>
            </div>

            {/* Beschreibung */}
            {(p.beschreibung ?? p.bio) && (
              <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 mb-3">
                {p.beschreibung ?? p.bio}
              </p>
            )}

            {/* Aktions-Links */}
            <div className="flex items-center gap-2">
              {p.google_maps_url && (
                <a
                  href={p.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  Maps
                </a>
              )}
              {p.website_url && (
                <a
                  href={p.website_url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-1 text-[11px] text-[#1db682] hover:text-[#18a270] font-semibold"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Footer-CTA */}
      <div className="bg-white rounded-xl border border-dashed border-[#1db682]/40 px-3 py-2.5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-gray-600">Werbeplatz frei</p>
          <p className="text-[10px] text-gray-400">ab 49 €/Monat</p>
        </div>
        <Link
          href="/werbepartner/"
          className="text-[11px] bg-[#1db682] text-white font-bold px-3 py-1.5 rounded-lg hover:bg-[#18a270] transition-colors whitespace-nowrap"
        >
          Hier werben →
        </Link>
      </div>
    </div>
  );
}
