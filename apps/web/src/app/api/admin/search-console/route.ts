import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";
export const maxDuration = 30;

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) return null;
  const credentials = JSON.parse(key);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
}

/**
 * GET /api/admin/search-console?type=overview|keywords|pages|trending&days=28
 */
export async function GET(req: NextRequest) {
  const auth = getAuth();
  if (!auth) {
    return NextResponse.json({ error: "GOOGLE_SERVICE_ACCOUNT_KEY nicht konfiguriert" }, { status: 500 });
  }

  const sp = req.nextUrl.searchParams;
  const type = sp.get("type") ?? "overview";
  const days = parseInt(sp.get("days") ?? "28", 10);
  const siteUrl = "sc-domain:urlaubfinder365.de";

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const searchconsole = google.searchconsole({ version: "v1", auth });

  try {
    switch (type) {
      case "overview": {
        // Gesamt-Performance: Klicks, Impressionen, CTR, Position
        const { data } = await searchconsole.searchanalytics.query({
          siteUrl,
          requestBody: {
            startDate: fmt(startDate),
            endDate: fmt(endDate),
            dimensions: ["date"],
            rowLimit: days,
          },
        });

        const rows = data.rows ?? [];
        const totals = rows.reduce(
          (acc, r) => ({
            clicks: acc.clicks + (r.clicks ?? 0),
            impressions: acc.impressions + (r.impressions ?? 0),
            ctr: 0,
            position: 0,
          }),
          { clicks: 0, impressions: 0, ctr: 0, position: 0 }
        );
        totals.ctr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
        totals.position = rows.length > 0
          ? rows.reduce((sum, r) => sum + (r.position ?? 0), 0) / rows.length
          : 0;

        // Vorperiode zum Vergleich
        const prevEnd = new Date(startDate);
        const prevStart = new Date(startDate);
        prevStart.setDate(prevStart.getDate() - days);

        const { data: prevData } = await searchconsole.searchanalytics.query({
          siteUrl,
          requestBody: {
            startDate: fmt(prevStart),
            endDate: fmt(prevEnd),
            dimensions: ["date"],
            rowLimit: days,
          },
        });

        const prevRows = prevData.rows ?? [];
        const prevTotals = prevRows.reduce(
          (acc, r) => ({
            clicks: acc.clicks + (r.clicks ?? 0),
            impressions: acc.impressions + (r.impressions ?? 0),
          }),
          { clicks: 0, impressions: 0 }
        );

        return NextResponse.json({
          totals,
          prevTotals,
          daily: rows.map((r) => ({
            date: r.keys?.[0],
            clicks: r.clicks,
            impressions: r.impressions,
            ctr: r.ctr,
            position: r.position,
          })),
        });
      }

      case "keywords": {
        // Top Keywords
        const { data } = await searchconsole.searchanalytics.query({
          siteUrl,
          requestBody: {
            startDate: fmt(startDate),
            endDate: fmt(endDate),
            dimensions: ["query"],
            rowLimit: 50,
            orderBy: [{ field: "impressions", sortOrder: "DESCENDING" }],
          },
        });

        return NextResponse.json({
          keywords: (data.rows ?? []).map((r) => ({
            keyword: r.keys?.[0],
            clicks: r.clicks,
            impressions: r.impressions,
            ctr: r.ctr,
            position: Math.round((r.position ?? 0) * 10) / 10,
          })),
        });
      }

      case "pages": {
        // Top Seiten
        const { data } = await searchconsole.searchanalytics.query({
          siteUrl,
          requestBody: {
            startDate: fmt(startDate),
            endDate: fmt(endDate),
            dimensions: ["page"],
            rowLimit: 50,
            orderBy: [{ field: "clicks", sortOrder: "DESCENDING" }],
          },
        });

        return NextResponse.json({
          pages: (data.rows ?? []).map((r) => ({
            page: r.keys?.[0]?.replace("https://www.urlaubfinder365.de", ""),
            clicks: r.clicks,
            impressions: r.impressions,
            ctr: r.ctr,
            position: Math.round((r.position ?? 0) * 10) / 10,
          })),
        });
      }

      case "trending": {
        // Keywords mit stärkstem Wachstum (letzte 7 Tage vs. davor)
        const recentStart = new Date();
        recentStart.setDate(recentStart.getDate() - 7);
        const prevStartT = new Date();
        prevStartT.setDate(prevStartT.getDate() - 14);

        const [{ data: recent }, { data: prev }] = await Promise.all([
          searchconsole.searchanalytics.query({
            siteUrl,
            requestBody: {
              startDate: fmt(recentStart),
              endDate: fmt(endDate),
              dimensions: ["query"],
              rowLimit: 100,
            },
          }),
          searchconsole.searchanalytics.query({
            siteUrl,
            requestBody: {
              startDate: fmt(prevStartT),
              endDate: fmt(recentStart),
              dimensions: ["query"],
              rowLimit: 100,
            },
          }),
        ]);

        const prevMap = new Map(
          (prev.rows ?? []).map((r) => [r.keys?.[0], r.impressions ?? 0])
        );

        const trending = (recent.rows ?? [])
          .map((r) => {
            const kw = r.keys?.[0] ?? "";
            const prevImpr = prevMap.get(kw) ?? 0;
            const growth = prevImpr > 0 ? (((r.impressions ?? 0) - prevImpr) / prevImpr) * 100 : 100;
            return {
              keyword: kw,
              impressions: r.impressions,
              prevImpressions: prevImpr,
              growth: Math.round(growth),
              position: Math.round((r.position ?? 0) * 10) / 10,
            };
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
