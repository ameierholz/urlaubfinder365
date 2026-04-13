import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/admin/keyword-action
 * Generiert KI-gestützte Maßnahmen für ein Keyword + findet passende eigene Seiten.
 */

// Keyword → Seiten-Mapping (statisch, schnell)
const KEYWORD_PAGE_MAP: { patterns: string[]; path: string; label: string }[] = [
  { patterns: ["türkei", "antalya", "bodrum", "side", "alanya"], path: "/urlaubsziele/tuerkei/", label: "Türkei Zielseite" },
  { patterns: ["mallorca", "balearen", "palma"], path: "/urlaubsziele/mallorca/", label: "Mallorca Zielseite" },
  { patterns: ["griechenland", "kreta", "rhodos", "korfu", "santorini"], path: "/urlaubsziele/griechenland/", label: "Griechenland Zielseite" },
  { patterns: ["ägypten", "hurghada", "sharm", "rotes meer"], path: "/urlaubsziele/aegypten/", label: "Ägypten Zielseite" },
  { patterns: ["kanaren", "teneriffa", "gran canaria", "fuerteventura"], path: "/urlaubsziele/kanaren/", label: "Kanaren Zielseite" },
  { patterns: ["dubai", "abu dhabi", "emirate", "vae"], path: "/urlaubsziele/dubai/", label: "Dubai Zielseite" },
  { patterns: ["thailand", "bangkok", "phuket"], path: "/urlaubsziele/thailand/", label: "Thailand Zielseite" },
  { patterns: ["italien", "rom", "sardinien", "sizilien"], path: "/urlaubsziele/italien/", label: "Italien Zielseite" },
  { patterns: ["spanien", "barcelona", "costa"], path: "/urlaubsziele/spanien/", label: "Spanien Zielseite" },
  { patterns: ["kroatien", "dubrovnik", "split"], path: "/urlaubsziele/kroatien/", label: "Kroatien Zielseite" },
  { patterns: ["portugal", "algarve", "lissabon"], path: "/urlaubsziele/portugal/", label: "Portugal Zielseite" },
  { patterns: ["all inclusive", "all-inclusive"], path: "/urlaubsarten/all-inclusive-urlaub/", label: "All Inclusive" },
  { patterns: ["pauschalreise", "pauschal"], path: "/urlaubsarten/pauschalreisen/", label: "Pauschalreisen" },
  { patterns: ["last minute", "last-minute", "lastminute"], path: "/last-minute/", label: "Last Minute" },
  { patterns: ["frühbucher", "fruehbucher", "früh bucher"], path: "/urlaubsarten/fruhbucher-urlaub/", label: "Frühbucher" },
  { patterns: ["kreuzfahrt", "schiff"], path: "/kreuzfahrten/", label: "Kreuzfahrten" },
  { patterns: ["familienurlaub", "familie", "kinder"], path: "/urlaubsthemen/familienurlaub/", label: "Familienurlaub" },
  { patterns: ["strandurlaub", "strand", "meer"], path: "/urlaubsthemen/strandurlaub/", label: "Strandurlaub" },
  { patterns: ["wellness", "spa"], path: "/urlaubsthemen/wellnessurlaub/", label: "Wellnessurlaub" },
  { patterns: ["städtereise", "stadtreise", "city"], path: "/urlaubsthemen/staedtereisen/", label: "Städtereisen" },
  { patterns: ["single", "allein"], path: "/urlaubsthemen/singlereisen/", label: "Singlereisen" },
  { patterns: ["luxus"], path: "/urlaubsthemen/luxusurlaub/", label: "Luxusurlaub" },
  { patterns: ["günstig", "billig", "budget", "sparurlaub"], path: "/guenstig-urlaub-buchen/", label: "Günstig buchen" },
  { patterns: ["super last minute"], path: "/urlaubsarten/super-last-minute-urlaub/", label: "Super Last Minute" },
  { patterns: ["hotel"], path: "/hotelsuche/", label: "Hotelsuche" },
  { patterns: ["flug"], path: "/flugsuche/", label: "Flugsuche" },
  { patterns: ["mietwagen"], path: "/mietwagen-reservieren/", label: "Mietwagen" },
  { patterns: ["versicherung"], path: "/reiseversicherung/", label: "Reiseversicherung" },
  { patterns: ["visum", "einreise"], path: "/visum-checker/", label: "Visum-Checker" },
  { patterns: ["preis", "wann buchen"], path: "/preisentwicklung/", label: "Preisentwicklung" },
  { patterns: ["urlaubsarten"], path: "/urlaubsarten/pauschalreisen/", label: "Urlaubsarten" },
];

