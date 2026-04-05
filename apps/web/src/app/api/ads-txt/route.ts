import { NextResponse } from "next/server";

// Serves ads.txt content via API route (rewritten from /ads.txt in next.config.ts)
// This bypasses trailing-slash redirects and i18n middleware.
export function GET() {
  return new NextResponse(
    "google.com, pub-9799640580685030, DIRECT, f08c47fec0942fa0\n",
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    }
  );
}
