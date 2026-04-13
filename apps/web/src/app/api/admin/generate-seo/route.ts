import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/admin/generate-seo
 * Generiert SEO-Meta-Daten + Textblöcke für eine Seite via Claude API.
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

  const prompt = `Du bist ein SEO-Experte und Texter für urlaubfinder365.de – ein deutsches Reiseportal für Pauschalreisen, Last-Minute, Hotels, Flüge und Kreuzfahrten.

Generiere optimale SEO-Daten und Textblöcke für folgende Seite:
- Seiten-Pfad: ${pagePath}
${pageTitle ? `- Aktueller Titel: ${pageTitle}` : ""}
- Domain: urlaubfinder365.de

SEITENAUFBAU:
1. seo_intro → direkt unter dem Hero-Bild (kurzer Einstieg)
2. seo_h2_middle + seo_middle → Infoblock in der Seitenmitte (vor Hauptinhalten)
3. seo_h2_bottom + seo_bottom → langer Ratgeber-Text ganz unten (Hauptteil für SEO)

Antworte AUSSCHLIESSLICH mit folgendem JSON (kein Markdown, keine Erklärung):
{
  "meta_title": "Max. 58 Zeichen. KEINE Jahreszahl. Hauptkeyword am Anfang. Natürliche Sprache.",
  "meta_description": "Max. 150 Zeichen. Natürliche Sprache, nutzerfokussiert. KEINE Sonderzeichen wie ✓ oder Pipes. Beispiel: 'Günstig Pauschalreisen vergleichen und zum Bestpreis buchen. Preisverlauf & Buchungsempfehlung inklusive.'",
  "focus_keyword": "Das meistgesuchte Keyword für diese Seite (höchstes Suchvolumen).",
  "additional_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "og_title": "Max. 60 Zeichen, emotionaler als meta_title.",
  "og_description": "Max. 200 Zeichen, Social-Media-optimiert, neugierig machend.",
  "og_image_suggestion": "Beschreibung des idealen OG-Bildes: Motiv, Stimmung, Format 1200×630.",
  "seo_intro": "3-4 emotionale Sätze die Lust auf das Thema machen. Echte Vorteile, keine Floskeln. 80-120 Wörter.",
  "seo_h2_middle": "Kurze H2 mit Keyword, passend zur Seitenmitte.",
  "seo_middle": "3-5 Absätze (durch \\n\\n getrennt). Informativ, mit Keywords. 300-400 Wörter.",
  "seo_h2_bottom": "H2 mit Ratgeber-Charakter, z.B. 'Der große Ratgeber: Tipps & Hintergrundwissen'",
  "seo_bottom": "8-12 Absätze (durch \\n\\n getrennt). Umfassender Ratgeber-Text: Was ist das?, Vorteile, konkrete Tipps, Preise/Kosten, FAQ-Antworten, Vergleiche, Beispiele, Erfahrungswerte, Buchungstipps, Call-to-Action. 800-1000 Wörter. DIES IST DER LÄNGSTE UND WICHTIGSTE TEXTBLOCK."
}

WICHTIG:
- Deutsch, natürlicher Lesefluss
- seo_bottom MUSS der mit Abstand längste Text sein (800-1000 Wörter)
- Gesamtwortzahl seo_intro + seo_middle + seo_bottom: MINDESTENS 1500 Wörter
- Keywords natürlich einbauen (kein Stuffing)
- Echte Fakten und Tipps`;

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
    if (!jsonMatch) {
      return NextResponse.json({ error: "Keine JSON-Antwort von Claude", raw: text }, { status: 500 });
    }

    const seo = JSON.parse(jsonMatch[0]);
    return NextResponse.json(seo);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
