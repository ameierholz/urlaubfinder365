import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/broken-link-scan
 * Crawlt eine Zielseite, extrahiert ausgehende Links und prüft auf 404/410.
 * Schlägt passende eigene Seiten als Ersatz vor.
 */

// Unsere Seiten als Replacement-Kandidaten
const OUR_PAGES = [
  { path: "/urlaubsziele/tuerkei/", title: "Türkei Urlaub", keywords: ["türkei", "antalya", "bodrum", "side", "türkische riviera", "istanbul"] },
  { path: "/urlaubsziele/mallorca/", title: "Mallorca Urlaub", keywords: ["mallorca", "balearen", "palma", "cala"] },
  { path: "/urlaubsziele/griechenland/", title: "Griechenland Urlaub", keywords: ["griechenland", "kreta", "rhodos", "korfu", "santorini", "athen"] },
  { path: "/urlaubsziele/kanaren/", title: "Kanaren Urlaub", keywords: ["kanaren", "teneriffa", "gran canaria", "fuerteventura", "lanzarote"] },
  { path: "/urlaubsziele/dubai/", title: "Dubai Urlaub", keywords: ["dubai", "abu dhabi", "vae", "emirate"] },
  { path: "/urlaubsziele/aegypten/", title: "Ägypten Urlaub", keywords: ["ägypten", "hurghada", "sharm el sheikh", "rotes meer"] },
  { path: "/urlaubsarten/all-inclusive-urlaub/", title: "All Inclusive Urlaub", keywords: ["all inclusive", "all-inclusive", "vollpension"] },
  { path: "/urlaubsarten/pauschalreisen/", title: "Pauschalreisen", keywords: ["pauschalreise", "pauschal", "paket"] },
  { path: "/last-minute/", title: "Last Minute Urlaub", keywords: ["last minute", "last-minute", "kurzfristig", "spontan"] },
  { path: "/kreuzfahrten/", title: "Kreuzfahrten", keywords: ["kreuzfahrt", "schiff", "mittelmeer"] },
  { path: "/ratgeber/", title: "Reise-Ratgeber", keywords: ["tipps", "ratgeber", "reiseplanung", "packliste"] },
  { path: "/preisentwicklung/", title: "Preisentwicklung", keywords: ["preis", "preisentwicklung", "günstig", "billig", "wann buchen"] },
  { path: "/reiseversicherung/", title: "Reiseversicherung", keywords: ["versicherung", "reiseversicherung", "auslandskranken"] },
  { path: "/visum-checker/", title: "Visum-Checker", keywords: ["visum", "einreise", "pass", "einreisebestimmung"] },
  { path: "/urlaubsziele/", title: "Alle Urlaubsziele", keywords: ["urlaubsziel", "reiseziel", "wohin"] },
];

function findReplacement(brokenUrl: string, anchorText: string): { path: string; title: string } | null {
  const combined = `${brokenUrl} ${anchorText}`.toLowerCase();
  let best: { path: string; title: string; score: number } | null = null;

  for (const page of OUR_PAGES) {
    let score = 0;
    for (const kw of page.keywords) {
      if (combined.includes(kw)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { path: page.path, title: page.title, score };
    }
  }
  return best ? { path: best.path, title: best.title } : null;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL ist erforderlich" }, { status: 400 });
    }

    const start = Date.now();

    // 1. Zielseite laden
    let html: string;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Urlaubfinder365-LinkChecker/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      html = await res.text();
    } catch {
      return NextResponse.json({ error: "Seite konnte nicht geladen werden" }, { status: 502 });
    }

    // 2. Alle ausgehenden Links extrahieren
    const linkRegex = /<a[^>]+href=["']?(https?:\/\/[^"'\s>]+)["']?[^>]*>(.*?)<\/a>/gi;
    const links: { url: string; anchor: string }[] = [];
    const seen = new Set<string>();

    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const linkUrl = match[1];
      const anchor = match[2].replace(/<[^>]*>/g, "").trim();
      // Nur externe Links, nicht die Zielseite selbst
      const targetDomain = new URL(url).hostname;
      try {
        const linkDomain = new URL(linkUrl).hostname;
        if (linkDomain === targetDomain) continue;
      } catch { continue; }
      if (seen.has(linkUrl)) continue;
      seen.add(linkUrl);
      links.push({ url: linkUrl, anchor });
    }

    // 3. Links prüfen (max 50, parallel mit Limit)
    const toCheck = links.slice(0, 50);
    const brokenLinks: {
      sourceUrl: string;
      sourcePage: string;
      brokenUrl: string;
      anchorText: string;
      statusCode: number;
      suggestedReplacement: string | null;
      suggestedReplacementTitle: string | null;
    }[] = [];

    // Parallel prüfen in Batches von 10
    for (let i = 0; i < toCheck.length; i += 10) {
      const batch = toCheck.slice(i, i + 10);
      const results = await Promise.allSettled(
        batch.map(async (link) => {
          try {
            const res = await fetch(link.url, {
              method: "HEAD",
              headers: { "User-Agent": "Urlaubfinder365-LinkChecker/1.0" },
              signal: AbortSignal.timeout(8000),
              redirect: "follow",
            });
            return { link, status: res.status };
          } catch {
            // Timeout oder Netzwerkfehler = potenziell tot
            return { link, status: 0 };
          }
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled") {
          const { link, status } = r.value;
          if (status === 404 || status === 410 || status === 0) {
            const replacement = findReplacement(link.url, link.anchor);
            brokenLinks.push({
              sourceUrl: url,
              sourcePage: new URL(url).pathname,
              brokenUrl: link.url,
              anchorText: link.anchor,
              statusCode: status || 0,
              suggestedReplacement: replacement?.path ?? null,
              suggestedReplacementTitle: replacement?.title ?? null,
            });
          }
        }
      }
    }

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    return NextResponse.json({
      target: url,
      scannedPages: 1,
      brokenLinks,
      scanTime: `${elapsed}s · ${toCheck.length} Links gepr\u00fcft`,
    });
  } catch (e) {
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}
