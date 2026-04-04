"use client";

import { useState, useTransition, useEffect } from "react";
import type { AppUser } from "@/context/AuthContext";
import type { UserProfile, PriceAlert, PriceTrend, PriceProfileId, PriceProfileData } from "@/types";
import {
  toggleFavoriteDestination,
  getPriceAlerts,
  createPriceAlert,
  deletePriceAlert,
  updatePriceAlert,
  getPriceTrends,
} from "@/lib/supabase-db";
import {
  Heart, MapPin, Search, ExternalLink, Bell, Plus, X, Loader2,
} from "lucide-react";
import Link from "next/link";
import { CATALOG } from "@/data/catalog-regions";
import { generateHeroFallback } from "@/lib/catalog-helpers";

interface Props {
  user: AppUser;
  userProfile: UserProfile | null;
}

const CONTINENTS = [
  { id: "all",      label: "Alle" },
  { id: "eu",       label: "Europa" },
  { id: "turkey",   label: "Türkei" },
  { id: "africa",   label: "Afrika & Naher Osten" },
  { id: "asia",     label: "Asien" },
  { id: "americas", label: "Amerika & Karibik" },
];

const FALLBACK_DESTINATIONS = [
  { slug: "mallorca",               name: "Mallorca",               country: "Spanien",       ibeBpRegion: "eu",       unsplashKeyword: "mallorca beach" },
  { slug: "antalya",                name: "Antalya",                country: "Türkei",         ibeBpRegion: "turkey",   unsplashKeyword: "antalya turkey" },
  { slug: "kreta",                  name: "Kreta",                  country: "Griechenland",   ibeBpRegion: "eu",       unsplashKeyword: "crete greece" },
  { slug: "barcelona",              name: "Barcelona",              country: "Spanien",        ibeBpRegion: "eu",       unsplashKeyword: "barcelona spain" },
  { slug: "dubai",                  name: "Dubai",                  country: "VAE",            ibeBpRegion: "africa",   unsplashKeyword: "dubai skyline" },
  { slug: "malediven",              name: "Malediven",              country: "Malediven",      ibeBpRegion: "asia",     unsplashKeyword: "maldives" },
  { slug: "teneriffa",              name: "Teneriffa",              country: "Spanien",        ibeBpRegion: "eu",       unsplashKeyword: "tenerife canary" },
  { slug: "thailand",               name: "Thailand",               country: "Thailand",       ibeBpRegion: "asia",     unsplashKeyword: "thailand beach" },
  { slug: "hurghada",               name: "Hurghada",               country: "Ägypten",        ibeBpRegion: "africa",   unsplashKeyword: "hurghada egypt" },
  { slug: "ibiza",                  name: "Ibiza",                  country: "Spanien",        ibeBpRegion: "eu",       unsplashKeyword: "ibiza spain" },
  { slug: "lanzarote",              name: "Lanzarote",              country: "Spanien",        ibeBpRegion: "eu",       unsplashKeyword: "lanzarote canary" },
  { slug: "rhodos",                 name: "Rhodos",                 country: "Griechenland",   ibeBpRegion: "eu",       unsplashKeyword: "rhodes greece" },
  { slug: "phuket",                 name: "Phuket",                 country: "Thailand",       ibeBpRegion: "asia",     unsplashKeyword: "phuket thailand" },
  { slug: "dominikanische-republik",name: "Dominikanische Republik",country: "Karibik",        ibeBpRegion: "americas", unsplashKeyword: "dominican republic beach" },
  { slug: "marrakesch",             name: "Marrakesch",             country: "Marokko",        ibeBpRegion: "africa",   unsplashKeyword: "marrakech morocco" },
  { slug: "santorin",               name: "Santorin",               country: "Griechenland",   ibeBpRegion: "eu",       unsplashKeyword: "santorini greece" },
  { slug: "cancun",                 name: "Cancún",                 country: "Mexiko",         ibeBpRegion: "americas", unsplashKeyword: "cancun mexico" },
  { slug: "bali",                   name: "Bali",                   country: "Indonesien",     ibeBpRegion: "asia",     unsplashKeyword: "bali indonesia" },
];

