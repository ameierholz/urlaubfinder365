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
  "caption": "Fertiger Post-Text. Direkte Ansprache, locker, mit Emojis sparsam. Keine Umlaute (ae statt ae, ue statt ue etc). Bei Instagram/TikTok: Link in Bio erwaehnen. Bei Facebook: direkten Link einbauen.",
  "hashtags": "8-12 relevante Hashtags mit # getrennt durch Leerzeichen",
  "canva_template": "Welches Template: Deal Post / Karussell Slide / Story Reel Cover / Facebook Link / Google Business",
  "canva_hint": "Kurze Anleitung fuer das Canva-Bild: Welches Foto, welcher Text drauf, welche Farben"
}

WICHTIG:
- Deutsch, locker, direkte Ansprache (du/ihr)
- Keine Umlaute (ue statt ü, ae statt ä, oe statt ö, ss statt ß)
- Kurz und knackig (max 150 Woerter)
- Call-to-Action am Ende
- Bei Google Business: formeller (Sie statt du), keine Hashtags`;

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
