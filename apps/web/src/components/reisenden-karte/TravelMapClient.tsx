"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { getTravelTips, addTravelTip, deleteTravelTip, uploadTravelTipImage } from "@/lib/supabase-db";
import { TravelTip, TravelTipCategory } from "@/types";
import { CATEGORY_CONFIG, FILTER_OPTIONS } from "./travelMapConfig";
import { X, MapPin, Plus, AlertCircle, Loader2, ImagePlus, CheckCircle2 } from "lucide-react";

// Leaflet Map wird ohne SSR geladen
const TravelMapLeaflet = dynamic(() => import("./TravelMapVanilla"), { ssr: false });

// ─── Demo-Daten (werden immer gezeigt) ────────────────────────────────────────

const DEMO_TIPS: TravelTip[] = [
  {
    id: "demo-1", userId: "demo", displayName: "Sarah M.",
    title: "Patara Strand – Längster Naturstrand der Türkei",
    description: "Über 20 km Naturstrand völlig ohne Hotels! Karettschildkröten nisten hier. Am besten frühmorgens, dann hat man den Strand für sich. Absoluter Geheimtipp!",
    category: "geheimtipp", locationName: "Patara, Türkei", lat: 36.26, lng: 29.31, createdAt: "2025-07",
  },
  {
    id: "demo-2", userId: "demo", displayName: "Thomas K.",
    title: "Akropolis vor Sonnenaufgang",
    description: "Um 7 Uhr öffnet das Tor – und man ist fast alleine! Komplett anderes Erlebnis als zu Mittag mit tausenden Touristen. Das goldene Morgenlicht ist unbeschreiblich.",
    category: "sehenswuerdigkeit", locationName: "Athen, Griechenland", lat: 37.972, lng: 23.725, createdAt: "2025-05",
  },
  {
    id: "demo-3", userId: "demo", displayName: "Lisa H.",
    title: "El Quim de la Boqueria",
    description: "Die beste Tapasbar mitten im Boqueria Markt! Frische Meeresfrüchte direkt vom Grill. Nur Barhockerzplätze, kommt früh (ab 9 Uhr) – Mittags ist es voll und die Preise steigen.",
    category: "gastronomie", locationName: "Barcelona, Spanien", lat: 41.381, lng: 2.172, createdAt: "2025-08",
  },
  {
    id: "demo-4", userId: "demo", displayName: "Markus W.",
    title: "Balos Lagune – Fotografisch atemberaubend",
    description: "Türkisblaues Wasser, weiße Sandbänke, Flamingos – wie aus dem Bilderbuch. Mit dem Ausflugsboot von Kissamos (günstiger als die Jeep-Tour). Unbedingt früh starten!",
    category: "geheimtipp", locationName: "Balos, Kreta", lat: 35.629, lng: 23.556, createdAt: "2025-06",
  },
  {
    id: "demo-5", userId: "demo", displayName: "Julia N.",
    title: "Es Caló de Sant Agustí – Geheimes Fischerdorf",
    description: "Kleines Fischerdorf auf Formentera – kein Tourist hat das auf dem Radar! Frischer Fisch im Restaurant Can Rafalet direkt am Wasser. Kein Strand zum Liegen, aber das Ambiente ist einzigartig.",
    category: "gastronomie", locationName: "Formentera, Spanien", lat: 38.72, lng: 1.52, createdAt: "2025-07",
  },
  {
    id: "demo-6", userId: "demo", displayName: "Andreas B.",
    title: "Strandabschnitt vor dem Titanic Beach Lara",
    description: "Das Hotel casht an jedem Handtuchplatz 25€. Direkt nebenan ist ein öffentlicher Strandabschnitt – komplett kostenlos, gleicher Strand. Nicht in die Touristenfalle tappen!",
    category: "negativ", locationName: "Lara Beach, Antalya", lat: 36.847, lng: 30.895, createdAt: "2025-04",
  },
  {
    id: "demo-7", userId: "demo", displayName: "Petra S.",
    title: "Hallstatt – Ja, schön. Aber…",
    description: "Jeden Tag 10.000 Touristen auf 800 Einwohner. Die Dorfstraße ist ein einziger Selfie-Stau. Alternativ: Obertraun 3 km weiter – kein Mensch, gleicher Blick auf den See, kostenlos.",
    category: "negativ", locationName: "Hallstatt, Österreich", lat: 47.562, lng: 13.648, createdAt: "2025-06",
  },
  {
    id: "demo-8", userId: "demo", displayName: "Florian R.",
    title: "Ölüdeniz Blaue Lagune",
    description: "Einer der meistfotografierten Strände der Welt – und das zu Recht. Paragliding vom Babadağ (1960m) ist ein absolutes Muss! Buchung direkt an der Basis, nicht durch Hotels.",
    category: "sehenswuerdigkeit", locationName: "Ölüdeniz, Türkei", lat: 36.548, lng: 29.114, createdAt: "2025-08",
  },
  {
    id: "demo-9", userId: "demo", displayName: "Nina W.",
    title: "Playa de Muro – Bester Familienstrand Mallorcas",
    description: "Flaches, türkisblaues Wasser, feiner Sand, kaum Strömung. Ideal für Kinder. Kommt vor 9 Uhr, dann ist noch Platz. Parkplätze ab dem Nachmittag hoffnungslos überfüllt.",
    category: "strand", locationName: "Playa de Muro, Mallorca", lat: 39.838, lng: 3.108, createdAt: "2025-07",
  },
  {
    id: "demo-10", userId: "demo", displayName: "Stefan B.",
    title: "Riad Maison Bleue – Verstecktes Juwel in der Medina",
    description: "Traditionelles Riad mitten in der Altstadt – komplett ruhig trotz der Hektik draußen. Dachterrasse mit Panoramablick über Fès, Frühstück wie aus 1001 Nacht. Weit unter Hotelpreisen buchen.",
    category: "unterkunft", locationName: "Fès, Marokko", lat: 34.065, lng: -4.973, createdAt: "2025-09",
  },
  {
    id: "demo-11", userId: "demo", displayName: "Claudia M.",
    title: "Chatuchak Wochenendmarkt – Shopping-Paradies",
    description: "Größter Markt Asiens mit über 15.000 Ständen. Antiquitäten, Kleidung, Streetfood, Pflanzen. Kommt morgens um 8 Uhr – mittags ist es unerträglich heiß und voll. Bargeld mitbringen!",
    category: "shopping", locationName: "Bangkok, Thailand", lat: 13.8, lng: 100.551, createdAt: "2025-06",
  },
  {
    id: "demo-12", userId: "demo", displayName: "Tobias K.",
    title: "Plitvička jezera – Wasserfall-Wanderung im Morgengrauen",
    description: "Nationalpark öffnet um 7 Uhr. Mit dem ersten Bus rein: keine Menschenmassen, das Licht durch den Wald ist magisch. Route H (obere Seen) kostet 2h und ist weniger bekannt als die untere Route.",
    category: "natur", locationName: "Plitvicer Seen, Kroatien", lat: 44.865, lng: 15.582, createdAt: "2025-08",
  },
  {
    id: "demo-13", userId: "demo", displayName: "Lena S.",
    title: "Rooftop-Bar 61 Skybar – Blick über Dubrovnik",
    description: "Beste Aussicht auf die Altstadt und die Adria – und das für den Preis eines normalen Cocktails. Kein Touristentrap: Locals kommen hier nach der Arbeit. Sonnenuntergang ab 20 Uhr im Sommer nicht verpassen.",
    category: "nachtleben", locationName: "Dubrovnik, Kroatien", lat: 42.641, lng: 18.108, createdAt: "2025-07",
  },
  {
    id: "demo-14", userId: "demo", displayName: "Ralf H.",
    title: "Flughafenbus X95 – Athen Innenstadt für 6 €",
    description: "Direkte Verbindung Flughafen ↔ Syntagma-Platz, fährt 24h, alle 20 Minuten. Das Metro-Ticket kostet das Dreifache. Haltestelle außen am Terminal, Richtung Ausgang 5.",
    category: "transport", locationName: "Athen Flughafen, Griechenland", lat: 37.936, lng: 23.944, createdAt: "2025-05",
  },
];

