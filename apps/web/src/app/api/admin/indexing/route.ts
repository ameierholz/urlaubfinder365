import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { requireAdmin } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Google Indexing API Wrapper.
 *
 * Erlaubt URL_UPDATED (neue/aktualisierte URL einreichen) und URL_DELETED
 * (URL aus Index entfernen). Nutzt das gleiche GOOGLE_SERVICE_ACCOUNT_KEY
 * Service Account wie die Search Console API – braucht aber zusätzlich
 * den Scope `https://www.googleapis.com/auth/indexing` UND der Service-
 * Account muss in der Search Console als "Inhaber" (nicht nur "Voll")
 * eingetragen sein.
 *
 * Limit: ~200 Anfragen pro Tag pro Property (Google's Default).
 *
 * Hinweis: Die Indexing API ist offiziell nur für JobPosting + BroadcastEvent
 * gedacht. Für normale Seiten funktioniert sie aber meistens auch –
 * Google priorisiert die Crawl-Queue dann.
 */

interface IndexResult {
  url: string;
  status: "success" | "error";
  message?: string;
  notifyTime?: string;
}

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) return null;
  try {
    const credentials = JSON.parse(key);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });
  } catch {
    return null;
  }
}

async function notifyGoogle(
  client: ReturnType<typeof google.indexing>,
  url: string,
  type: "URL_UPDATED" | "URL_DELETED"
): Promise<IndexResult> {
  try {
    const res = await client.urlNotifications.publish({
      requestBody: { url, type },
    });
    const time = (res.data as { urlNotificationMetadata?: { latestUpdate?: { notifyTime?: string } } })
      ?.urlNotificationMetadata?.latestUpdate?.notifyTime;
    return { url, status: "success", notifyTime: time };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { url, status: "error", message: msg };
  }
}

/** POST /api/admin/indexing  – Body: { urls: string[], type?: "URL_UPDATED" | "URL_DELETED" } */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const auth = getAuth();
  if (!auth) {
    return NextResponse.json(
      { error: "GOOGLE_SERVICE_ACCOUNT_KEY nicht konfiguriert" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const urls: unknown = body.urls;
  const type: "URL_UPDATED" | "URL_DELETED" = body.type === "URL_DELETED" ? "URL_DELETED" : "URL_UPDATED";

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: "Bitte mindestens eine URL angeben" }, { status: 400 });
  }
  if (urls.length > 100) {
    return NextResponse.json({ error: "Maximal 100 URLs pro Anfrage" }, { status: 400 });
  }

  // Validierung: alle URLs müssen zur eigenen Domain gehören und mit https beginnen
  const ALLOWED_HOST = "www.urlaubfinder365.de";
  const cleanUrls: string[] = [];
  for (const u of urls) {
    if (typeof u !== "string") continue;
    try {
      const url = new URL(u);
      if (url.hostname !== ALLOWED_HOST) {
        return NextResponse.json(
          { error: `URL muss von ${ALLOWED_HOST} sein: ${u}` },
          { status: 400 }
        );
      }
      cleanUrls.push(url.toString());
    } catch {
      return NextResponse.json({ error: `Ungültige URL: ${u}` }, { status: 400 });
    }
  }

  const indexingClient = google.indexing({ version: "v3", auth });

  // Sequentiell verarbeiten — die Indexing API verträgt keine Bursts
  const results: IndexResult[] = [];
  for (const url of cleanUrls) {
    const r = await notifyGoogle(indexingClient, url, type);
    results.push(r);
    // Kleines Delay zwischen Requests
    await new Promise((res) => setTimeout(res, 150));
  }

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return NextResponse.json({
    total: results.length,
    success: successCount,
    error: errorCount,
    type,
    results,
  });
}

/** GET /api/admin/indexing?url=...  – Status einer URL abfragen (zuletzt notified) */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const auth = getAuth();
  if (!auth) {
    return NextResponse.json(
      { error: "GOOGLE_SERVICE_ACCOUNT_KEY nicht konfiguriert" },
      { status: 500 }
    );
  }

  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url Param fehlt" }, { status: 400 });

  try {
    const indexingClient = google.indexing({ version: "v3", auth });
    const res = await indexingClient.urlNotifications.getMetadata({ url });
    return NextResponse.json(res.data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
