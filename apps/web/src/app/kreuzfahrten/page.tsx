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

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kreuzfahrten günstig buchen",
    description: "Kreuzfahrten günstig buchen – Hochsee & Flussfahrten, Karibik & Mittelmeer, 30+ Reedereien.",
    url: "https://www.urlaubfinder365.de/kreuzfahrten/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",    item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Kreuzfahrten",  item: "https://www.urlaubfinder365.de/kreuzfahrten/" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Welche Kreuzfahrten gibt es bei Urlaubfinder365?",
        acceptedAnswer: { "@type": "Answer", text: "Wir zeigen Hochseekreuzfahrten, Flusskreuzfahrten, Mittelmeerrouten und Karibik-Kreuzfahrten von über 30 Reedereien wie AIDA, TUI Cruises und MSC." },
      },
      {
        "@type": "Question",
        name: "Wann sind Kreuzfahrten am günstigsten?",
        acceptedAnswer: { "@type": "Answer", text: "Die günstigsten Preise gibt es oft als Frühbucher (6–12 Monate vor Abfahrt) oder kurzfristig 1–4 Wochen vor der Abfahrt als Last-Minute-Angebot." },
      },
    ],
  },
];

export default function KreuzfahrtenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Server-gerenderter H1 – für SSR/Crawler sichtbar; der visuelle H1 liegt im Client-Component */}
      <h1 className="sr-only">Traumkreuzfahrten günstig buchen – Hochsee, Flussfahrten, Karibik & Mittelmeer</h1>
      <KreuzfahrtenContent />
    </>
  );
}
