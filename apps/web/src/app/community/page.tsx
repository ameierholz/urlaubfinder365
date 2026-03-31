"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTravelReports, getCommunityProfiles } from "@/lib/firestore";
import { TravelReport, CommunityProfile } from "@/types";
import TravelReportCard from "@/components/community/TravelReportCard";
import UserProfileCard from "@/components/community/UserProfileCard";
import { BookOpen, Users, Map, Users2, ArrowRight, Globe, Star, MessageCircle } from "lucide-react";

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
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 30% 70%, white 1px, transparent 1px), radial-gradient(circle at 70% 30%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-4 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <Globe className="w-4 h-4" /> Community
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">
            Reisende verbinden.<br />Erlebnisse teilen.
          </h1>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
            Lies echte Reiseberichte, tausche dich in Gruppen aus und entdecke Geheimtipps von Reisenden wie dir.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/community/reiseberichte/"
              className="bg-white text-teal-700 font-bold px-6 py-3 rounded-full text-sm hover:bg-teal-50 transition-colors shadow-lg"
            >
              Reiseberichte entdecken
            </Link>
            <Link href="/community/gruppen/"
              className="bg-teal-800/60 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-teal-800 transition-colors border border-white/20"
            >
              Gruppen beitreten
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: <BookOpen className="w-5 h-5" />, label: "Reiseberichte" },
              { icon: <Users className="w-5 h-5" />, label: "Mitglieder" },
              { icon: <Map className="w-5 h-5" />, label: "Reisenden-Karte" },
              { icon: <Users2 className="w-5 h-5" />, label: "Gruppen" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
                <div className="flex justify-center mb-1">{s.icon}</div>
                <p className="text-xs text-teal-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5">
            {[
              { href: "/community/reiseberichte/", icon: <BookOpen className="w-4 h-4" />, label: "Reiseberichte" },
              { href: "/community/gruppen/",       icon: <Users2 className="w-4 h-4" />,   label: "Gruppen" },
              { href: "/community/mitglieder/",    icon: <Users className="w-4 h-4" />,    label: "Mitglieder" },
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

      <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-14">
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

        {/* CTA */}
        <section className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-3xl p-8 text-center border border-teal-100">
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
