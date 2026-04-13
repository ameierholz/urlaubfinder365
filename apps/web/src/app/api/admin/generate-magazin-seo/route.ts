import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });

  const { title, category, excerpt } = await req.json();
  if (!title) return NextResponse.json({ error: "title fehlt" }, { status: 400 });

  const prompt = `Du bist ein erfahrener Reise-SEO-Texter für urlaubfinder365.de.

Erstelle SEO-optimierte Metadaten und einen Teaser für einen Magazin-Artikel:
- Titel: "${title}"
- Kategorie: ${category || "Reise"}
${excerpt ? `- Bestehender Teaser: "${excerpt}"` : ""}

Antworte AUSSCHLIESSLICH mit folgendem JSON:
{
  "meta_title": "Max. 58 Zeichen. Keyword am Anfang. Klickstark, nicht generisch.",
  "meta_description": "Max. 155 Zeichen. Natürlicher Satz der Mehrwert verspricht und zum Klicken einlädt.",
  "focus_keyword": "Das meistgesuchte Keyword zum Thema – was tippen Nutzer bei Google ein?",
  "keywords": "6-8 weitere Keywords kommagetrennt, nach Suchvolumen geordnet.",
  "excerpt": "2-3 packende Sätze als Teaser. Max. 60 Wörter. Machen Lust den Artikel zu lesen.",
  "og_title": "Social-Media-Titel. Etwas lockerer/emotionaler als der Meta-Title. Max. 60 Zeichen.",
  "og_description": "Social-Media-Beschreibung. 1-2 Sätze die zum Teilen einladen. Max. 120 Zeichen.",
  "content_outline": "Vollständiger Markdown-Artikel mit mindestens 1500 Wörtern. Format:\\n\\n## Überschrift 1 (mit Keyword)\\n\\n3-4 Absätze mit 200-300 Wörtern. Konkrete Fakten, Zahlen, Tipps.\\n\\n## Überschrift 2\\n\\n3-4 Absätze, 200-300 Wörter.\\n\\n## Überschrift 3\\n\\n3-4 Absätze, 200-300 Wörter.\\n\\n## Überschrift 4\\n\\nWeiterer Abschnitt.\\n\\n## Überschrift 5\\n\\nWeiterer Abschnitt.\\n\\n## Fazit\\n\\nZusammenfassung + Call-to-Action.\\n\\nDer LETZTE Abschnitt muss der LÄNGSTE sein (400-500 Wörter) – das ist entscheidend für SEO."
}

WICHTIG:
- Deutsch, natürlicher Lesefluss, Du-Ansprache
- content_outline = VOLLSTÄNDIGER Artikel, KEIN Outline — mindestens 1500 Wörter
- Der letzte Abschnitt muss der längste sein (SEO-Haupttext)
- Echte Fakten, Zahlen, Preise, Beispiele — keine Platzhalter
- Keywords natürlich einbauen (kein Stuffing)
- Focus-Keyword = das, was Nutzer am häufigsten googeln`;

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

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Claude API: ${res.status} ${err}` }, { status: 502 });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "Keine JSON-Antwort", raw: text }, { status: 500 });

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
