"use client";

import { useState, useEffect } from "react";
import type { AppUser } from "@/context/AuthContext";
import type { UserProfile, TravelReport, TravelGroup, CommunityProfile } from "@/types";
import {
  getUserSavedActivities, getCommunityProfile,
  getTravelReportsByUser, getUserGroups,
} from "@/lib/firestore";
import Link from "next/link";
import {
  Heart, MapPin, CheckSquare, BookOpen, Ticket,
  Plane, Compass, Zap, ArrowRight, Sun,
  Globe, Trophy, Users2, ThumbsUp, MessageCircle,
  FileText, Star, TrendingUp,
} from "lucide-react";

type Tab = "overview"|"trips"|"activities"|"wishlist"|"checklist"|"pricealerts"|"tripplanner"|"documents"|"laender"|"berichte"|"gruppen"|"profile"|"settings";

interface Props {
  user: AppUser;
  userProfile: UserProfile | null;
  setTab: (tab: Tab) => void;
}

// Achievements zum Zählen (vereinfacht)
const ACHIEVEMENT_CHECKS = [
  (v: Set<string>) => v.size >= 1,
  (v: Set<string>) => v.size >= 10,
  (v: Set<string>) => v.size >= 25,
  (v: Set<string>) => v.size >= 50,
  (v: Set<string>) => v.size >= 100,
  (v: Set<string>) => ["ES","IT","GR","TR"].every(c=>v.has(c)),
  (v: Set<string>) => ["DE","AT","CH"].every(c=>v.has(c)),
  (v: Set<string>) => ["AE","QA","SA"].every(c=>v.has(c)),
  (v: Set<string>) => ["CU","DO","JM"].every(c=>v.has(c)),
];

