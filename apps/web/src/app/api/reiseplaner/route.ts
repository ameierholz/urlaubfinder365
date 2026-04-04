import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/api-helpers";

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/** Versuche JSON zu reparieren: abgeschnittene Antworten, trailing commas etc. */
function tryParseJSON(raw: string): unknown | null {
  // 1. Direkter Versuch
  try { return JSON.parse(raw); } catch { /* weiter */ }

  // 2. Trailing commas entfernen (,] oder ,})
  let fixed = raw.replace(/,\s*([}\]])/g, "$1");
  try { return JSON.parse(fixed); } catch { /* weiter */ }

  // 3. Abgeschnittenes JSON: fehlende schließende Klammern ergänzen
  const opens  = (fixed.match(/[{[]/g) || []).length;
  const closes = (fixed.match(/[}\]]/g) || []).length;
  const missing = opens - closes;
  if (missing > 0) {
    // Finde die offenen Klammern in umgekehrter Reihenfolge
    const stack: string[] = [];
    for (const ch of fixed) {
      if (ch === "{" || ch === "[") stack.push(ch === "{" ? "}" : "]");
      else if (ch === "}" || ch === "]") stack.pop();
    }
    // Trailing comma vor dem Schließen entfernen
    fixed = fixed.replace(/,\s*$/, "");
    // Fehlende Klammern in umgekehrter Reihenfolge anhängen
    fixed += stack.reverse().join("");
    try { return JSON.parse(fixed); } catch { /* aufgeben */ }
  }

  return null;
}

export async function POST(req: NextRequest) {
  // Strenges Rate-Limiting: max 3 Anfragen pro Minute (teurer KI-API-Call)
  const limited = rateLimit(req, 3, 60_000);
  if (limited) return limited;

  try {
    const { ziel, tage, budget, reisende, monat, interessen, unterkunft } = await req.json();

    if (!ziel || !tage) {
      return NextResponse.json({ error: "Ziel und Reisedauer fehlen" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "KI nicht konfiguriert" }, { status: 503 });
    }

    const prompt = `Du bist ein erfahrener Urlaubsplaner. Erstelle einen detaillierten Reiseplan für folgende Reise:

**Urlaubsziel:** ${ziel}
**Reisedauer:** ${tage} Tage
**Reisende:** ${reisende} Person(en)
**Budget:** ${budget || "flexibel"} pro Person
**Reisemonat:** ${monat || "nicht festgelegt"}
**Interessen:** ${interessen?.join(", ") || "allgemein"}
**Unterkunft:** ${unterkunft || "Hotel"}

Erstelle einen strukturierten Tagesplan im folgenden JSON-Format. WICHTIG: Antworte ausschließlich mit validem JSON, kein anderer Text davor oder danach. Achte auf korrekte JSON-Syntax (keine Trailing Commas, alle Strings in doppelten Anführungszeichen).

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
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // JSON aus der Antwort extrahieren
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Ungültige KI-Antwort" }, { status: 500 });
    }

    const reiseplan = tryParseJSON(jsonMatch[0]);
    if (!reiseplan) {
      console.error("JSON parse failed, raw length:", text.length, "stop_reason:", message.stop_reason);
      return NextResponse.json({ error: "KI-Antwort konnte nicht verarbeitet werden. Bitte erneut versuchen." }, { status: 500 });
    }

    return NextResponse.json({ reiseplan });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Urlaubsplaner API Error:", msg);
    return NextResponse.json({ error: "Serverfehler. Bitte erneut versuchen." }, { status: 500 });
  }
}
