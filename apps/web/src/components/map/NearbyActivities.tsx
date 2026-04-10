"use client";

/**
 * NearbyActivities — Tiqets-Mini-Cards im Side-Panel.
 *
 * Lädt 4 Top-Aktivitäten für einen Catalog-Slug via /api/map/activities,
 * client-cached. Wenn der Slug selbst keine tiqetsCityId hat, fällt der
 * Server auf den Parent-Slug zurück (z. B. Belek → Antalya).
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Sparkles, ExternalLink } from "lucide-react";
import type { TiqetsProduct } from "@/types";

interface Props {
  slug: string;
  /** Max. Anzahl Cards (default: 4) */
  limit?: number;
}

const cache = new Map<string, { products: TiqetsProduct[]; ts: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 Min

export default function NearbyActivities({ slug, limit = 4 }: Props) {
  const [products, setProducts] = useState<TiqetsProduct[]>([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!slug) return;
    const key = `${slug}:${limit}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      setProducts(cached.products);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/map/activities?slug=${encodeURIComponent(slug)}&limit=${limit}`)
      .then((r) => r.ok ? r.json() : { products: [] })
      .then((json) => {
        if (cancelled) return;
        const list: TiqetsProduct[] = json?.products ?? [];
        cache.set(key, { products: list, ts: Date.now() });
        setProducts(list);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug, limit]);

  if (loading) {
    return (
      <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-orange-600">Aktivitäten werden geladen…</span>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-orange-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Aktivitäten in der Nähe
        </p>
        <Link
          href={`/aktivitaeten/${slug}/`}
          className="text-[10px] font-bold text-orange-600 hover:text-orange-800 flex items-center gap-0.5"
        >
          Alle ansehen →
        </Link>
      </div>

      <div className="space-y-1.5">
        {products.map((p, i) => (
          <a
            key={i}
            href={p.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-white border border-gray-200 hover:border-orange-300 hover:shadow-sm rounded-lg p-2 transition-all group"
          >
            {p.images?.[0]?.medium ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.images[0].medium}
                alt={p.title}
                className="w-14 h-14 rounded object-cover shrink-0 bg-gray-100"
                loading="lazy"
              />
            ) : (
              <div className="w-14 h-14 rounded bg-orange-100 flex items-center justify-center text-2xl shrink-0">
                🎟️
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-orange-700">
                {p.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {p.ratings && p.ratings.total > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                    <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    {p.ratings.average.toFixed(1)}
                    <span className="text-gray-400">({p.ratings.total})</span>
                  </span>
                )}
                {p.price && (
                  <span className="text-[11px] font-bold text-orange-600 ml-auto">
                    ab {Math.round(p.price)} €
                  </span>
                )}
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-orange-500 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
