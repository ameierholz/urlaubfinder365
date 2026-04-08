import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });

  const { slug, name, country } = await req.json();
  if (!name) return NextResponse.json({ error: "name fehlt" }, { status: 400 });

  const prompt = `Du bist ein erfahrener Reise-SEO-Texter für urlaubfinder365.de.

Erstelle drei SEO-Textblöcke für die Destination-Seite /urlaubsziele/${slug}/:
- Destination: ${name}
${country ? `- Land: ${country}` : ""}

Recherchiere mental: Was suchen Urlauber zu "${name}"? Welche Infos bieten Check24, HolidayCheck, TUI, ab-in-den-urlaub? Schreibe BESSERE, informativere Texte.

Antworte AUSSCHLIESSLICH mit folgendem JSON:
{
  "seo_intro": "2-3 emotionale Sätze die Lust auf ${name} machen. Keine Floskeln, echte Highlights.",
  "seo_h2_middle": "H2-Überschrift mit Keyword '${name} Urlaub' oder '${name} Reise'",
  "seo_middle": "3-4 Absätze (durch \\n\\n getrennt):\\n\\n1. Beste Reisezeit & Klima\\n\\n2. Top-Strände/Sehenswürdigkeiten\\n\\n3. Aktivitäten & Ausflüge\\n\\n4. Kulinarik & Insider-Tipps\\n\\nInsgesamt 200-300 Wörter, natürlich, informativ, mit Keywords.",
  "seo_h2_bottom": "H2-Überschrift mit CTA-Charakter, z.B. '${name}-Urlaub günstig buchen'",
  "seo_bottom": "2-3 Absätze (durch \\n\\n getrennt):\\n\\n1. Warum bei Urlaubfinder365 buchen (Preisvergleich, Preisalarm)\\n\\n2. Pauschalreise-Vorteile\\n\\n3. Call-to-Action\\n\\nInsgesamt 100-150 Wörter."
}

WICHTIG:
- Deutsch, natürlicher Lesefluss
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
        max_tokens: 2048,
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
