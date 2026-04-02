import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { ziel, tage, budget, reisende, monat, interessen, unterkunft } = await req.json();

    if (!ziel || !tage) {
      return NextResponse.json({ error: "Ziel und Reisedauer fehlen" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "KI nicht konfiguriert" }, { status: 503 });
    }

    const prompt = `Du bist ein erfahrener Reiseplaner. Erstelle einen detaillierten Reiseplan für folgende Reise:

**Reiseziel:** ${ziel}
**Reisedauer:** ${tage} Tage
**Reisende:** ${reisende} Person(en)
**Budget:** ${budget || "flexibel"} pro Person
**Reisemonat:** ${monat || "nicht festgelegt"}
**Interessen:** ${interessen?.join(", ") || "allgemein"}
**Unterkunft:** ${unterkunft || "Hotel"}

Erstelle einen strukturierten Tagesplan im folgenden JSON-Format (nur JSON, kein anderer Text):

{
  "zusammenfassung": "2-3 Sätze Überblick über die Reise",
  "highlights": ["Top-Highlight 1", "Top-Highlight 2", "Top-Highlight 3"],
  "tage": [
    {
      "tag": 1,
      "titel": "Ankunft & erste Erkundung",
      "aktivitaeten": [
        {
          "zeit": "Vormittag",
          "titel": "Aktivität",
          "beschreibung": "Kurze Beschreibung was man dort macht und warum es empfehlenswert ist",
          "kosten": "ca. X €",
          "tipp": "Insider-Tipp"
        }
      ]
    }
  ],
  "praktische_tipps": [
    { "kategorie": "Anreise", "tipp": "..." },
    { "kategorie": "Unterkunft", "tipp": "..." },
    { "kategorie": "Essen", "tipp": "..." },
    { "kategorie": "Sicherheit", "tipp": "..." },
    { "kategorie": "Budget", "tipp": "..." }
  ],
  "beste_reisezeit": "Wann ist die beste Zeit für diese Reise und warum",
  "gesamtbudget_schaetzung": "Schätzung der Gesamtkosten für ${reisende} Person(en) für ${tage} Tage"
}

Erstelle für jeden der ${tage} Tage mindestens 3 Aktivitäten (Vormittag, Nachmittag, Abend). Sei konkret, nenne echte Sehenswürdigkeiten, Restaurants und Aktivitäten. Antworte ausschließlich auf Deutsch.`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // JSON aus der Antwort extrahieren
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Ungültige KI-Antwort" }, { status: 500 });
    }

    const reiseplan = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ reiseplan });

  } catch (e) {
    console.error("Reiseplaner API Error:", e);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
