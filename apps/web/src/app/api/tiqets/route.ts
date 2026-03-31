import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.TIQETS_API_KEY || "tqat-EaW7s7rthE8b1cJm1U4KrpEyvx4cmwKI";

export async function GET(req: NextRequest) {
  const cityId = req.nextUrl.searchParams.get("cityId");
  if (!cityId) return NextResponse.json({ products: [] });

  const pageSize = Math.min(Number(req.nextUrl.searchParams.get("pageSize") ?? "20"), 50);
  const url = `https://api.tiqets.com/v2/products?city_id=${cityId}&lang=de&page_size=${pageSize}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Token ${API_KEY}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({ products: [] });
    const data = await res.json();
    return NextResponse.json({ products: data.products ?? [] });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
