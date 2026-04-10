/**
 * Lädt Tiqets-Aktivitäten für eine Destination per Slug.
 *
 *   GET /api/map/activities?slug=mallorca&limit=4
 *
 * Catalog → tiqetsCityId Lookup, dann Tiqets API mit Cache 1h.
 * Wird vom MapSidePanel im Highlights-Bereich gerufen.
 */

import { NextRequest, NextResponse } from "next/server";
import { CATALOG } from "@/data/catalog-regions";
import type { TiqetsProduct } from "@/types";

export const runtime = "nodejs";
export const revalidate = 3600;

const API_KEY = process.env.TIQETS_API_KEY || "tqat-EaW7s7rthE8b1cJm1U4KrpEyvx4cmwKI";

interface ActivitiesResponse {
  products: TiqetsProduct[];
  count:    number;
  source?:  "self" | "parent";  // self = direkter Slug, parent = vom Parent-Slug geliehen
}

export async function GET(req: NextRequest): Promise<NextResponse<ActivitiesResponse>> {
  const slug  = req.nextUrl.searchParams.get("slug") ?? "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "4"), 12);

  if (!slug) return NextResponse.json({ products: [], count: 0 });

  // 1. Catalog-Eintrag für slug
  const entry = CATALOG.find((e) => e.slug === slug);
  if (!entry) return NextResponse.json({ products: [], count: 0 });

  // 2. tiqetsCityId direkt vom Eintrag, sonst vom Parent
  let cityId: string | undefined = entry.tiqetsCityId;
  let source: "self" | "parent" = "self";
  if (!cityId && entry.parentSlug) {
    const parent = CATALOG.find((p) => p.slug === entry.parentSlug);
    if (parent?.tiqetsCityId) {
      cityId = parent.tiqetsCityId;
      source = "parent";
    }
  }

  if (!cityId) return NextResponse.json({ products: [], count: 0 });

  // 3. Tiqets API
  try {
    const url = `https://api.tiqets.com/v2/products?city_id=${cityId}&lang=de&page_size=${limit}`;
    const res = await fetch(url, {
      headers: { Authorization: `Token ${API_KEY}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ products: [], count: 0 });
    }
    const data = await res.json();
    const products: TiqetsProduct[] = data.products ?? [];
    return NextResponse.json(
      { products: products.slice(0, limit), count: products.length, source },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    return NextResponse.json({ products: [], count: 0 });
  }
}
