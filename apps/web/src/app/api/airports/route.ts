import { NextRequest, NextResponse } from "next/server";
import { AIRPORTS_DATA } from "@/data/airports-data";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const results = AIRPORTS_DATA.filter(
    (ap) =>
      ap.iata.toLowerCase().startsWith(q) ||
      ap.city.toLowerCase().includes(q) ||
      ap.name.toLowerCase().includes(q) ||
      ap.country.toLowerCase().includes(q)
  ).slice(0, 20);

  return NextResponse.json(results);
}