type DestEntry = {
  slug: string;
  name: string;
  country: string;
  ibeBpRegion: string;
  unsplashKeyword: string;
};

function getDestinations(): DestEntry[] {
  try {
    if (CATALOG && CATALOG.length > 0) {
      return CATALOG.map((e) => ({
        slug: e.slug,
        name: e.name,
        country: e.country,
        ibeBpRegion: e.ibeBpRegion,
        unsplashKeyword: e.unsplashKeyword,
      }));
    }
  } catch { /* CATALOG not ready */ }
  return FALLBACK_DESTINATIONS;
}

interface AlertFormState {
  maxPrice: string;
  adults: string;
  nights: string;
}

const PRICE_PROFILES: { id: PriceProfileId; label: string; emoji: string; hint: string }[] = [
  { id: "pauschal", label: "Pauschalreise", emoji: "✈️", hint: "Flug + Hotel, alle Verpflegungsarten, min. 3★, ≥50% Empfehlung" },
  { id: "hotel",    label: "Nur Hotel",     emoji: "🏨", hint: "Ohne All-Inclusive – Frühstück, Halbpension oder mehr, min. 3★, ≥50% Empfehlung" },
  { id: "ai",       label: "All-Inclusive", emoji: "🍹", hint: "Nur All-Inclusive Angebote, min. 3★, ≥50% Empfehlung" },
];

// ── Sparkline (SVG, keine externe Library) ─────────────────────────────────
function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const W = 72; const H = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  // Trend: fallende Preise = grün (gut für den Kunden), steigende = amber
  const half      = Math.floor(data.length / 2);
  const firstAvg  = data.slice(0, half).reduce((a, b) => a + b, 0) / half;
  const secondAvg = data.slice(half).reduce((a, b) => a + b, 0) / (data.length - half);
  const color = secondAvg <= firstAvg ? "#10b981" : "#f59e0b";
  const lastX = ((data.length - 1) / (data.length - 1)) * W;
  const lastY = H - ((data[data.length - 1] - min) / range) * (H - 4) - 2;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <circle cx={lastX.toFixed(1)} cy={lastY.toFixed(1)} r="2.5" fill={color} />
    </svg>
  );
}

