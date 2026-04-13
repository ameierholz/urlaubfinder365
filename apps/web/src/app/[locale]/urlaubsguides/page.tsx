import type { Metadata } from "next";
import RightSidebar from "@/components/layout/RightSidebar";
import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { destinations, destImg } from "@/lib/destinations";
import { setRequestLocale } from "next-intl/server";
import { fetchPageSeoMeta } from "@/lib/seo-meta";

import JsonLd from "@/components/seo/JsonLd";
const YEAR = new Date().getFullYear();

const FALLBACK_TITLE = `📖 Urlaubsguides ${YEAR} – kostenlose Urlaubsführer & Tipps`;
const FALLBACK_DESC = `Kostenlose Urlaubsguides ${YEAR}: Sehenswürdigkeiten, Geheimtipps, Klima & Einreise für Antalya, Mallorca, Kreta, Hurghada & Barcelona.`;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeoMeta("/urlaubsguides");
  const title = seo?.meta_title || FALLBACK_TITLE;
  const description = seo?.meta_description || FALLBACK_DESC;
  return {
    title,
    description,
    keywords: ["Urlaubsführer kostenlos", "Urlaubsguide", "Urlaubstipps", "Urlaubsführer Antalya", "Urlaubsführer Mallorca", "Urlaubsführer Kreta", "Urlaubsführer Hurghada", "Urlaubsführer Barcelona"],
    alternates: { canonical: "https://www.urlaubfinder365.de/urlaubsguides/" },
    openGraph: {
      title: seo?.og_title || `📖 Urlaubsguides ${YEAR} – kostenlose Urlaubsführer | Urlaubfinder365`,
      description: seo?.og_description || description,
      url: "https://www.urlaubfinder365.de/urlaubsguides/",
      type: "website",
      ...(seo?.og_image ? { images: [{ url: seo.og_image }] } : {}),
    },
  };
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Urlaubsguides – Urlaubsführer & Urlaubstipps",
    description: "Hilfreiche Urlaubsguides und Urlaubsführer: Einreise, Klima, Sehenswürdigkeiten und Insidertipps für dein Urlaubsziel.",
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

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = await fetchPageSeoMeta("/urlaubsguides");
  return (
    <>
      <JsonLd data={jsonLd} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/urlaubsguides_header.webp" alt="Urlaubsguides" className="w-full object-cover" style={{ maxHeight: "180px" }} loading="eager" />

      {/* SEO Intro */}
      {seo?.seo_intro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
            {seo.seo_intro}
          </p>
        </div>
      )}

      {/* SEO Middle */}
      {seo?.seo_middle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
          {seo.seo_h2_middle && (
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{seo.seo_h2_middle}</h2>
          )}
          <div className="text-gray-600 text-sm leading-relaxed max-w-3xl space-y-3">
            {seo.seo_middle.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((block, i) => (
              <p key={i}>{block}</p>
            ))}
          </div>
        </div>
      )}

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="xl:flex xl:gap-8 xl:items-start">
      <div className="flex-1 min-w-0">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-sand-50 text-sand-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <BookOpen className="w-4 h-4" />
          Urlaubsführer
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Kostenlose Urlaubsführer & Urlaubstipps</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-3">
          Unsere kostenlosen Urlaubsguides liefern dir alles Wissenswerte zu den beliebtesten Urlaubszielen – kompakt aufbereitet für vor, während und nach deiner Reise.
        </p>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Von Einreise- und Visabestimmungen über Klimatabellen und Packlisten bis hin zu Sehenswürdigkeiten, Insidertipps und lokalen Restaurantempfehlungen – unsere Urlaubsführer begleiten dich auf jedem Schritt deiner Reise. Alle Guides werden regelmäßig aktualisiert und sind kostenlos verfügbar.
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
                {dest.name} Urlaubsführer
              </h2>
              <span className="flex items-center gap-1 text-xs text-sand-500">
                <Clock className="w-3.5 h-3.5" />
                8 Min. Lesezeit
              </span>
            </div>
          </Link>
        ))}
      </div>
      </div>{/* end main */}
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-24">
          <RightSidebar
            extrasBox={{
              image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=400&h=200&q=70&auto=format",
              eyebrow: "Urlaub planen",
              title: "Günstige Angebote finden",
              description: "Nutze unsere Guides zur Planung und buche direkt zum Bestpreis.",
              href: "/guenstig-urlaub-buchen/",
              ctaLabel: "Angebote vergleichen →",
            }}
            seoLinksTitle="📚 Beliebte Guides"
            seoLinks={[
              { href: "/urlaubsguides/reisefuehrer-antalya/",   label: "Urlaubsführer Antalya" },
              { href: "/urlaubsguides/reisefuehrer-mallorca/",  label: "Urlaubsführer Mallorca" },
              { href: "/urlaubsguides/reisefuehrer-kreta/",     label: "Urlaubsführer Kreta" },
              { href: "/urlaubsguides/reisefuehrer-barcelona/", label: "Urlaubsführer Barcelona" },
            ]}
          />
        </div>
      </aside>
      </div>{/* end xl:flex */}
    </div>

      {/* SEO Bottom */}
      {seo?.seo_bottom && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl">
            {seo.seo_h2_bottom && (
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">{seo.seo_h2_bottom}</h2>
            )}
            <div className="text-gray-600 text-sm leading-relaxed space-y-3">
              {seo.seo_bottom.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
