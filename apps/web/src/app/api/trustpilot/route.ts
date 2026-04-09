import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const res = await fetch(
      "https://www.trustpilot.com/api/categoriespages/69b05095e5b9211cdbf12068",
      {
        headers: { "User-Agent": "Urlaubfinder365/1.0" },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      // Fallback: Seite scrapen
      const pageRes = await fetch("https://de.trustpilot.com/review/urlaubfinder365.de", {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 3600 },
      });
      const html = await pageRes.text();

      const scoreMatch = html.match(/data-rating="([\d.]+)"/);
      const countMatch = html.match(/"numberOfReviews"[:\s]*(\d+)/);

      return NextResponse.json({
        score: scoreMatch ? parseFloat(scoreMatch[1]) : 5,
        count: countMatch ? parseInt(countMatch[1]) : 1,
      }, { headers: { "Cache-Control": "public, s-maxage=3600" } });
    }

    const data = await res.json();
    return NextResponse.json({
      score: data.trustScore ?? 5,
      count: data.numberOfReviews ?? 1,
    }, { headers: { "Cache-Control": "public, s-maxage=3600" } });
  } catch {
    return NextResponse.json({ score: 5, count: 1 });
  }
}
