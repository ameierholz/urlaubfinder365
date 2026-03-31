"use client";

import { useState, useEffect, use } from "react";
import { getTravelGroup, joinGroup, leaveGroup } from "@/lib/firestore";
import { TravelGroup } from "@/types";
import GroupPostFeed from "@/components/community/GroupPostFeed";
import { useAuth } from "@/context/AuthContext";
import { Users2, MapPin, Calendar, Tag, LogIn, LogOut, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CAT_LABELS: Record<string, string> = {
  destination:"Destination", style:"Reisestil", date:"Reisezeitraum", interest:"Interesse"
};

function formatMonth(ym?: string) {
  if (!ym) return null;
  const [y, m] = ym.split("-");
  const months = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  return `${months[parseInt(m) - 1]} ${y}`;
}

export default function GruppeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [group, setGroup] = useState<TravelGroup | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    getTravelGroup(id).then((g) => {
      setGroup(g);
      if (g && user) setIsMember(g.memberIds.includes(user.uid));
    }).finally(() => setLoading(false));
  }, [id, user]);

  async function handleJoin() {
    if (!user || !group) return;
    setJoining(true);
    await joinGroup(user.uid, group.id);
    setIsMember(true);
    setGroup((g) => g ? { ...g, membersCount: g.membersCount + 1, memberIds: [...g.memberIds, user.uid] } : g);
    setJoining(false);
  }

  async function handleLeave() {
    if (!user || !group) return;
    setJoining(true);
    await leaveGroup(user.uid, group.id);
    setIsMember(false);
    setGroup((g) => g ? { ...g, membersCount: Math.max(0, g.membersCount - 1) } : g);
    setJoining(false);
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  if (!group) return <div className="text-center py-20 text-gray-400">Gruppe nicht gefunden.</div>;

  const isCreator = user?.uid === group.creatorId;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      {/* Zurück */}
      <Link href="/community/gruppen/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Alle Gruppen
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="relative h-36 bg-gradient-to-br from-teal-400 to-cyan-500">
          {group.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={group.coverImageUrl} alt={group.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-semibold">
                {CAT_LABELS[group.category]}
              </span>
              <h1 className="text-xl font-black text-white mt-1 leading-tight">{group.name}</h1>
            </div>
            <div className="flex items-center gap-1.5 text-white text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-full">
              <Users2 className="w-4 h-4" /> {group.membersCount}
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-wrap items-center gap-3">
          <p className="text-sm text-gray-600 flex-1">{group.description}</p>

          <div className="flex flex-wrap gap-2">
            {group.destination && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                <MapPin className="w-3 h-3" />{group.destination}
              </span>
            )}
            {group.travelMonth && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                <Calendar className="w-3 h-3" />{formatMonth(group.travelMonth)}
              </span>
            )}
            {group.tags?.map((t) => (
              <span key={t} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                <Tag className="w-3 h-3" />{t}
              </span>
            ))}
          </div>

          {user && !isCreator && (
            isMember ? (
              <button onClick={handleLeave} disabled={joining}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 border border-gray-200 px-3 py-1.5 rounded-full transition-colors"
              >
                {joining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                Verlassen
              </button>
            ) : (
              <button onClick={handleJoin} disabled={joining}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-1.5 rounded-full transition-colors"
              >
                {joining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
                Beitreten
              </button>
            )
          )}
          {!user && (
            <Link href="/login/" className="text-xs font-bold text-teal-600 border border-teal-300 px-4 py-1.5 rounded-full hover:bg-teal-50">
              Anmelden um beizutreten
            </Link>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-800 mb-5">Gruppenunterhaltung</h2>
        <GroupPostFeed groupId={group.id} isMember={isMember} />
      </div>
    </div>
  );
}
