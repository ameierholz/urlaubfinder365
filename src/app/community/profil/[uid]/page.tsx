"use client";

import { useState, useEffect, use } from "react";
import {
  getCommunityProfile, getTravelReportsByUser, isFollowing,
  getUserGroups, followUser, unfollowUser,
} from "@/lib/firestore";
import { CommunityProfile, TravelReport, TravelGroup } from "@/types";
import TravelReportCard from "@/components/community/TravelReportCard";
import { useAuth } from "@/context/AuthContext";
import {
  Loader2, BookOpen, Globe, Users, Users2,
  ThumbsUp, MessageCircle, UserPlus, UserCheck, Trophy, Star,
  MapPin, Instagram, Link2, Plane, EyeOff,
} from "lucide-react";
import Link from "next/link";

// ─── Achievements (gleich wie im Dashboard) ───────────────────────────────────

const EU_CODES  = new Set(["AL","AD","AT","BE","BA","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","MC","ME","NL","MK","NO","PL","PT","RO","RU","RS","SK","SI","ES","SE","CH","UA","GB"]);
const AS_CODES  = new Set(["AF","AM","AZ","BD","BT","BN","KH","CN","GE","IN","ID","JP","KZ","KG","LA","MY","MV","MN","MM","NP","KP","PK","PH","SG","KR","LK","TJ","TW","TH","TL","TM","UZ","VN"]);
const AF_CODES  = new Set(["DZ","AO","BJ","BW","BF","BI","CM","CV","KM","DJ","EG","GQ","ER","ET","GA","GM","GH","GN","GW","KE","LS","LR","LY","MG","MW","ML","MR","MU","MA","MZ","NA","NE","NG","RW","SN","SL","SO","ZA","SD","TZ","TG","TN","UG","ZM","ZW"]);
const ALL_CONTS = [EU_CODES, AS_CODES, AF_CODES,
  new Set(["BH","IR","IQ","IL","JO","KW","LB","OM","QA","SA","SY","TR","AE","YE"]),
  new Set(["AR","BS","BB","BZ","BO","BR","CA","CL","CO","CR","CU","DO","EC","SV","GT","GY","HT","HN","JM","MX","NI","PA","PY","PE","TT","US","UY","VE"]),
  new Set(["AU","FJ","KI","MH","NR","NZ","PW","PG","WS","SB","TO","TV","VU"]),
];

const ACHIEVEMENTS = [
  { id:"first",   emoji:"✈️",  title:"Erste Reise",       desc:"Erstes Land markiert",                  check:(v:Set<string>)=>v.size>=1 },
  { id:"eu5",     emoji:"🏰",  title:"Europareisender",   desc:"5 europäische Länder",                  check:(v:Set<string>)=>[...EU_CODES].filter(c=>v.has(c)).length>=5 },
  { id:"med",     emoji:"🌊",  title:"Mittelmeer-Fan",    desc:"Spanien, Italien, Griechenland, Türkei", check:(v:Set<string>)=>["ES","IT","GR","TR"].every(c=>v.has(c)) },
  { id:"10",      emoji:"🗺️",  title:"Vielreisender",     desc:"10 Länder weltweit",                    check:(v:Set<string>)=>v.size>=10 },
  { id:"dach",    emoji:"🏔️",  title:"DACH-Kenner",       desc:"DE, AT & CH besucht",                   check:(v:Set<string>)=>["DE","AT","CH"].every(c=>v.has(c)) },
  { id:"asia5",   emoji:"🏯",  title:"Asien-Fan",         desc:"5 asiatische Länder",                   check:(v:Set<string>)=>[...AS_CODES].filter(c=>v.has(c)).length>=5 },
  { id:"gulf",    emoji:"🕌",  title:"Golf-Reisender",    desc:"Dubai, Katar & Saudi-Arabien",          check:(v:Set<string>)=>["AE","QA","SA"].every(c=>v.has(c)) },
  { id:"25",      emoji:"🌍",  title:"Weltenbummler",     desc:"25 Länder weltweit",                    check:(v:Set<string>)=>v.size>=25 },
  { id:"carib",   emoji:"🏝️",  title:"Karibik-Liebhaber",desc:"Kuba, Dom. Rep. & Jamaika",             check:(v:Set<string>)=>["CU","DO","JM"].every(c=>v.has(c)) },
  { id:"africa5", emoji:"🦁",  title:"Afrika-Entdecker",  desc:"5 afrikanische Länder",                 check:(v:Set<string>)=>[...AF_CODES].filter(c=>v.has(c)).length>=5 },
  { id:"50",      emoji:"🌐",  title:"Globetrotter",      desc:"50 Länder weltweit",                    check:(v:Set<string>)=>v.size>=50 },
  { id:"allcont", emoji:"🏆",  title:"Alle Kontinente",   desc:"Jeden Kontinent bereist",               check:(v:Set<string>)=>ALL_CONTS.every(cont=>[...cont].some(c=>v.has(c))) },
  { id:"100",     emoji:"👑",  title:"Weltreisender",     desc:"100 Länder weltweit",                   check:(v:Set<string>)=>v.size>=100 },
];

