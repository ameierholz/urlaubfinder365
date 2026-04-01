"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTravelReports, getCommunityProfiles } from "@/lib/supabase-db";
import { TravelReport, CommunityProfile } from "@/types";
import TravelReportCard from "@/components/community/TravelReportCard";
import UserProfileCard from "@/components/community/UserProfileCard";
import { BookOpen, Users, Map, Users2, ArrowRight, Globe, Star, MessageCircle, Play, UserSearch, Route, Sparkles, Brain, Flame } from "lucide-react";

export default function CommunityPage() {
  const [reports, setReports] = useState<TravelReport[]>([]);
  const [members, setMembers] = useState<CommunityProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTravelReports(6), getCommunityProfiles(6)])
      .then(([r, m]) => { setReports(r); setMembers(m); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero mit Hintergrundbild */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: "520px" }}>
        {/* Hintergrundbild */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/community_header.webp"
          alt="Community"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Gradient-Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-black/70" />

        {/* Inhalt */}
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Globe className="w-4 h-4" /> Community
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-5 leading-tight drop-shadow-lg">
            Reisende verbinden.<br />Erlebnisse teilen.
          </h1>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto drop-shadow">
            Lies echte Reiseberichte, tausche dich in Gruppen aus und entdecke Geheimtipps von Reisenden wie dir.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/community/reiseberichte/"
              className="bg-white text-teal-700 font-bold px-6 py-3 rounded-full text-sm hover:bg-teal-50 transition-colors shadow-lg"
            >
              Reiseberichte entdecken
            </Link>
            <Link href="/community/gruppen/"
              className="bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/30 transition-colors border border-white/30"
            >
              Gruppen beitreten
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto w-full">
            {[
              { icon: <BookOpen className="w-5 h-5" />, label: "Reiseberichte" },
              { icon: <Users className="w-5 h-5" />, label: "Mitglieder" },
              { icon: <Map className="w-5 h-5" />, label: "Reisenden-Karte" },
              { icon: <Users2 className="w-5 h-5" />, label: "Gruppen" },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                <div className="flex justify-center mb-1.5">{s.icon}</div>
                <p className="text-xs font-semibold text-white/90">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5">
            {[
              { href: "/community/reiseberichte/", icon: <BookOpen className="w-4 h-4" />, label: "Reiseberichte" },
              { href: "/community/gruppen/",       icon: <Users2 className="w-4 h-4" />,   label: "Gruppen" },
              { href: "/community/mitglieder/",    icon: <Users className="w-4 h-4" />,    label: "Mitglieder" },
              { href: "/feed/",                    icon: <Play className="w-4 h-4" />,      label: "Reise-Feed" },
              { href: "/travel-buddies/",          icon: <UserSearch className="w-4 h-4" />,label: "Travel Buddies" },
              { href: "/reiserouten/",             icon: <Route className="w-4 h-4" />,     label: "Reiserouten" },
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
              Neueste Reiseberichte
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

        {/* Reise-Feed Teaser */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Play className="w-5 h-5 text-rose-500 fill-rose-500" />
              Reise-Feed
            </h2>
            <Link href="/feed/" className="text-sm text-teal-600 font-semibold hover:underline flex items-center gap-1">
              Zum Feed <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="relative rounded-3xl overflow-hidden h-64 bg-linear-to-br from-rose-500 to-orange-400 flex items-center justify-center shadow-lg group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80"
              alt="Reise-Feed"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="relative text-center text-white space-y-3 px-6">
              <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mx-auto">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </div>
              <p className="font-bold text-lg drop-shadow">Tägliche Reiseinspiration</p>
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
              Jetzt Reisepartner finden →
            </Link>
          </p>
        </section>

        {/* Reiserouten Teaser */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Route className="w-5 h-5 text-indigo-500" />
              Reiserouten – teilen &amp; klonen
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
                Andere Nutzer teilen ihre kompletten Reisepläne – Ziel, Daten, Reisende, Budget und Notizen.
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
              { icon: Sparkles, color: "bg-amber-50 text-amber-600 border-amber-100", title: "KI-Empfehlungen", desc: "Personalisierte Reisevorschläge basierend auf deinem Stil", href: "/dashboard/" },
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
            Teile deine Reiseerfahrungen, hilf anderen Reisenden und werde Teil der Urlaubfinder365 Community.
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
