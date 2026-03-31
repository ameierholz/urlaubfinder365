import { NextResponse } from "next/server";

const WIDGET_URL =
  "https://api.specials.de/component/searchBoxMix.html?access=7bb55d1b6095e63fb7c09e46579c4120";

export async function GET() {
  try {
    const res = await fetch(WIDGET_URL, {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
      return NextResponse.json({ error: "upstream error" }, { status: 502 });
    }

    const html = await res.text();
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
