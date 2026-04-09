import { NextRequest, NextResponse } from "next/server";
import { google, searchconsole_v1 } from "googleapis";

export const runtime = "nodejs";
export const maxDuration = 30;

type SCRow = searchconsole_v1.Schema$ApiDataRow;

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) return null;
  const credentials = JSON.parse(key);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
}

async function query(sc: searchconsole_v1.Searchconsole, siteUrl: string, body: searchconsole_v1.Schema$SearchAnalyticsQueryRequest): Promise<SCRow[]> {
  const res = await sc.searchanalytics.query({ siteUrl, requestBody: body });
  return (res as { data: { rows?: SCRow[] } }).data.rows ?? [];
}

export async function GET(req: NextRequest) {
  const auth = getAuth();
  if (!auth) return NextResponse.json({ error: "GOOGLE_SERVICE_ACCOUNT_KEY nicht konfiguriert" }, { status: 500 });

  const sp = req.nextUrl.searchParams;
  const type = sp.get("type") ?? "overview";
  const days = parseInt(sp.get("days") ?? "28", 10);
  const siteUrl = "sc-domain:urlaubfinder365.de";

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const sc = google.searchconsole({ version: "v1", auth });

  try {
    switch (type) {
      case "overview": {
        const rows = await query(sc, siteUrl, {
          startDate: fmt(startDate), endDate: fmt(endDate),
          dimensions: ["date"], rowLimit: days,
        });

        let totalClicks = 0, totalImpressions = 0, totalPosition = 0;
        for (const r of rows) { totalClicks += r.clicks ?? 0; totalImpressions += r.impressions ?? 0; totalPosition += r.position ?? 0; }

        const totals = {
          clicks: totalClicks,
          impressions: totalImpressions,
          ctr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
          position: rows.length > 0 ? totalPosition / rows.length : 0,
        };

        // Vorperiode
        const prevEnd = new Date(startDate);
        const prevStart = new Date(startDate);
        prevStart.setDate(prevStart.getDate() - days);

        const prevRows = await query(sc, siteUrl, {
          startDate: fmt(prevStart), endDate: fmt(prevEnd),
          dimensions: ["date"], rowLimit: days,
        });

        let prevClicks = 0, prevImpressions = 0;
        for (const r of prevRows) { prevClicks += r.clicks ?? 0; prevImpressions += r.impressions ?? 0; }

        return NextResponse.json({
          totals,
          prevTotals: { clicks: prevClicks, impressions: prevImpressions },
          daily: rows.map((r) => ({
            date: r.keys?.[0], clicks: r.clicks, impressions: r.impressions,
            ctr: r.ctr, position: r.position,
          })),
        });
      }

      case "keywords": {
        const rows = await query(sc, siteUrl, {
          startDate: fmt(startDate), endDate: fmt(endDate),
          dimensions: ["query"], rowLimit: 50,
          orderBy: [{ field: "impressions", sortOrder: "DESCENDING" }],
        });
        return NextResponse.json({
          keywords: rows.map((r) => ({
            keyword: r.keys?.[0], clicks: r.clicks, impressions: r.impressions,
            ctr: r.ctr, position: Math.round((r.position ?? 0) * 10) / 10,
          })),
        });
      }

      case "pages": {
        const rows = await query(sc, siteUrl, {
          startDate: fmt(startDate), endDate: fmt(endDate),
          dimensions: ["page"], rowLimit: 50,
          orderBy: [{ field: "clicks", sortOrder: "DESCENDING" }],
        });
        return NextResponse.json({
          pages: rows.map((r) => ({
            page: r.keys?.[0]?.replace("https://www.urlaubfinder365.de", ""),
            clicks: r.clicks, impressions: r.impressions,
            ctr: r.ctr, position: Math.round((r.position ?? 0) * 10) / 10,
          })),
        });
      }

      case "trending": {
        const recentStart = new Date(); recentStart.setDate(recentStart.getDate() - 7);
        const prevStartT = new Date(); prevStartT.setDate(prevStartT.getDate() - 14);

        const [recent, prev] = await Promise.all([
          query(sc, siteUrl, { startDate: fmt(recentStart), endDate: fmt(endDate), dimensions: ["query"], rowLimit: 100 }),
          query(sc, siteUrl, { startDate: fmt(prevStartT), endDate: fmt(recentStart), dimensions: ["query"], rowLimit: 100 }),
        ]);

        const prevMap = new Map(prev.map((r) => [r.keys?.[0], r.impressions ?? 0]));

        const trending = recent
          .map((r) => {
            const kw = r.keys?.[0] ?? "";
            const prevImpr = prevMap.get(kw) ?? 0;
            const growth = prevImpr > 0 ? (((r.impressions ?? 0) - prevImpr) / prevImpr) * 100 : 100;
            return { keyword: kw, impressions: r.impressions, prevImpressions: prevImpr, growth: Math.round(growth), position: Math.round((r.position ?? 0) * 10) / 10 };
          })
          .filter((r) => r.growth > 0 && (r.impressions ?? 0) > 5)
          .sort((a, b) => b.growth - a.growth)
          .slice(0, 20);

        return NextResponse.json({ trending });
      }

      default:
        return NextResponse.json({ error: "Unbekannter Typ" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
