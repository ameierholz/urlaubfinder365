import { createSupabaseServer } from "@/lib/supabase-server";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Megaphone, MapPin } from "lucide-react";
import { DEMO_ANGEBOTE } from "@/data/demo-partners";

type Context =
  | { type: "homepage" }
  | { type: "destination"; cityName: string; countryName: string }
  | { type: "kategorie"; kategorie: string };

type Position = "oben" | "unten" | "alle";
type Variant  = "banner" | "sidebar";

interface Props {
  context: Context;
  position?: Position;
  maxItems?: number;
  variant?: Variant;
}

export default async function SponsoredAngebote({
  context,
  position = "alle",
  maxItems = 4,
  variant = "banner",
}: Props) {
  const supabase = await createSupabaseServer();

  const { data: raw } = await supabase
    .from("werbeplaetze_buchungen")
    .select(`
      id, paket, zielseite, preis_monatlich,
      angebote:angebot_id (
        id, titel, slug, ziel, preis, preistyp, foto_url, kategorie,
        anbieter_profile:anbieter_id (name, avatar_url, verifiziert)
      )
    `)
    .eq("status", "aktiv")
    .not("angebot_id", "is", null);

  const buchungen = (raw ?? []) as Array<{
    id: string;
    paket: string;
    zielseite: string | null;
    angebote: {
      id: string; titel: string; slug: string; ziel: string;
      preis: number | null; preistyp: string; foto_url: string | null; kategorie: string;
      anbieter_profile: { name: string; avatar_url: string | null; verifiziert: boolean } | null;
    } | null;
  }>;

  const matched = buchungen.filter((b) => {
    if (!b.angebote) return false;
    const z = (b.zielseite ?? "").toLowerCase();

    if (context.type === "homepage") {
      return ["homepage", "rundum", "kategorie"].includes(b.paket);
    }
    if (context.type === "destination") {
      const city    = context.cityName.toLowerCase();
      const country = context.countryName.toLowerCase();
      if (b.paket === "stadt_oben" || b.paket === "stadt_unten") {
        if (position !== "alle") {
          const wantedPaket = position === "oben" ? "stadt_oben" : "stadt_unten";
          if (b.paket !== wantedPaket) return false;
        }
        return z.includes(city) || city.includes(z);
      }
      if (b.paket === "region") {
        return z.includes(country) || country.includes(z);
      }
      if (b.paket === "rundum") {
        return z.includes(country) || country.includes(z) || z.includes(city) || city.includes(z);
      }
      return false;
    }
    if (context.type === "kategorie") {
      return b.paket === "kategorie" && z === context.kategorie.toLowerCase();
    }
    return false;
  });

  const realAngebote = matched.map((b) => b.angebote!).filter(Boolean).slice(0, maxItems);
  // Wenn keine echten Angebote → Demo-Daten zeigen (Social Proof für potenzielle Partner)
  const angebote = realAngebote.length > 0 ? realAngebote : [...DEMO_ANGEBOTE].slice(0, maxItems) as typeof realAngebote;

  const PREISTYP_LABEL: Record<string, string> = {
    pro_person:  "/ Person",
    pro_gruppe:  "/ Gruppe",
    festpreis:   "Festpreis",
    auf_anfrage: "Auf Anfrage",
  };
  const KAT_EMOJI: Record<string, string> = {
    stadtfuehrung: "🏛️", tagesausflug: "🚌", wassersport: "🤿",
    outdoor: "🏔️", kulinarik: "🍽️", kultur: "🎭", fotoshooting: "📸", transfer: "🚗",
  };

  // ── SIDEBAR-Variante ────────────────────────────────────────────────────────
  if (variant === "sidebar") {
    return (
      <div className="space-y-3">
        {angebote.map((a) => (
          <Link
            key={a.id}
            href={`/marktplatz/${a.slug}/`}
            className="group block bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
          >
            {/* Hauptfoto */}
            <div className="relative h-28 bg-gray-100 overflow-hidden">
              {a.foto_url ? (
                <Image
                  src={a.foto_url}
                  alt={a.titel}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {KAT_EMOJI[a.kategorie] ?? "🌍"}
                </div>
              )}
              <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-full leading-none">
                Anzeige
              </span>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="font-bold text-gray-900 text-xs leading-snug line-clamp-2 group-hover:text-[#00838F] transition-colors mb-2">
                {a.titel}
              </p>

              {/* Anbieter-Zeile mit Avatar + Name + Verifiziert-Badge */}
              {a.anbieter_profile && (
                <div className="flex items-center gap-2 mb-2">
                  {a.anbieter_profile.avatar_url ? (
                    <Image
                      src={a.anbieter_profile.avatar_url}
                      alt={a.anbieter_profile.name}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#00838F]/20 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-[#00838F]">
                        {a.anbieter_profile.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="text-[11px] text-gray-600 font-medium truncate">{a.anbieter_profile.name}</span>
                  {a.anbieter_profile.verifiziert && (
                    <span className="shrink-0 flex items-center gap-0.5 bg-[#00838F]/10 text-[#00838F] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      <BadgeCheck className="w-3 h-3" /> Verifiziert
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-0.5 text-[10px] text-gray-400">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{a.ziel}</span>
                </div>
                {a.preis ? (
                  <div className="flex items-baseline gap-0.5 shrink-0">
                    <span className="text-sm font-black text-[#00838F]">{Number(a.preis).toFixed(0)} €</span>
                    <span className="text-[10px] text-gray-400">{PREISTYP_LABEL[a.preistyp] ?? ""}</span>
                  </div>
                ) : (
                  <span className="text-[11px] font-bold text-gray-500 shrink-0">Auf Anfrage</span>
                )}
              </div>

              {/* CTA */}
              <div className="mt-2.5 w-full text-center bg-[#00838F] group-hover:bg-[#006d78] text-white text-[11px] font-bold py-1.5 rounded-xl transition-colors">
                Jetzt buchen →
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // ── BANNER-Variante (Standard — horizontales Grid) ──────────────────────────
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-5">
        <Megaphone className="w-4 h-4 text-amber-500" />
        <h2 className="text-lg font-bold text-gray-900">Gesponserte Angebote</h2>
        <span className="text-[10px] font-semibold text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full ml-1">Anzeige</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {angebote.map((a) => (
          <Link
            key={a.id}
            href={`/marktplatz/${a.slug}/`}
            className="group bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
          >
            <div className="relative h-36 bg-gray-100 overflow-hidden">
              {a.foto_url ? (
                <Image src={a.foto_url} alt={a.titel} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {KAT_EMOJI[a.kategorie] ?? "🌍"}
                </div>
              )}
              <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Anzeige
              </span>
            </div>
            <div className="p-3">
              <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-[#00838F] transition-colors mb-1.5">
                {a.titel}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{a.ziel}</span>
              </div>
              {a.anbieter_profile && (
                <div className="flex items-center gap-1.5 mb-2">
                  {a.anbieter_profile.avatar_url ? (
                    <Image src={a.anbieter_profile.avatar_url} alt={a.anbieter_profile.name}
                      width={16} height={16} className="w-4 h-4 rounded-full object-cover" unoptimized />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-[#00838F]/20 flex items-center justify-center text-[8px] font-bold text-[#00838F]">
                      {a.anbieter_profile.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-[11px] text-gray-500 truncate">{a.anbieter_profile.name}</span>
                  {a.anbieter_profile.verifiziert && <BadgeCheck className="w-3 h-3 text-[#00838F] shrink-0" />}
                </div>
              )}
              <div className="flex items-baseline gap-1">
                {a.preis ? (
                  <>
                    <span className="text-base font-black text-[#00838F]">{Number(a.preis).toFixed(2)} €</span>
                    <span className="text-[11px] text-gray-400">{PREISTYP_LABEL[a.preistyp] ?? ""}</span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-gray-500">Auf Anfrage</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
