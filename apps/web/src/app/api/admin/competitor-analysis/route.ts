import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 45;

interface Competitor {
  name: string;
  url: string;
  strengths: string[];
}

interface AnalysisResult {
  competitors: Competitor[];
  recommendations: string[];
  contentGaps: string[];
  suggestedTitle: string;
  suggestedH1: string;
}

interface OverviewResult {
  marktposition: string;
  hauptkonkurrenten: Array<{
    name: string;
    url: string;
    staerken: string[];
    schwaeche: string;
  }>;
  topKeywords: Array<{
    keyword: string;
    schwierigkeit: "hoch" | "mittel" | "niedrig";
    potenzial: "hoch" | "mittel" | "niedrig";
    monatlicheSuchen: string;
  }>;
  sofortmassnahmen: string[];
  contentLuecken: string[];
  wettbewerbsvorteile: string[];
}

function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  return (start !== -1 && end !== -1) ? text.slice(start, end + 1) : text;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { keyword, mode } = body as { keyword?: string; mode?: string };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });
  const system = "Du antwortest ausschließlich mit validem JSON. Kein erklärender Text, kein Markdown, keine Codeblöcke. Nur das rohe JSON-Objekt.";

  // ── OVERVIEW MODE ──────────────────────────────────────────────────────────
  if (mode === "overview") {
    const prompt = `Du bist ein SEO-Experte. Analysiere den deutschen Online-Reisemarkt für urlaubfinder365.de.

urlaubfinder365.de ist ein neues deutsches Reiseportal mit:
- Pauschalreisen, Last Minute, All Inclusive Vergleich
- 250+ Reiseziele mit eigenen Seiten
- Aktivitäten & Tickets über Tiqets
- Community-Features, Urlaubsguides, Magazin
- Konkurrenz: Check24, TUI, Holidaycheck, ab-in-den-urlaub, lastminute.de, Expedia, Booking.com

Antworte mit exakt diesem JSON:
{
  "marktposition": "2-3 Sätze zur aktuellen Marktposition eines neuen Reiseportals vs. etablierte Player",
  "hauptkonkurrenten": [
    {
      "name": "Seitenname",
      "url": "https://...",
      "staerken": ["Stärke 1", "Stärke 2", "Stärke 3"],
      "schwaeche": "Hauptschwäche die urlaubfinder365.de ausnutzen kann"
    }
  ],
  "topKeywords": [
    {
      "keyword": "keyword text",
      "schwierigkeit": "hoch",
      "potenzial": "hoch",
      "monatlicheSuchen": "ca. 50.000"
    }
  ],
  "sofortmassnahmen": ["Maßnahme 1", "Maßnahme 2", "Maßnahme 3", "Maßnahme 4", "Maßnahme 5"],
  "contentLuecken": ["Lücke 1", "Lücke 2", "Lücke 3", "Lücke 4", "Lücke 5"],
  "wettbewerbsvorteile": ["Vorteil 1", "Vorteil 2", "Vorteil 3"]
}

Gib mindestens 6 Hauptkonkurrenten und 12 Top-Keywords zurück. Keywords sollen real und relevant für den deutschen Reisemarkt sein.`;

    try {
      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        system,
        messages: [{ role: "user", content: prompt }],
      });

      const content = message.content[0];
      if (content.type !== "text") {
        return NextResponse.json({ error: "Unerwartete Antwort von Claude" }, { status: 500 });
      }

      const result: OverviewResult = JSON.parse(extractJson(content.text.trim()));
      return NextResponse.json({ mode: "overview", ...result });
    } catch (err) {
      if (err instanceof SyntaxError) {
        return NextResponse.json({ error: "Claude-Antwort konnte nicht als JSON geparst werden" }, { status: 500 });
      }
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  // ── KEYWORD MODE ───────────────────────────────────────────────────────────
  if (!keyword || typeof keyword !== "string") {
    return NextResponse.json({ error: "keyword fehlt" }, { status: 400 });
  }

  const prompt = `Analysiere die Google-Suchergebnisse für "${keyword}" im deutschen Markt. Welche Seiten ranken in den Top 10? Was machen Check24, HolidayCheck, TUI, ab-in-den-urlaub anders? Was braucht urlaubfinder365.de um in die Top 5 zu kommen?

Gib exakt dieses JSON zurück:
{
  "competitors": [
    {"name": "Seitenname", "url": "https://...", "strengths": ["Stärke 1", "Stärke 2"]}
  ],
  "recommendations": ["Empfehlung 1", "Empfehlung 2"],
  "contentGaps": ["Content-Lücke 1", "Content-Lücke 2"],
  "suggestedTitle": "Vorgeschlagener Meta-Title für urlaubfinder365.de (max. 60 Zeichen)",
  "suggestedH1": "Vorgeschlagene H1 für urlaubfinder365.de"
}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unerwartete Antwort von Claude" }, { status: 500 });
    }

    const result: AnalysisResult = JSON.parse(extractJson(content.text.trim()));
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "Claude-Antwort konnte nicht als JSON geparst werden" }, { status: 500 });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
