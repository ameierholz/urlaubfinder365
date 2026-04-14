import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY fehlt" }, { status: 500 });

  const { topic } = await req.json();
  if (!topic) return NextResponse.json({ error: "topic fehlt" }, { status: 400 });

  const prompt = `Du bist SEO-Experte und Reise-Redakteur fuer urlaubfinder365.de.

Erstelle einen kompletten Ratgeber-Artikel zum Thema: "${topic}"

Antworte AUSSCHLIESSLICH mit folgendem JSON:
{
  "slug": "url-freundlicher-slug-ohne-umlaute",
  "title": "Ansprechender Artikel-Titel (max 70 Zeichen)",
  "seo_title": "SEO-optimierter Meta Title (max 58 Zeichen, Keyword vorne)",
  "seo_description": "Meta Description (max 155 Zeichen, nutzerfokussiert, mit CTA)",
  "focus_keyword": "Haupt-Keyword (1-3 Woerter)",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "lead": "Einleitung mit 100-150 Woertern. Emotional, informativ, macht Lust weiterzulesen.",
  "sections": [
    {
      "heading": "H2 Ueberschrift mit Keyword",
      "body": "300-500 Woerter pro Abschnitt. Detailliert, praktisch, mit konkreten Tipps. Absaetze durch Leerzeilen trennen."
    }
  ],
  "faqs": [
    {
      "question": "Haeufig gestellte Frage?",
      "answer": "Ausfuehrliche Antwort mit 50-100 Woertern."
    }
  ]
}

WICHTIG:
- Mindestens 5 Sections mit je 300-500 Woertern
- Mindestens 5 FAQs
- Deutsch, natuerlich, echte Tipps mit Mehrwert
- Keine Umlaute in slug
- Gesamtlaenge: mindestens 2.000 Woerter
- Urlaubfinder365.de als Referenz einbauen wo passend`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Claude API: ${res.status} ${err}` }, { status: 502 });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "Keine JSON-Antwort", raw: text }, { status: 500 });

    const cleaned = jsonMatch[0].replace(/,\s*([}\]])/g, "$1");
    return NextResponse.json(JSON.parse(cleaned));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
