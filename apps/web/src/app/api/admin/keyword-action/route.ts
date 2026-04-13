import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/admin/keyword-action
 * Generiert KI-gestützte Maßnahmen für ein Keyword basierend auf der Performance.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });
  }

  const { keyword, position, change, type } = await req.json();
  if (!keyword) {
    return NextResponse.json({ error: "keyword fehlt" }, { status: 400 });
  }

  const isWinner = type === "winner";

  const prompt = isWinner
    ? `Du bist SEO-Berater für urlaubfinder365.de (deutsches Reiseportal).

Das Keyword "${keyword}" ist ein GEWINNER:
- Aktuelle Position: ${position}
- Positions-Gewinn: +${Math.abs(change)} Plätze

Erstelle eine kurze, konkrete Maßnahmen-Liste (max. 5 Punkte) um diesen Erfolg auszubauen:
1. Wie können wir die Position weiter verbessern?
2. Welche Content-Erweiterungen machen Sinn?
3. Welche Backlink-Strategie passt?
4. Gibt es Related Keywords die wir auch abdecken sollten?

Schreibe prägnant auf Deutsch, keine Einleitung, direkt die Maßnahmen mit Emoji-Bullets.`
    : `Du bist SEO-Berater für urlaubfinder365.de (deutsches Reiseportal).

Das Keyword "${keyword}" ist ein VERLIERER:
- Aktuelle Position: ${position}
- Positions-Verlust: ${change} Plätze

Erstelle eine kurze, konkrete Rettungs-Maßnahmen-Liste (max. 5 Punkte):
1. Was sind die wahrscheinlichsten Ursachen für den Verlust?
2. Welche sofortigen On-Page-Maßnahmen helfen?
3. Wie können wir den Content verbessern?
4. Brauchen wir mehr Backlinks oder interne Links?
5. Welche Quick-Wins gibt es?

Schreibe prägnant auf Deutsch, keine Einleitung, direkt die Maßnahmen mit Emoji-Bullets.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "Keine Vorschläge generiert.";

    return NextResponse.json({ suggestion: text });
  } catch {
    return NextResponse.json({ error: "KI-Fehler" }, { status: 500 });
  }
}
