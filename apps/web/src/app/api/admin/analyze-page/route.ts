import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

/**
 * POST /api/admin/analyze-page
 * Crawlt eine Seite und analysiert die SEO-Struktur.
 * Body: { pagePath: string, focusKeyword?: string }
 */
export async function POST(req: NextRequest) {
  const { pagePath, focusKeyword } = await req.json();
  if (!pagePath) return NextResponse.json({ error: "pagePath fehlt" }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.urlaubfinder365.de";
  const url = `${baseUrl}${pagePath}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Urlaubfinder365-SEO-Analyzer/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return NextResponse.json({ error: `Seite nicht erreichbar: ${res.status}` }, { status: 502 });

    const html = await res.text();

    // H-Tags extrahieren
    const hTagRegex = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
    const headings: { level: number; text: string }[] = [];
    let match;
    while ((match = hTagRegex.exec(html)) !== null) {
      const level = parseInt(match[1][1]);
      const text = match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (text) headings.push({ level, text });
    }

    // Meta-Tags aus HTML extrahieren
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const pageTitle = titleMatch?.[1]?.replace(/\s+/g, " ").trim() ?? "";

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const pageDescription = descMatch?.[1] ?? "";

    // Analyse
    const h1s = headings.filter((h) => h.level === 1);
    const h2s = headings.filter((h) => h.level === 2);
    const h3s = headings.filter((h) => h.level === 3);

    const checks: { label: string; pass: boolean; detail: string }[] = [];

    // 1. Genau eine H1
    checks.push({
      label: "Genau eine H1",
      pass: h1s.length === 1,
      detail: h1s.length === 0 ? "Keine H1 gefunden" : h1s.length === 1 ? `H1: "${h1s[0].text}"` : `${h1s.length} H1-Tags gefunden (nur 1 erlaubt)`,
    });

    // 2. Focus Keyword in H1
    if (focusKeyword && h1s.length > 0) {
      const kwInH1 = h1s[0].text.toLowerCase().includes(focusKeyword.toLowerCase());
      checks.push({
        label: "Focus Keyword in H1",
        pass: kwInH1,
        detail: kwInH1 ? `"${focusKeyword}" ist in der H1` : `"${focusKeyword}" fehlt in der H1: "${h1s[0].text}"`,
      });
    }

    // 3. Focus Keyword in Title
    if (focusKeyword) {
      const kwInTitle = pageTitle.toLowerCase().includes(focusKeyword.toLowerCase());
      checks.push({
        label: "Focus Keyword in Title",
        pass: kwInTitle,
        detail: kwInTitle ? `"${focusKeyword}" im Title gefunden` : `"${focusKeyword}" fehlt im Title: "${pageTitle}"`,
      });
    }

    // 4. Focus Keyword in Description
    if (focusKeyword) {
      const kwInDesc = pageDescription.toLowerCase().includes(focusKeyword.toLowerCase());
      checks.push({
        label: "Focus Keyword in Description",
        pass: kwInDesc,
        detail: kwInDesc ? `"${focusKeyword}" in Description gefunden` : `"${focusKeyword}" fehlt in der Meta-Description`,
      });
    }

    // 5. H-Struktur: keine Sprünge (z.B. H1 → H3 ohne H2)
    let structureOk = true;
    let structureDetail = "";
    for (let i = 1; i < headings.length; i++) {
      if (headings[i].level > headings[i - 1].level + 1) {
        structureOk = false;
        structureDetail = `Sprung: H${headings[i - 1].level} → H${headings[i].level} ("${headings[i].text}")`;
        break;
      }
    }
    checks.push({
      label: "Logische H-Struktur",
      pass: structureOk,
      detail: structureOk ? "Keine Sprünge in der Überschriften-Hierarchie" : structureDetail,
    });

    // 6. Mindestens 2 H2
    checks.push({
      label: "Mindestens 2 H2-Überschriften",
      pass: h2s.length >= 2,
      detail: `${h2s.length} H2-Überschriften gefunden`,
    });

    // 7. Title-Länge
    checks.push({
      label: "Title-Länge (30–60 Zeichen)",
      pass: pageTitle.length >= 30 && pageTitle.length <= 65,
      detail: `${pageTitle.length} Zeichen: "${pageTitle.slice(0, 60)}${pageTitle.length > 60 ? "…" : ""}"`,
    });

    // 8. Description-Länge
    checks.push({
      label: "Description-Länge (120–160 Zeichen)",
      pass: pageDescription.length >= 120 && pageDescription.length <= 165,
      detail: `${pageDescription.length} Zeichen`,
    });

    // 9. Bilder mit alt-Text
    const imgCount = (html.match(/<img /gi) ?? []).length;
    const imgWithAlt = (html.match(/<img [^>]*alt=["'][^"']+["']/gi) ?? []).length;
    checks.push({
      label: "Bilder mit Alt-Text",
      pass: imgCount === 0 || imgWithAlt >= imgCount * 0.8,
      detail: `${imgWithAlt}/${imgCount} Bilder haben Alt-Text`,
    });

    // 10. JSON-LD vorhanden
    const hasJsonLd = html.includes("application/ld+json");
    checks.push({
      label: "Strukturierte Daten (JSON-LD)",
      pass: hasJsonLd,
      detail: hasJsonLd ? "JSON-LD Schema gefunden" : "Kein JSON-LD auf der Seite",
    });

    const passCount = checks.filter((c) => c.pass).length;
    const score = Math.round((passCount / checks.length) * 100);

    return NextResponse.json({
      url,
      score,
      checks,
      headings: headings.slice(0, 30),
      h1: h1s[0]?.text ?? null,
      h2Count: h2s.length,
      h3Count: h3s.length,
      pageTitle,
      pageDescription,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
