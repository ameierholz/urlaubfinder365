import { NextRequest, NextResponse } from "next/server";
import { IBE_DESTINATIONS } from "@/data/ibe-destinations";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const results = IBE_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.parent.toLowerCase().includes(q)
  ).slice(0, 25);

  return NextResponse.json(results);
}
