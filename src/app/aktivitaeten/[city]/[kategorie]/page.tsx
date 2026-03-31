import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDestinationBySlug, destinations } from "@/lib/destinations";
import TiqetsNicheSection from "@/components/tiqets/TiqetsNicheSection";

interface Props {
  params: Promise<{ city: string; kategorie: string }>;
}

export async function generateStaticParams() {
  const params: { city: string; kategorie: string }[] = [];
  for (const dest of destinations) {
    if (dest.tiqetsCityId && dest.tiqetsNiches) {
      for (const niche of dest.tiqetsNiches) {
        params.push({ city: dest.slug, kategorie: niche.slug });
      }
    }
  }
  return params;
}

const BASE_URL = "https://www.urlaubfinder365.de";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, kategorie } = await params;
  const dest  = getDestinationBySlug(city);
  const niche = dest?.tiqetsNiches?.find((n) => n.slug === kategorie);
  if (!dest || !niche) return {};

  const canonical = `${BASE_URL}/aktivitaeten/${city}/${kategorie}/`;
  return {
    title: niche.metaTitle,
    description: niche.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: niche.metaTitle,
      description: niche.metaDescription,
      url: canonical,
      type: "website",
      images: dest.heroImageFallback ? [{ url: dest.heroImageFallback }] : [],
    },
  };
}

export const revalidate = 3600;

export default async function TiqetsNichePage({ params }: Props) {
  const { city, kategorie } = await params;
  const dest  = getDestinationBySlug(city);
  const niche = dest?.tiqetsNiches?.find((n) => n.slug === kategorie);
  if (!dest || !dest.tiqetsCityId || !niche) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",   item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Aktivitäten",  item: `${BASE_URL}/aktivitaeten/` },
      { "@type": "ListItem", position: 3, name: dest.name,       item: `${BASE_URL}/aktivitaeten/${dest.slug}/` },
      { "@type": "ListItem", position: 4, name: niche.label,    item: `${BASE_URL}/aktivitaeten/${dest.slug}/${niche.slug}/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#00838F] to-[#004F5A] text-white relative overflow-hidden">
        {dest.heroImageFallback && (
          <img
            src={dest.heroImageFallback}
            alt={dest.name}
            className="absolute inset-0 w-full h-full object-cover opacity-[0.15]"
          />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-white/65 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>›</span>
            <Link href="/aktivitaeten/" className="hover:text-white transition-colors">Aktivitäten</Link>
            <span>›</span>
            <Link href={`/aktivitaeten/${dest.slug}/`} className="hover:text-white transition-colors">{dest.name}</Link>
            <span>›</span>
            <span className="text-white font-medium">{niche.label}</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3.5 py-1.5 rounded-full mb-4">
            🎟️ {niche.label}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            {(() => {
              const parts = niche.h1.split(dest.name);
              return parts.length > 1
                ? <>{parts[0]}<span className="text-[#6CC4BA]">{dest.name}</span>{parts[1]}</>
                : <>{niche.h1}</>;
            })()}
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">{niche.intro}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href={`/aktivitaeten/${dest.slug}/`}
              className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/25 transition-colors border border-white/30"
            >
              ← Alle Aktivitäten in {dest.name}
            </Link>
            <Link
              href={`/urlaubsziele/${dest.slug}/`}
              className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/25 transition-colors border border-white/30"
            >
              🏖️ {dest.name} Urlaub buchen
            </Link>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TiqetsNicheSection
          cityId={dest.tiqetsCityId}
          cityName={dest.name}
          citySlug={dest.slug}
          keywords={niche.keywords}
        />
      </div>

      {/* SEO-Textblock */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {niche.label} in {dest.name} – Tipps & Infos
          </h2>
          <p className="text-gray-600 leading-relaxed">{niche.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/urlaubsziele/${dest.slug}/`}
              className="inline-block bg-sand-500 hover:bg-sand-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
            >
              {dest.name} Urlaub buchen →
            </Link>
            <Link
              href={`/aktivitaeten/${dest.slug}/`}
              className="inline-block border border-[#6CC4BA] text-[#00838F] hover:bg-[#6CC4BA] hover:text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
            >
              Alle Aktivitäten in {dest.name} →
            </Link>
          </div>
        </div>
      </div>

      {/* Weitere Kategorien in dieser Stadt */}
      {dest.tiqetsNiches && dest.tiqetsNiches.filter((n) => n.slug !== kategorie).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Weitere Aktivitäten in {dest.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {dest.tiqetsNiches
              .filter((n) => n.slug !== kategorie)
              .map((n) => (
                <Link
                  key={n.slug}
                  href={`/aktivitaeten/${dest.slug}/${n.slug}/`}
                  className="inline-flex items-center gap-2 bg-teal-50 hover:bg-[#6CC4BA] border border-teal-200 hover:border-[#6CC4BA] text-gray-700 hover:text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                >
                  🎟️ {n.label} →
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Aktivitäten in anderen Zielen */}
      {(() => {
        const otherDests = destinations.filter(
          (d) => d.slug !== dest.slug && d.tiqetsCityId && d.tiqetsNiches && d.tiqetsNiches.length > 0
        );
        if (!otherDests.length) return null;
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Ähnliche Aktivitäten an anderen Urlaubszielen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherDests.slice(0, 2).map((od) => {
                const similarNiche = od.tiqetsNiches?.find((n) =>
                  n.label.toLowerCase().split(" ").some((w) => niche.label.toLowerCase().includes(w))
                ) ?? od.tiqetsNiches?.[0];
                return (
                  <Link
                    key={od.slug}
                    href={similarNiche ? `/aktivitaeten/${od.slug}/${similarNiche.slug}/` : `/aktivitaeten/${od.slug}/`}
                    className="group flex items-center gap-4 bg-white border border-gray-200 hover:border-[#6CC4BA] hover:shadow-md rounded-2xl p-4 transition-all duration-200"
                  >
                    <div className="text-3xl flex-shrink-0">🌍</div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 group-hover:text-[#00838F] transition-colors">
                        {similarNiche?.label ?? "Aktivitäten"} in {od.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{od.country} · Jetzt entdecken →</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}
    </>
  );
}
