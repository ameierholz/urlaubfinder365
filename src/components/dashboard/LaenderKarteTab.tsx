"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCommunityProfile, updateCommunityProfile } from "@/lib/firestore";
import { Globe, Save, Loader2, Check, Trophy, MapPin, TrendingUp, Star } from "lucide-react";

// ─── Länder nach Kontinent ────────────────────────────────────────────────────

type Country = { code: string; name: string; flag: string };

const CONTINENTS: { id: string; label: string; emoji: string; color: string; bg: string; countries: Country[] }[] = [
  {
    id: "europa", label: "Europa", emoji: "🏰", color: "text-blue-600", bg: "bg-blue-50 border-blue-200",
    countries: [
      { code:"AL", name:"Albanien",         flag:"🇦🇱" },
      { code:"AD", name:"Andorra",           flag:"🇦🇩" },
      { code:"AT", name:"Österreich",        flag:"🇦🇹" },
      { code:"BE", name:"Belgien",           flag:"🇧🇪" },
      { code:"BA", name:"Bosnien",           flag:"🇧🇦" },
      { code:"BG", name:"Bulgarien",         flag:"🇧🇬" },
      { code:"HR", name:"Kroatien",          flag:"🇭🇷" },
      { code:"CY", name:"Zypern",            flag:"🇨🇾" },
      { code:"CZ", name:"Tschechien",        flag:"🇨🇿" },
      { code:"DK", name:"Dänemark",          flag:"🇩🇰" },
      { code:"EE", name:"Estland",           flag:"🇪🇪" },
      { code:"FI", name:"Finnland",          flag:"🇫🇮" },
      { code:"FR", name:"Frankreich",        flag:"🇫🇷" },
      { code:"DE", name:"Deutschland",       flag:"🇩🇪" },
      { code:"GR", name:"Griechenland",      flag:"🇬🇷" },
      { code:"HU", name:"Ungarn",            flag:"🇭🇺" },
      { code:"IS", name:"Island",            flag:"🇮🇸" },
      { code:"IE", name:"Irland",            flag:"🇮🇪" },
      { code:"IT", name:"Italien",           flag:"🇮🇹" },
      { code:"LV", name:"Lettland",          flag:"🇱🇻" },
      { code:"LI", name:"Liechtenstein",     flag:"🇱🇮" },
      { code:"LT", name:"Litauen",           flag:"🇱🇹" },
      { code:"LU", name:"Luxemburg",         flag:"🇱🇺" },
      { code:"MT", name:"Malta",             flag:"🇲🇹" },
      { code:"MC", name:"Monaco",            flag:"🇲🇨" },
      { code:"ME", name:"Montenegro",        flag:"🇲🇪" },
      { code:"NL", name:"Niederlande",       flag:"🇳🇱" },
      { code:"MK", name:"Nordmazedonien",    flag:"🇲🇰" },
      { code:"NO", name:"Norwegen",          flag:"🇳🇴" },
      { code:"PL", name:"Polen",             flag:"🇵🇱" },
      { code:"PT", name:"Portugal",          flag:"🇵🇹" },
      { code:"RO", name:"Rumänien",          flag:"🇷🇴" },
      { code:"RU", name:"Russland",          flag:"🇷🇺" },
      { code:"RS", name:"Serbien",           flag:"🇷🇸" },
      { code:"SK", name:"Slowakei",          flag:"🇸🇰" },
      { code:"SI", name:"Slowenien",         flag:"🇸🇮" },
      { code:"ES", name:"Spanien",           flag:"🇪🇸" },
      { code:"SE", name:"Schweden",          flag:"🇸🇪" },
      { code:"CH", name:"Schweiz",           flag:"🇨🇭" },
      { code:"UA", name:"Ukraine",           flag:"🇺🇦" },
      { code:"GB", name:"Großbritannien",    flag:"🇬🇧" },
    ],
  },
  {
    id: "asien", label: "Asien", emoji: "🏯", color: "text-red-600", bg: "bg-red-50 border-red-200",
    countries: [
      { code:"AF", name:"Afghanistan",       flag:"🇦🇫" },
      { code:"AM", name:"Armenien",          flag:"🇦🇲" },
      { code:"AZ", name:"Aserbaidschan",     flag:"🇦🇿" },
      { code:"BD", name:"Bangladesch",       flag:"🇧🇩" },
      { code:"BT", name:"Bhutan",            flag:"🇧🇹" },
      { code:"BN", name:"Brunei",            flag:"🇧🇳" },
      { code:"KH", name:"Kambodscha",        flag:"🇰🇭" },
      { code:"CN", name:"China",             flag:"🇨🇳" },
      { code:"GE", name:"Georgien",          flag:"🇬🇪" },
      { code:"IN", name:"Indien",            flag:"🇮🇳" },
      { code:"ID", name:"Indonesien",        flag:"🇮🇩" },
      { code:"JP", name:"Japan",             flag:"🇯🇵" },
      { code:"KZ", name:"Kasachstan",        flag:"🇰🇿" },
      { code:"KG", name:"Kirgisistan",       flag:"🇰🇬" },
      { code:"LA", name:"Laos",              flag:"🇱🇦" },
      { code:"MY", name:"Malaysia",          flag:"🇲🇾" },
      { code:"MV", name:"Malediven",         flag:"🇲🇻" },
      { code:"MN", name:"Mongolei",          flag:"🇲🇳" },
      { code:"MM", name:"Myanmar",           flag:"🇲🇲" },
      { code:"NP", name:"Nepal",             flag:"🇳🇵" },
      { code:"KP", name:"Nordkorea",         flag:"🇰🇵" },
      { code:"PK", name:"Pakistan",          flag:"🇵🇰" },
      { code:"PH", name:"Philippinen",       flag:"🇵🇭" },
      { code:"SG", name:"Singapur",          flag:"🇸🇬" },
      { code:"KR", name:"Südkorea",          flag:"🇰🇷" },
      { code:"LK", name:"Sri Lanka",         flag:"🇱🇰" },
      { code:"TJ", name:"Tadschikistan",     flag:"🇹🇯" },
      { code:"TW", name:"Taiwan",            flag:"🇹🇼" },
      { code:"TH", name:"Thailand",          flag:"🇹🇭" },
      { code:"TL", name:"Osttimor",          flag:"🇹🇱" },
      { code:"TM", name:"Turkmenistan",      flag:"🇹🇲" },
      { code:"UZ", name:"Usbekistan",        flag:"🇺🇿" },
      { code:"VN", name:"Vietnam",           flag:"🇻🇳" },
    ],
  },
  {
    id: "neareast", label: "Naher Osten", emoji: "🕌", color: "text-amber-600", bg: "bg-amber-50 border-amber-200",
    countries: [
      { code:"BH", name:"Bahrain",           flag:"🇧🇭" },
      { code:"IR", name:"Iran",              flag:"🇮🇷" },
      { code:"IQ", name:"Irak",              flag:"🇮🇶" },
      { code:"IL", name:"Israel",            flag:"🇮🇱" },
      { code:"JO", name:"Jordanien",         flag:"🇯🇴" },
      { code:"KW", name:"Kuwait",            flag:"🇰🇼" },
      { code:"LB", name:"Libanon",           flag:"🇱🇧" },
      { code:"OM", name:"Oman",              flag:"🇴🇲" },
      { code:"QA", name:"Katar",             flag:"🇶🇦" },
      { code:"SA", name:"Saudi-Arabien",     flag:"🇸🇦" },
      { code:"SY", name:"Syrien",            flag:"🇸🇾" },
      { code:"TR", name:"Türkei",            flag:"🇹🇷" },
      { code:"AE", name:"VAE / Dubai",       flag:"🇦🇪" },
      { code:"YE", name:"Jemen",             flag:"🇾🇪" },
    ],
  },
  {
    id: "amerika", label: "Amerika", emoji: "🗽", color: "text-green-600", bg: "bg-green-50 border-green-200",
    countries: [
      { code:"AR", name:"Argentinien",       flag:"🇦🇷" },
      { code:"BS", name:"Bahamas",           flag:"🇧🇸" },
      { code:"BB", name:"Barbados",          flag:"🇧🇧" },
      { code:"BZ", name:"Belize",            flag:"🇧🇿" },
      { code:"BO", name:"Bolivien",          flag:"🇧🇴" },
      { code:"BR", name:"Brasilien",         flag:"🇧🇷" },
      { code:"CA", name:"Kanada",            flag:"🇨🇦" },
      { code:"CL", name:"Chile",             flag:"🇨🇱" },
      { code:"CO", name:"Kolumbien",         flag:"🇨🇴" },
      { code:"CR", name:"Costa Rica",        flag:"🇨🇷" },
      { code:"CU", name:"Kuba",              flag:"🇨🇺" },
      { code:"DO", name:"Dom. Republik",     flag:"🇩🇴" },
      { code:"EC", name:"Ecuador",           flag:"🇪🇨" },
      { code:"SV", name:"El Salvador",       flag:"🇸🇻" },
      { code:"GT", name:"Guatemala",         flag:"🇬🇹" },
      { code:"GY", name:"Guyana",            flag:"🇬🇾" },
      { code:"HT", name:"Haiti",             flag:"🇭🇹" },
      { code:"HN", name:"Honduras",          flag:"🇭🇳" },
      { code:"JM", name:"Jamaika",           flag:"🇯🇲" },
      { code:"MX", name:"Mexiko",            flag:"🇲🇽" },
      { code:"NI", name:"Nicaragua",         flag:"🇳🇮" },
      { code:"PA", name:"Panama",            flag:"🇵🇦" },
      { code:"PY", name:"Paraguay",          flag:"🇵🇾" },
      { code:"PE", name:"Peru",              flag:"🇵🇪" },
      { code:"TT", name:"Trinidad/Tobago",   flag:"🇹🇹" },
      { code:"US", name:"USA",               flag:"🇺🇸" },
      { code:"UY", name:"Uruguay",           flag:"🇺🇾" },
      { code:"VE", name:"Venezuela",         flag:"🇻🇪" },
    ],
  },
  {
    id: "afrika", label: "Afrika", emoji: "🦁", color: "text-orange-600", bg: "bg-orange-50 border-orange-200",
    countries: [
      { code:"DZ", name:"Algerien",          flag:"🇩🇿" },
      { code:"AO", name:"Angola",            flag:"🇦🇴" },
      { code:"BJ", name:"Benin",             flag:"🇧🇯" },
      { code:"BW", name:"Botswana",          flag:"🇧🇼" },
      { code:"BF", name:"Burkina Faso",      flag:"🇧🇫" },
      { code:"BI", name:"Burundi",           flag:"🇧🇮" },
      { code:"CM", name:"Kamerun",           flag:"🇨🇲" },
      { code:"CV", name:"Kap Verde",         flag:"🇨🇻" },
      { code:"KM", name:"Komoren",           flag:"🇰🇲" },
      { code:"DJ", name:"Dschibuti",         flag:"🇩🇯" },
      { code:"EG", name:"Ägypten",           flag:"🇪🇬" },
      { code:"GQ", name:"Äquatorialguinea",  flag:"🇬🇶" },
      { code:"ER", name:"Eritrea",           flag:"🇪🇷" },
      { code:"ET", name:"Äthiopien",         flag:"🇪🇹" },
      { code:"GA", name:"Gabun",             flag:"🇬🇦" },
      { code:"GM", name:"Gambia",            flag:"🇬🇲" },
      { code:"GH", name:"Ghana",             flag:"🇬🇭" },
      { code:"GN", name:"Guinea",            flag:"🇬🇳" },
      { code:"GW", name:"Guinea-Bissau",     flag:"🇬🇼" },
      { code:"KE", name:"Kenia",             flag:"🇰🇪" },
      { code:"LS", name:"Lesotho",           flag:"🇱🇸" },
      { code:"LR", name:"Liberia",           flag:"🇱🇷" },
      { code:"LY", name:"Libyen",            flag:"🇱🇾" },
      { code:"MG", name:"Madagaskar",        flag:"🇲🇬" },
      { code:"MW", name:"Malawi",            flag:"🇲🇼" },
      { code:"ML", name:"Mali",              flag:"🇲🇱" },
      { code:"MR", name:"Mauretanien",       flag:"🇲🇷" },
      { code:"MU", name:"Mauritius",         flag:"🇲🇺" },
      { code:"MA", name:"Marokko",           flag:"🇲🇦" },
      { code:"MZ", name:"Mosambik",          flag:"🇲🇿" },
      { code:"NA", name:"Namibia",           flag:"🇳🇦" },
      { code:"NE", name:"Niger",             flag:"🇳🇪" },
      { code:"NG", name:"Nigeria",           flag:"🇳🇬" },
      { code:"RW", name:"Ruanda",            flag:"🇷🇼" },
      { code:"SN", name:"Senegal",           flag:"🇸🇳" },
      { code:"SL", name:"Sierra Leone",      flag:"🇸🇱" },
      { code:"SO", name:"Somalia",           flag:"🇸🇴" },
      { code:"ZA", name:"Südafrika",         flag:"🇿🇦" },
      { code:"SD", name:"Sudan",             flag:"🇸🇩" },
      { code:"TZ", name:"Tansania",          flag:"🇹🇿" },
      { code:"TG", name:"Togo",              flag:"🇹🇬" },
      { code:"TN", name:"Tunesien",          flag:"🇹🇳" },
      { code:"UG", name:"Uganda",            flag:"🇺🇬" },
      { code:"ZM", name:"Sambia",            flag:"🇿🇲" },
      { code:"ZW", name:"Simbabwe",          flag:"🇿🇼" },
    ],
  },
  {
    id: "ozeanien", label: "Ozeanien", emoji: "🌺", color: "text-teal-600", bg: "bg-teal-50 border-teal-200",
    countries: [
      { code:"AU", name:"Australien",        flag:"🇦🇺" },
      { code:"FJ", name:"Fidschi",           flag:"🇫🇯" },
      { code:"KI", name:"Kiribati",          flag:"🇰🇮" },
      { code:"MH", name:"Marshallinseln",    flag:"🇲🇭" },
      { code:"NR", name:"Nauru",             flag:"🇳🇷" },
      { code:"NZ", name:"Neuseeland",        flag:"🇳🇿" },
      { code:"PW", name:"Palau",             flag:"🇵🇼" },
      { code:"PG", name:"Papua-Neuguinea",   flag:"🇵🇬" },
      { code:"WS", name:"Samoa",             flag:"🇼🇸" },
      { code:"SB", name:"Salomonen",         flag:"🇸🇧" },
      { code:"TO", name:"Tonga",             flag:"🇹🇴" },
      { code:"TV", name:"Tuvalu",            flag:"🇹🇻" },
      { code:"VU", name:"Vanuatu",           flag:"🇻🇺" },
    ],
  },
];

