"use client";

import { useState, useEffect, use } from "react";
import { getTravelGroup, joinGroup, leaveGroup } from "@/lib/supabase-db";
import { TravelGroup } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  Users2, MapPin, Calendar, Tag, LogIn, LogOut, Loader2, ArrowLeft,
  Heart, MessageCircle, Share2, Pin, Lightbulb, HelpCircle, Camera,
  Newspaper, Send, ChevronRight, PartyPopper, BarChart2, Route,
  Plus, Check, Clock, Star,
} from "lucide-react";
import Link from "next/link";

/* ── Types ──────────────────────────────────────────────────────────────── */

type PostType = "tipp" | "frage" | "bericht" | "foto" | "news";

interface FeedPost {
  id: string;
  userId: string;
  displayName: string;
  type: PostType;
  text: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  pinned?: boolean;
  createdAt: string;
}

interface GroupEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  description: string;
  joined: boolean;
}

interface Poll {
  id: string;
  question: string;
  options: { label: string; votes: number }[];
  totalVotes: number;
  voted: number | null;
  endsAt: string;
}

interface GroupMember {
  id: string;
  name: string;
  country: string;
  bio: string;
  reportsCount: number;
  joinedAt: string;
}

interface GroupRoute {
  id: string;
  title: string;
  destination: string;
  nights: number;
  persons: number;
  cloneCount: number;
  coverImageUrl: string;
  sharedBy: string;
}

/* ── Demo data factories ────────────────────────────────────────────────── */

function makePosts(groupId: string): FeedPost[] {
  const sets: Record<string, FeedPost[]> = {
    default: [
      { id: "p1", userId: "u1", displayName: "Sandra K.", type: "news", pinned: true,
        text: "Willkommen in unserer Gruppe! Bitte stellt euch kurz vor und teilt euer liebstes Urlaubsziel. Wir freuen uns auf euch!",
        imageUrl: undefined, likesCount: 24, commentsCount: 8, createdAt: "2025-09-01T10:00:00Z" },
      { id: "p2", userId: "u2", displayName: "Marco T.", type: "tipp",
        text: "Geheimtipp: Frühbucher-Angebote jetzt checken! Ich hab gerade All-Inclusive für Juni 2026 für 599€/Person gefunden – Flug inklusive. Link im Kommentar.",
        likesCount: 41, commentsCount: 12, createdAt: "2025-10-15T14:30:00Z" },
      { id: "p3", userId: "u3", displayName: "Julia & Max", type: "bericht",
        text: "Gerade zurück von unserem Urlaub! 14 Tage waren einfach zu kurz. Das Hotel war top, das Essen grandios und das Wetter perfekt. Nächstes Jahr auf jeden Fall wieder!",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format",
        likesCount: 67, commentsCount: 21, createdAt: "2025-11-02T09:15:00Z" },
      { id: "p4", userId: "u4", displayName: "Tim B.", type: "frage",
        text: "Hat jemand Erfahrung mit dem Transfer vom Flughafen direkt ins Hotel? Privat-Transfer oder Shuttle – was lohnt sich mehr bei 4 Personen?",
        likesCount: 15, commentsCount: 7, createdAt: "2025-11-10T18:00:00Z" },
      { id: "p5", userId: "u5", displayName: "Lena M.", type: "foto",
        text: "Sonnenuntergang gestern Abend – solche Momente vergisst man einfach nicht!",
        imageUrl: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80&auto=format",
        likesCount: 89, commentsCount: 14, createdAt: "2025-11-18T20:30:00Z" },
    ],
  };
  return sets[groupId] ?? sets.default;
}

function makeEvents(): GroupEvent[] {
  return [
    { id: "e1", title: "Virtuelles Treffen: Urlaubstipps 2026 teilen", date: "2026-04-20T19:00:00Z",
      location: "Zoom (Link nach Anmeldung)", attendees: 18, maxAttendees: 30,
      description: "Gemeinsam die besten Deals und Tipps für den Sommer 2026 besprechen. Jeder bringt seinen Top-Tipp mit!", joined: false },
    { id: "e2", title: "Gruppenreise: Mallorca Mai 2026", date: "2026-05-15T07:00:00Z",
      location: "Abflug Frankfurt/Main", attendees: 9, maxAttendees: 20,
      description: "Gemeinsame Gruppenreise nach Mallorca! 7 Nächte AI im 4-Sterne-Hotel. Gruppenrabatt bei mind. 12 Teilnehmern.", joined: false },
    { id: "e3", title: "Stammtisch Berlin: Urlaubs-Community", date: "2026-05-08T18:30:00Z",
      location: "Café Central, Berlin Mitte", attendees: 12,
      description: "Lokales Treffen für alle Berliner Community-Mitglieder. Quatschen, Pläne schmieden, neue Urlaubsfreunde finden.", joined: true },
  ];
}

