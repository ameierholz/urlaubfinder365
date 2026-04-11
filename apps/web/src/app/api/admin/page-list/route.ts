import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Fest einprogrammierte wichtige Seiten (immer dabei)
const CORE_PAGES = [
  "/",
  "/guenstig-urlaub-buchen", "/last-minute", "/hotelsuche", "/flugsuche",
  "/kreuzfahrten", "/mietwagen", "/aktivitaeten",
  "/urlaubsarten/all-inclusive-urlaub", "/urlaubsarten/pauschalreisen",
  "/urlaubsarten/last-minute-urlaub", "/urlaubsarten/super-last-minute-urlaub",
  "/urlaubsarten/fruhbucher-urlaub",
  "/urlaubsthemen/familienurlaub", "/urlaubsthemen/strandurlaub",
  "/urlaubsthemen/wellnessurlaub", "/urlaubsthemen/singlereisen",
  "/urlaubsthemen/luxusurlaub", "/urlaubsthemen/abenteuerurlaub",
  "/urlaubsthemen/aktivurlaub", "/urlaubsthemen/staedtereisen",
  "/reisewarnungen", "/visum-checker", "/preisentwicklung",
  "/reiseversicherung", "/ki-reiseplaner", "/urlaubsguides", "/magazin",
];

/**
 * GET /api/admin/page-list?include=destinations&limit=100
 * Gibt alle bekannten Seiten zurück (aus page_seo_meta + CORE_PAGES + optional Destinations)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeDestinations = searchParams.get("include") === "destinations";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "200"), 500);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Seiten aus page_seo_meta
  const { data: seoPages } = await supabase
    .from("page_seo_meta")
    .select("page_path, meta_title, focus_keyword")
    .order("page_path");

  // Alle bekannten Pfade zusammenführen (deduplizieren)
  const pathSet = new Set<string>(CORE_PAGES);
  for (const row of seoPages ?? []) {
    if (row.page_path) pathSet.add(row.page_path);
  }

  const seoMap = new Map((seoPages ?? []).map((r: { page_path: string; meta_title: string | null; focus_keyword: string | null }) => [
    r.page_path,
    { title: r.meta_title, keyword: r.focus_keyword },
  ]));

  const pages = [...pathSet].slice(0, limit).map((path) => ({
    path,
    title: seoMap.get(path)?.title ?? null,
    keyword: seoMap.get(path)?.keyword ?? null,
    inDb: seoMap.has(path),
  }));

  // Destinations optional dazu
  let destinations: { path: string; title: string | null; keyword: string | null; inDb: boolean }[] = [];
  if (includeDestinations) {
    const { data: destRows } = await supabase
      .from("destinations")
      .select("slug, name")
      .order("name")
      .limit(250);

    destinations = (destRows ?? []).map((d: { slug: string; name: string }) => ({
      path: `/urlaubsziele/${d.slug}`,
      title: d.name,
      keyword: null,
      inDb: false,
    }));
  }

  return NextResponse.json({
    pages,
    destinations,
    total: pages.length + destinations.length,
  });
}
