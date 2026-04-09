import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

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

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();
  if (!keyword || typeof keyword !== "string") {
    return NextResponse.json({ error: "keyword fehlt" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `Analysiere die Google-Suchergebnisse für "${keyword}" im deutschen Markt. Welche Seiten ranken in den Top 10? Was machen Check24, HolidayCheck, TUI, ab-in-den-urlaub anders? Was braucht urlaubfinder365.de um in die Top 5 zu kommen?

Antworte ausschließlich als valides JSON ohne Markdown-Codeblöcke:
{
  "competitors": [
    {"name": "Seitenname", "url": "https://...", "strengths": ["Stärke 1", "Stärke 2"]}
  ],
  "recommendations": ["Empfehlung 1", "Empfehlung 2"],
  "contentGaps": ["Content-Lücke 1", "Content-Lücke 2"],
  "suggestedTitle": "Vorgeschlagener Meta-Title für urlaubfinder365.de",
  "suggestedH1": "Vorgeschlagene H1 für urlaubfinder365.de"
}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unerwartete Antwort von Claude" }, { status: 500 });
    }

    let text = content.text.trim();
    // Strip Markdown code block if present
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    const result: AnalysisResult = JSON.parse(text);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "Claude-Antwort konnte nicht als JSON geparst werden" }, { status: 500 });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
