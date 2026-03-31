import type { Metadata } from "next";
import KreuzfahrtenContent from "@/components/cruise/KreuzfahrtenContent";

export async function generateMetadata(): Promise<Metadata> {
  const year = new Date().getFullYear();
  const next = year + 1;
  return {
    title: `Kreuzfahrten günstig buchen ${year}/${next}`,
    description:
      "Kreuzfahrten günstig buchen ✓ Hochsee & Flussfahrten ✓ Karibik & Mittelmeer ✓ 30+ Reedereien: AIDA, TUI Cruises, MSC. Jetzt vergleichen!",
    alternates: { canonical: "https://www.urlaubfinder365.de/kreuzfahrten/" },
    openGraph: {
      title: `Kreuzfahrten günstig buchen ${year}/${next} | Urlaubfinder365`,
      description:
        "Kreuzfahrten günstig buchen ✓ Hochsee & Flussfahrten ✓ Karibik & Mittelmeer ✓ 30+ Reedereien: AIDA, TUI Cruises, MSC. Jetzt vergleichen!",
      url: "https://www.urlaubfinder365.de/kreuzfahrten/",
      type: "website",
    },
  };
}

export default function KreuzfahrtenPage() {
  return <KreuzfahrtenContent />;
}