// ─── Beliebtheit-Score ────────────────────────────────────────────────────────

function popularityLabel(likes: number, comments: number): { label: string; color: string; stars: number } {
  const score = likes * 2 + comments * 3;
  if (score >= 100) return { label: "Community-Star",   color: "text-amber-600",  stars: 5 };
  if (score >= 40)  return { label: "Sehr beliebt",     color: "text-orange-600", stars: 4 };
  if (score >= 15)  return { label: "Beliebt",          color: "text-teal-600",   stars: 3 };
  if (score >= 5)   return { label: "Aktives Mitglied", color: "text-blue-600",   stars: 2 };
  if (score >= 1)   return { label: "Newcomer",         color: "text-gray-600",   stars: 1 };
  return { label: "Neu dabei", color: "text-gray-400", stars: 0 };
}

// ─── Reise-Interessen Labels ─────────────────────────────────────────────────

const INTEREST_LABELS: Record<string, string> = {
  strand: "🏖️ Strand & Meer", stadt: "🏙️ Städtetrips", natur: "🏔️ Natur & Wandern",
  abenteuer: "🧗 Abenteuer", kultur: "🎭 Kultur", wellness: "💆 Wellness",
  luxus: "✨ Luxus", backpacking: "🎒 Backpacking", familie: "👨‍👩‍👧 Familie", kreuzfahrt: "🚢 Kreuzfahrt",
};

const TRAVELER_TYPE_LABELS: Record<string, string> = {
  entdecker: "🔭 Entdecker", strandliebhaber: "🏖️ Strandliebhaber", staedtereisender: "🏙️ Städtereisender",
  abenteurer: "🧗 Abenteurer", kulturfan: "🎭 Kulturfan", weltenbummler: "🌍 Weltenbummler",
  familienreisender: "👨‍👩‍👧 Familienreisender",
};

const FREQUENCY_LABELS: Record<string, string> = {
  "selten": "Reist selten", "1-2x": "1–2× im Jahr", "3-5x": "3–5× im Jahr", "mehrmals": "Mehrmals im Monat",
};

// ─── Seite ────────────────────────────────────────────────────────────────────

