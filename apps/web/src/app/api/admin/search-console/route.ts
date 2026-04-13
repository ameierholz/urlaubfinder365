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
          dimensions: ["query"], rowLimit: 500,
        });
        rows.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
        const top = rows.slice(0, 50);
        return NextResponse.json({
          keywords: top.map((r) => ({
            keyword: r.keys?.[0], clicks: r.clicks, impressions: r.impressions,
            ctr: r.ctr, position: Math.round((r.position ?? 0) * 10) / 10,
          })),
        });
      }

      case "pages": {
        const rows = await query(sc, siteUrl, {
          startDate: fmt(startDate), endDate: fmt(endDate),
          dimensions: ["page"], rowLimit: 500,
        });
        rows.sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0));
        return NextResponse.json({
          pages: rows.slice(0, 50).map((r) => ({
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

      case "devices": {
        const rows = await query(sc, siteUrl, {
          startDate: fmt(startDate), endDate: fmt(endDate),
          dimensions: ["device"], rowLimit: 10,
        });

        let totalClicks = 0;
        let totalImpressions = 0;
        for (const r of rows) {
          totalClicks += r.clicks ?? 0;
          totalImpressions += r.impressions ?? 0;
        }

        const devices = rows.map((r) => ({
          device: r.keys?.[0] ?? "unknown",
          clicks: r.clicks ?? 0,
          impressions: r.impressions ?? 0,
          ctr: r.ctr ?? 0,
          position: Math.round((r.position ?? 0) * 10) / 10,
          clickShare: totalClicks > 0 ? (r.clicks ?? 0) / totalClicks : 0,
          impressionShare: totalImpressions > 0 ? (r.impressions ?? 0) / totalImpressions : 0,
        }));

        return NextResponse.json({ devices, totalClicks, totalImpressions });
      }

      case "countries": {
        const rows = await query(sc, siteUrl, {
          startDate: fmt(startDate), endDate: fmt(endDate),
          dimensions: ["country"], rowLimit: 500,
        });
        rows.sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0));

        return NextResponse.json({
          countries: rows.slice(0, 30).map((r) => ({
            country: r.keys?.[0] ?? "unknown",
            clicks: r.clicks ?? 0,
            impressions: r.impressions ?? 0,
            ctr: r.ctr ?? 0,
            position: Math.round((r.position ?? 0) * 10) / 10,
          })),
        });
      }

      case "winners": {
        const prevEnd = new Date(startDate);
        const prevStart = new Date(startDate);
        prevStart.setDate(prevStart.getDate() - days);

        const [current, previous] = await Promise.all([
          query(sc, siteUrl, { startDate: fmt(startDate), endDate: fmt(endDate), dimensions: ["query"], rowLimit: 500 }),
          query(sc, siteUrl, { startDate: fmt(prevStart), endDate: fmt(prevEnd), dimensions: ["query"], rowLimit: 500 }),
        ]);

        const prevMap = new Map(previous.map((r) => [r.keys?.[0], r.position ?? 0]));

        const compared = current
          .filter((r) => prevMap.has(r.keys?.[0]))
          .map((r) => {
            const kw = r.keys?.[0] ?? "";
            const prevPos = prevMap.get(kw) ?? 0;
            const curPos = r.position ?? 0;
            const change = prevPos - curPos; // positive = improved (lower position number)
            return {
              keyword: kw,
              clicks: r.clicks ?? 0,
              impressions: r.impressions ?? 0,
              position: Math.round(curPos * 10) / 10,
              prevPosition: Math.round(prevPos * 10) / 10,
              change: Math.round(change * 10) / 10,
            };
          });

        const winners = [...compared].sort((a, b) => b.change - a.change).slice(0, 15);
        const losers = [...compared].sort((a, b) => a.change - b.change).slice(0, 15);

        return NextResponse.json({ winners, losers });
      }

      case "opportunities": {
        const rows = await query(sc, siteUrl, {
          startDate: fmt(startDate), endDate: fmt(endDate),
          dimensions: ["page"], rowLimit: 500,
        });

        const opportunities = rows
          .filter((r) => (r.impressions ?? 0) > 100 && (r.ctr ?? 0) < 0.02)
          .map((r) => ({
            page: r.keys?.[0]?.replace("https://www.urlaubfinder365.de", "") ?? "",
            clicks: r.clicks ?? 0,
            impressions: r.impressions ?? 0,
            ctr: r.ctr ?? 0,
            position: Math.round((r.position ?? 0) * 10) / 10,
            potentialClicks: Math.round((r.impressions ?? 0) * 0.05), // bei 5% CTR
          }))
          .sort((a, b) => b.impressions - a.impressions);

        return NextResponse.json({ opportunities });
      }

      default:
        return NextResponse.json({ error: "Unbekannter Typ" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
