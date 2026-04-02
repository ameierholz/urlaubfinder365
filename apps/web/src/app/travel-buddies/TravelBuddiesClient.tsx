"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Users2, MapPin, Globe, MessageCircle, Search, Filter, Plus, Heart, CheckCircle, X } from "lucide-react";
import Link from "next/link";

interface Buddy {
  id: string;
  userId: string;
  displayName: string;
  photoUrl: string | null;
  ageRange: string;
  gender: string;
  languages: string[];
  destinations: string[];
  travelStyle: string[];
  bio: string;
  departureFrom: string;
  travelMonths: string[];
}

const TRAVEL_STYLES = [
  { id: "strand", label: "Strand" },
  { id: "stadt", label: "Städte" },
  { id: "natur", label: "Natur" },
  { id: "kultur", label: "Kultur" },
  { id: "abenteuer", label: "Abenteuer" },
  { id: "wellness", label: "Wellness" },
  { id: "backpacker", label: "Backpacker" },
  { id: "luxus", label: "Luxus" },
];

const AGE_RANGES = ["18-24", "25-35", "36-45", "46-55", "56+"];

const DEMO_BUDDIES: Buddy[] = [
  {
    id: "demo-1", userId: "demo-1", displayName: "Sandra K.", photoUrl: null,
    ageRange: "25-35", gender: "Weiblich", languages: ["Deutsch", "Englisch", "Spanisch"],
    destinations: ["Mallorca", "Barcelona", "Teneriffa"], travelStyle: ["strand", "stadt", "kultur"],
    bio: "Reisebloggerin & Fotografin. Suche Reisepartnerin für Mallorca im September. Am liebsten Strand tagsüber und Tapas abends!",
    departureFrom: "München", travelMonths: ["Sep", "Okt", "Mai"],
  },
  {
    id: "demo-2", userId: "demo-2", displayName: "Marco T.", photoUrl: null,
    ageRange: "36-45", gender: "Männlich", languages: ["Deutsch", "Englisch"],
    destinations: ["Hurghada", "Sharm el Sheikh", "Malediven"], travelStyle: ["strand", "abenteuer"],
    bio: "Leidenschaftlicher Taucher. Suche Buddy für Tauchurlaub am Roten Meer. PADI Advanced zertifiziert.",
    departureFrom: "Wien", travelMonths: ["Nov", "Dez", "Jan", "Feb"],
  },
  {
    id: "demo-3", userId: "demo-3", displayName: "Julia M.", photoUrl: null,
    ageRange: "25-35", gender: "Weiblich", languages: ["Deutsch", "Englisch", "Französisch"],
    destinations: ["Kreta", "Santorini", "Korfu"], travelStyle: ["kultur", "natur", "strand"],
    bio: "Griechenland-Fan! Suche Mitreisende für Insel-Hopping im Juni. Wandern, Kultur und griechisches Essen.",
    departureFrom: "Frankfurt", travelMonths: ["Jun", "Jul"],
  },
  {
    id: "demo-4", userId: "demo-4", displayName: "Tim B.", photoUrl: null,
    ageRange: "25-35", gender: "Männlich", languages: ["Deutsch", "Englisch"],
    destinations: ["Thailand", "Vietnam", "Bali"], travelStyle: ["backpacker", "abenteuer", "natur"],
    bio: "Solo-Backpacker sucht Reisebegleitung für 3 Wochen Südostasien. Flexibel, spontan, budgetbewusst.",
    departureFrom: "Berlin", travelMonths: ["Feb", "Mär"],
  },
  {
    id: "demo-5", userId: "demo-5", displayName: "Lena M.", photoUrl: null,
    ageRange: "36-45", gender: "Weiblich", languages: ["Deutsch"],
    destinations: ["Antalya", "Side", "Bodrum"], travelStyle: ["wellness", "strand", "luxus"],
    bio: "Spa-Liebhaberin sucht Reisepartnerin für Wellness-Woche in der Türkei. 5-Sterne All-Inclusive bevorzugt.",
    departureFrom: "Zürich", travelMonths: ["Apr", "Mai", "Okt"],
  },
  {
    id: "demo-6", userId: "demo-6", displayName: "Alex R.", photoUrl: null,
    ageRange: "46-55", gender: "Männlich", languages: ["Deutsch", "Englisch"],
    destinations: ["Mittelmeer Kreuzfahrt", "Karibik", "Norwegen"], travelStyle: ["luxus", "kultur"],
    bio: "Kreuzfahrt-Enthusiast. Suche Mitreisende für AIDA Mittelmeer-Route im Herbst. Gerne auch Paare.",
    departureFrom: "Hamburg", travelMonths: ["Sep", "Okt"],
  },
];
const MONTHS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];

