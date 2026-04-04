"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTravelReports, getCommunityProfiles, getLatestApprovedTips } from "@/lib/supabase-db";
import { TravelReport, CommunityProfile, TravelTip } from "@/types";
import TravelReportCard from "@/components/community/TravelReportCard";
import UserProfileCard from "@/components/community/UserProfileCard";
import { CATEGORY_CONFIG } from "@/components/reisenden-karte/travelMapConfig";
import { BookOpen, Users, Map, Users2, ArrowRight, Star, MessageCircle, Play, UserSearch, Route, Sparkles, Brain, Flame, MapPin, Navigation } from "lucide-react";

/* ── Demo-Daten (Fallback wenn DB leer) ──────────────────────────────────── */

const DEMO_REPORTS: TravelReport[] = [
  {
    id: "demo-1",
    userId: "demo",
    displayName: "Familie Weber",
    destination: "Antalya, Türkei",
    country: "Türkei",
    title: "Traumurlaub an der türkischen Riviera",
    highlights: "Riesiger Strand, tolles Essen, Kinderclub, saubere Anlage",
    lowlights: "Pool manchmal voll, Liegen früh reserviert",
    tips: "Früh aufstehen für Strandliegen, Ausflug nach Side lohnt sich",
    priceRange: "mittel",
    rating: 5,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80",
    visitedAt: "2025-08",
    createdAt: "2025-09-01T10:00:00Z",
    likesCount: 24,
    likedBy: [],
    commentsCount: 5,
    isPublished: true,
  },
  {
    id: "demo-2",
    userId: "demo",
    displayName: "Sandra K.",
    destination: "Mallorca, Spanien",
    country: "Spanien",
    title: "Entspannter Pärchenurlaub auf Mallorca",
    highlights: "Strandlage, gutes Restaurant, ruhig im Oktober",
    lowlights: "WLAN im Zimmer schwach",
    tips: "Mietwagen buchen für Serra de Tramuntana, Tapas in Palma",
    priceRange: "mittel",
    rating: 4,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80",
    visitedAt: "2025-10",
    createdAt: "2025-10-20T14:30:00Z",
    likesCount: 18,
    likedBy: [],
    commentsCount: 3,
    isPublished: true,
  },
  {
    id: "demo-3",
    userId: "demo",
    displayName: "Marco T.",
    destination: "Hurghada, Ägypten",
    country: "Ägypten",
    title: "Schnorchel-Paradies am Roten Meer",
    highlights: "Fantastisches Hausriff, All-Inclusive top, Spa",
    lowlights: "Flughafentransfer 45 Min.",
    tips: "Tauchkurs vor Ort buchen, Ausflug nach Luxor einplanen",
    priceRange: "mittel",
    rating: 5,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    visitedAt: "2025-11",
    createdAt: "2025-12-01T09:15:00Z",
    likesCount: 31,
    likedBy: [],
    commentsCount: 7,
    isPublished: true,
  },
  {
    id: "demo-4",
    userId: "demo",
    displayName: "Julia & Max",
    destination: "Kreta, Griechenland",
    country: "Griechenland",
    title: "Kreta – Kultur und Traumstrände",
    highlights: "Vielfältige Insel, freundliche Locals, tolles Essen",
    lowlights: "Mietwagen fast Pflicht für Ausflüge",
    tips: "Elafonissi Beach besuchen, Samaria-Schlucht früh starten",
    priceRange: "mittel",
    rating: 4,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    visitedAt: "2025-06",
    createdAt: "2025-07-10T16:00:00Z",
    likesCount: 22,
    likedBy: [],
    commentsCount: 4,
    isPublished: true,
  },
  {
    id: "demo-5",
    userId: "demo",
    displayName: "Tim B.",
    destination: "Barcelona, Spanien",
    country: "Spanien",
    title: "Barcelona – die perfekte Städtereise",
    highlights: "Architektur, Essen, Strand, Nightlife",
    lowlights: "Taschendiebe auf La Rambla – aufpassen!",
    tips: "Tickets für Sagrada Família vorher online buchen",
    priceRange: "mittel",
    rating: 5,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80",
    visitedAt: "2025-09",
    createdAt: "2025-09-25T11:45:00Z",
    likesCount: 15,
    likedBy: [],
    commentsCount: 2,
    isPublished: true,
  },
  {
    id: "demo-6",
    userId: "demo",
    displayName: "Fam. Schneider",
    destination: "Side, Türkei",
    country: "Türkei",
    title: "Perfekter Familienurlaub in Side",
    highlights: "Kinderfreundlich, Preis-Leistung, flacher Strand",
    lowlights: "Animation manchmal zu laut",
    tips: "Kinderbuffet nutzen, Basar in Side besuchen",
    priceRange: "budget",
    rating: 4,
    recommendation: true,
    coverImageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    visitedAt: "2025-07",
    createdAt: "2025-07-20T08:30:00Z",
    likesCount: 29,
    likedBy: [],
    commentsCount: 6,
    isPublished: true,
  },
];