const TOTAL = CONTINENTS.reduce((s, c) => s + c.countries.length, 0);

// ─── Achievements ─────────────────────────────────────────────────────────────

interface Achievement {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  check: (visited: Set<string>) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { id:"first",       emoji:"✈️",  title:"Erste Reise",        desc:"Erstes Land markiert",                         check: (v) => v.size >= 1 },
  { id:"eu5",         emoji:"🏰",  title:"Europareisender",    desc:"5 europäische Länder besucht",                 check: (v) => CONTINENTS[0].countries.filter(c=>v.has(c.code)).length >= 5 },
  { id:"med",         emoji:"🌊",  title:"Mittelmeer-Fan",     desc:"Spanien, Italien, Griechenland & Türkei",       check: (v) => ["ES","IT","GR","TR"].every(c=>v.has(c)) },
  { id:"10",          emoji:"🗺️",  title:"Vielreisender",      desc:"10 Länder weltweit",                           check: (v) => v.size >= 10 },
  { id:"dach",        emoji:"🏔️",  title:"DACH-Kenner",        desc:"Deutschland, Österreich & Schweiz",            check: (v) => ["DE","AT","CH"].every(c=>v.has(c)) },
  { id:"asia5",       emoji:"🏯",  title:"Asien-Fan",          desc:"5 asiatische Länder besucht",                  check: (v) => CONTINENTS[1].countries.filter(c=>v.has(c.code)).length >= 5 },
  { id:"gulf",        emoji:"🕌",  title:"Golf-Reisender",     desc:"Dubai, Katar & Saudi-Arabien",                 check: (v) => ["AE","QA","SA"].every(c=>v.has(c)) },
  { id:"25",          emoji:"🌍",  title:"Weltenbummler",      desc:"25 Länder weltweit",                           check: (v) => v.size >= 25 },
  { id:"carib",       emoji:"🏝️",  title:"Karibik-Liebhaber", desc:"Kuba, Dom. Rep. & Jamaika",                    check: (v) => ["CU","DO","JM"].every(c=>v.has(c)) },
  { id:"africa5",     emoji:"🦁",  title:"Afrika-Entdecker",  desc:"5 afrikanische Länder besucht",                check: (v) => CONTINENTS[4].countries.filter(c=>v.has(c.code)).length >= 5 },
  { id:"50",          emoji:"🌐",  title:"Globetrotter",       desc:"50 Länder weltweit",                           check: (v) => v.size >= 50 },
  { id:"allcont",     emoji:"🏆",  title:"Alle Kontinente",   desc:"Jeden Kontinent bereist",                      check: (v) => CONTINENTS.every(cont => cont.countries.some(c=>v.has(c.code))) },
  { id:"100",         emoji:"👑",  title:"Weltreisender",      desc:"100 Länder weltweit",                          check: (v) => v.size >= 100 },
];