export default function WishlistTab({ user, userProfile }: Props) {
  const [favs, setFavs]               = useState<string[]>(userProfile?.favoriteDestinations ?? []);
  const [search, setSearch]           = useState("");
  const [continent, setContinent]     = useState("all");
  const [isPending, startTransition]  = useTransition();

  // Price alerts
  const [alerts, setAlerts]             = useState<PriceAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [openAlertForm, setOpenAlertForm] = useState<string | null>(null);
  const [alertForm, setAlertForm]         = useState<AlertFormState>({ maxPrice: "", adults: "2", nights: "7" });
  const [savingAlert, setSavingAlert]     = useState(false);

  // Price trends
  const [trends, setTrends]         = useState<Record<string, PriceTrend>>({});
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [profileId, setProfileId] = useState<PriceProfileId>(() => {
    if (typeof window === "undefined") return "pauschal";
    return (localStorage.getItem("wl_profileId") as PriceProfileId) ?? "pauschal";
  });

  const allDests = getDestinations();

  /** Gibt Profil-Daten oder Legacy-Fallback zurück */
  const getProfileData = (trend: PriceTrend | undefined): PriceProfileData | null => {
    if (!trend) return null;
    const profileData = trend[profileId];
    if (profileData) return profileData;
    // Fallback auf Legacy-Daten (nur beim pauschal-Profil sinnvoll)
    if (profileId === "pauschal") {
      return { currentMinPrice: trend.currentMinPrice, currentDealCount: trend.currentDealCount, snapshots: trend.snapshots };
    }
    return null;
  };

  useEffect(() => {
    getPriceAlerts(user.uid)
      .then(setAlerts)
      .catch(() => { /* silent */ })
      .finally(() => setAlertsLoading(false));
  }, [user.uid]);

  // Preisverläufe für alle gemerkten Destinationen laden
  useEffect(() => {
    if (favs.length === 0) { setTrends({}); return; }
    setTrendsLoading(true);
    getPriceTrends(favs)
      .then(setTrends)
      .catch(() => { /* silent – Daten kommen täglich */ })
      .finally(() => setTrendsLoading(false));
  // Nur beim ersten Mount und wenn sich Favs ändern
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favs.join(",")]); // eslint-disable-line

  const filtered = allDests.filter((d) => {
    const matchSearch    = (d.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
                           (d.country ?? "").toLowerCase().includes(search.toLowerCase());
    const matchContinent = continent === "all" || d.ibeBpRegion === continent;
    return matchSearch && matchContinent;
  });

  const toggle = (slug: string) => {
    const isFav = favs.includes(slug);
    setFavs((prev) => isFav ? prev.filter((s) => s !== slug) : [...prev, slug]);
    // If removing fav that has an alert, also clean up alert UI
    if (isFav) {
      setAlerts((prev) => prev.filter((a) => a.destination !== slug));
      setOpenAlertForm((o) => (o === slug ? null : o));
    }
    startTransition(async () => {
      await toggleFavoriteDestination(user.uid, slug, isFav);
    });
  };

  const getAlert = (slug: string) => alerts.find((a) => a.destination === slug);

  const handleOpenAlertForm = (slug: string) => {
    const existing = getAlert(slug);
    setAlertForm(existing
      ? { maxPrice: String(existing.maxPrice), adults: String(existing.adults), nights: String(existing.nights) }
      : { maxPrice: "", adults: "2", nights: "7" }
    );
    setOpenAlertForm((prev) => (prev === slug ? null : slug));
  };

  const handleSaveAlert = async (slug: string, destName: string) => {
    const maxPrice = Number(alertForm.maxPrice);
    if (!maxPrice || maxPrice <= 0) return;
    setSavingAlert(true);
    try {
      const existing = getAlert(slug);
      if (existing) {
        await updatePriceAlert(user.uid, existing.id, {
          maxPrice,
          adults:  Number(alertForm.adults),
          nights:  Number(alertForm.nights),
          enabled: true,
        });
        setAlerts((prev) => prev.map((a) =>
          a.id === existing.id
            ? { ...a, maxPrice, adults: Number(alertForm.adults), nights: Number(alertForm.nights), enabled: true }
            : a
        ));
      } else {
        const newId = await createPriceAlert(user.uid, {
          destination:     slug,
          destinationName: destName,
          maxPrice,
          adults:  Number(alertForm.adults),
          nights:  Number(alertForm.nights),
          enabled: true,
        });
        setAlerts((prev) => [...prev, {
          id: newId, userId: user.uid,
          destination: slug, destinationName: destName,
          maxPrice, adults: Number(alertForm.adults), nights: Number(alertForm.nights),
          enabled: true, createdAt: null,
        }]);
      }
    } finally {
      setSavingAlert(false);
      setOpenAlertForm(null);
    }
  };

  const handleDeleteAlert = async (slug: string) => {
    const existing = getAlert(slug);
    if (!existing) return;
    setAlerts((prev) => prev.filter((a) => a.id !== existing.id));
    setOpenAlertForm(null);
    await deletePriceAlert(user.uid, existing.id);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">

    {/* Rechte Erklärungsspalte */}
    <div className="order-first lg:order-last lg:w-64 shrink-0">
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 lg:sticky lg:top-28">
        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">So funktioniert&apos;s</h3>
        <ul className="space-y-2.5 text-xs text-gray-600">
          <li className="flex items-start gap-2"><span className="shrink-0">❤️</span><span>Scrolle durch die Liste und klicke das <strong>Herz-Icon</strong> auf einer Karte – das Ziel landet in deinen Wunschzielen</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">🔔</span><span>Klicke bei einem Ziel auf das <strong>Glocken-Icon</strong> um einen Preisalarm zu setzen</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">✈️</span><span>Wähle zwischen <strong>Pauschalreise</strong>, <strong>Nur Hotel</strong> oder <strong>All-Inclusive</strong> für den Preisvergleich</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">🔍</span><span>Nutze die <strong>Suchleiste</strong> oder <strong>Kontinent-Filter</strong> um Ziele zu finden</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">🔗</span><span>Hover über eine Karte und klicke den <strong>Pfeil-Link</strong> zur Zielseite</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">✏️</span><span>Preisalarm bearbeiten: erneut auf das Glocken-Icon klicken</span></li>
        </ul>
      </div>
    </div>

    {/* Hauptinhalt */}
    <div className="flex-1 min-w-0 space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-rose-500" />
          Meine Wunschliste
          {favs.length > 0 && (
            <span className="text-sm font-normal text-gray-500">({favs.length} gespeichert)</span>
          )}
        </h2>
      </div>

      {/* ── Preis-Profil Selector ───────────────────────────────────── */}
      {favs.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">Preisvergleich anzeigen für:</p>
          <div className="flex flex-wrap gap-2">
            {PRICE_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => { setProfileId(p.id); localStorage.setItem("wl_profileId", p.id); }}
                title={p.hint}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  profileId === p.id
                    ? "bg-[#00838F] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#00838F] hover:text-[#00838F]"
                }`}
              >
                <span>{p.emoji}</span>
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {PRICE_PROFILES.find((p) => p.id === profileId)?.hint}
          </p>
        </div>
      )}

      {/* ── Wunschziele Cards ───────────────────────────────────────── */}
      {favs.length > 0 && (
        <div className="bg-blue-50 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-blue-500 text-blue-500" />
            Meine Wunschziele
            {(alertsLoading || trendsLoading) && (
              <Loader2 className="w-3 h-3 animate-spin text-blue-400 ml-1" />
            )}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {favs.map((slug) => {
              const d           = allDests.find((x) => x.slug === slug);
              const alert       = getAlert(slug);
              const isOpen      = openAlertForm === slug;
              const trend       = trends[slug];
              const profileData = getProfileData(trend);
              // Sparkline: älteste → neueste (chronologisch)
              const sparkData = profileData?.snapshots
                ? [...profileData.snapshots].reverse().map((s) => s.minPrice)
                : [];
              // Alert-Match: Preis ist heute unter Budget
              const isMatch = alert && profileData &&
                typeof alert.matchedPrice === "number" &&
                alert.matchedPrice <= alert.maxPrice;

              return (
                <div key={slug} className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm">
                  {/* Card row */}
                  <div className="flex items-center gap-3 p-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      {d && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={generateHeroFallback(d.unsplashKeyword).replace("w=1600", "w=120")}
                          alt={d.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* Name / country / Preis / Sparkline */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/urlaubsziele/${slug}`}
                        className="font-semibold text-sm text-gray-900 hover:underline truncate block"
                      >
                        {d?.name ?? slug}
                      </Link>
                      <p className="text-xs text-gray-400 truncate">{d?.country ?? ""}</p>

                      {/* Preis + Sparkline */}
                      {profileData ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Sparkline data={sparkData} />
                          <span className="text-xs font-semibold text-gray-700 shrink-0">
                            ab {profileData.currentMinPrice} €
                          </span>
                          {sparkData.length >= 2 && (() => {
                            const half = Math.floor(sparkData.length / 2);
                            const fAvg = sparkData.slice(0, half).reduce((a,b)=>a+b,0)/half;
                            const sAvg = sparkData.slice(half).reduce((a,b)=>a+b,0)/(sparkData.length-half);
                            return sAvg < fAvg
                              ? <span className="text-xs text-emerald-600 font-medium">📉 fällt</span>
                              : <span className="text-xs text-amber-500 font-medium">📈 steigt</span>;
                          })()}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-300 mt-1">
                          {trendsLoading ? "wird geladen…" : "Noch keine Preisdaten"}
                        </p>
                      )}

                      {/* Alert-Einstellung */}
                      {alert && !isMatch && (
                        <p className="text-xs text-emerald-600 font-medium mt-0.5">
                          🔔 Alarm bis {alert.maxPrice} €
                        </p>
                      )}

                      {/* 🎯 Match-Badge */}
                      {isMatch && (
                        <div className="mt-1 inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                          🎯 Jetzt ab {alert.matchedPrice} € verfügbar!
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Bell: set / edit alert */}
                      <button
                        onClick={() => handleOpenAlertForm(slug)}
                        title={alert ? "Preisalarm bearbeiten" : "Preisalarm setzen"}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          alert
                            ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                            : isOpen
                              ? "bg-[#00838F]/10 text-[#00838F]"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                      {/* Remove from wishlist */}
                      <button
                        onClick={() => toggle(slug)}
                        disabled={isPending}
                        title="Aus Wunschliste entfernen"
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* ── Inline Alert Form ─────────────────────────────── */}
                  {isOpen && (
                    <div className="border-t border-blue-100 bg-blue-50/70 p-3 space-y-3">
                      <p className="text-xs font-semibold text-blue-700">
                        {alert ? "Preisalarm bearbeiten" : "Neuen Preisalarm setzen"}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Max. €&thinsp;/&thinsp;Person</label>
                          <input
                            type="number"
                            min={1}
                            value={alertForm.maxPrice}
                            onChange={(e) => setAlertForm((f) => ({ ...f, maxPrice: e.target.value }))}
                            placeholder="z.B. 600"
                            className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00838F] bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Erwachsene</label>
                          <select
                            value={alertForm.adults}
                            onChange={(e) => setAlertForm((f) => ({ ...f, adults: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#00838F] bg-white"
                          >
                            {[1, 2, 3, 4].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Nächte</label>
                          <select
                            value={alertForm.nights}
                            onChange={(e) => setAlertForm((f) => ({ ...f, nights: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#00838F] bg-white"
                          >
                            {[5, 7, 10, 14, 21].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveAlert(slug, d?.name ?? slug)}
                          disabled={savingAlert || !alertForm.maxPrice}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-[#00838F] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#006E7A] disabled:opacity-50 transition-colors"
                        >
                          {savingAlert
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Bell className="w-3.5 h-3.5" />
                          }
                          Alarm speichern
                        </button>
                        {alert && (
                          <button
                            onClick={() => handleDeleteAlert(slug)}
                            className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
                          >
                            Löschen
                          </button>
                        )}
                        <button
                          onClick={() => setOpenAlertForm(null)}
                          className="px-3 py-2 text-xs text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Suche & Filter ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Urlaubsziel suchen…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#00838F] bg-white"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CONTINENTS.map((c) => (
            <button
              key={c.id}
              onClick={() => setContinent(c.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                continent === c.id
                  ? "bg-[#00838F] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#00838F] hover:text-[#00838F]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Destinations Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((dest) => {
          const isFav = favs.includes(dest.slug);
          return (
            <div key={dest.slug} className="relative group rounded-2xl overflow-hidden aspect-4/3 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generateHeroFallback(dest.unsplashKeyword).replace("w=1600", "w=400")}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://source.unsplash.com/400x300/?${encodeURIComponent(dest.unsplashKeyword)}`;
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm leading-tight">{dest.name}</p>
                <p className="text-white/70 text-xs">{dest.country}</p>
                {(() => {
                  const pd = getProfileData(trends[dest.slug]);
                  return pd ? (
                    <p className="text-white/90 text-xs font-semibold mt-0.5">
                      ab {pd.currentMinPrice} €
                    </p>
                  ) : null;
                })()}
              </div>

              {/* External link (hover) */}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/urlaubsziele/${dest.slug}`}
                  className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-700" />
                </Link>
              </div>

              {/* Heart / Favorite toggle */}
              <button
                onClick={() => toggle(dest.slug)}
                disabled={isPending}
                className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 bg-white/90 hover:bg-white shadow-sm"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFav ? "fill-rose-500 text-rose-500" : "text-gray-400"
                  }`}
                />
              </button>

              {/* Bell indicator on card (shows if alert active) */}
              {isFav && getAlert(dest.slug) && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                  <Bell className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Keine Urlaubsziele gefunden</p>
        </div>
      )}
    </div>
    </div>
  );
}
