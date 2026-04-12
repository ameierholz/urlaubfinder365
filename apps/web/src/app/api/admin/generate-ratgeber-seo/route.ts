import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });

  const { slug, title, category, existingLead } = await req.json();
  if (!slug || !title) return NextResponse.json({ error: "slug und title fehlen" }, { status: 400 });

  const prompt = `Du bist ein erfahrener Reise-SEO-Texter für urlaubfinder365.de.

Erstelle einen vollständigen Ratgeber-Artikel für die Seite /ratgeber/${slug}/:
- Titel: "${title}"
- Kategorie: ${category || "Allgemein"}
${existingLead ? `- Bestehender Lead: "${existingLead}"` : ""}

Der Artikel soll ein umfassender, suchmaschinenoptimierter Reise-Ratgeber sein.

Antworte AUSSCHLIESSLICH mit folgendem JSON:
{
  "seo_title": "Max. 58 Zeichen. Keyword am Anfang. Knackig, klickstark.",
  "seo_description": "Max. 155 Zeichen. Natürlicher Satz der Mehrwert verspricht.",
  "focus_keyword": "Das meistgesuchte Keyword zum Thema – was tippen Nutzer bei Google ein?",
  "keywords": "6-8 weitere Keywords kommagetrennt, nach Suchvolumen geordnet.",
  "lead": "2-3 packende Sätze als Einleitung. Max. 60 Wörter. Direkte Ansprache.",
  "reading_time_min": "Geschätzte Lesezeit in Minuten (5-10)",
  "seo_intro": "2-3 emotionale Sätze direkt nach dem Hero-Bild. Max. 80 Wörter.",
  "seo_h2_middle": "Kurze H2 mit Keyword für die Seitenmitte",
  "seo_middle": "2-3 Absätze (durch \\n\\n getrennt). Kerninfos zum Thema. 150-200 Wörter.",
  "seo_h2_bottom": "H2 mit Ratgeber-Charakter für den unteren Bereich",
  "seo_bottom": "5-7 Absätze (durch \\n\\n getrennt). Ausführlicher Ratgeber-Text, 500-600 Wörter. MUSS der längste Textblock sein.",
  "sections": [
    {
      "heading": "Erste H2-Überschrift mit Keyword",
      "body": "2-3 Absätze mit konkreten Fakten, Zahlen, Tipps. 150-200 Wörter. Durch \\n\\n getrennt."
    },
    {
      "heading": "Zweite H2-Überschrift",
      "body": "Weiterer Abschnitt mit praktischem Mehrwert. 150-200 Wörter."
    },
    {
      "heading": "Dritte H2-Überschrift",
      "body": "Vertiefung oder Vergleich. 150-200 Wörter."
    },
    {
      "heading": "Vierte H2-Überschrift",
      "body": "Tipps, Empfehlungen oder Fazit. 150-200 Wörter."
    },
    {
      "heading": "Fünfte H2-Überschrift",
      "body": "Zusätzlicher Abschnitt. 100-150 Wörter."
    },
    {
      "heading": "Sechste H2-Überschrift (optional, bei komplexen Themen)",
      "body": "Ergänzender Abschnitt. 100-150 Wörter."
    }
  ],
  "faqs": [
    { "question": "Häufig gestellte Frage 1?", "answer": "Ausführliche Antwort, 2-4 Sätze." },
    { "question": "Häufig gestellte Frage 2?", "answer": "Ausführliche Antwort, 2-4 Sätze." },
    { "question": "Häufig gestellte Frage 3?", "answer": "Ausführliche Antwort, 2-4 Sätze." },
    { "question": "Häufig gestellte Frage 4?", "answer": "Ausführliche Antwort, 2-4 Sätze." }
  ]
}

WICHTIG:
- Deutsch, natürlicher Lesefluss, Du-Ansprache
- 5-6 Sections mit je 150-200 Wörtern = Gesamt mind. 800 Wörter
- 4 FAQs die echte Fragen beantworten (gut für Google Featured Snippets)
- Konkrete Zahlen, Fakten, Preise wo möglich
- Keine generischen Floskeln
- Keywords natürlich einbauen
- Jede Section hat einen klaren Mehrwert`;

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
        max_tokens: 6000,
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
