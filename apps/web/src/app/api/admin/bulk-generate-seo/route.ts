import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 min max

const KNOWN_PATHS = [
  "/guenstig-urlaub-buchen", "/last-minute", "/hotelsuche", "/flugsuche",
  "/kreuzfahrten", "/mietwagen", "/aktivitaeten",
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
  "/urlaubsguides", "/magazin",
];

async function generateSeo(pagePath: string, apiKey: string): Promise<Record<string, unknown> | null> {
  const year = new Date().getFullYear();
  const prompt = `Du bist ein SEO-Experte für urlaubfinder365.de – ein deutsches Reiseportal.

Generiere optimale SEO-Meta-Daten für: ${pagePath}
Domain: urlaubfinder365.de

Recherchiere welche Keywords Check24, HolidayCheck, TUI, ab-in-den-urlaub für ähnliche Seiten nutzen.

Antworte NUR mit JSON:
{
  "meta_title": "... (max 60 Zeichen, Keyword vorne, Jahr ${year})",
  "meta_description": "... (max 155 Zeichen, CTAs, ✓ Vertrauenssignale)",
  "focus_keyword": "... (1-3 Wörter, höchstes Suchvolumen)",
  "additional_keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "og_title": "... (max 60 Zeichen, emotional, mit Emoji)",
  "og_description": "... (max 200 Zeichen, Social-Media optimiert)"
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  return JSON.parse(match[0]);
}

export async function POST() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY fehlt" }, { status: 500 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Finde Seiten ohne SEO-Daten
  const { data: existing } = await supabase.from("page_seo_meta").select("page_path");
  const existingPaths = new Set(((existing ?? []) as { page_path: string }[]).map((r) => r.page_path));
  const missing = KNOWN_PATHS.filter((p) => !existingPaths.has(p));

  const results = { generated: [] as string[], errors: [] as string[] };

  // Sequenziell generieren (Rate Limits beachten)
  for (const path of missing) {
    try {
      const seo = await generateSeo(path, apiKey);
      if (!seo) { results.errors.push(path); continue; }

      const { error } = await supabase.from("page_seo_meta").upsert({
        page_path: path,
        meta_title: seo.meta_title,
        meta_description: seo.meta_description,
        focus_keyword: seo.focus_keyword,
        additional_keywords: seo.additional_keywords,
        og_title: seo.og_title,
        og_description: seo.og_description,
      }, { onConflict: "page_path" });

      if (error) results.errors.push(`${path}: ${error.message}`);
      else results.generated.push(path);

      // 500ms Pause zwischen Requests
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      results.errors.push(`${path}: ${String(err)}`);
    }
  }

  return NextResponse.json({
    success: true,
    total: missing.length,
    generated: results.generated.length,
    errors: results.errors,
  });
}
