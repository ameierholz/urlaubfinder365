import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Alle Urlaubsziele",
  description:
    "Entdecke über 250 Reiseziele weltweit. Finde Pauschalreisen, Hotels und Last-Minute-Angebote für deinen Traumurlaub.",
};

// Statische Daten bis Supabase eingerichtet ist
const DESTINATIONS = [
  { slug: "mallorca", name: "Mallorca", country: "Spanien", continent: "Europa" },
  { slug: "antalya", name: "Antalya", country: "Türkei", continent: "Europa" },
  { slug: "kreta", name: "Kreta", country: "Griechenland", continent: "Europa" },
  { slug: "hurghada", name: "Hurghada", country: "Ägypten", continent: "Afrika" },
  { slug: "barcelona", name: "Barcelona", country: "Spanien", continent: "Europa" },
  { slug: "fuerteventura", name: "Fuerteventura", country: "Spanien", continent: "Europa" },
  { slug: "gran-canaria", name: "Gran Canaria", country: "Spanien", continent: "Europa" },
  { slug: "teneriffa", name: "Teneriffa", country: "Spanien", continent: "Europa" },
  { slug: "rhodos", name: "Rhodos", country: "Griechenland", continent: "Europa" },
  { slug: "rom", name: "Rom", country: "Italien", continent: "Europa" },
  { slug: "side", name: "Side", country: "Türkei", continent: "Europa" },
  { slug: "bodrum", name: "Bodrum", country: "Türkei", continent: "Europa" },
  { slug: "malediven", name: "Malediven", country: "Malediven", continent: "Asien" },
  { slug: "dubai", name: "Dubai", country: "VAE", continent: "Asien" },
  { slug: "phuket", name: "Phuket", country: "Thailand", continent: "Asien" },
  { slug: "bali", name: "Bali", country: "Indonesien", continent: "Asien" },
  { slug: "kapstadt", name: "Kapstadt", country: "Südafrika", continent: "Afrika" },
  { slug: "new-york", name: "New York", country: "USA", continent: "Nordamerika" },
  { slug: "cancun", name: "Cancún", country: "Mexiko", continent: "Nordamerika" },
  { slug: "sansibar", name: "Sansibar", country: "Tansania", continent: "Afrika" },
];

export default function UrlaubszielePage() {
  const continents = [...new Set(DESTINATIONS.map((d) => d.continent))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-sand-900 md:text-4xl">
        Alle Urlaubsziele
      </h1>
      <p className="mb-10 text-lg text-sand-600">
        Entdecke die schönsten Reiseziele der Welt und finde deinen
        perfekten Urlaub.
      </p>

      {continents.map((continent) => (
        <section key={continent} className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-sand-800">
            {continent}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {DESTINATIONS.filter((d) => d.continent === continent).map(
              (dest) => (
                <Link
                  key={dest.slug}
                  href={`/urlaubsziele/${dest.slug}/`}
                  className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white p-4 transition hover:border-primary-300 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                    <MapPin className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sand-900">{dest.name}</p>
                    <p className="text-sm text-sand-500">{dest.country}</p>
                  </div>
                </Link>
              )
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
