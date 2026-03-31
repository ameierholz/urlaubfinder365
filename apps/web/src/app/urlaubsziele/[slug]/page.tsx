import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Sun, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";

// Statische Daten bis Supabase eingerichtet ist
const DESTINATIONS: Record<
  string,
  {
    name: string;
    country: string;
    description: string;
    climate: string;
    bestSeason: string[];
    tags: string[];
  }
> = {
  mallorca: {
    name: "Mallorca",
    country: "Spanien",
    description:
      "Die beliebteste Urlaubsinsel der Deutschen bietet traumhafte Strände, malerische Buchten und das pulsierende Palma de Mallorca.",
    climate: "Mediterran",
    bestSeason: ["Mai", "Jun", "Jul", "Aug", "Sep", "Okt"],
    tags: ["Strand", "Familie", "Kultur", "Nachtleben"],
  },
  antalya: {
    name: "Antalya",
    country: "Türkei",
    description:
      "Die türkische Riviera begeistert mit All-Inclusive-Resorts, antiken Ruinen und der spektakulären Küstenlandschaft.",
    climate: "Mediterran",
    bestSeason: ["Mai", "Jun", "Jul", "Aug", "Sep", "Okt"],
    tags: ["Strand", "All-Inclusive", "Kultur", "Familie"],
  },
  kreta: {
    name: "Kreta",
    country: "Griechenland",
    description:
      "Griechenlands größte Insel vereint mythische Geschichte, wilde Schluchten und kristallklares Wasser.",
    climate: "Mediterran",
    bestSeason: ["Mai", "Jun", "Jul", "Aug", "Sep", "Okt"],
    tags: ["Strand", "Kultur", "Wandern", "Natur"],
  },
  hurghada: {
    name: "Hurghada",
    country: "Ägypten",
    description:
      "Am Roten Meer gelegen, ist Hurghada ein Paradies für Taucher und Schnorchler mit ganzjährig warmem Wetter.",
    climate: "Wüste",
    bestSeason: ["Jan", "Feb", "Mär", "Apr", "Okt", "Nov", "Dez"],
    tags: ["Strand", "Tauchen", "All-Inclusive", "Schnorcheln"],
  },
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = DESTINATIONS[slug];
  if (!dest) return {};

  return {
    title: `Urlaub ${dest.name} — Angebote & Reiseführer`,
    description: dest.description,
    openGraph: {
      title: `${dest.name} Urlaub — Urlaubfinder365`,
      description: dest.description,
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const dest = DESTINATIONS[slug];

  if (!dest) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: dest.name,
    description: dest.description,
    touristType: dest.tags,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-accent-600 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-4 text-sm text-primary-200">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            {" / "}
            <Link href="/urlaubsziele/" className="hover:text-white">
              Urlaubsziele
            </Link>
            {" / "}
            <span className="text-white">{dest.name}</span>
          </nav>
          <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">
            {dest.name}
          </h1>
          <p className="flex items-center gap-1 text-lg text-primary-100">
            <MapPin className="h-5 w-5" />
            {dest.country}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="mb-8 text-lg leading-relaxed text-sand-700">
          {dest.description}
        </p>

        {/* Quick Facts */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-sand-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-primary-600">
              <Sun className="h-5 w-5" />
              <span className="font-semibold">Klima</span>
            </div>
            <p className="text-sand-700">{dest.climate}</p>
          </div>
          <div className="rounded-xl border border-sand-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-primary-600">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">Beste Reisezeit</span>
            </div>
            <p className="text-sand-700">{dest.bestSeason.join(", ")}</p>
          </div>
          <div className="rounded-xl border border-sand-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-primary-600">
              <Tag className="h-5 w-5" />
              <span className="font-semibold">Highlights</span>
            </div>
            <p className="text-sand-700">{dest.tags.join(", ")}</p>
          </div>
        </div>

        {/* Placeholder für Angebote */}
        <section className="rounded-2xl border border-sand-200 bg-white p-8 text-center">
          <h2 className="mb-2 text-xl font-bold text-sand-900">
            Aktuelle Angebote für {dest.name}
          </h2>
          <p className="text-sand-600">
            Angebote werden geladen, sobald die Reise-API verbunden ist.
          </p>
        </section>
      </div>
    </>
  );
}
