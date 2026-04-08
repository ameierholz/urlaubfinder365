import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/admin/generate-seo
 * Generiert optimale SEO-Meta-Daten für eine Seite via Claude API.
 * Body: { pagePath: string, pageTitle?: string }
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });
  }

  const { pagePath, pageTitle } = await req.json();
  if (!pagePath) {
    return NextResponse.json({ error: "pagePath fehlt" }, { status: 400 });
  }

  const prompt = `Du bist ein SEO-Experte für urlaubfinder365.de – ein deutsches Reiseportal für Pauschalreisen, Last-Minute, Hotels, Flüge und Kreuzfahrten.

Generiere optimale SEO-Meta-Daten für folgende Seite:
- Seiten-Pfad: ${pagePath}
${pageTitle ? `- Aktueller Titel: ${pageTitle}` : ""}
- Domain: urlaubfinder365.de

Recherchiere mental, welche Keywords die großen Konkurrenten (Check24, HolidayCheck, TUI, ab-in-den-urlaub, Expedia) für ähnliche Seiten nutzen. Ziel: Top-Rankings bei Google, Bing und KI-Suchmaschinen.

Antworte AUSSCHLIESSLICH mit folgendem JSON (keine Erklärung, kein Markdown):
{
  "meta_title": "... (max 60 Zeichen, mit Keyword am Anfang, Jahr ${new Date().getFullYear()} wenn passend)",
  "meta_description": "... (max 155 Zeichen, Call-to-Action, Vertrauenssignale wie ✓, USPs)",
  "focus_keyword": "... (1-3 Wörter, höchstes Suchvolumen)",
  "additional_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "og_title": "... (max 60 Zeichen, emotionaler als meta_title, mit Emoji wenn passend)",
  "og_description": "... (max 200 Zeichen, Social-Media optimiert, neugierig machend)",
  "og_image_suggestion": "... (Beschreibung des idealen OG-Bildes: Motiv, Stimmung, Format 1200x630)"
}`;

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
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Claude API: ${res.status} ${err}` }, { status: 502 });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "";

    // Parse JSON aus der Antwort
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Keine JSON-Antwort von Claude", raw: text }, { status: 500 });
    }

    const seo = JSON.parse(jsonMatch[0]);
    return NextResponse.json(seo);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
