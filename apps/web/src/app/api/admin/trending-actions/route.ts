import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY fehlt" }, { status: 500 });

  const { keywords } = await req.json() as {
    keywords: { keyword: string; position: number; impressions: number; growth: number }[];
  };
  if (!keywords?.length) return NextResponse.json({ error: "Keine Keywords" }, { status: 400 });

  // Alle bekannten Seiten laden
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: pages } = await supabase
    .from("page_seo_meta")
    .select("page_path, meta_title, focus_keyword");

  const pageList = (pages ?? []).map((p: { page_path: string; meta_title: string | null; focus_keyword: string | null }) =>
    `${p.page_path} | ${p.focus_keyword || ""} | ${p.meta_title || ""}`
  ).join("\n");

  const kwList = keywords.map((k) =>
    `- "${k.keyword}" (Pos ${k.position}, ${k.impressions} Impr., +${k.growth}%)`
  ).join("\n");

  const prompt = `Du bist SEO-Experte fuer urlaubfinder365.de (deutsches Reiseportal).

Hier sind die Trending-Keywords (steigende Impressionen in Google):
${kwList}

Hier sind alle bekannten Seiten mit Focus-Keyword:
${pageList}

Analysiere jedes Trending-Keyword und erstelle eine Empfehlung:
1. Finde die passendste bestehende Seite (oder "null" wenn keine passt)
2. Gib eine konkrete, kurze Handlungsempfehlung (max 100 Zeichen)
3. Setze die Prioritaet: "hoch" (Pos 5-15, hohe Impressionen), "mittel" (Pos 15-30), "niedrig" (Pos 30+)

Antworte NUR mit JSON-Array:
[
  {
    "keyword": "das keyword",
    "matchedPage": "/pfad/zur/seite" oder null,
    "action": "Keyword in H2 einbauen, Content um 500 Woerter erweitern",
    "priority": "hoch"
  }
]`;

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
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Claude API: ${res.status} ${err}` }, { status: 502 });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return NextResponse.json({ error: "Keine JSON-Antwort" }, { status: 500 });

    const actions = JSON.parse(jsonMatch[0].replace(/,\s*([}\]])/g, "$1"));
    return NextResponse.json({ actions });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