function findMatchingPages(keyword: string): { path: string; label: string }[] {
  const kw = keyword.toLowerCase();
  return KEYWORD_PAGE_MAP
    .filter((m) => m.patterns.some((p) => kw.includes(p)))
    .map(({ path, label }) => ({ path, label }));
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });
  }

  const { keyword, position, change, type } = await req.json();
  if (!keyword) {
    return NextResponse.json({ error: "keyword fehlt" }, { status: 400 });
  }

  // Passende eigene Seiten finden
  const matchingPages = findMatchingPages(keyword);

  // Auch in Supabase SEO-Daten schauen ob es Seiten mit diesem focus_keyword gibt
  let dbPages: { path: string; label: string }[] = [];
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("page_seo")
      .select("page_path, meta_title")
      .or(`focus_keyword.ilike.%${keyword}%,additional_keywords.cs.{${keyword}}`)
      .limit(5) as { data: { page_path: string; meta_title: string | null }[] | null };
    if (data) {
      dbPages = data.map((r) => ({ path: r.page_path, label: r.meta_title ?? r.page_path }));
    }
  } catch { /* DB-Fehler ignorieren */ }

  // Alle passenden Seiten zusammenführen (deduplizieren)
  const allPages = [...matchingPages];
  for (const p of dbPages) {
    if (!allPages.some((a) => a.path === p.path)) allPages.push(p);
  }

  const isWinner = type === "winner";
  const pagesContext = allPages.length > 0
    ? `\n\nUnsere relevanten Seiten für dieses Keyword:\n${allPages.map((p) => `- ${p.path} (${p.label})`).join("\n")}`
    : "\n\nWir haben noch keine dedizierte Seite für dieses Keyword — das ist eine Content-Lücke!";

  const prompt = isWinner
    ? `Du bist SEO-Berater für urlaubfinder365.de (deutsches Reiseportal).

Das Keyword "${keyword}" ist ein GEWINNER:
- Aktuelle Position: ${position}
- Positions-Gewinn: +${Math.abs(change)} Plätze
${pagesContext}

Erstelle eine kurze, konkrete Maßnahmen-Liste (max. 5 Punkte) um diesen Erfolg auszubauen.
Beziehe dich auf die konkreten Seiten oben. Nenne spezifische Aktionen:
- Welcher Content auf welcher Seite erweitert werden soll
- Welche internen Links gesetzt werden sollten
- Welche Backlink-Strategie passt
- Related Keywords die wir auch abdecken sollten

Schreibe prägnant auf Deutsch, keine Einleitung, direkt die Maßnahmen mit Emoji-Bullets.`
    : `Du bist SEO-Berater für urlaubfinder365.de (deutsches Reiseportal).

Das Keyword "${keyword}" ist ein VERLIERER:
- Aktuelle Position: ${position}
- Positions-Verlust: ${change} Plätze
${pagesContext}

Erstelle eine kurze, konkrete Rettungs-Maßnahmen-Liste (max. 5 Punkte).
Beziehe dich auf die konkreten Seiten oben. Nenne spezifische Aktionen:
- Welche Seite optimiert werden muss (Title, H1, Content)
- Was wahrscheinlich die Ursache für den Verlust ist
- Welche On-Page-Fixes sofort helfen
- Ob interne Links oder Backlinks fehlen

Schreibe prägnant auf Deutsch, keine Einleitung, direkt die Maßnahmen mit Emoji-Bullets.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "Keine Vorschläge generiert.";

    return NextResponse.json({ suggestion: text, matchingPages: allPages });
  } catch {
    return NextResponse.json({ error: "KI-Fehler" }, { status: 500 });
  }
}