export default function ProfilPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = use(params);
  const { user } = useAuth();
  const [profile, setProfile]   = useState<CommunityProfile | null>(null);
  const [reports, setReports]   = useState<TravelReport[]>([]);
  const [groups, setGroups]     = useState<TravelGroup[]>([]);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      getCommunityProfile(uid),
      getTravelReportsByUser(uid).then(r => r.filter(x => x.isPublished)),
      user && user.uid !== uid ? isFollowing(user.uid, uid) : Promise.resolve(false),
      getUserGroups(uid),
    ]).then(([p, r, f, g]) => {
      setProfile(p ?? { uid, displayName: "Reisender", visitedCountries:[], followersCount:0, followingCount:0, reportsCount:0, tipsCount:0, groupsCount:0 });
      setReports(r as TravelReport[]);
      setFollowing(f as boolean);
      setGroups(g as TravelGroup[]);
    }).finally(() => setLoading(false));
  }, [uid, user]);

  async function handleFollow() {
    if (!user) return;
    setFollowLoading(true);
    if (following) {
      await unfollowUser(user.uid, uid);
      setFollowing(false);
      setProfile(p => p ? { ...p, followersCount: Math.max(0, p.followersCount - 1) } : p);
    } else {
      await followUser(user.uid, uid);
      setFollowing(true);
      setProfile(p => p ? { ...p, followersCount: p.followersCount + 1 } : p);
    }
    setFollowLoading(false);
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  if (!profile) return <div className="text-center py-20 text-gray-400">Profil nicht gefunden.</div>;

  const isOwn         = user?.uid === uid;
  const visitedSet    = new Set(profile.visitedCountries ?? []);
  const totalLikes    = reports.reduce((s, r) => s + (r.likesCount ?? 0), 0);
  const totalComments = reports.reduce((s, r) => s + (r.commentsCount ?? 0), 0);
  const popularity    = popularityLabel(totalLikes, totalComments);
  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.check(visitedSet));
  const initials      = (profile.displayName ?? "").split(" ").map(w => w[0]).filter(Boolean).slice(0,2).join("").toUpperCase() || "?";

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-0">

      {/* ── Privat-Banner ────────────────────────────────────────── */}
      {profile.isPublic === false && isOwn && (
        <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-amber-700 text-sm">
          <EyeOff className="w-4 h-4 shrink-0" />
          <span>Dein Profil ist aktuell <strong>privat</strong> – nur du kannst es sehen. Ändere das in den <Link href="/dashboard/" className="underline">Profileinstellungen</Link>.</span>
        </div>
      )}

      {/* ── Cover Banner ─────────────────────────────────────────── */}
      <div className="h-36 rounded-b-3xl relative mb-16 overflow-hidden"
        style={{
          background: profile.bannerURL
            ? undefined
            : "linear-gradient(135deg, #2dd4bf 0%, #06b6d4 50%, #3b82f6 100%)",
        }}
      >
        {profile.bannerURL && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.bannerURL}
            alt={`${profile.displayName ?? "Profil"} Banner`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Avatar */}
        {profile.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photoURL}
            alt={profile.displayName ?? "Avatar"}
            className="absolute -bottom-12 left-6 w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00838F] to-[#005F6A] border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-black">
            {initials}
          </div>
        )}
      </div>

      {/* ── Profile Header ───────────────────────────────────────── */}
      <div className="px-4 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-gray-900">{profile.displayName ?? "Reisender"}</h1>
            {profile.travelerType && (
              <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full border border-teal-100">
                {TRAVELER_TYPE_LABELS[profile.travelerType] ?? profile.travelerType}
              </span>
            )}
          </div>
          {profile.bio && <p className="text-sm text-gray-500 mt-1 max-w-lg">{profile.bio}</p>}
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            {profile.location && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {profile.location}
              </p>
            )}
            {profile.nationality && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Globe className="w-3 h-3" /> {profile.nationality}
              </p>
            )}
            {profile.travelFrequency && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Plane className="w-3 h-3" /> {FREQUENCY_LABELS[profile.travelFrequency]}
              </p>
            )}
          </div>
          {/* Social Links */}
          <div className="flex gap-3 mt-2">
            {profile.instagramUrl && (
              <a
                href={`https://instagram.com/${profile.instagramUrl.replace(/^@/, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 font-semibold"
              >
                <Instagram className="w-3.5 h-3.5" /> @{profile.instagramUrl.replace(/^@/, "")}
              </a>
            )}
            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl.startsWith("http") ? profile.websiteUrl : `https://${profile.websiteUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                <Link2 className="w-3.5 h-3.5" /> Website
              </a>
            )}
          </div>
          {/* Beliebtheit */}
          {(totalLikes > 0 || totalComments > 0) && (
            <div className={`flex items-center gap-1.5 mt-2 text-xs font-bold ${popularity.color}`}>
              {Array.from({ length: popularity.stars }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
              {popularity.label}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {isOwn ? (
            <Link href="/dashboard/"
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
            >
              Dashboard öffnen
            </Link>
          ) : user ? (
            <button onClick={handleFollow} disabled={followLoading}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                following
                  ? "bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              {followLoading ? <Loader2 className="w-4 h-4 animate-spin" /> :
                following ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {following ? "Gefolgt" : "Folgen"}
            </button>
          ) : (
            <Link href="/login/"
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
            >
              <UserPlus className="w-4 h-4" /> Folgen
            </Link>
          )}
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 px-4 mb-6">
        {[
          { icon: Globe,         value: visitedSet.size,          label: "Länder",     color: "text-teal-600",   bg: "bg-teal-50" },
          { icon: BookOpen,      value: reports.length,           label: "Berichte",   color: "text-violet-600", bg: "bg-violet-50" },
          { icon: Users2,        value: groups.length,            label: "Gruppen",    color: "text-blue-600",   bg: "bg-blue-50" },
          { icon: Users,         value: profile.followersCount ?? 0,   label: "Follower",   color: "text-rose-600",   bg: "bg-rose-50" },
          { icon: ThumbsUp,      value: totalLikes,               label: "Likes",      color: "text-amber-600",  bg: "bg-amber-50" },
          { icon: MessageCircle, value: totalComments,            label: "Kommentare", color: "text-green-600",  bg: "bg-green-50" },
        ].map(({ icon: Icon, value, label, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-3 flex flex-col items-center text-center`}>
            <Icon className={`w-5 h-5 ${color} mb-1`} />
            <div className={`text-xl font-black ${color}`}>{value}</div>
            <div className="text-[10px] text-gray-500 font-medium">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 px-4 pb-10">

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <aside className="space-y-5">

          {/* Achievements */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-sm text-gray-700 flex items-center gap-1.5 mb-3">
              <Trophy className="w-4 h-4 text-amber-500" />
              Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = a.check(visitedSet);
                return (
                  <div key={a.id}
                    className={`rounded-xl px-2.5 py-2 flex items-center gap-2 border text-xs transition-all ${
                      unlocked ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100 opacity-40 grayscale"
                    }`}
                  >
                    <span className="text-base shrink-0">{a.emoji}</span>
                    <div>
                      <div className={`font-bold leading-tight ${unlocked ? "text-amber-800" : "text-gray-500"}`}>{a.title}</div>
                      <div className="text-[9px] text-gray-400 leading-tight">{a.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reise-Interessen */}
          {(profile.travelInterests?.length ?? 0) > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-sm text-gray-700 flex items-center gap-1.5 mb-3">
                <Plane className="w-4 h-4 text-teal-600" />
                Reise-Interessen
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.travelInterests!.map((id) => (
                  <span key={id} className="bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-100">
                    {INTEREST_LABELS[id] ?? id}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sprachen */}
          {(profile.languages?.length ?? 0) > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-sm text-gray-700 flex items-center gap-1.5 mb-3">
                <Globe className="w-4 h-4 text-blue-600" />
                Spricht
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.languages!.map((lang) => (
                  <span key={lang} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bereiste Länder */}
          {visitedSet.size > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-sm text-gray-700 flex items-center gap-1.5 mb-3">
                <Globe className="w-4 h-4 text-teal-600" />
                Bereiste Länder ({visitedSet.size})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[...visitedSet].map((code) => (
                  <div key={code} className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-100">
                    <img
                      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
                      width={14} height={10} alt={code}
                      className="rounded-sm object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    {code}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gruppen */}
          {groups.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-sm text-gray-700 flex items-center gap-1.5 mb-3">
                <Users2 className="w-4 h-4 text-blue-600" /> Reise-Gruppen
              </h3>
              <div className="space-y-2">
                {groups.slice(0, 5).map((g) => (
                  <Link key={g.id} href={`/community/gruppen/${g.id}/`}
                    className="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg p-1.5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-800 line-clamp-1">{g.name}</div>
                      <div className="text-[10px] text-gray-400">{g.membersCount} Mitglieder</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── Berichte ─────────────────────────────────────────── */}
        <main>
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 mb-5">
            <BookOpen className="w-5 h-5 text-violet-600" />
            Reiseberichte ({reports.length})
          </h2>
          {reports.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Noch keine Berichte veröffentlicht.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {reports.map((r) => <TravelReportCard key={r.id} report={r} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
