import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const maxDuration = 300;

const WEEK_TEMPLATE = [
  { day: 0, platform: "instagram", post_type: "reel",      time: "18:00" },
  { day: 0, platform: "tiktok",    post_type: "video",     time: "19:00" },
  { day: 1, platform: "facebook",  post_type: "bild",      time: "12:00" },
  { day: 2, platform: "google",    post_type: "angebot",   time: null    },
  { day: 2, platform: "instagram", post_type: "karussell", time: "18:00" },
  { day: 3, platform: "facebook",  post_type: "text",      time: "12:00" },
  { day: 4, platform: "instagram", post_type: "reel",      time: "18:00" },
  { day: 4, platform: "tiktok",    post_type: "video",     time: "19:00" },
  { day: 5, platform: "facebook",  post_type: "bild",      time: "12:00" },
  { day: 6, platform: "instagram", post_type: "reel",      time: "19:00" },
] as const;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });

  // Auth check
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle() as { data: { role: string } | null };
    if (!profile || !["admin", "moderator"].includes(profile.role)) return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
  } catch {
    return NextResponse.json({ error: "Auth-Fehler" }, { status: 401 });
  }

  const { weekStartDate, theme } = await req.json();
  if (!weekStartDate) return NextResponse.json({ error: "weekStartDate fehlt" }, { status: 400 });

  const prompt = `Du bist Social-Media-Manager fuer urlaubfinder365.de (deutsches Reiseportal).

Erstelle 10 Social-Media-Posts fuer eine Woche zum Thema: "${theme || "Aktuelle Reisedeals und Tipps"}"

Die 10 Posts verteilen sich so:
1. Montag: Instagram Reel (Video 15-20 Sek)
2. Montag: TikTok Video (15-20 Sek)
3. Dienstag: Facebook Bild-Post
4. Mittwoch: Google Business Angebot
5. Mittwoch: Instagram Karussell (4-5 Slides)
6. Donnerstag: Facebook Engagement-Post
7. Freitag: Instagram Reel (Video 15-20 Sek)
8. Freitag: TikTok Video (15-20 Sek)
9. Samstag: Facebook Bild-Post
10. Sonntag: Instagram Reel (Video)

Antworte AUSSCHLIESSLICH mit folgendem JSON-Array:
[
  {
    "title": "Kurzer Titel (max 50 Zeichen)",
    "caption": "Gut strukturierter Text mit Emojis (🏖️ ✈️ 💰 ⭐ 🔥 👉 ☀️).\\nJeder Absatz durch Leerzeile getrennt.\\nKeine Umlaute (ue/ae/oe/ss verwenden).\\nHook am Anfang, CTA am Ende.",
    "hashtags": "#hashtag1 #hashtag2 (8-12 Stueck, immer #urlaubfinder365 dabei)",
    "link": "/urlaubsziele/antalya/ (passender Pfad auf urlaubfinder365.de)",
    "canva_hint": "Schritt-fuer-Schritt Canva-Anleitung:\\n1. Format\\n2. Suchbegriff fuer Foto/Video\\n3. Text-Overlay\\n4. Farben (#1db682 gruen, #6991d8 blau)\\n5. Bei Video: Szenen + Musik"
  }
]

WICHTIG:
- Genau 10 Posts im Array (Reihenfolge wie oben)
- Deutsch, locker, du/ihr (Google: Sie)
- Keine Umlaute
- Echte Preise: Tuerkei ab 399€, Mallorca ab 349€, Griechenland ab 389€, Aegypten ab 449€, Kreuzfahrt ab 599€
- TikTok + Instagram Reels: Canva-Hint MUSS Video-Anleitung mit Szenen sein
- Google Business: Formell, keine Emojis, keine Hashtags
- Jeder Post einzigartig, kein Copy-Paste`;

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
        max_tokens: 6000,
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
    if (!jsonMatch) return NextResponse.json({ error: "Keine JSON-Antwort", raw: text }, { status: 500 });

    const posts = JSON.parse(jsonMatch[0]) as Array<{
      title: string; caption: string; hashtags: string; link: string; canva_hint: string;
    }>;

    // In DB speichern
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY fehlt" }, { status: 500 });

    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, { auth: { persistSession: false } });
    const startDate = new Date(weekStartDate);

    const rows = posts.slice(0, 10).map((post, i) => {
      const tmpl = WEEK_TEMPLATE[i];
      const postDate = new Date(startDate);
      postDate.setDate(startDate.getDate() + tmpl.day);

      return {
        post_date: postDate.toISOString().slice(0, 10),
        platform: tmpl.platform,
        post_type: tmpl.post_type,
        title: post.title,
        caption: post.caption,
        hashtags: tmpl.platform === "google" ? null : post.hashtags,
        link: post.link || null,
        canva_template: tmpl.post_type === "reel" || tmpl.post_type === "video" ? "Reel Video" :
                        tmpl.post_type === "karussell" ? "Karussell Slide" :
                        tmpl.platform === "google" ? "Google Business" : "Deal Post",
        canva_hint: post.canva_hint,
        post_time: tmpl.time,
        status: "geplant",
      };
    });

    const { error } = await admin.from("marketing_posts").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, count: rows.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