function StatCard({ icon: Icon, value, label, color, bg, onClick }: {
  icon: React.ElementType; value: string | number; label: string;
  color: string; bg: string; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} disabled={!onClick}
      className={`${bg} rounded-2xl p-4 text-left w-full transition-all hover:shadow-md hover:-translate-y-0.5 ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <Icon className={`w-6 h-6 ${color} mb-2`} />
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
    </button>
  );
}

type ActivityItem = { emoji: string; text: string; sub: string; href: string };

export default function OverviewTab({ user, userProfile, setTab }: Props) {
  const [activityCount, setActivityCount]       = useState(0);
  const [communityProfile, setCommunityProfile] = useState<CommunityProfile | null>(null);
  const [ownReports, setOwnReports]             = useState<TravelReport[]>([]);
  const [groups, setGroups]                     = useState<TravelGroup[]>([]);

  useEffect(() => {
    Promise.all([
      getUserSavedActivities(user.uid).then(a => setActivityCount(a.length)).catch(() => {}),
      getCommunityProfile(user.uid).then(p => setCommunityProfile(p)).catch(() => {}),
      getTravelReportsByUser(user.uid).then(r => setOwnReports(r)).catch(() => {}),
      getUserGroups(user.uid).then(g => setGroups(g)).catch(() => {}),
    ]);
  }, [user.uid]);

  const firstName    = user.displayName?.split(" ")[0] || "Reisender";
  const memberSince  = userProfile
    ? new Date(userProfile.createdAt).toLocaleDateString("de-DE", { month: "long", year: "numeric" })
    : "–";

  const savedCount       = userProfile?.savedTrips.length ?? 0;
  const wishlistCount    = userProfile?.favoriteDestinations.length ?? 0;
  const checkedItems     = userProfile?.checklist?.filter(c => c.checked).length ?? 0;
  const totalItems       = userProfile?.checklist?.length ?? 0;
  const checkPercent     = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const visitedSet       = new Set(communityProfile?.visitedCountries ?? []);
  const laenderCount     = visitedSet.size;
  const achievementCount = ACHIEVEMENT_CHECKS.filter(fn => fn(visitedSet)).length;
  const publishedReports = ownReports.filter(r => r.isPublished);
  const draftReports     = ownReports.filter(r => !r.isPublished);
  const totalLikes       = ownReports.reduce((s, r) => s + (r.likesCount ?? 0), 0);
  const totalComments    = ownReports.reduce((s, r) => s + (r.commentsCount ?? 0), 0);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Guten Morgen" : hour < 18 ? "Hallo" : "Guten Abend";

  // Activity-Feed aus vorhandenen Daten ableiten
  const activity: ActivityItem[] = [];
  if (totalLikes > 0) activity.push({ emoji:"👍", text:`${totalLikes} Like${totalLikes !== 1 ? "s" : ""} auf deinen Berichten`, sub:"Deine Reiseberichte kommen gut an", href:"/dashboard" });
  if (totalComments > 0) activity.push({ emoji:"💬", text:`${totalComments} Kommentar${totalComments !== 1 ? "e" : ""} auf deinen Berichten`, sub:"Schau nach, was andere schreiben", href:"/community/reiseberichte/" });
  if (draftReports.length > 0) activity.push({ emoji:"📝", text:`${draftReports.length} unveröffentlichte${draftReports.length !== 1 ? " Entwürfe" : "r Entwurf"}`, sub:"Bereit zum Veröffentlichen?", href:"/dashboard" });
  if (groups.length > 0) {
    const totalPosts = groups.reduce((s, g) => s + (g.postsCount ?? 0), 0);
    if (totalPosts > 0) activity.push({ emoji:"💬", text:`${totalPosts} Beiträge in deinen Gruppen`, sub:"Bleib aktiv in deinen Reise-Gruppen", href:"/community/gruppen/" });
  }
  if (laenderCount > 0) activity.push({ emoji:"🌍", text:`${laenderCount} Länder auf deiner Karte`, sub:laenderCount >= 25 ? "Echter Globetrotter!" : "Füge weitere Reiseziele hinzu", href:"/dashboard" });
  if (activity.length === 0) {
    activity.push({ emoji:"🚀", text:"Starte deine Reise-Community", sub:"Schreib deinen ersten Reisebericht oder tritt einer Gruppe bei", href:"/community/" });
  }

  return (
    <div className="space-y-7">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#00838F] to-[#005F6A] p-6 text-white relative">
        <div className="absolute right-6 top-4 opacity-10"><Sun className="w-28 h-28" /></div>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {(communityProfile?.photoURL || user.photoURL) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={communityProfile?.photoURL || user.photoURL!}
              alt={user.displayName ?? "Avatar"}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-black text-xl shrink-0">
              {(user.displayName || user.email || "U").split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-sm font-medium">{greeting},</p>
            <h1 className="text-xl font-bold">{firstName}! 🌴</h1>
            <div className="flex flex-wrap gap-3 text-xs text-white/80 mt-1">
              {laenderCount > 0 && <span>🌍 {laenderCount} Länder</span>}
              {publishedReports.length > 0 && <span>📖 {publishedReports.length} Berichte</span>}
              {groups.length > 0 && <span>👥 {groups.length} Gruppen</span>}
              {totalLikes > 0 && <span>👍 {totalLikes} Likes</span>}
            </div>
          </div>
        </div>
        <p className="text-white/40 text-xs mt-3">Mitglied seit {memberSince}</p>
      </div>

      {/* ── Community Stats ───────────────────────────────────────── */}
      <div>
        <h2 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-teal-600" /> Community
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Globe}      value={laenderCount}          label="Länder bereist"  color="text-teal-600"   bg="bg-teal-50"    onClick={() => setTab("laender")} />
          <StatCard icon={Trophy}     value={achievementCount}      label="Achievements"    color="text-amber-600" bg="bg-amber-50"   onClick={() => setTab("laender")} />
          <StatCard icon={BookOpen}   value={publishedReports.length} label="Reiseberichte"  color="text-violet-600" bg="bg-violet-50" onClick={() => setTab("berichte")} />
          <StatCard icon={Users2}     value={groups.length}         label="Gruppen"         color="text-blue-600"  bg="bg-blue-50"    onClick={() => setTab("gruppen")} />
        </div>
      </div>

      {/* ── Dashboard Stats ───────────────────────────────────────── */}
      <div>
        <h2 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500" /> Mein Dashboard
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Heart}      value={savedCount}    label="Gespeicherte Reisen"   color="text-rose-500"    bg="bg-rose-50"     onClick={() => setTab("trips")} />
          <StatCard icon={Ticket}     value={activityCount} label="Gespeicherte Aktivit."  color="text-[#6CC4BA]"  bg="bg-[#6CC4BA]/10" onClick={() => setTab("activities")} />
          <StatCard icon={MapPin}     value={wishlistCount} label="Wunschliste"            color="text-blue-500"   bg="bg-blue-50"     onClick={() => setTab("wishlist")} />
          <StatCard icon={CheckSquare} value={totalItems > 0 ? `${checkPercent}%` : "–"} label="Checkliste" color="text-emerald-500" bg="bg-emerald-50" onClick={() => setTab("checklist")} />
        </div>
      </div>

      {/* ── Activity Feed ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" /> Aktivität & Highlights
        </h2>
        <div className="space-y-3">
          {activity.map((item, i) => (
            <Link key={i} href={item.href}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-800 group-hover:text-teal-700">{item.text}</div>
                <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 shrink-0 mt-1 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Likes + Comments Summary */}
        {(totalLikes > 0 || totalComments > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-50 flex gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ThumbsUp className="w-4 h-4 text-blue-400" />
              <span><strong className="text-gray-700">{totalLikes}</strong> Likes erhalten</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageCircle className="w-4 h-4 text-teal-400" />
              <span><strong className="text-gray-700">{totalComments}</strong> Kommentare</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Meine Gruppen (Vorschau) ──────────────────────────────── */}
      {groups.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Users2 className="w-4 h-4 text-teal-600" /> Meine Gruppen
            </h2>
            <button onClick={() => setTab("gruppen")}
              className="text-xs text-teal-600 font-medium hover:underline flex items-center gap-1"
            >
              Alle anzeigen <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {groups.slice(0, 3).map((g) => (
              <Link key={g.id} href={`/community/gruppen/${g.id}/`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 shrink-0 overflow-hidden">
                  {g.coverImageUrl && <img src={g.coverImageUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-800 group-hover:text-teal-700 line-clamp-1">{g.name}</div>
                  <div className="text-xs text-gray-400">{g.membersCount} Mitglieder · {g.postsCount ?? 0} Beiträge</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Meine letzten Berichte (Vorschau) ────────────────────── */}
      {publishedReports.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-600" /> Meine Reiseberichte
            </h2>
            <button onClick={() => setTab("berichte")}
              className="text-xs text-teal-600 font-medium hover:underline flex items-center gap-1"
            >
              Alle verwalten <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {publishedReports.slice(0, 3).map((r) => (
              <Link key={r.id} href={`/community/reiseberichte/${r.id}/`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 shrink-0 overflow-hidden">
                  {r.coverImageUrl && <img src={r.coverImageUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-800 group-hover:text-teal-700 line-clamp-1">{r.title}</div>
                  <div className="text-xs text-gray-400">{r.destination} · {r.likesCount ?? 0} Likes · {r.commentsCount ?? 0} Kommentare</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {"⭐".repeat(Math.min(r.rating, 5))}
                </div>
              </Link>
            ))}
          </div>
          {draftReports.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-50">
              <button onClick={() => setTab("berichte")}
                className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-700 font-semibold"
              >
                <FileText className="w-3.5 h-3.5" />
                {draftReports.length} Entwurf{draftReports.length !== 1 ? "e" : ""} warten auf Veröffentlichung
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Checkliste ────────────────────────────────────────────── */}
      {totalItems > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-500" /> Reise-Checkliste
            </h2>
            <button onClick={() => setTab("checklist")}
              className="text-xs text-[#00838F] font-medium hover:underline flex items-center gap-1"
            >
              Öffnen <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${checkPercent}%` }} />
            </div>
            <span className="text-sm font-semibold text-gray-700 shrink-0">{checkedItems}/{totalItems}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {checkPercent === 100 ? "🎉 Alles erledigt – bereit für den Abflug!" : `Noch ${totalItems - checkedItems} Aufgaben offen`}
          </p>
        </div>
      )}

      {/* ── Quick-Links ───────────────────────────────────────────── */}
      <div>
        <h2 className="font-bold text-gray-700 text-sm mb-3">Schnellzugriff</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href:"/community/reiseberichte/", label:"Reiseberichte",    icon:BookOpen,  color:"bg-violet-50 text-violet-600" },
            { href:"/community/gruppen/",        label:"Reise-Gruppen",   icon:Users2,    color:"bg-blue-50 text-blue-600" },
            { href:"/last-minute/",              label:"Last-Minute",     icon:Zap,       color:"bg-amber-50 text-amber-600" },
            { href:"/urlaubsziele/",             label:"Urlaubsziele",    icon:Compass,   color:"bg-teal-50 text-teal-600" },
            { href:"/extras/reisenden-karte/",   label:"Reisenden-Karte", icon:Globe,     color:"bg-emerald-50 text-emerald-600" },
            { href:"/flugsuche/",                label:"Flug suchen",     icon:Plane,     color:"bg-sky-50 text-sky-600" },
          ].map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Wunschliste ───────────────────────────────────────────── */}
      {wishlistCount > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" /> Meine Wunschliste
            </h2>
            <button onClick={() => setTab("wishlist")}
              className="text-xs text-[#00838F] font-medium hover:underline flex items-center gap-1"
            >
              Alle anzeigen <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(userProfile?.favoriteDestinations ?? []).slice(0, 8).map((slug) => (
              <Link key={slug} href={`/urlaubsziele/${slug}/`}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-100 transition-colors capitalize"
              >
                {slug.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
