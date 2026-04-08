import { NextRequest, NextResponse } from "next/server";
import { IBE_DESTINATIONS } from "@/data/ibe-destinations";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  // Priorität: exakter Name-Match > Name-contains > Parent-contains
  const exact: typeof IBE_DESTINATIONS = [];
  const nameMatch: typeof IBE_DESTINATIONS = [];
  const parentMatch: typeof IBE_DESTINATIONS = [];

  for (const d of IBE_DESTINATIONS) {
    const nameLower = d.name.toLowerCase();
    if (nameLower === q) exact.push(d);
    else if (nameLower.includes(q)) nameMatch.push(d);
    else if (d.parent.toLowerCase().includes(q)) parentMatch.push(d);
  }

  // Regionen vor Städten, dann alphabetisch
  const sort = (arr: typeof IBE_DESTINATIONS) =>
    arr.sort((a, b) => {
      if (a.city && !b.city) return 1;
      if (!a.city && b.city) return -1;
      return a.name.localeCompare(b.name, "de");
    });

  const results = [...exact, ...sort(nameMatch), ...sort(parentMatch)].slice(0, 25);

  return NextResponse.json(results);
}