function makePolls(): Poll[] {
  return [
    { id: "po1", question: "Wohin soll unsere nächste Gruppenreise gehen?",
      options: [
        { label: "Türkei – Antalya", votes: 23 },
        { label: "Griechenland – Kreta", votes: 31 },
        { label: "Spanien – Mallorca", votes: 18 },
        { label: "Ägypten – Hurghada", votes: 14 },
      ], totalVotes: 86, voted: null, endsAt: "2026-04-30T23:59:00Z" },
    { id: "po2", question: "Wann soll das nächste Gruppen-Meeting stattfinden?",
      options: [
        { label: "Wochentags abends", votes: 45 },
        { label: "Samstag Nachmittag", votes: 27 },
        { label: "Sonntag Morgen", votes: 13 },
      ], totalVotes: 85, voted: 0, endsAt: "2026-04-15T23:59:00Z" },
  ];
}

function makeMembers(): GroupMember[] {
  return [
    { id: "m1", name: "Sandra K.", country: "Deutschland", bio: "Urlaubs-Enthusiastin seit 15 Jahren. Lieblingsland: Türkei.", reportsCount: 8, joinedAt: "2025-01-10T00:00:00Z" },
    { id: "m2", name: "Marco T.", country: "Österreich", bio: "Tauchen, Schnorcheln, Strand – das Leben ist zu kurz für schlechtes Wetter!", reportsCount: 5, joinedAt: "2025-02-14T00:00:00Z" },
    { id: "m3", name: "Julia & Max", country: "Deutschland", bio: "Pärchen auf der Suche nach dem perfekten All-Inclusive-Hotel.", reportsCount: 12, joinedAt: "2025-01-22T00:00:00Z" },
    { id: "m4", name: "Tim B.", country: "Schweiz", bio: "Budget-Reisender der ersten Stunde. Nie mehr als 500€ für Flug+Hotel.", reportsCount: 3, joinedAt: "2025-03-05T00:00:00Z" },
    { id: "m5", name: "Lena M.", country: "Deutschland", bio: "Fotografin und Urlaubsbloggerin. Fange magische Momente ein.", reportsCount: 19, joinedAt: "2025-01-15T00:00:00Z" },
    { id: "m6", name: "Alex R.", country: "Deutschland", bio: "Gruppenreise-Organisator. Wer mit möchte: einfach melden!", reportsCount: 6, joinedAt: "2025-04-01T00:00:00Z" },
    { id: "m7", name: "Fam. Weber", country: "Deutschland", bio: "Familienurlaub mit 3 Kindern – wir kennen alle kinderfreundlichen Strände!", reportsCount: 4, joinedAt: "2025-05-10T00:00:00Z" },
    { id: "m8", name: "Sophie N.", country: "Österreich", bio: "Solo-Reisende und Yoga-Fan. Immer auf der Suche nach Wellness & Natur.", reportsCount: 7, joinedAt: "2025-06-01T00:00:00Z" },
  ];
}

