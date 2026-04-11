import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });

  const { slug, name, country } = await req.json();
  if (!name) return NextResponse.json({ error: "name fehlt" }, { status: 400 });

  const prompt = `Du bist ein erfahrener Reise-SEO-Texter für urlaubfinder365.de.

Erstelle SEO-Textblöcke für die Destination-Seite /urlaubsziele/${slug}/:
- Destination: ${name}
${country ? `- Land: ${country}` : ""}

SEITENAUFBAU (von oben nach unten):
1. seo_intro → direkt unter dem Hero-Bild
2. seo_h2_middle + seo_middle → kurzer Infoblock VOR dem Aktivitäten-Bereich
3. [Aktivitäten & Tickets Sektion]
4. seo_h2_bottom + seo_bottom → langer Reiseführer-Text GANZ UNTEN (nach Aktivitäten, Karte etc.)

Antworte AUSSCHLIESSLICH mit folgendem JSON:
{
  "meta_title": "Max. 58 Zeichen. KEIN JAHRESZAHL (wird automatisch ergänzt). Keyword '${name} Urlaub' am Anfang. Beispiel: '${name} Urlaub – Günstige Pauschalreisen & Deals'",
  "meta_description": "Max. 150 Zeichen. Natürliche Sprache, destination-fokussiert – was will jemand der nach '${name} Urlaub' sucht wissen? Nutzen statt Feature-Listen. Keine ✓-Zeichen. Beispiel: 'Günstige ${name} Pauschalreisen entdecken. Preise vergleichen, besten Buchungszeitpunkt finden und traumhaften Urlaub buchen.'",
  "focus_keyword": "Das meistgesuchte Keyword für dieses Ziel – prüfe mental: Was tippen die meisten Urlauber bei Google ein wenn sie ${name} buchen wollen? Meist '${name} Urlaub' oder '${name} Pauschalreise' oder '${name} All Inclusive' – nimm das volumenstärkste.",
  "keywords": "6-8 weitere Keywords nach Suchvolumen geordnet, kommagetrennt. Varianten: Pauschalreise, All Inclusive, Last Minute, günstig, buchen, Angebote.",
  "seo_intro": "2-3 emotionale Sätze die Lust auf ${name} machen. Echte Highlights, keine Floskeln. Max. 80 Wörter.",
  "seo_h2_middle": "Kurze H2 mit Keyword, z.B. '${name} – Was dich erwartet'",
  "seo_middle": "2-3 Absätze (durch \\n\\n getrennt). Klima, beste Reisezeit, 2-3 Top-Sehenswürdigkeiten oder Highlights. 150-200 Wörter.",
  "seo_h2_bottom": "H2 mit Reiseführer-Charakter, z.B. '${name} Reiseführer: Tipps, Strände & Insiderwissen'",
  "seo_bottom": "5-7 Absätze (durch \\n\\n getrennt):\\n\\n1. Beste Reisezeit & Klima (ausführlich)\\n\\n2. Top-Strände oder Sehenswürdigkeiten (mit Details)\\n\\n3. Aktivitäten & Ausflugstipps\\n\\n4. Kulinarik & lokale Besonderheiten\\n\\n5. Unterkünfte & Hotels (Typen)\\n\\n6. Anreise & praktische Tipps\\n\\n7. Buchungstipp + Call-to-Action\\n\\nInsgesamt 500-600 Wörter. WICHTIG: Dies muss der längste Textblock sein."
}

WICHTIG:
- Deutsch, natürlicher Lesefluss
- seo_bottom MUSS der längste Text sein (500-600 Wörter)
- Gesamtwortzahl seo_intro + seo_middle + seo_bottom: mindestens 850 Wörter
- Keywords natürlich einbauen: "${name} Urlaub", "Pauschalreise ${name}", "${name} buchen", "günstig"
- KEIN Keyword-Stuffing
- Einzigartig (nicht generisch/austauschbar)
- Echte Fakten und Tipps, keine Platitüden`;

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
        max_tokens: 4500,
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