// ─── Leeres Formular ──────────────────────────────────────────────────────────

const EMPTY_FORM = { title: "", description: "", category: "geheimtipp" as TravelTipCategory, locationName: "" };
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// ─── Komponente ───────────────────────────────────────────────────────────────

export default function TravelMapClient() {
  const { user } = useAuth();
  const [userTips, setUserTips]       = useState<TravelTip[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setActive]   = useState<TravelTipCategory | "all">("all");

  // Modal + Ort-Picking
  const [showModal, setShowModal]     = useState(false);
  const [isPicking, setIsPicking]     = useState(false);
  const [pendingLat, setPendingLat]   = useState<number | null>(null);
  const [pendingLng, setPendingLng]   = useState<number | null>(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [imageFile, setImageFile]     = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving]           = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const tipsBannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef  = useRef<HTMLInputElement>(null);

  // Firestore-Tipps laden
  useEffect(() => {
    getTravelTips()
      .then(setUserTips)
      .catch(() => setUserTips([]))
      .finally(() => setLoading(false));
  }, []);

  const allTips = [...DEMO_TIPS, ...userTips];
  const counts: Record<string, number> = { all: allTips.length };
  for (const cat of Object.keys(CATEGORY_CONFIG) as TravelTipCategory[]) {
    counts[cat] = allTips.filter((t) => t.category === cat).length;
  }

  // Ort auf Karte auswählen
  function handleLocationPicked(lat: number, lng: number) {
    setPendingLat(lat);
    setPendingLng(lng);
    setIsPicking(false);
    setShowModal(true);
  }

  function startPicking() {
    if (!user) { setError("Bitte melde dich an, um einen Tipp hinzuzufügen."); return; }
    setShowModal(false);
    setIsPicking(true);
    setPendingLat(null);
    setPendingLng(null);
  }

  function cancelModal() {
    setShowModal(false);
    setIsPicking(false);
    setPendingLat(null);
    setPendingLng(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setSubmitted(false);
    setError(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError("Bild darf maximal 5 MB groß sein."); return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  }

  async function submitTip() {
    if (!user) return;
    if (!form.title.trim() || !form.description.trim() || !form.locationName.trim()) {
      setError("Bitte alle Felder ausfüllen."); return;
    }
    if (pendingLat === null || pendingLng === null) {
      setError("Bitte zuerst den Ort auf der Karte markieren."); return;
    }
    setSaving(true);
    setError(null);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadTravelTipImage(user.uid, imageFile);
      }
      await addTravelTip(user.uid, {
        displayName: user.displayName ?? user.email?.split("@")[0] ?? "Anonym",
        ...form,
        lat: pendingLat,
        lng: pendingLng,
        imageUrl,
      });
      // Tipp landet in "pending" → nicht sofort auf Karte, Erfolgsscreen zeigen
      setSubmitted(true);
      setImageFile(null);
      setImagePreview(null);
    } catch {
      setError("Fehler beim Speichern. Bitte erneut versuchen.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTip(id: string) {
    if (!user) return;
    await deleteTravelTip(user.uid, id).catch(() => {});
    setUserTips((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 96px)", minHeight: "500px" }}>

      {/* ── Topbar ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3 flex-wrap z-10 shrink-0">

        {/* Titel */}
        <div className="flex items-center gap-2 mr-2">
          <MapPin className="w-5 h-5 text-teal-600" />
          <span className="font-bold text-gray-800 text-sm hidden sm:inline">Reisenden-Karte</span>
        </div>

        {/* Kategorie-Filter */}
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === f.value
                  ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-700"
              }`}
            >
              <span>{f.emoji}</span>
              <span className="hidden sm:inline">{f.label}</span>
              <span className="bg-white/20 text-inherit rounded-full px-1.5 py-0 text-[10px]">
                {counts[f.value] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Tipp hinzufügen */}
        <button
          onClick={() => user ? (setPendingLat(null), setPendingLng(null), setForm(EMPTY_FORM), setIsPicking(false), setShowModal(true)) : setError("Bitte anmelden.")}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tipp hinzufügen</span>
        </button>
      </div>

      {/* ── Picking-Banner ───────────────────────────────────────────────────── */}
      {isPicking && (
        <div ref={tipsBannerRef} className="bg-purple-600 text-white text-sm font-semibold text-center py-2.5 px-4 flex items-center justify-center gap-2 z-10 shrink-0">
          <MapPin className="w-4 h-4 animate-bounce" />
          Klicke auf die Karte, um den Ort deines Tipps zu markieren
          <button onClick={cancelModal} className="ml-4 text-purple-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Fehler-Banner ────────────────────────────────────────────────────── */}
      {error && !showModal && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm px-4 py-2 flex items-center gap-2 z-10 shrink-0">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* ── Karte ────────────────────────────────────────────────────────────── */}
      {/* isolate erstellt einen eigenen Stacking Context, damit Leaflets interne
          z-indexes (Marker 600, Controls 800 …) nicht den Header (z-50) überdecken */}
      <div className="flex-1 relative overflow-hidden isolate">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <TravelMapLeaflet
            tips={allTips}
            activeCategory={activeCategory}
            isPickingLocation={isPicking}
            pendingLat={pendingLat}
            pendingLng={pendingLng}
            onLocationPicked={handleLocationPicked}
            currentUserId={user?.uid}
            onDeleteTip={handleDeleteTip}
          />
        )}

        {/* Legende (Desktop) */}
        <div className="absolute bottom-6 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 hidden md:block z-[400]">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Legende</p>
          {(Object.entries(CATEGORY_CONFIG) as [TravelTipCategory, typeof CATEGORY_CONFIG[TravelTipCategory]][]).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-2 text-xs text-gray-700 mb-1.5 last:mb-0">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: cfg.color }} />
              {cfg.emoji} {cfg.label}
            </div>
          ))}
        </div>

        {/* Statistik-Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2 z-[400] hidden md:block">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Community-Tipps</p>
          <p className="text-2xl font-black text-teal-600 leading-tight">{allTips.length}</p>
          <p className="text-[11px] text-gray-500">aus aller Welt</p>
        </div>
      </div>

      {/* ── Modal: Tipp hinzufügen ─────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelModal} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full sm:max-w-md mx-auto overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-teal-600 px-5 py-4 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-white font-bold text-base">Reise-Tipp teilen</h2>
                <p className="text-teal-100 text-xs mt-0.5">
                  {submitted ? "Tipp eingereicht" : pendingLat !== null ? `📍 ${pendingLat.toFixed(3)}°, ${pendingLng!.toFixed(3)}°` : "Ort noch nicht gesetzt"}
                </p>
              </div>
              <button onClick={cancelModal} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Erfolgsscreen nach Absenden ─────────────────────────────── */}
            {submitted ? (
              <div className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">Tipp eingereicht!</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Dein Tipp wird von unserem Team geprüft und in Kürze auf der Karte freigeschaltet. Danke für deinen Beitrag!
                  </p>
                </div>
                <button
                  onClick={cancelModal}
                  className="mt-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Schließen
                </button>
              </div>
            ) : (
              <div className="p-5 space-y-4 overflow-y-auto">
                {/* Ort auf Karte setzen */}
                {pendingLat === null ? (
                  <button
                    onClick={startPicking}
                    className="w-full border-2 border-dashed border-teal-300 bg-teal-50 text-teal-700 rounded-xl py-4 flex flex-col items-center gap-1.5 hover:bg-teal-100 transition-colors"
                  >
                    <MapPin className="w-6 h-6" />
                    <span className="font-semibold text-sm">Ort auf der Karte markieren</span>
                    <span className="text-xs text-teal-500">Klicke, dann auf die Karte</span>
                  </button>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="text-sm text-green-700 font-semibold">Ort markiert</span>
                    <button onClick={startPicking} className="ml-auto text-xs text-green-600 hover:underline">Ändern</button>
                  </div>
                )}

                {/* Orts-Bezeichnung */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Ort / Stadt *</label>
                  <input
                    type="text"
                    placeholder="z.B. Antalya, Türkei"
                    value={form.locationName}
                    onChange={(e) => setForm((f) => ({ ...f, locationName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                {/* Kategorie */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Kategorie *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(CATEGORY_CONFIG) as [TravelTipCategory, typeof CATEGORY_CONFIG[TravelTipCategory]][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, category: key }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                          form.category === key ? "border-current text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                        style={form.category === key ? { background: cfg.color, borderColor: cfg.color } : {}}
                      >
                        <span>{cfg.emoji}</span>
                        <span>{cfg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Titel */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Titel *</label>
                  <input
                    type="text"
                    placeholder="Kurzer, prägnanter Titel"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    maxLength={80}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                {/* Beschreibung */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Beschreibung *</label>
                  <textarea
                    placeholder="Was macht diesen Ort besonders? Tipps, Hinweise, Öffnungszeiten…"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    maxLength={400}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                  />
                  <p className="text-right text-[10px] text-gray-400">{form.description.length}/400</p>
                </div>

                {/* Bild-Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Foto (optional, max. 5 MB)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Vorschau" className="w-full h-40 object-cover" />
                      <button
                        onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 rounded-xl py-5 flex flex-col items-center gap-1.5 text-gray-400 hover:border-teal-300 hover:text-teal-600 transition-colors"
                    >
                      <ImagePlus className="w-6 h-6" />
                      <span className="text-xs font-semibold">Foto hinzufügen</span>
                      <span className="text-[10px]">JPG, PNG, WebP bis 5 MB</span>
                    </button>
                  )}
                </div>

                {/* Fehler */}
                {error && (
                  <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={cancelModal}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-semibold"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={submitTip}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {saving ? "Wird gespeichert…" : "Tipp einreichen"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
