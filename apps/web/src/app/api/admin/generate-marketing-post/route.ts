import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });

  const { platform, topic, destination, price, postType } = await req.json();
  if (!platform || !topic) return NextResponse.json({ error: "platform und topic fehlen" }, { status: 400 });

  const prompt = `Du bist Social-Media-Manager fuer urlaubfinder365.de, ein deutsches Reiseportal.

Erstelle einen fertigen Social-Media-Post:
- Plattform: ${platform}
- Thema: ${topic}
${destination ? `- Reiseziel: ${destination}` : ""}
${price ? `- Preis: ${price}` : ""}
- Post-Typ: ${postType || "post"}

Antworte AUSSCHLIESSLICH mit folgendem JSON:
{
  "title": "Kurzer interner Titel (max 50 Zeichen)",
  "caption": "Fertiger Post-Text mit klarer Struktur:\\n\\nErste Zeile: Aufmerksamkeits-Hook (emotional, Frage oder Statement)\\n\\nZweite Zeile: Leerzeile\\n\\nDann: Kernbotschaft mit Emojis als Aufzaehlungszeichen, z.B.:\\n🏖️ Punkt 1\\n✈️ Punkt 2\\n💰 Punkt 3\\n\\nAbschluss: Call-to-Action mit 👉 oder Link in Bio\\n\\nWICHTIG: Verwende Emojis als visuelle Strukturelemente (🏖️ 💰 ✈️ ⭐ 🔥 👉 ☀️ 🌍 🤖 📊). Jeder Absatz durch Leerzeile getrennt. Keine Umlaute (ue/ae/oe/ss).",
  "hashtags": "8-12 relevante Hashtags mit # getrennt durch Leerzeichen",
  "canva_template": "Welches Template: Bild-Post (1080x1080) / Karussell (1080x1080, 4-5 Slides) / Infografik (1080x1080) / Google Business",
  "canva_hint": "Detaillierte Schritt-fuer-Schritt Anleitung fuer Canva:\\n1. Welches Format (1080x1080 oder 1200x675)\\n2. Welchen Suchbegriff fuer Foto eingeben\\n3. Welcher Text als Overlay\\n4. Welche Farben (#1db682 gruen oder #6991d8 blau)\\n5. Bei Karussell: Was kommt auf welchen Slide"
}

WICHTIG:
- Deutsch, locker, direkte Ansprache (du/ihr)
- Keine Umlaute (ue statt ue, ae statt ae, oe statt oe, ss statt ss)
- Gut strukturiert mit Leerzeilen und Emojis
- Call-to-Action am Ende
- KEINE Reels, KEINE Videos, KEINE TikTok — nur Grafiken, Bilder und Karussells
- Bei Infografik: Canva-Hint muss Grafik-Layout beschreiben (Hintergrund, Text-Anordnung, Icons)
- Bei Karussell: Canva-Hint muss pro Slide beschreiben was drauf kommt
- Bei Google Business: formeller (Sie statt du), keine Hashtags, keine Emojis`;

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
        max_tokens: 1500,
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