function db() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function Avatar({ buddy }: { buddy: Buddy }) {
  const initials = buddy.displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return buddy.photoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={buddy.photoUrl} alt={buddy.displayName} className="w-14 h-14 rounded-full object-cover" />
  ) : (
    <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#00838F] to-[#1db682] flex items-center justify-center text-white font-bold text-lg shrink-0">
      {initials}
    </div>
  );
}

export default function TravelBuddiesClient() {
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStyle, setFilterStyle] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [requestSent, setRequestSent] = useState<Set<string>>(new Set());
  const [myProfile, setMyProfile] = useState<Buddy | null>(null);
  const [editForm, setEditForm] = useState({
    bio: "", departureFrom: "", ageRange: "25-35", gender: "keine Angabe",
    languages: "", destinations: "", travelStyle: [] as string[], travelMonths: [] as string[],
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data: authData } = await db().auth.getUser();
    const uid = authData.user?.id ?? null;
    setUserId(uid);

    const { data } = await db()
      .from("travel_buddies")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(50);

    const list: Buddy[] = (data ?? []).map((r) => ({
      id: r.id, userId: r.user_id, displayName: r.display_name, photoUrl: r.photo_url,
      ageRange: r.age_range, gender: r.gender,
      languages: r.languages ?? [], destinations: r.destinations ?? [],
      travelStyle: r.travel_style ?? [], bio: r.bio ?? "",
      departureFrom: r.departure_from ?? "", travelMonths: r.travel_months ?? [],
    }));

    setBuddies(list.length > 0 ? list : DEMO_BUDDIES);
    if (uid) {
      const mine = list.find((b) => b.userId === uid);
      setMyProfile(mine ?? null);
      if (mine) {
        setEditForm({
          bio: mine.bio, departureFrom: mine.departureFrom, ageRange: mine.ageRange,
          gender: mine.gender, languages: mine.languages.join(", "),
          destinations: mine.destinations.join(", "), travelStyle: mine.travelStyle,
          travelMonths: mine.travelMonths,
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    const { data: authData } = await db().auth.getUser();
    const displayName = authData.user?.user_metadata?.full_name ?? authData.user?.email ?? "Reisender";

    await db().from("travel_buddies").upsert({
      user_id: userId, display_name: displayName,
      bio: editForm.bio, departure_from: editForm.departureFrom,
      age_range: editForm.ageRange, gender: editForm.gender,
      languages: editForm.languages.split(",").map((s) => s.trim()).filter(Boolean),
      destinations: editForm.destinations.split(",").map((s) => s.trim()).filter(Boolean),
      travel_style: editForm.travelStyle,
      travel_months: editForm.travelMonths,
      is_active: true, updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    setSaving(false);
    setShowProfile(false);
    load();
  };

  const sendRequest = async (buddy: Buddy) => {
    if (!userId) return;
    await db().from("buddy_requests").upsert({
      from_user_id: userId, to_user_id: buddy.userId, status: "pending",
    }, { onConflict: "from_user_id,to_user_id" });
    setRequestSent((prev) => new Set([...prev, buddy.id]));
  };

  const filtered = buddies.filter((b) => {
    if (b.userId === userId) return false;
    const matchSearch = search === "" ||
      b.displayName.toLowerCase().includes(search.toLowerCase()) ||
      b.destinations.some((d) => d.toLowerCase().includes(search.toLowerCase())) ||
      b.departureFrom.toLowerCase().includes(search.toLowerCase());
    const matchStyle = filterStyle.length === 0 || filterStyle.some((s) => b.travelStyle.includes(s));
    return matchSearch && matchStyle;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#00838F] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">←</Link>
            <h1 className="font-bold text-gray-900 flex items-center gap-2">
              <Users2 className="w-5 h-5 text-[#00838F]" />
              Travel Buddies
            </h1>
          </div>
          {userId && (
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 bg-[#00838F] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#006E7A] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {myProfile ? "Profil bearbeiten" : "Profil erstellen"}
            </button>
          )}
          {!userId && (
            <Link href="/login" className="text-xs text-[#00838F] font-semibold">
              Einloggen um mitzumachen →
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search + Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Nach Name, Ziel oder Abflugort suchen…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00838F]/30 bg-white"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {TRAVEL_STYLES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilterStyle((prev) =>
                  prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                )}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  filterStyle.includes(id)
                    ? "bg-[#00838F] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Users2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-bold text-gray-700 mb-2">Noch keine passenden Reisepartner</p>
            <p className="text-sm text-gray-400">
              {userId ? "Erstelle dein Profil, um als erster sichtbar zu sein!" : "Melde dich an, um Reisepartner zu finden."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((buddy) => (
              <div key={buddy.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar buddy={buddy} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900">{buddy.displayName}</h3>
                    <p className="text-xs text-gray-500">{buddy.ageRange} · {buddy.gender}</p>
                    {buddy.departureFrom && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> Ab {buddy.departureFrom}
                      </p>
                    )}
                  </div>
                </div>

                {buddy.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{buddy.bio}</p>
                )}

                {buddy.destinations.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Globe className="w-3 h-3 text-gray-400 shrink-0" />
                    {buddy.destinations.slice(0, 3).map((d) => (
                      <span key={d} className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {buddy.travelStyle.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {buddy.travelStyle.slice(0, 4).map((s) => (
                      <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {TRAVEL_STYLES.find((t) => t.id === s)?.label ?? s}
                      </span>
                    ))}
                  </div>
                )}

                {userId && (
                  <button
                    onClick={() => sendRequest(buddy)}
                    disabled={requestSent.has(buddy.id)}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      requestSent.has(buddy.id)
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-[#00838F] text-white hover:bg-[#006E7A]"
                    }`}
                  >
                    {requestSent.has(buddy.id) ? (
                      <><CheckCircle className="w-3.5 h-3.5" /> Anfrage gesendet</>
                    ) : (
                      <><MessageCircle className="w-3.5 h-3.5" /> Kontakt aufnehmen</>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#00838F]" />
                Mein Buddy-Profil
              </h2>
              <button onClick={() => setShowProfile(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Über mich</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Wer bist du als Reisender? Was suchst du in einem Reisepartner?"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00838F]/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Abflugort</label>
                  <input
                    type="text"
                    value={editForm.departureFrom}
                    onChange={(e) => setEditForm((f) => ({ ...f, departureFrom: e.target.value }))}
                    placeholder="z.B. Frankfurt"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00838F]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Altersgruppe</label>
                  <select
                    value={editForm.ageRange}
                    onChange={(e) => setEditForm((f) => ({ ...f, ageRange: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00838F]/30 bg-white"
                  >
                    {AGE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Wunschziele (kommagetrennt)</label>
                <input
                  type="text"
                  value={editForm.destinations}
                  onChange={(e) => setEditForm((f) => ({ ...f, destinations: e.target.value }))}
                  placeholder="z.B. Mallorca, Thailand, Teneriffa"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00838F]/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Sprachen (kommagetrennt)</label>
                <input
                  type="text"
                  value={editForm.languages}
                  onChange={(e) => setEditForm((f) => ({ ...f, languages: e.target.value }))}
                  placeholder="z.B. Deutsch, Englisch, Spanisch"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00838F]/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Reisestil</label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STYLES.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setEditForm((f) => ({
                        ...f,
                        travelStyle: f.travelStyle.includes(id)
                          ? f.travelStyle.filter((x) => x !== id)
                          : [...f.travelStyle, id],
                      }))}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                        editForm.travelStyle.includes(id)
                          ? "bg-[#00838F] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Bevorzugte Reisemonate</label>
                <div className="grid grid-cols-6 gap-1.5">
                  {MONTHS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setEditForm((f) => ({
                        ...f,
                        travelMonths: f.travelMonths.includes(m)
                          ? f.travelMonths.filter((x) => x !== m)
                          : [...f.travelMonths, m],
                      }))}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        editForm.travelMonths.includes(m)
                          ? "bg-[#00838F] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full bg-[#00838F] text-white font-semibold py-3 rounded-xl hover:bg-[#006E7A] transition-colors disabled:opacity-50"
              >
                {saving ? "Wird gespeichert…" : "Profil speichern"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
