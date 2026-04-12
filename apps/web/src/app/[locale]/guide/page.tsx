import Link from "next/link";
import { BookOpen, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import { destinations } from "@/lib/destinations";
import { setRequestLocale } from "next-intl/server";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "📖 Urlaubsführer – alle Urlaubsziele im Überblick",
  description: "Kostenlose Urlaubsführer für über 50 Urlaubsziele weltweit ✓ Sehenswürdigkeiten, Tipps & Insiderwissen ✓ Jetzt Guide lesen.",
  keywords: ["Urlaubsführer", "Urlaubsguide", "Urlaubstipps", "Urlaubsinformationen", "Urlaubsführer kostenlos"],
  alternates: { canonical: `${BASE_URL}/guide/` },
  openGraph: {
    title: "📖 Urlaubsführer – alle Urlaubsziele | Urlaubfinder365",
    description: "Kostenlose Urlaubsführer für über 50 Urlaubsziele weltweit ✓ Sehenswürdigkeiten, Tipps & Insiderwissen ✓ Jetzt Guide lesen.",
    url: `${BASE_URL}/guide/`,
    type: "website",
    siteName: "Urlaubfinder365",
  },
  twitter: {
    card: "summary_large_image",
    title: "📖 Urlaubsführer – alle Urlaubsziele | Urlaubfinder365",
    description: "Kostenlose Urlaubsführer für über 50 Urlaubsziele weltweit ✓ Sehenswürdigkeiten, Tipps & Insiderwissen ✓ Jetzt Guide lesen.",
  },
};

// Guides mit aktiven Seiten – neue Einträge erst hinzufügen wenn /guide/[slug]/ Inhalt hat
const guides = [
  {
    slug: "reisefuehrer-antalya",
    destination: "Antalya",
    title: "Antalya Urlaubsführer: Alles was du wissen musst",
    excerpt: "Von Einreisebestimmungen über die besten Strände bis zu Geheimtipps – dein kompletter Antalya Guide.",
    category: "vor-der-reise",
    categoryLabel: "Vor der Reise",
    readingTime: 8,
    coverImage: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800&q=80&auto=format",
    tags: ["Türkei", "Strand", "Einreise", "Tipps"],
  },
];

const categories = [
  { key: "alle", label: "Alle Guides" },
  { key: "vor-der-reise", label: "Vor der Reise" },
  { key: "waehrend-der-reise", label: "Während der Reise" },
  { key: "nach-der-reise", label: "Nach der Reise" },
  { key: "allgemein", label: "Allgemein" },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-sand-50 text-sand-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <BookOpen className="w-4 h-4" />
          Kostenlose Urlaubsführer
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Urlaubsführer & Urlaubstipps
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Hilfreiche Guides für jede Phase deiner Reise – von der Planung bis zur Rückkehr.
        </p>
      </div>

      {/* Kategorie-Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className="px-4 py-1.5 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-sand-400 hover:text-sand-600 transition-colors first:bg-sand-500 first:text-white first:border-sand-500"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="relative h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={guide.coverImage}
                alt={guide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-sand-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                {guide.categoryLabel}
              </span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {guide.readingTime} Min. Lesezeit
                </span>
                <span>{guide.destination}</span>
              </div>
              <h2 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                {guide.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{guide.excerpt}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {guide.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
