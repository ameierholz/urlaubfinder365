"use client";

import { useState, useEffect, useMemo } from "react";
import { Heart } from "lucide-react";
import { TIQETS_CATEGORIES, matchesCategory, getPrimaryCategory } from "@/lib/tiqets-categories";
import { useAuth } from "@/context/AuthContext";
import { saveActivity, unsaveActivity } from "@/lib/supabase-db";
import Toast from "@/components/ui/Toast";
import { TiqetsProduct } from "@/types";

// Products API returns these fields (Experiences API does not)
interface TiqetsProductFull extends TiqetsProduct {
  id: number;
  city_name?: string;
  instant_ticket_delivery?: boolean;
  smartphone_ticket?: boolean;
  skip_line?: boolean;
  cancellation?: { policy: string; window: number | null };
  tag_ids?: number[];
  address?: { city_name?: string };
  ratings?: { average: number; total: number };
  promo_label?: string;
  discount_percentage?: number;
}

interface Destination {
  cityId: string;
  name: string;
  emoji?: string;
}

interface Props {
  destinations: Destination[];
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="flex gap-px">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-xs leading-none ${s <= full ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
    </span>
  );
}

function ProductCard({ p }: { p: TiqetsProductFull }) {
  const { user } = useAuth();
  const [saved,  setSaved]  = useState(false);
  const [saving, setSaving] = useState(false);
  const [docId,  setDocId]  = useState<string | null>(null);
  const [toast,  setToast]  = useState<{ type: "save" | "unsave"; msg: string } | null>(null);

  const imgObj = p.images?.[0] as Record<string, string | undefined> | undefined;
  const img    = imgObj?.large ?? imgObj?.medium ?? imgObj?.extra_large ?? "";
  const alt    = (p.images?.[0] as { alt_text?: string } | undefined)?.alt_text ?? p.title;
  const link   = p.product_url ?? "#";
  const price  = typeof p.price === "number" ? p.price.toFixed(2).replace(".", ",") : null;
  const rating = p.ratings?.average ? Math.round(p.ratings.average * 10) / 10 : null;
  const cnt    = p.ratings?.total ?? 0;
  const cat    = getPrimaryCategory(p.tag_ids);
  const city   = p.city_name ?? p.address?.city_name;

  const hasFreeCancel = p.cancellation?.policy === "before_date" && (p.cancellation?.window ?? 0) >= 24;

  const handleSave = async (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!user) { window.location.href = "/login"; return; }
    if (saving) return;
    setSaving(true);
    try {
      if (saved && docId) {
        await unsaveActivity(user.uid, docId);
        setSaved(false); setDocId(null);
        setToast({ type: "unsave", msg: "Aus deinen gespeicherten Aktivitäten entfernt." });
      } else {
        const id = await saveActivity(user.uid, p as TiqetsProduct);
        setSaved(true); setDocId(id);
        setToast({ type: "save", msg: "Gespeichert! Du findest es unter" });
      }
    } finally { setSaving(false); }
  };

  return (
    <>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col no-underline"
    >
      <div className="relative h-44 bg-gray-100 overflow-hidden shrink-0">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        {/* City label */}
        {city && (
          <div className="absolute top-2 left-2 bg-[#00838F]/85 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            📍 {city}
          </div>
        )}

        {/* Herz */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all ${
            saved ? "bg-red-500 text-white" : "bg-white/90 text-gray-500 hover:bg-white hover:text-red-500"
          }`}
          title={saved ? "Gespeichert" : "Speichern"}
        >
          <Heart className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} />
        </button>

        {/* Discount badge */}
        {p.discount_percentage && p.discount_percentage > 0 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
            -{Math.round(p.discount_percentage)}%
          </div>
        )}

        {/* Category badge bottom-left */}
        {cat && (
          <div className="absolute bottom-2 left-2 bg-black/55 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            {cat.emoji} {cat.label}
          </div>
        )}
      </div>

      <div className="p-3.5 flex flex-col flex-grow">
        {rating && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <StarRow rating={rating} />
            <span className="text-xs font-bold text-gray-700">{rating}</span>
            {cnt > 0 && <span className="text-[10px] text-gray-400">({cnt.toLocaleString("de-DE")})</span>}
          </div>
        )}
        <h3 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 group-hover:text-[#00838F] transition-colors flex-grow">
          {p.title}
        </h3>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-1 mt-2">
          {p.instant_ticket_delivery && (
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              ⚡ Sofort
            </span>
          )}
          {p.smartphone_ticket && (
            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              📱 Handy
            </span>
          )}
          {p.skip_line && (
            <span className="inline-flex items-center gap-0.5 bg-violet-50 text-violet-700 border border-violet-100 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              🚀 Kein Anstehen
            </span>
          )}
          {hasFreeCancel && (
            <span className="inline-flex items-center gap-0.5 bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              🛡️ Gratis Storno
            </span>
          )}
        </div>
      </div>

      <div className="px-3.5 pb-3.5 flex items-center justify-between gap-2 shrink-0">
        <div>
          {price ? (
            <div className="text-base font-extrabold text-sand-500">ab {price} €</div>
          ) : null}
        </div>
        <span className="bg-[#6CC4BA] group-hover:bg-[#5ab0a6] text-white text-xs font-bold px-3 py-2 rounded-full transition-colors whitespace-nowrap shadow-sm">
          Entdecken →
        </span>
      </div>
    </a>

    {toast && (
      <Toast
        type={toast.type}
        message={toast.msg}
        link={toast.type === "save" ? { href: "/dashboard/", label: "Dashboard → Meine Aktivitäten" } : undefined}
        onDismiss={() => setToast(null)}
      />
    )}
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-44 bg-gray-200 animate-pulse" />
      <div className="p-3.5 space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
        <div className="flex gap-1 mt-2">
          <div className="h-4 bg-gray-100 rounded-full animate-pulse w-14" />
          <div className="h-4 bg-gray-100 rounded-full animate-pulse w-14" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-8 bg-gray-200 rounded-full animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}

export default function TiqetsMultiCityDiscovery({ destinations }: Props) {
  const [products, setProducts]   = useState<TiqetsProductFull[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [activeDest, setActiveDest] = useState<string>("all");
  const [showAll, setShowAll]     = useState(false);

  const activeCityIds = activeDest === "all"
    ? destinations.map((d) => d.cityId)
    : [activeDest];

  useEffect(() => {
    if (!activeCityIds.length) return;
    setLoading(true);
    setProducts([]);
    const params = activeCityIds.map((id) => `cityId=${id}`).join("&");
    fetch(`/api/tiqets?${params}&pageSize=30`)
      .then((r) => r.json())
      .then((d) => {
        const sorted = (d.products ?? []).sort(
          (a: TiqetsProductFull, b: TiqetsProductFull) => (b.ratings?.average ?? 0) - (a.ratings?.average ?? 0)
        );
        setProducts(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDest]);

  const availableCategories = useMemo(() => {
    return TIQETS_CATEGORIES.filter((cat) =>
      products.some((p) => matchesCategory(p.tag_ids, cat.id))
    );
  }, [products]);

  const filtered = useMemo(() => {
    if (activeCat === "all") return products;
    return products.filter((p) => matchesCategory(p.tag_ids, activeCat));
  }, [products, activeCat]);

  const INITIAL_COUNT = 12;
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  if (!loading && products.length === 0) return null;

  return (
    <div>
      {/* Destination Filter */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => { setActiveDest("all"); setActiveCat("all"); setShowAll(false); }}
          className={`whitespace-nowrap text-sm px-4 py-2 rounded-full font-medium transition-all border ${
            activeDest === "all"
              ? "bg-[#00838F] text-white border-[#00838F] shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#00838F] hover:text-[#00838F]"
          }`}
        >
          🌍 Alle Urlaubsziele
        </button>
        {destinations.map((dest) => (
          <button
            key={dest.cityId}
            onClick={() => { setActiveDest(dest.cityId); setActiveCat("all"); setShowAll(false); }}
            className={`whitespace-nowrap text-sm px-4 py-2 rounded-full font-medium transition-all border ${
              activeDest === dest.cityId
                ? "bg-[#00838F] text-white border-[#00838F] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#00838F] hover:text-[#00838F]"
            }`}
          >
            {dest.emoji ?? "📍"} {dest.name}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => { setActiveCat("all"); setShowAll(false); }}
          className={`whitespace-nowrap text-sm px-4 py-2 rounded-full font-medium transition-all border ${
            activeCat === "all"
              ? "bg-[#6CC4BA] text-white border-[#6CC4BA] shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#6CC4BA] hover:text-[#6CC4BA]"
          }`}
        >
          🎟️ Alle Erlebnisse {!loading && `(${products.length})`}
        </button>
        {availableCategories.map((cat) => {
          const count = products.filter((p) => matchesCategory(p.tag_ids, cat.id)).length;
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveCat(cat.id); setShowAll(false); }}
              className={`whitespace-nowrap text-sm px-4 py-2 rounded-full font-medium transition-all border ${
                activeCat === cat.id
                  ? "bg-[#6CC4BA] text-white border-[#6CC4BA] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#6CC4BA] hover:text-[#6CC4BA]"
              }`}
            >
              {cat.emoji} {cat.label} {!loading && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(INITIAL_COUNT)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visible.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>

          {!showAll && filtered.length > INITIAL_COUNT && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(true)}
                className="bg-white border border-gray-200 hover:border-[#6CC4BA] text-gray-700 hover:text-[#6CC4BA] font-semibold px-8 py-3 rounded-full transition-all text-sm shadow-sm hover:shadow-md"
              >
                Alle {filtered.length} Aktivitäten anzeigen ↓
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
