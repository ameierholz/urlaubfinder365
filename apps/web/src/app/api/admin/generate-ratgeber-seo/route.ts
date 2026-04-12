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
  "seo_title": "Max. 58 Zeichen. Keyword am Anfang. Knackig, klickstark. Beispiel: 'Last Minute buchen – Wann sind Reisen am günstigsten?'",
  "seo_description": "Max. 155 Zeichen. Natürlicher Satz der Mehrwert verspricht. Kein Keyword-Stuffing. Beispiel: 'Erfahre den besten Buchungszeitpunkt für Last-Minute-Reisen und spare bis zu 40%. Mit konkreten Tipps und Preisvergleich.'",
  "lead": "2-3 packende Sätze als Einleitung. Machen Lust den Artikel zu lesen. Max. 60 Wörter. Sprich den Leser direkt an.",
  "hero_image_keyword": "Ein Suchbegriff für Unsplash der zum Thema passt, z.B. 'beach suitcase', 'cruise ship', 'family vacation'",
  "reading_time_min": "Geschätzte Lesezeit in Minuten (5-10)",
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