// ─── Flag Image ───────────────────────────────────────────────────────────────

function Flag({ code, name }: { code: string; name: string }) {
  return (
    <img
      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
      width={20}
      height={14}
      alt={name}
      className="rounded-sm object-cover shrink-0"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = "bg-teal-500", height = "h-2" }: { value: number; max: number; color?: string; height?: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${height}`}>
      <div className={`${color} ${height} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────

export default function LaenderKarteTab() {
  const { user } = useAuth();
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeContinent, setActiveContinent] = useState("europa");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    getCommunityProfile(user.uid)
      .then((p) => { if (p?.visitedCountries) setVisited(new Set(p.visitedCountries)); })
      .finally(() => setLoading(false));
  }, [user]);

  function toggle(code: string) {
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
    setSaved(false);
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    await updateCommunityProfile(user.uid, { visitedCountries: [...visited] }).catch(() => {});
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const currentContinent = CONTINENTS.find((c) => c.id === activeContinent)!;
  const continentVisited = currentContinent.countries.filter((c) => visited.has(c.code)).length;

  const filtered = search.trim()
    ? currentContinent.countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : currentContinent.countries;

  const continentsUnlocked = CONTINENTS.filter((cont) =>
    cont.countries.some((c) => visited.has(c.code))
  ).length;

  if (loading) return (
    <div className="flex justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
    </div>
  );

  return (
    <div className="space-y-5">

      {/* ── Gesamt-Statistik ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Globe,      label: "Länder besucht", value: visited.size,         sub: `von ${TOTAL}`,          color: "text-teal-600", bg: "bg-teal-50" },
          { icon: TrendingUp, label: "Weltabdeckung",  value: `${Math.round(visited.size/TOTAL*100)} %`, sub: "der Welt", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: MapPin,     label: "Kontinente",     value: continentsUnlocked,   sub: `von ${CONTINENTS.length}`, color: "text-amber-600", bg: "bg-amber-50" },
          { icon: Trophy,     label: "Achievements",   value: ACHIEVEMENTS.filter(a=>a.check(visited)).length, sub: `von ${ACHIEVEMENTS.length}`, color: "text-rose-600", bg: "bg-rose-50" },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 flex items-center gap-3`}>
            <Icon className={`w-8 h-8 shrink-0 ${color}`} />
            <div>
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 font-medium leading-tight">{label}<br/><span className="text-gray-400">{sub}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Gesamt-Fortschrittsbalken ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-700">Gesamt-Fortschritt</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-teal-600">{visited.size} / {TOTAL}</span>
            <button onClick={save} disabled={saving}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "Gespeichert!" : "Speichern"}
            </button>
          </div>
        </div>
        <ProgressBar value={visited.size} max={TOTAL} color="bg-gradient-to-r from-teal-400 to-cyan-500" height="h-3" />
        {/* Milestone-Marker */}
        <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
          {[10, 25, 50, 100].map((m) => (
            <span key={m} className={visited.size >= m ? "text-teal-600 font-bold" : ""}>{m} 🌍</span>
          ))}
        </div>
      </div>

      {/* ── Achievements ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" /> Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = a.check(visited);
            return (
              <div key={a.id}
                className={`rounded-xl p-2.5 flex items-center gap-2 border transition-all ${
                  unlocked
                    ? "bg-amber-50 border-amber-200 shadow-sm"
                    : "bg-gray-50 border-gray-100 opacity-50 grayscale"
                }`}
              >
                <span className="text-xl shrink-0">{a.emoji}</span>
                <div>
                  <div className={`text-xs font-bold leading-tight ${unlocked ? "text-amber-800" : "text-gray-500"}`}>{a.title}</div>
                  <div className="text-[10px] text-gray-400 leading-tight">{a.desc}</div>
                </div>
                {unlocked && <Star className="w-3 h-3 text-amber-500 ml-auto shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Kontinent-Tabs ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab-Leiste */}
        <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `repeat(${CONTINENTS.length}, 1fr)` }}>
          {CONTINENTS.map((cont) => {
            const cnt = cont.countries.filter((c) => visited.has(c.code)).length;
            const isActive = activeContinent === cont.id;
            return (
              <button
                key={cont.id}
                onClick={() => { setActiveContinent(cont.id); setSearch(""); }}
                className={`flex flex-col items-center px-2 py-3 text-xs font-bold transition-colors border-b-2 gap-0.5 w-full ${
                  isActive
                    ? "border-teal-500 text-teal-700 bg-teal-50/60"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{cont.emoji}</span>
                <span>{cont.label}</span>
                <span className={`text-[10px] font-semibold ${isActive ? "text-teal-600" : "text-gray-400"}`}>
                  {cnt}/{cont.countries.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Kontinent-Fortschritt + Suche */}
        <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar
              value={continentVisited}
              max={currentContinent.countries.length}
              color={
                activeContinent === "europa"   ? "bg-blue-500"   :
                activeContinent === "asien"    ? "bg-red-500"    :
                activeContinent === "neareast" ? "bg-amber-500"  :
                activeContinent === "amerika"  ? "bg-green-500"  :
                activeContinent === "afrika"   ? "bg-orange-500" :
                "bg-teal-500"
              }
              height="h-2"
            />
            <div className="text-[11px] text-gray-400 mt-1">
              {continentVisited} von {currentContinent.countries.length} Ländern in {currentContinent.label} besucht
            </div>
          </div>
          <input
            type="text" placeholder="Suchen…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 w-32 shrink-0"
          />
        </div>

        {/* Länder-Grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
          {filtered.map((c) => {
            const isVisited = visited.has(c.code);
            return (
              <button key={c.code} onClick={() => toggle(c.code)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all text-left ${
                  isVisited
                    ? "border-teal-400 bg-teal-50 text-teal-800 shadow-sm scale-[1.02]"
                    : "border-gray-100 bg-gray-50 text-gray-600 hover:border-teal-200 hover:bg-white hover:shadow-sm"
                }`}
              >
                <Flag code={c.code} name={c.name} />
                <span className="truncate leading-snug">{c.name}</span>
                {isVisited && <Check className="w-3 h-3 text-teal-500 ml-auto shrink-0" />}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-gray-400 py-4">Kein Land gefunden.</p>
          )}
        </div>
      </div>

      {/* ── Bereits besucht (alle Kontinente) ────────────────────────────── */}
      {visited.size > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            Meine {visited.size} bereisten Länder
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {CONTINENTS.flatMap((cont) =>
              cont.countries.filter((c) => visited.has(c.code)).map((c) => (
                <button key={c.code} onClick={() => toggle(c.code)}
                  title="Klicken zum Entfernen"
                  className="flex items-center gap-1.5 bg-teal-100 hover:bg-red-100 hover:text-red-700 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors"
                >
                  <Flag code={c.code} name={c.name} /> {c.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
