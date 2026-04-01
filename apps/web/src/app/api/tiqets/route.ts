import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.TIQETS_API_KEY || "tqat-EaW7s7rthE8b1cJm1U4KrpEyvx4cmwKI";

export async function GET(req: NextRequest) {
  // Support multiple cityId params: ?cityId=65915&cityId=44
  const cityIds  = req.nextUrl.searchParams.getAll("cityId");
  const pageSize = Math.min(Number(req.nextUrl.searchParams.get("pageSize") ?? "20"), 50);

  if (!cityIds.length) return NextResponse.json({ products: [] });

  // Fetch all cities in parallel
  const results = await Promise.all(
    cityIds.map(async (cityId) => {
      const url = `https://api.tiqets.com/v2/products?city_id=${cityId}&lang=de&page_size=${pageSize}`;
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Token ${API_KEY}` },
          next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.products ?? [];
      } catch {
        return [];
      }
    })
  );

  // Flatten + deduplicate by product id
  const seen = new Set<number>();
  const products = results.flat().filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return NextResponse.json({ products });
}