function makeRoutes(): GroupRoute[] {
  return [
    { id: "r1", title: "Türkei-Rundreise: Antalya, Side & Alanya", destination: "Antalya, Türkei",
      nights: 10, persons: 2, cloneCount: 23,
      coverImageUrl: "https://images.unsplash.com/photo-1686808191914-5df77394ec3a?w=600&q=80&auto=format",
      sharedBy: "Sandra K." },
    { id: "r2", title: "Mallorca mit Kindern – Strand & Natur", destination: "Mallorca, Spanien",
      nights: 11, persons: 4, cloneCount: 45,
      coverImageUrl: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80&auto=format",
      sharedBy: "Fam. Weber" },
    { id: "r3", title: "Kreta Insel-Erkundung: West nach Ost", destination: "Kreta, Griechenland",
      nights: 13, persons: 2, cloneCount: 31,
      coverImageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80&auto=format",
      sharedBy: "Julia & Max" },
  ];
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

const CAT_LABELS: Record<string, string> = {
  destination: "Destination", style: "Reisestil", date: "Reisezeitraum", interest: "Interesse",
};

const POST_TYPE_META: Record<PostType, { label: string; icon: React.ReactNode; color: string }> = {
  news:    { label: "Ankündigung", icon: <Pin className="w-3 h-3" />,        color: "bg-amber-100 text-amber-700" },
  tipp:    { label: "Tipp",        icon: <Lightbulb className="w-3 h-3" />,  color: "bg-emerald-100 text-emerald-700" },
  frage:   { label: "Frage",       icon: <HelpCircle className="w-3 h-3" />, color: "bg-blue-100 text-blue-700" },
  bericht: { label: "Bericht",     icon: <Newspaper className="w-3 h-3" />,  color: "bg-purple-100 text-purple-700" },
  foto:    { label: "Foto",        icon: <Camera className="w-3 h-3" />,     color: "bg-pink-100 text-pink-700" },
};

function timeAgo(ts: string): string {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return "gerade eben";
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`;
  if (diff < 2592000) return `vor ${Math.floor(diff / 86400)} Tagen`;
  return new Date(ts).toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatMonth(ym?: string): string | null {
  if (!ym) return null;
  const [y, m] = ym.split("-");
  const months = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  return `${months[parseInt(m) - 1]} ${y}`;
}

/* ── Avatar ─────────────────────────────────────────────────────────────── */
function Avatar({ name, size = "md", color = "bg-teal-500" }: { name: string; size?: "sm" | "md" | "lg"; color?: string }) {
  const initials = name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  const cls = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-10 h-10 text-sm";
  return (
    <div className={`${cls} ${color} rounded-full text-white font-bold flex items-center justify-center shrink-0`}>
      {initials}
    </div>
  );
}

const AVATAR_COLORS = ["bg-teal-500","bg-cyan-500","bg-indigo-500","bg-violet-500","bg-rose-500","bg-amber-500","bg-emerald-500","bg-sky-500"];
function avatarColor(name: string) { return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]; }

/* ── Tab: Feed ──────────────────────────────────────────────────────────── */
function FeedTab({ groupId, isMember, user }: { groupId: string; isMember: boolean; user: { uid: string; displayName?: string | null } | null }) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [text, setText] = useState("");
  const [postType, setPostType] = useState<PostType>("tipp");
  const [sending, setSending] = useState(false);

  useEffect(() => { setPosts(makePosts(groupId)); }, [groupId]);

  function handleLike(id: string) {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likesCount: liked.has(id) ? p.likesCount - 1 : p.likesCount + 1 } : p));
  }

  async function handlePost() {
    if (!user || !text.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 400));
    const newPost: FeedPost = {
      id: `p-${Date.now()}`, userId: user.uid,
      displayName: user.displayName ?? "Anonym",
      type: postType, text: text.trim(),
      likesCount: 0, commentsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
    setText("");
    setSending(false);
  }

  const pinned = posts.filter((p) => p.pinned);
  const feed   = posts.filter((p) => !p.pinned);

  return (
    <div className="space-y-4">
      {/* Compose */}
      {isMember && user ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex gap-3 mb-3">
            <Avatar name={user.displayName ?? "?"} color={avatarColor(user.displayName ?? "A")} />
            <textarea
              value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Teile einen Tipp, stelle eine Frage oder berichte von deiner Reise…"
              rows={3} maxLength={800}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <div className="flex gap-1 flex-wrap">
              {(["tipp","frage","bericht","foto"] as PostType[]).map((t) => {
                const m = POST_TYPE_META[t];
                return (
                  <button key={t} onClick={() => setPostType(t)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                      postType === t ? m.color + " border-transparent" : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {m.icon}{m.label}
                  </button>
                );
              })}
            </div>
            <button onClick={handlePost} disabled={sending || !text.trim()}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 px-4 py-2 rounded-xl transition-colors"
            >
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Posten
            </button>
          </div>
        </div>
      ) : !user ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
          <Link href="/login/" className="text-teal-600 font-semibold hover:underline">Anmelden</Link>
          &nbsp;und der Gruppe beitreten, um zu schreiben
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600">
          Tritt der Gruppe bei, um Beiträge zu schreiben.
        </div>
      )}

      {/* Pinned */}
      {pinned.map((p) => <PostCard key={p.id} post={p} liked={liked.has(p.id)} onLike={() => handleLike(p.id)} />)}

      {/* Feed */}
      {feed.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">Noch keine Beiträge – starte die Unterhaltung!</p>
      ) : feed.map((p) => <PostCard key={p.id} post={p} liked={liked.has(p.id)} onLike={() => handleLike(p.id)} />)}
    </div>
  );
}

function PostCard({ post, liked, onLike }: { post: FeedPost; liked: boolean; onLike: () => void }) {
  const meta = POST_TYPE_META[post.type];
  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${post.pinned ? "border-amber-200" : "border-gray-100"}`}>
      {post.pinned && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-1.5 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
          <Pin className="w-3 h-3" /> Angepinnte Ankündigung
        </div>
      )}
      {post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imageUrl} alt={post.text} className="w-full h-52 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar name={post.displayName} size="sm" color={avatarColor(post.displayName)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-bold text-gray-800">{post.displayName}</span>
              <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
                {meta.icon}{meta.label}
              </span>
              <span className="text-[10px] text-gray-400 ml-auto">{timeAgo(post.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.text}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
          <button onClick={onLike} className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}>
            <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
            {post.likesCount + (liked ? 0 : 0)}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-teal-600 transition-colors">
            <MessageCircle className="w-4 h-4" /> {post.commentsCount} Kommentare
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-teal-600 transition-colors ml-auto">
            <Share2 className="w-4 h-4" /> Teilen
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Mitglieder ────────────────────────────────────────────────────── */
function MitgliederTab({ membersCount }: { membersCount: number }) {
  const members = makeMembers();
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{membersCount} Mitglieder insgesamt · Zuletzt aktiv angezeigt</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {members.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
            <Avatar name={m.name} size="lg" color={avatarColor(m.name)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-sm">{m.name}</span>
                {m.reportsCount >= 10 && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
              </div>
              <p className="text-[10px] text-gray-400 mb-1">{m.country} · Mitglied seit {new Date(m.joinedAt).toLocaleDateString("de-DE", { month: "short", year: "numeric" })}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{m.bio}</p>
              <p className="text-[10px] text-teal-600 font-semibold mt-1">{m.reportsCount} Urlaubsberichte</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tab: Events ────────────────────────────────────────────────────────── */
function EventsTab() {
  const [events, setEvents] = useState<GroupEvent[]>(makeEvents());

  function toggleJoin(id: string) {
    setEvents((prev) => prev.map((e) => e.id === id
      ? { ...e, joined: !e.joined, attendees: e.joined ? e.attendees - 1 : e.attendees + 1 }
      : e
    ));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Kommende Events & Gruppenreisen</p>
        <button className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline">
          <Plus className="w-3.5 h-3.5" /> Event vorschlagen
        </button>
      </div>
      {events.map((e) => {
        const past = new Date(e.date) < new Date();
        const full = e.maxAttendees ? e.attendees >= e.maxAttendees : false;
        return (
          <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className="bg-teal-50 text-teal-700 rounded-xl p-3 text-center min-w-14 shrink-0">
                <p className="text-lg font-black">{new Date(e.date).getDate()}</p>
                <p className="text-[10px] font-semibold">{new Date(e.date).toLocaleDateString("de-DE", { month: "short" })}</p>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm mb-1">{e.title}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(e.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>
                  <span className="flex items-center gap-1"><Users2 className="w-3 h-3" />
                    {e.attendees}{e.maxAttendees ? `/${e.maxAttendees}` : ""} Teilnehmer
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{e.description}</p>
                {!past && (
                  <button
                    onClick={() => toggleJoin(e.id)}
                    disabled={!e.joined && full}
                    className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${
                      e.joined
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : full
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    {e.joined ? <><Check className="w-3.5 h-3.5" /> Zugesagt</> : full ? "Ausgebucht" : <><PartyPopper className="w-3.5 h-3.5" /> Teilnehmen</>}
                  </button>
                )}
                {past && <span className="text-[10px] text-gray-400 italic">Vergangenes Event</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Tab: Umfragen ──────────────────────────────────────────────────────── */
function UmfragenTab() {
  const [polls, setPolls] = useState<Poll[]>(makePolls());

  function vote(pollId: string, optIdx: number) {
    setPolls((prev) => prev.map((p) => {
      if (p.id !== pollId || p.voted !== null) return p;
      const newOpts = p.options.map((o, i) => i === optIdx ? { ...o, votes: o.votes + 1 } : o);
      return { ...p, options: newOpts, totalVotes: p.totalVotes + 1, voted: optIdx };
    }));
  }

  return (
    <div className="space-y-5">
      {polls.map((poll) => {
        const ended = new Date(poll.endsAt) < new Date();
        return (
          <div key={poll.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h3 className="font-bold text-gray-800 text-sm">{poll.question}</h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${ended ? "bg-gray-100 text-gray-500" : "bg-teal-50 text-teal-700"}`}>
                {ended ? "Beendet" : `endet ${new Date(poll.endsAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}`}
              </span>
            </div>
            <div className="space-y-2.5">
              {poll.options.map((opt, i) => {
                const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                const isVoted = poll.voted === i;
                return (
                  <button
                    key={i}
                    onClick={() => vote(poll.id, i)}
                    disabled={poll.voted !== null || ended}
                    className="w-full text-left group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold ${isVoted ? "text-teal-700" : "text-gray-700"}`}>
                        {isVoted && <Check className="w-3 h-3 inline mr-1" />}{opt.label}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isVoted ? "bg-teal-500" : "bg-gray-300 group-hover:bg-teal-200"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
              <BarChart2 className="w-3 h-3" /> {poll.totalVotes} Stimmen insgesamt
              {poll.voted === null && !ended && <span className="ml-auto text-teal-600 font-semibold">Klick zum Abstimmen</span>}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ── Tab: Urlaubsrouten ───────────────────────────────────────────────────── */
function RoutesTab() {
  const [cloned, setCloned] = useState<Set<string>>(new Set());
  const routes = makeRoutes();

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Von Gruppenmitgliedern geteilte Urlaubsrouten – übernimm sie mit einem Klick in deine Planung.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {routes.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.coverImageUrl} alt={r.title} className="w-full h-32 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{r.title}</h3>
              <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.destination}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.nights} Nächte</span>
                <span className="flex items-center gap-1"><Users2 className="w-3 h-3" />{r.persons} Pers.</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">von {r.sharedBy} · {r.cloneCount}× geklont</span>
                <button
                  onClick={() => setCloned((prev) => new Set([...prev, r.id]))}
                  disabled={cloned.has(r.id)}
                  className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    cloned.has(r.id)
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-[#00838F] text-white hover:bg-[#006E7A]"
                  }`}
                >
                  <Route className="w-3 h-3" />
                  {cloned.has(r.id) ? "Geklont!" : "Klonen"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center pt-2">
        <Link href="/reiserouten/" className="text-sm font-semibold text-teal-600 hover:underline flex items-center gap-1 justify-center">
          Alle öffentlichen Urlaubsrouten entdecken <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

type TabId = "feed" | "mitglieder" | "events" | "umfragen" | "routen";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "feed",       label: "Feed",        icon: <Newspaper className="w-3.5 h-3.5" /> },
  { id: "mitglieder", label: "Mitglieder",  icon: <Users2 className="w-3.5 h-3.5" /> },
  { id: "events",     label: "Events",      icon: <PartyPopper className="w-3.5 h-3.5" /> },
  { id: "umfragen",   label: "Umfragen",    icon: <BarChart2 className="w-3.5 h-3.5" /> },
  { id: "routen",     label: "Routen",      icon: <Route className="w-3.5 h-3.5" /> },
];

export default function GruppeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [group, setGroup]     = useState<TravelGroup | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading]  = useState(true);
  const [joining, setJoining]  = useState(false);
  const [tab, setTab]          = useState<TabId>("feed");

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
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Zurück */}
      <Link href="/community/gruppen/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Alle Gruppen
      </Link>

      {/* Group Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
        <div className="relative h-44 bg-linear-to-br from-teal-400 to-cyan-500">
          {group.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={group.coverImageUrl} alt={group.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-semibold backdrop-blur-sm">
                {CAT_LABELS[group.category]}
              </span>
              <h1 className="text-2xl font-black text-white mt-1.5 leading-tight drop-shadow">{group.name}</h1>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 text-white text-sm font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Users2 className="w-4 h-4" /> {group.membersCount}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 leading-relaxed">{group.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
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
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user && !isCreator && (
              isMember ? (
                <button onClick={handleLeave} disabled={joining}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-2 rounded-xl transition-colors"
                >
                  {joining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                  Verlassen
                </button>
              ) : (
                <button onClick={handleJoin} disabled={joining}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl transition-colors"
                >
                  {joining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
                  Beitreten
                </button>
              )
            )}
            {!user && (
              <Link href="/login/"
                className="text-xs font-bold text-teal-600 border border-teal-300 px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors"
              >
                Anmelden
              </Link>
            )}
            {isCreator && (
              <span className="text-xs text-teal-600 font-bold bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100">
                Deine Gruppe
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-1 justify-center ${
              tab === t.id ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "feed"       && <FeedTab groupId={group.id} isMember={isMember} user={user} />}
      {tab === "mitglieder" && <MitgliederTab membersCount={group.membersCount} />}
      {tab === "events"     && <EventsTab />}
      {tab === "umfragen"   && <UmfragenTab />}
      {tab === "routen"     && <RoutesTab />}
    </div>
  );
}
