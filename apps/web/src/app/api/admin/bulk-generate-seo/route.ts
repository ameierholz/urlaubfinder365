import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { PAUSCHAL_KOMBIS } from "@/lib/pauschalreisen-kombi-data";
import { SEASON_GUIDES } from "@/lib/season-guide-data";
import { RATGEBER_ARTICLES } from "@/lib/ratgeber-data";

export const runtime = "nodejs";
export const maxDuration = 300;

// ── Alle bekannten statischen Seiten ────────────────────────────────────────
const STATIC_PATHS = [
  "/guenstig-urlaub-buchen", "/last-minute", "/hotelsuche", "/flugsuche",
  "/kreuzfahrten", "/mietwagen-reservieren", "/aktivitaeten",
  "/urlaubsarten/all-inclusive-urlaub", "/urlaubsarten/pauschalreisen",
  "/urlaubsarten/last-minute-urlaub", "/urlaubsarten/super-last-minute-urlaub",
  "/urlaubsarten/fruhbucher-urlaub",
  "/urlaubsthemen/familienurlaub", "/urlaubsthemen/strandurlaub",
  "/urlaubsthemen/wellnessurlaub", "/urlaubsthemen/singlereisen",
  "/urlaubsthemen/luxusurlaub", "/urlaubsthemen/abenteuerurlaub",
  "/urlaubsthemen/aktivurlaub", "/urlaubsthemen/staedtereisen",
  "/urlaubsthemen/hochzeitsreise", "/urlaubsthemen/seniorenreisen",
  "/urlaubsthemen/adults-only", "/urlaubsthemen/kurreisen",
  "/urlaubsthemen/budget-bis-500", "/urlaubsthemen/budget-bis-1000",
  "/urlaubsthemen/budget-bis-1500", "/urlaubsthemen/budget-bis-2000",
  "/reisewarnungen", "/visum-checker", "/preisentwicklung",
  "/reiseversicherung", "/ki-reiseplaner", "/community", "/feed",
  "/urlaubsguides", "/magazin", "/ratgeber", "/pauschalreisen", "/reiseziele",
  "/reisestatistiken", "/partner", "/werbepartner",
];

const PAUSCHAL_PATHS = PAUSCHAL_KOMBIS.map((k) => `/pauschalreisen/${k.slug}`);
const RATGEBER_PATHS = RATGEBER_ARTICLES.map((a) => `/ratgeber/${a.slug}`);
const SEASON_PATHS = SEASON_GUIDES.map((g) => `/reiseziele/${g.slug}`);

// ── SEO generieren (vollständig mit Textblöcken) ────────────────────────────
async function generateFullSeo(pagePath: string, apiKey: string): Promise<Record<string, unknown> | null> {
  const prompt = `Du bist ein SEO-Experte und Texter für urlaubfinder365.de – ein deutsches Reiseportal.

Generiere optimale SEO-Daten und Textblöcke für: ${pagePath}
Domain: urlaubfinder365.de

SEITENAUFBAU:
1. seo_intro → direkt unter dem Hero-Bild (kurzer Einstieg)
2. seo_h2_middle + seo_middle → Infoblock in der Seitenmitte
3. seo_h2_bottom + seo_bottom → langer Ratgeber-Text ganz unten (SEO-Haupttext)

Antworte NUR mit JSON:
{
  "meta_title": "Max 58 Zeichen. Keyword vorne. Natürliche Sprache.",
  "meta_description": "Max 150 Zeichen. Nutzerfokussiert, keine Sonderzeichen.",
  "focus_keyword": "1-3 Wörter, höchstes Suchvolumen",
  "additional_keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "og_title": "Max 60 Zeichen, emotional",
  "og_description": "Max 200 Zeichen, Social-Media optimiert",
  "seo_intro": "3-4 Sätze, emotional, 80-120 Wörter",
  "seo_h2_middle": "H2 mit Keyword",
  "seo_middle": "3-5 Absätze (\\n\\n getrennt), 300-400 Wörter",
  "seo_h2_bottom": "H2 Ratgeber-Charakter",
  "seo_bottom": "8-12 Absätze (\\n\\n getrennt), 800-1000 Wörter. LÄNGSTER TEXT."
}

WICHTIG: seo_bottom MUSS 800-1000 Wörter haben. Deutsch, natürlich, echte Tipps.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.content?.[0]?.text ?? "";
    const cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0].replace(/,\s*([}\]])/g, "$1"));
  } catch {
    return null;
  }
}

// ── POST Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY fehlt" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const mode = (body as { mode?: string }).mode ?? "missing"; // "missing" | "all" | "upgrade"
  const batchSize = Math.min((body as { batchSize?: number }).batchSize ?? 5, 10);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  // Alle bekannten Seiten-Pfade sammeln
  const allPaths = [...STATIC_PATHS, ...PAUSCHAL_PATHS, ...RATGEBER_PATHS, ...SEASON_PATHS];

  // Bestehende SEO-Daten laden
  const { data: existing } = await supabase
    .from("page_seo_meta")
    .select("page_path, meta_title, seo_intro, seo_bottom");

  const existingMap = new Map(
    ((existing ?? []) as { page_path: string; meta_title: string | null; seo_intro: string | null; seo_bottom: string | null }[])
      .map((r) => [r.page_path, r])
  );

  // Welche Seiten brauchen Generierung?
  let toGenerate: string[];

  if (mode === "all") {
    // Alle neu generieren (überschreibt bestehende)
    toGenerate = allPaths;
  } else if (mode === "upgrade") {
    // Nur Seiten die Meta haben aber keine Textblöcke
    toGenerate = allPaths.filter((p) => {
      const e = existingMap.get(p);
      return e && e.meta_title && (!e.seo_intro || !e.seo_bottom);
    });
  } else {
    // Default: Nur fehlende Seiten
    toGenerate = allPaths.filter((p) => !existingMap.has(p));
  }

  // Batch begrenzen (maxDuration beachten)
  const batch = toGenerate.slice(0, batchSize);

  const results = {
    total: toGenerate.length,
    batchSize: batch.length,
    remaining: toGenerate.length - batch.length,
    generated: [] as string[],
    errors: [] as string[],
  };

  for (const path of batch) {
    try {
      const seo = await generateFullSeo(path, apiKey);
      if (!seo) { results.errors.push(path); continue; }

      const { error } = await supabase.from("page_seo_meta").upsert({
        page_path: path,
        meta_title: seo.meta_title ?? null,
        meta_description: seo.meta_description ?? null,
        focus_keyword: seo.focus_keyword ?? null,
        additional_keywords: seo.additional_keywords ?? null,
        og_title: seo.og_title ?? null,
        og_description: seo.og_description ?? null,
        seo_intro: seo.seo_intro ?? null,
        seo_h2_middle: seo.seo_h2_middle ?? null,
        seo_middle: seo.seo_middle ?? null,
        seo_h2_bottom: seo.seo_h2_bottom ?? null,
        seo_bottom: seo.seo_bottom ?? null,
      }, { onConflict: "page_path" });

      if (error) results.errors.push(`${path}: ${error.message}`);
      else results.generated.push(path);

      // Pause zwischen Requests
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      results.errors.push(`${path}: ${String(err)}`);
    }
  }

  return NextResponse.json(results);
}