const DEMO_MEMBERS: CommunityProfile[] = [
  { uid: "demo-1", displayName: "Sandra K.", bio: "Urlaubsbloggerin & Mallorca-Fan. 15+ Länder bereist.", nationality: "Deutschland", visitedCountries: ["DE","ES","TR","GR","IT"], followersCount: 42, followingCount: 18, reportsCount: 8, tipsCount: 12, groupsCount: 3 },
  { uid: "demo-2", displayName: "Marco T.", bio: "Taucher & Ägypten-Liebhaber. Unterwasserfotografie ist meine Leidenschaft.", nationality: "Österreich", visitedCountries: ["AT","EG","TR","GR","TH"], followersCount: 35, followingCount: 22, reportsCount: 5, tipsCount: 9, groupsCount: 2 },
  { uid: "demo-3", displayName: "Julia & Max", bio: "Pärchen aus München. Wir lieben Griechenland und gutes Essen!", nationality: "Deutschland", visitedCountries: ["DE","GR","ES","IT","HR"], followersCount: 28, followingCount: 15, reportsCount: 3, tipsCount: 6, groupsCount: 2 },
];

// ── Demo Karten-Tipps (Fallback) ───────────────────────────────────────────────
const DEMO_TIPS: TravelTip[] = [
  { id: "d1", userId: "demo", displayName: "Sarah M.", title: "Patara Strand – Längster Naturstrand der Türkei", description: "Über 20 km Naturstrand ohne Hotels. Karettschildkröten nisten hier!", category: "strand", locationName: "Patara, Türkei", lat: 36.26, lng: 29.31, createdAt: "2025-07", status: "approved" },
  { id: "d2", userId: "demo", displayName: "Thomas K.", title: "Akropolis vor Sonnenaufgang", description: "Um 7 Uhr öffnet das Tor – fast alleine! Goldenes Morgenlicht.", category: "sehenswuerdigkeit", locationName: "Athen, Griechenland", lat: 37.972, lng: 23.725, createdAt: "2025-05", status: "approved" },
  { id: "d3", userId: "demo", displayName: "Lisa H.", title: "El Quim de la Boqueria", description: "Beste Tapasbar mitten im Markt. Nur Barhockerzplätze, früh kommen!", category: "gastronomie", locationName: "Barcelona, Spanien", lat: 41.381, lng: 2.172, createdAt: "2025-08", status: "approved" },
  { id: "d4", userId: "demo", displayName: "Claudia M.", title: "Chatuchak Wochenendmarkt", description: "Größter Markt Asiens – morgens um 8 Uhr ist es noch aushaltbar.", category: "shopping", locationName: "Bangkok, Thailand", lat: 13.8, lng: 100.551, createdAt: "2025-06", status: "approved", imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&q=70" },
  { id: "d5", userId: "demo", displayName: "Tobias K.", title: "Plitvička jezera im Morgengrauen", description: "Mit dem ersten Bus rein: keine Massen, magisches Licht.", category: "natur", locationName: "Plitvicer Seen, Kroatien", lat: 44.865, lng: 15.582, createdAt: "2025-08", status: "approved", imageUrl: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=400&q=70" },
  { id: "d6", userId: "demo", displayName: "Lena S.", title: "Rooftop-Bar 61 Skybar Dubrovnik", description: "Bester Blick auf die Altstadt – zum Preis eines normalen Cocktails.", category: "nachtleben", locationName: "Dubrovnik, Kroatien", lat: 42.641, lng: 18.108, createdAt: "2025-07", status: "approved" },
];

export default function CommunityPageClient() {
  const [reports, setReports] = useState<TravelReport[]>([]);
  const [members, setMembers] = useState<CommunityProfile[]>([]);
  const [tips, setTips]       = useState<TravelTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTravelReports(6), getCommunityProfiles(6), getLatestApprovedTips(8)])
      .then(([r, m, t]) => {
        setReports(r.length > 0 ? r : DEMO_REPORTS);
        setMembers(m.length > 0 ? m : DEMO_MEMBERS);
        setTips(t.length > 0 ? t : DEMO_TIPS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5">
            {[
              { href: "/community/reiseberichte/", icon: <BookOpen className="w-4 h-4" />, label: "Urlaubsberichte" },
              { href: "/community/gruppen/",       icon: <Users2 className="w-4 h-4" />,   label: "Gruppen" },
              { href: "/community/mitglieder/",    icon: <Users className="w-4 h-4" />,    label: "Mitglieder" },
              { href: "/feed/",                    icon: <Play className="w-4 h-4" />,      label: "Urlaubs-Feed" },
              { href: "/travel-buddies/",          icon: <UserSearch className="w-4 h-4" />,label: "Travel Buddies" },
              { href: "/reiserouten/",             icon: <Route className="w-4 h-4" />,     label: "Urlaubsrouten" },
              { href: "/extras/reisenden-karte/",  icon: <Map className="w-4 h-4" />,      label: "Reisenden-Karte" },
            ].map((n) => (
              <Link key={n.href} href={n.href}
                className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg whitespace-nowrap transition-colors"
              >
                {n.icon} {n.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-14">
        {/* Neueste Berichte */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Neueste Urlaubsberichte
            </h2>
            <Link href="/community/reiseberichte/" className="text-sm text-teal-600 font-semibold hover:underline flex items-center gap-1">
              Alle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Noch keine Berichte – sei der Erste!</p>
              <Link href="/dashboard/" className="mt-3 inline-block text-teal-600 font-semibold hover:underline">
                Bericht schreiben →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reports.map((r) => <TravelReportCard key={r.id} report={r} />)}
            </div>
          )}
        </section>

        {/* Aktive Mitglieder */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              Aktive Mitglieder
            </h2>
            <Link href="/community/mitglieder/" className="text-sm text-teal-600 font-semibold hover:underline flex items-center gap-1">
              Alle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members.slice(0, 3).map((m) => <UserProfileCard key={m.uid} profile={m} />)}
            {members.length === 0 && !loading && (
              <p className="text-gray-400 col-span-3 text-center py-8">Noch keine Mitglieder registriert.</p>
            )}
          </div>
        </section>

        {/* Karten-Tipps der Community */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-teal-600" />
              Geheimtipps & Orte der Community
            </h2>
            <Link href="/extras/reisenden-karte/" className="text-sm text-teal-600 font-semibold hover:underline flex items-center gap-1">
              Alle auf der Karte <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-60 shrink-0 bg-gray-100 rounded-2xl h-52 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {tips.map((tip) => {
                const cfg = CATEGORY_CONFIG[tip.category];
                return (
                  <Link
                    key={tip.id}
                    href="/extras/reisenden-karte/"
                    className="w-60 shrink-0 snap-start bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group"
                  >
                    {/* Bild oder farbiger Header */}
                    {tip.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tip.imageUrl} alt={tip.title} className="w-full h-32 object-cover" />
                    ) : (
                      <div
                        className="w-full h-20 flex items-center justify-center text-3xl"
                        style={{ background: cfg.color + "22" }}
                      >
                        {cfg.emoji}
                      </div>
                    )}

                    <div className="p-3">
                      {/* Kategorie-Badge */}
                      <span
                        className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-white mb-1.5"
                        style={{ background: cfg.color }}
                      >
                        {cfg.emoji} {cfg.label}
                      </span>

                      <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors mb-1">
                        {tip.title}
                      </h3>

                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{tip.locationName}</span>
                      </div>

                      <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {tip.description}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-2 font-medium">von {tip.displayName}</p>
                    </div>
                  </Link>
                );
              })}

              {/* CTA-Karte */}
              <Link
                href="/extras/reisenden-karte/"
                className="w-52 shrink-0 snap-start bg-linear-to-br from-teal-50 to-cyan-50 border border-teal-100 rounded-2xl flex flex-col items-center justify-center gap-3 p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-teal-600" />
                </div>
                <p className="font-bold text-teal-700 text-sm group-hover:text-teal-800">Eigenen Tipp teilen</p>
                <p className="text-[11px] text-teal-500">Markiere deinen Lieblingsort auf der Karte</p>
              </Link>
            </div>
          )}
        </section>

        {/* Urlaubs-Feed Teaser */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Play className="w-5 h-5 text-rose-500 fill-rose-500" />
              Urlaubs-Feed
            </h2>
            <Link href="/feed/" className="text-sm text-teal-600 font-semibold hover:underline flex items-center gap-1">
              Zum Feed <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="relative rounded-3xl overflow-hidden h-64 bg-linear-to-br from-rose-500 to-orange-400 flex items-center justify-center shadow-lg group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80"
              alt="Urlaubs-Feed"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="relative text-center text-white space-y-3 px-6">
              <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mx-auto">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
              <p className="font-bold text-lg drop-shadow">Tägliche Urlaubsinspiration</p>
              <p className="text-sm text-white/80 drop-shadow">Fotos & Videos aus aller Welt – scrolle, like & teile</p>
              <Link href="/feed/" className="inline-block bg-white text-rose-600 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-rose-50 transition-colors shadow-md">
                Feed öffnen →
              </Link>
            </div>
          </div>
        </section>

        {/* Travel Buddies Teaser */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <UserSearch className="w-5 h-5 text-teal-600" />
              Travel Buddies
            </h2>
            <Link href="/travel-buddies/" className="text-sm text-teal-600 font-semibold hover:underline flex items-center gap-1">
              Alle anzeigen <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { emoji: "🏖️", style: "Strand & Meer", months: "Jun–Aug", from: "Frankfurt" },
              { emoji: "🏙️", style: "Städtereisen", months: "Ganzjährig", from: "München" },
              { emoji: "🧗", style: "Abenteuer", months: "Mai–Okt", from: "Berlin" },
            ].map((b, i) => (
              <Link key={i} href="/travel-buddies/"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-center space-y-2 group"
              >
                <div className="text-4xl">{b.emoji}</div>
                <p className="font-bold text-gray-800 group-hover:text-teal-700 transition-colors">{b.style}</p>
                <p className="text-xs text-gray-500">🗓 {b.months} · ✈️ Ab {b.from}</p>
              </Link>
            ))}
          </div>
          <p className="text-center mt-4">
            <Link href="/travel-buddies/" className="text-sm text-teal-600 font-semibold hover:underline">
              Jetzt Urlaubspartner finden →
            </Link>
          </p>
        </section>

        {/* Urlaubsrouten Teaser */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Route className="w-5 h-5 text-indigo-500" />
              Urlaubsrouten – teilen &amp; klonen
            </h2>
            <Link href="/reiserouten/" className="text-sm text-teal-600 font-semibold hover:underline flex items-center gap-1">
              Alle Routen <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
              <Route className="w-10 h-10 text-indigo-500" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Lass dich von anderen Reisenden inspirieren</h3>
              <p className="text-gray-600 text-sm mb-4">
                Andere Nutzer teilen ihre kompletten Urlaubspläne – Ziel, Daten, Reisende, Budget und Notizen.
                Du kannst jede Route mit einem Klick in deine eigene Planung übernehmen.
              </p>
              <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
                <Link href="/reiserouten/" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-5 py-2 rounded-full text-sm transition-colors">
                  Routen entdecken
                </Link>
                <Link href="/dashboard/" className="border border-indigo-300 text-indigo-700 font-bold px-5 py-2 rounded-full text-sm hover:bg-indigo-50 transition-colors">
                  Eigene Route teilen
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* KI-Empfehlungen Teaser */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Entdecke mehr mit Urlaubfinder365
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Sparkles, color: "bg-amber-50 text-amber-600 border-amber-100", title: "KI-Empfehlungen", desc: "Personalisierte Urlaubsvorschläge basierend auf deinem Stil", href: "/dashboard/" },
              { icon: Brain, color: "bg-indigo-50 text-indigo-600 border-indigo-100", title: "Daily Quiz", desc: "Teste täglich dein Geographiewissen und sammle Punkte", href: "/dashboard/" },
              { icon: Flame, color: "bg-orange-50 text-orange-600 border-orange-100", title: "Streak & Coins", desc: "Check-in jeden Tag und verdiene Travel Coins", href: "/dashboard/" },
              { icon: Map, color: "bg-teal-50 text-teal-600 border-teal-100", title: "Reisenden-Karte", desc: "Markiere bereiste Länder und sammle Achievements", href: "/extras/reisenden-karte/" },
            ].map(({ icon: Icon, color, title, desc, href }) => (
              <Link key={href + title} href={href}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border mb-3 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm group-hover:text-teal-700 transition-colors mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-linear-to-r from-teal-50 to-cyan-50 rounded-3xl p-8 text-center border border-teal-100">
          <MessageCircle className="w-10 h-10 text-teal-500 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-gray-800 mb-2">Mach mit!</h2>
          <p className="text-gray-600 mb-5 max-w-md mx-auto">
            Teile deine Urlaubserfahrungen, hilf anderen Reisenden und werde Teil der Urlaubfinder365 Community.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/register/" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors">
              Jetzt kostenlos registrieren
            </Link>
            <Link href="/login/" className="border border-teal-300 text-teal-700 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-teal-50 transition-colors">
              Anmelden
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
