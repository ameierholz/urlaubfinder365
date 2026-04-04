import { createSupabaseServer } from "@/lib/supabase-server";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Megaphone, Star, ExternalLink, MapPin } from "lucide-react";
import { DEMO_ANBIETER } from "@/data/demo-partners";

type FeaturedAngebot = {
  titel: string;
  preis: number;
  preistyp: string;
  foto_url: string | null;
};

type Anbieter = {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  titelbild_url?: string | null;
  verifiziert: boolean;
  bewertung?: number | null;
  bewertungenAnzahl?: number | null;
  featured_angebot?: FeaturedAngebot | null;
  standort?: string | null;
  href?: string;
};

const PREISTYP_LABEL: Record<string, string> = {
  pro_person:  "/ Person",
  pro_gruppe:  "/ Gruppe",
  festpreis:   "Festpreis",
  auf_anfrage: "Auf Anfrage",
};

export default async function SponsoredAnbieter({ compact = false }: { compact?: boolean }) {
  let anbieter: Anbieter[] = [];

  try {
    const supabase = await createSupabaseServer();
    const { data: raw } = await supabase
      .from("werbeplaetze_buchungen")
      .select(`
        id,
        anbieter_profile:anbieter_id (
          id, name, bio, avatar_url, titelbild_url, verifiziert,
          bewertung, bewertungenAnzahl, standort
        )
      `)
      .eq("paket", "anbieter_spotlight")
      .eq("status", "aktiv")
      .limit(3);

    const fetched = ((raw ?? []) as Array<{
      id: string;
      anbieter_profile: Anbieter | null;
    }>)
      .map((b) => b.anbieter_profile)
      .filter(Boolean) as Anbieter[];

    anbieter = fetched.length > 0 ? fetched : [...DEMO_ANBIETER];
  } catch {
    anbieter = [...DEMO_ANBIETER];
  }

  // ── Compact-Modus (eingebettet in RightSidebar-Karte) ──────────────
  if (compact) {
    return (
      <div className="divide-y divide-gray-100">
        {anbieter.slice(0, 2).map((a) => (
          <Link
            key={a.id}
            href={a.href ?? "/marktplatz/"}
            className="block group"
          >
            {/* Titelbild */}
            <div className="relative h-24 overflow-hidden bg-gray-100">
              {a.titelbild_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.titelbild_url}
                  alt={a.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#6991d8]/20 to-[#1db682]/20 flex items-center justify-center">
                  <span className="text-3xl">🏢</span>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>

            <div className="px-4 pt-2.5 pb-3">
              {/* Avatar + Name */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm ring-1 ring-gray-200">
                  {a.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.avatar_url} alt={a.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#6991d8] text-white text-[10px] font-black">
                      {a.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                  <span className="text-xs font-black text-gray-900 truncate group-hover:text-[#6991d8] transition-colors">
                    {a.name}
                  </span>
                  {a.verifiziert && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#1db682] bg-[#1db682]/10 px-1.5 py-0.5 rounded-full shrink-0">
                      <BadgeCheck className="w-2.5 h-2.5" />
                      Verifiziert
                    </span>
                  )}
                </div>
              </div>

              {/* Standort */}
              {a.standort && (
                <div className="flex items-center gap-1 mb-1.5">
                  <MapPin className="w-3 h-3 text-gray-300 shrink-0" />
                  <span className="text-[11px] text-gray-400">{a.standort}</span>
                </div>
              )}

              {/* Beschreibung 2-zeilig */}
              {a.bio && (
                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-2.5">
                  {a.bio}
                </p>
              )}

            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Megaphone className="w-3.5 h-3.5 text-[#6991d8]" />
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Empfohlene Anbieter
          </p>
        </div>
        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
          Anzeige
        </span>
      </div>

      {anbieter.map((a) => (
        <Link
          key={a.id}
          href={a.href ?? "/marktplatz/"}
          className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
        >
          {/* Titelbild */}
          {a.titelbild_url ? (
            <div className="relative h-20 overflow-hidden bg-gray-100">
              <Image
                src={a.titelbild_url}
                alt={a.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full h-12 bg-linear-to-br from-[#6991d8]/20 to-[#1db682]/20 flex items-center justify-center">
              <span className="text-xl">🏢</span>
            </div>
          )}

          <div className="p-3">
            {/* Avatar + Name + Badge */}
            <div className="flex items-center gap-2 mb-2">
              <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm -mt-5 ring-2 ring-gray-100">
                {a.avatar_url ? (
                  <Image
                    src={a.avatar_url}
                    alt={a.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#6991d8] text-white text-xs font-black">
                    {a.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs font-black text-gray-900 group-hover:text-[#6991d8] transition-colors truncate">
                    {a.name}
                  </span>
                  {a.verifiziert && <BadgeCheck className="w-3 h-3 text-[#1db682] shrink-0" />}
                </div>
                {/* Bewertung */}
                {a.bewertung && (
                  <div className="flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-gray-600">{a.bewertung}</span>
                    {a.bewertungenAnzahl && (
                      <span className="text-[10px] text-gray-400">({a.bewertungenAnzahl})</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {a.bio && (
              <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-2">
                {a.bio}
              </p>
            )}

            {/* Featured Angebot */}
            {a.featured_angebot && (
              <div className="rounded-xl overflow-hidden border border-[#6991d8]/20 bg-[#6991d8]/5 mb-2">
                {a.featured_angebot.foto_url && (
                  <div className="relative h-16 overflow-hidden">
                    <Image
                      src={a.featured_angebot.foto_url}
                      alt={a.featured_angebot.titel}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-1.5 left-2 right-2 flex items-end justify-between">
                      <p className="text-[10px] font-bold text-white leading-tight line-clamp-2 flex-1 mr-1">
                        {a.featured_angebot.titel}
                      </p>
                      <span className="shrink-0 text-[11px] font-black text-white bg-[#1db682] px-1.5 py-0.5 rounded-lg leading-none">
                        {a.featured_angebot.preis} €
                        <span className="font-normal text-[9px] block text-center opacity-90">
                          {PREISTYP_LABEL[a.featured_angebot.preistyp] ?? ""}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
                {!a.featured_angebot.foto_url && (
                  <div className="px-2 py-1.5 flex items-center justify-between gap-1">
                    <p className="text-[10px] font-semibold text-[#6991d8] line-clamp-1 flex-1">
                      {a.featured_angebot.titel}
                    </p>
                    <span className="shrink-0 text-xs font-black text-[#1db682]">
                      {a.featured_angebot.preis} €
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center gap-1 text-[11px] text-[#6991d8] font-bold group-hover:underline">
              <ExternalLink className="w-3 h-3 shrink-0" />
              Profil & Angebote ansehen →
            </div>
          </div>
        </Link>
      ))}

      {/* Footer-CTA */}
      <div className="bg-white rounded-xl border border-dashed border-[#6991d8]/40 px-3 py-2.5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-gray-600">Spotlight buchen</p>
          <p className="text-[10px] text-gray-400">Profil & Angebote bewerben</p>
        </div>
        <Link
          href="/werbepartner/"
          className="text-[11px] bg-[#6991d8] text-white font-bold px-3 py-1.5 rounded-lg hover:bg-[#5577c0] transition-colors whitespace-nowrap"
        >
          Hier werben →
        </Link>
      </div>
    </div>
  );
}
