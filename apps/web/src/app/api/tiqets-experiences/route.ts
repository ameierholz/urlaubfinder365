import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.TIQETS_API_KEY || "tqat-EaW7s7rthE8b1cJm1U4KrpEyvx4cmwKI";

export async function GET(req: NextRequest) {
  // Support multiple cityId params: ?cityId=66342&cityId=38
  const cityIds = req.nextUrl.searchParams.getAll("cityId");
  const type     = req.nextUrl.searchParams.get("type") ?? "";          // venue|activity|service|poi
  const pageSize = Math.min(Number(req.nextUrl.searchParams.get("pageSize") ?? "50"), 100);

  if (!cityIds.length) return NextResponse.json({ experiences: [], total: 0 });

  const url = new URL("https://api.tiqets.com/v2/experiences");
  cityIds.forEach((id) => url.searchParams.append("city_id", id));
  if (type) url.searchParams.set("type", type);
  url.searchParams.set("lang", "de");
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set("currency", "EUR");

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Token ${API_KEY}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({ experiences: [], total: 0 });
    const data = await res.json();
    return NextResponse.json({
      experiences: data.experiences ?? [],
      total: data.pagination?.total ?? 0,
    });
  } catch {
    return NextResponse.json({ experiences: [], total: 0 });
  }
}
