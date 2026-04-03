import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft, BadgeCheck, Star, MapPin, Clock, Users,
  Languages, Globe, Calendar
} from "lucide-react";
import { AKTIVITAETEN, KATEGORIEN } from "@/data/marktplatz-data";
import { setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const slugs = [...new Set(AKTIVITAETEN.map((a) => a.anbieter.slug))];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const anbieter = AKTIVITAETEN.find((a) => a.anbieter.slug === slug)?.anbieter;
  if (!anbieter) return {};
  return {
    title: `${anbieter.name} – Anbieter-Profil | Urlaubfinder365 Marktplatz`,
    description: anbieter.bio ?? `Entdecke alle Angebote von ${anbieter.name} auf dem Urlaubfinder365 Marktplatz.`,
    alternates: { canonical: `https://www.urlaubfinder365.de/marktplatz/anbieter/${slug}/` },
  };
}

export default async function AnbieterProfilPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { slug } = await params;

  // Find provider + all their activities
  const angebote = AKTIVITAETEN.filter((a) => a.anbieter.slug === slug);
  if (!angebote.length) notFound();

  const anbieter = angebote[0].anbieter;

  // Aggregate rating across all activities
  const gesamtBewertungen = anbieter.bewertungenAnzahl;
  const avgBewertung = anbieter.bewertung;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": anbieter.name,
    "image": anbieter.avatar,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgBewertung,
      "reviewCount": gesamtBewertungen,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/marktplatz/" className="flex items-center gap-1 hover:text-[#00838F] transition-colors">
              <ChevronLeft className="w-4 h-4" /> Marktplatz
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{anbieter.name}</span>
          </div>
        </div>

        {/* Hero / Cover */}
        <div className="relative h-56 md:h-72 bg-gray-200 overflow-hidden">
          {anbieter.titelbild && (
            <Image
              src={anbieter.titelbild}
              alt={`${anbieter.name} – Titelbild`}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Profile Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 mb-6 flex items-end gap-5">
            {/* Avatar */}
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0 bg-gray-100">
              <Image
                src={anbieter.avatar}
                alt={anbieter.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Name & Badge */}
            <div className="pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-md leading-tight">
                  {anbieter.name}
                </h1>
                {anbieter.verifiziert && (
                  <span className="flex items-center gap-1 bg-[#00838F] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verifiziert
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-white font-bold text-sm drop-shadow">{avgBewertung}</span>
                <span className="text-white/80 text-sm drop-shadow">({gesamtBewertungen} Bewertungen)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">

            {/* Left: Bio + Angebote */}
            <div className="lg:col-span-2 space-y-6">

              {/* Bio Card */}
              {anbieter.bio && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-bold text-gray-900 text-lg mb-3">Über mich</h2>
                  <p className="text-gray-600 leading-relaxed">{anbieter.bio}</p>
                </div>
              )}

              {/* Angebote */}
              <div>
                <h2 className="font-bold text-gray-900 text-lg mb-4">
                  Meine Angebote <span className="text-gray-400 font-normal text-base">({angebote.length})</span>
                </h2>
                <div className="space-y-4">
                  {angebote.map((a) => {
                    const kat = KATEGORIEN[a.kategorie];
                    return (
                      <Link
                        key={a.slug}
                        href={`/marktplatz/${a.slug}/`}
                        className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex gap-0"
                      >
                        {/* Foto */}
                        <div className="relative w-36 sm:w-48 shrink-0">
                          <Image
                            src={a.foto}
                            alt={a.titel}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                          {(a.beliebt || a.neu) && (
                            <div className="absolute top-2 left-2">
                              {a.beliebt && (
                                <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Star className="w-2.5 h-2.5 fill-amber-900" /> Beliebt
                                </span>
                              )}
                              {a.neu && !a.beliebt && (
                                <span className="bg-[#00838F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✨ Neu</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 min-w-0">
                          <div className="mb-1">
                            <span className="text-[10px] font-bold text-[#00838F] bg-[#00838F]/10 px-2 py-0.5 rounded-full">
                              {kat.emoji} {kat.label}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm leading-snug mt-1.5 group-hover:text-[#00838F] transition-colors line-clamp-2">
                            {a.titel}
                          </h3>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.ziel}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.dauer}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />max. {a.maxTeilnehmer}</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-semibold text-gray-700">{a.bewertung}</span>
                              <span className="text-xs text-gray-400">({a.bewertungenAnzahl})</span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-black text-[#00838F]">{a.preis} €</span>
                              <span className="text-xs text-gray-400"> / Person</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Info Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">

              {/* Stats */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Auf einen Blick</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Gesamtbewertung</p>
                      <p className="text-sm font-bold text-gray-900">{avgBewertung} / 5 ({gesamtBewertungen} Bewertungen)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#00838F]/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-[#00838F]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Mitglied seit</p>
                      <p className="text-sm font-bold text-gray-900">{anbieter.mitgliedSeit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Languages className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Spricht</p>
                      <p className="text-sm font-bold text-gray-900">{anbieter.sprachen.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Angebote</p>
                      <p className="text-sm font-bold text-gray-900">{angebote.length} aktive {angebote.length === 1 ? "Tour" : "Touren"}</p>
                    </div>
                  </div>
                  {anbieter.verifiziert && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Status</p>
                        <p className="text-sm font-bold text-emerald-700">Verifizierter Anbieter</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#00838F] rounded-2xl p-5 text-white">
                <p className="font-bold text-sm mb-2">Jetzt buchen</p>
                <p className="text-xs text-white/80 mb-4 leading-relaxed">
                  Individuelle Wünsche und Anmerkungen kannst du direkt bei der Buchung angeben.
                </p>
                <Link
                  href={`/marktplatz/${angebote[0].slug}/`}
                  className="block w-full bg-white text-[#00838F] font-bold text-sm px-4 py-2.5 rounded-xl text-center hover:bg-white/90 transition-colors"
                >
                  Zum ersten Angebot →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
