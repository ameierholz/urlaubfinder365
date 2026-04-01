import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { destinations, destImg } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Urlaubsguides – Reiseführer & Reisetipps",
  description: "Hilfreiche Urlaubsguides und Reiseführer: Einreise, Klima, Sehenswürdigkeiten und Insidertipps für dein Reiseziel.",
  alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsguides/" },
  openGraph: {
    title: "Urlaubsguides – Reiseführer & Reisetipps",
    description: "Hilfreiche Urlaubsguides und Reiseführer: Einreise, Klima, Sehenswürdigkeiten und Insidertipps für dein Reiseziel.",
    url: "https://www.urlaubfinder365.de/urlaubsguides/",
    type: "website",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Urlaubsguides – Reiseführer & Reisetipps",
    description: "Hilfreiche Urlaubsguides und Reiseführer: Einreise, Klima, Sehenswürdigkeiten und Insidertipps für dein Reiseziel.",
    url: "https://www.urlaubfinder365.de/urlaubsguides/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",    item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Urlaubsguides", item: "https://www.urlaubfinder365.de/urlaubsguides/" },
    ],
  },
];

export default function UrlaubsguidesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/urlaubsguides_header.webp" alt="Urlaubsguides" className="w-full object-cover" style={{ maxHeight: "180px" }} loading="eager" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-sand-50 text-sand-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <BookOpen className="w-4 h-4" />
          Reiseführer
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Kostenlose Reiseführer & Urlaubstipps</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Alles was du wissen musst – vor, während und nach deiner Reise.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {destinations.filter((d) => d.guideSlug).map((dest) => (
          <Link
            key={dest.slug}
            href={`/urlaubsguides/${dest.guideSlug}/`}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex"
          >
            <div className="relative w-40 shrink-0 overflow-hidden">
              <img
                src={destImg(dest)}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex flex-col justify-center">
              <p className="text-xs text-gray-400 mb-1">{dest.country}</p>
              <h2 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {dest.name} Reiseführer
              </h2>
              <span className="flex items-center gap-1 text-xs text-sand-500">
                <Clock className="w-3.5 h-3.5" />
                8 Min. Lesezeit
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
