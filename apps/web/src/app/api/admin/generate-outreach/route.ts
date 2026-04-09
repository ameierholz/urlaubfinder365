import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY nicht konfiguriert" },
      { status: 500 }
    );

  const { targetUrl, targetName, purpose } = await req.json();
  if (!targetUrl)
    return NextResponse.json({ error: "targetUrl fehlt" }, { status: 400 });

  const purposeLabel =
    purpose === "kooperation"
      ? "Kooperation / Partnerschaft"
      : purpose === "linktausch"
        ? "Link-Tausch"
        : "Gastbeitrag";

  const prompt = `Du bist ein freundlicher, professioneller Outreach-Experte für das Reiseportal urlaubfinder365.de.

Zielmedium: ${targetName || targetUrl}
URL: ${targetUrl}
Zweck: ${purposeLabel}

Schreibe eine personalisierte, authentische Outreach-E-Mail auf Deutsch für urlaubfinder365.de.

Anforderungen:
- Professionell aber menschlich – NICHT spammy oder generisch
- Zeige echtes Interesse am Blog/Medium
- Klarer Mehrwert für den Empfänger
- Konkrete Handlungsaufforderung
- Max. 200 Wörter für den E-Mail-Body

Antworte AUSSCHLIESSLICH mit folgendem JSON:
{
  "subject": "Betreff der E-Mail (max. 60 Zeichen, neugierig machend)",
  "emailBody": "Der vollständige E-Mail-Text mit Anrede, Body und Signatur. Nutze \\n für Zeilenumbrüche.",
  "topicSuggestions": [
    "Konkreter Gastbeitrag-Themenvorschlag 1 (passend zum Reiseportal-Thema)",
    "Konkreter Gastbeitrag-Themenvorschlag 2",
    "Konkreter Gastbeitrag-Themenvorschlag 3"
  ]
}

Signatur: "Mit freundlichen Grüßen,\\nDas Team von Urlaubfinder365\\nhttps://www.urlaubfinder365.de"`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await res.json();
    const raw = data.content?.[0]?.text ?? "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      return NextResponse.json({ error: "Kein JSON in Antwort" }, { status: 500 });

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
