import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Users, Star, BadgeCheck, Check, X, ChevronLeft, Languages } from "lucide-react";
import { AKTIVITAETEN, KATEGORIEN } from "@/data/marktplatz-data";
import AnfrageFormular from "@/components/marktplatz/AnfrageFormular";
import FavoritButton from "@/components/marktplatz/FavoritButton";
import BewertungsSection from "@/components/marktplatz/BewertungsSection";
import SponsoredAngebote from "@/components/marktplatz/SponsoredAngebote";
import SponsoredAnbieter from "@/components/marktplatz/SponsoredAnbieter";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  return AKTIVITAETEN.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = AKTIVITAETEN.find((a) => a.slug === slug);
  if (!a) return {};
  return {
    title: `${a.titel} – ${a.ziel} | Urlaubfinder365 Marktplatz`,
    description: a.kurzbeschreibung,
    alternates: { canonical: `https://www.urlaubfinder365.de/marktplatz/${slug}/` },
  };
}

export default async function AktivitaetPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { slug } = await params;
  const a = AKTIVITAETEN.find((a) => a.slug === slug);
  if (!a) notFound();

  const kat = KATEGORIEN[a.kategorie];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/marktplatz/" className="flex items-center gap-1 hover:text-[#00838F] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Marktplatz
          </Link>
          <span>›</span>
          <span>{kat.emoji} {kat.label}</span>
          <span>›</span>
          <span className="text-gray-900 font-medium truncate">{a.titel}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Links: Inhalt ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hauptfoto */}
            <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden">
              <Image src={a.foto} alt={a.titel} fill className="object-cover" unoptimized />
              <div className="absolute top-4 left-4 flex gap-2">
                {a.beliebt && (
                  <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-900" /> Beliebt
                  </span>
                )}
                {a.neu && (
                  <span className="bg-[#00838F] text-white text-xs font-bold px-3 py-1 rounded-full">✨ Neu</span>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <FavoritButton slug={a.slug} />
              </div>
            </div>

            {/* Titel & Meta */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <span className="text-xs font-bold text-[#00838F] bg-[#00838F]/10 px-2.5 py-1 rounded-full">
                    {kat.emoji} {kat.label}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-3 leading-tight">{a.titel}</h1>
                </div>
              </div>

              {/* Schnell-Infos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { icon: MapPin,    label: "Ort",         wert: a.ziel },
                  { icon: Clock,     label: "Dauer",       wert: a.dauer },
                  { icon: Users,     label: "Max. Gruppe", wert: `${a.maxTeilnehmer} Personen` },
                  { icon: Languages, label: "Sprachen",    wert: a.sprachen.join(", ") },
                ].map(({ icon: Icon, label, wert }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <Icon className="w-4 h-4 mx-auto mb-1 text-[#00838F]" />
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">{label}</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{wert}</p>
                  </div>
                ))}
              </div>

              {/* Bewertung */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(a.bewertung) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                </div>
                <span className="font-bold text-gray-900">{a.bewertung}</span>
                <span className="text-gray-400 text-sm">({a.bewertungenAnzahl} Bewertungen)</span>
              </div>

              {/* Beschreibung */}
              <p className="text-gray-600 leading-relaxed">{a.beschreibung}</p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">✨ Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {a.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Inbegriffen / Nicht inbegriffen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">✅ Inbegriffen</h3>
                <ul className="space-y-1.5">
                  {a.inbegriffen.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />{i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">❌ Nicht inbegriffen</h3>
                <ul className="space-y-1.5">
                  {a.nichtInbegriffen.map((n) => (
                    <li key={n} className="flex items-start gap-2 text-xs text-gray-500">
                      <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />{n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Treffpunkt */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00838F] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm mb-1">Treffpunkt</p>
                  <p className="text-sm text-gray-600 mb-3">{a.treffpunkt}</p>
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.treffpunkt)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00838F] border border-[#00838F]/30 bg-[#00838F]/5 hover:bg-[#00838F] hover:text-white px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" /> In Google Maps öffnen
                  </Link>
                </div>
              </div>
              {a.treffpunkt_hinweis && (
                <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <span className="text-base shrink-0">⏰</span>
                  <p className="text-xs text-amber-800 leading-relaxed">{a.treffpunkt_hinweis}</p>
                </div>
              )}
            </div>

            {/* Bewertungen */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-5">⭐ Bewertungen</h2>
              <BewertungsSection slug={a.slug} />
            </div>
          </div>

          {/* ── Rechts: Buchungs-Sidebar ── */}
          <div className="space-y-4 sticky top-24 self-start">

            {/* Preis-Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-black text-[#00838F]">{a.preis} €</span>
                <span className="text-sm text-gray-400">/ Person</span>
              </div>
              <div className="flex items-center gap-1 mb-5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold">{a.bewertung}</span>
                <span className="text-xs text-gray-400">({a.bewertungenAnzahl})</span>
              </div>

              <AnfrageFormular
                aktivitaetTitel={a.titel}
                aktivitaetSlug={a.slug}
                preis={a.preis}
                maxTeilnehmer={a.maxTeilnehmer}
              />
            </div>

            {/* Anbieter-Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Dein Anbieter</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image src={a.anbieter.avatar} alt={a.anbieter.name} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900 text-sm">{a.anbieter.name}</span>
                    {a.anbieter.verifiziert && <BadgeCheck className="w-4 h-4 text-[#00838F]" />}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold">{a.anbieter.bewertung}</span>
                    <span className="text-xs text-gray-400">({a.anbieter.bewertungenAnzahl} Bewertungen)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                <p>🗣️ Spricht: {a.anbieter.sprachen.join(", ")}</p>
                <p>📅 Mitglied seit {a.anbieter.mitgliedSeit}</p>
                {a.anbieter.verifiziert && <p className="text-[#00838F] font-semibold">✅ Verifizierter Anbieter</p>}
              </div>
              <Link
                href={`/marktplatz/anbieter/${a.anbieter.slug}/`}
                className="block w-full text-center text-xs font-bold text-[#00838F] border border-[#00838F] rounded-xl py-2 hover:bg-[#00838F] hover:text-white transition-colors"
              >
                Alle Angebote ansehen →
              </Link>
            </div>

            {/* Gesponserte Angebote in der Sidebar */}
            <Suspense fallback={null}>
              <SponsoredAngebote
                context={{ type: "homepage" }}
                variant="sidebar"
                maxItems={4}
              />
            </Suspense>
            <Suspense fallback={null}>
              <SponsoredAnbieter />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
