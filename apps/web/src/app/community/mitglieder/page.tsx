"use client";

import { useState, useEffect } from "react";
import { getCommunityProfiles } from "@/lib/supabase-db";
import { CommunityProfile } from "@/types";
import UserProfileCard from "@/components/community/UserProfileCard";
import { Users, Loader2 } from "lucide-react";
import Link from "next/link";

export default function MitgliederPage() {
  const [members, setMembers] = useState<CommunityProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommunityProfiles(48).then(setMembers).finally(() => setLoading(false));
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
