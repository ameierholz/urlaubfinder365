import Link from "next/link";
import { Plane, MapPin, Clock, Star } from "lucide-react";

const HIGHLIGHTS = [
  {
    slug: "mallorca",
    name: "Mallorca",
    country: "Spanien",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
  },
  {
    slug: "antalya",
    name: "Antalya",
    country: "Türkei",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop",
  },
  {
    slug: "kreta",
    name: "Kreta",
    country: "Griechenland",
    image: "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600&h=400&fit=crop",
  },
  {
    slug: "hurghada",
    name: "Hurghada",
    country: "Ägypten",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 px-4 py-20 text-white md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Finde deinen
            <br />
            <span className="text-primary-100">Traumurlaub</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100 md:text-xl">
            Vergleiche Pauschalreisen, Last-Minute-Angebote und Hotels für
            über 250 Reiseziele weltweit — zum besten Preis.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/urlaubsziele/"
              className="rounded-full bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg transition hover:bg-primary-50"
            >
              Alle Reiseziele entdecken
            </Link>
            <Link
              href="/last-minute/"
              className="rounded-full border-2 border-white/40 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Last-Minute-Deals
            </Link>
          </div>
        </div>

        {/* Dekorative Elemente */}
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/5" />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPin, title: "250+ Reiseziele", desc: "Weltweit die besten Urlaubsorte" },
            { icon: Star, title: "Beste Preise", desc: "Angebote von Top-Reiseanbietern" },
            { icon: Clock, title: "Last Minute", desc: "Täglich neue Schnäppchen" },
            { icon: Plane, title: "Alles inklusive", desc: "Flug, Hotel & Transfer" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-sand-200 bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                <Icon className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="mb-1 font-semibold text-sand-900">{title}</h3>
              <p className="text-sm text-sand-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beliebte Reiseziele */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-sand-900 md:text-3xl">
            Beliebte Reiseziele
          </h2>
          <Link
            href="/urlaubsziele/"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Alle anzeigen →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((dest) => (
            <Link
              key={dest.slug}
              href={`/urlaubsziele/${dest.slug}/`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sand-900">{dest.name}</h3>
                <p className="text-sm text-sand-500">{dest.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
