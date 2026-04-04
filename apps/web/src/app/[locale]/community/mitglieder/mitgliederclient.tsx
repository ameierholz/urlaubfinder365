"use client";

import { useState, useEffect } from "react";
import { getCommunityProfiles } from "@/lib/supabase-db";
import { CommunityProfile } from "@/types";
import UserProfileCard from "@/components/community/UserProfileCard";
import { Users, Loader2 } from "lucide-react";
import Link from "next/link";

/* ── Demo-Daten (Fallback wenn DB leer) ──────────────────────────────────── */

const DEMO_MEMBERS: CommunityProfile[] = [
  { uid: "demo-1", displayName: "Sandra K.", bio: "Urlaubsbloggerin & Mallorca-Fan. 15+ Länder bereist.", nationality: "Deutschland", visitedCountries: ["DE","ES","TR","GR","IT","PT","FR","HR","AT","CZ","NL","GB","TH","EG","MA"], followersCount: 42, followingCount: 18, reportsCount: 8, tipsCount: 12, groupsCount: 3 },
  { uid: "demo-2", displayName: "Marco T.", bio: "Taucher & Ägypten-Liebhaber. Unterwasserfotografie.", nationality: "Österreich", visitedCountries: ["AT","EG","TR","GR","TH","MV","ID","ES","IT"], followersCount: 35, followingCount: 22, reportsCount: 5, tipsCount: 9, groupsCount: 2 },
  { uid: "demo-3", displayName: "Julia & Max", bio: "Pärchen aus München. Griechenland-Liebhaber.", nationality: "Deutschland", visitedCountries: ["DE","GR","ES","IT","HR","ME","PT"], followersCount: 28, followingCount: 15, reportsCount: 3, tipsCount: 6, groupsCount: 2 },
  { uid: "demo-4", displayName: "Tim B.", bio: "Solo-Traveller. 30 Länder. Nächstes Ziel: Südostasien.", nationality: "Deutschland", visitedCountries: ["DE","ES","TR","TH","VN","KH","ID","JP","KR","MX","CO","PE","MA","EG","GR","IT","FR","PT","HR","CZ","AT","NL","GB","IE","SE","NO","US","CU","DO","IN"], followersCount: 67, followingCount: 31, reportsCount: 12, tipsCount: 24, groupsCount: 4 },
  { uid: "demo-5", displayName: "Fam. Weber", bio: "Familie mit 2 Kids. All-Inclusive Experten seit 2018.", nationality: "Deutschland", visitedCountries: ["DE","TR","ES","GR","EG","IT","HR","AT"], followersCount: 19, followingCount: 8, reportsCount: 6, tipsCount: 10, groupsCount: 2 },
  { uid: "demo-6", displayName: "Lena M.", bio: "Wellness & Spa Liebhaberin. Suche immer die besten Spa-Hotels.", nationality: "Schweiz", visitedCountries: ["CH","DE","AT","IT","ES","TH","MV","ID"], followersCount: 24, followingCount: 12, reportsCount: 4, tipsCount: 7, groupsCount: 1 },
  { uid: "demo-7", displayName: "Fam. Schneider", bio: "Türkei-Stammgäste seit 2015. Kennen jedes Hotel in Side.", nationality: "Deutschland", visitedCountries: ["DE","TR","GR","ES","HR","BG"], followersCount: 31, followingCount: 14, reportsCount: 9, tipsCount: 15, groupsCount: 3 },
  { uid: "demo-8", displayName: "Alex R.", bio: "Kreuzfahrt-Fan. AIDA, MSC & TUI Mein Schiff Erfahrungen.", nationality: "Deutschland", visitedCountries: ["DE","ES","IT","GR","TR","NO","IS","PT","MT","FR","HR"], followersCount: 45, followingCount: 20, reportsCount: 7, tipsCount: 11, groupsCount: 2 },
];

export default function MitgliederPage() {
  const [members, setMembers] = useState<CommunityProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommunityProfiles(48).then((m) => setMembers(m.length > 0 ? m : DEMO_MEMBERS)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-teal-600" />
          Community-Mitglieder
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Entdecke aktive Reisende, folge ihnen und lese ihre Berichte.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Noch keine Mitglieder</p>
          <p className="text-sm mt-1">Registriere dich um der Erste zu sein</p>
          <Link href="/register/" className="mt-4 inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold">
            Jetzt registrieren
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((m) => <UserProfileCard key={m.uid} profile={m} />)}
        </div>
      )}
    </div>
  );
}
