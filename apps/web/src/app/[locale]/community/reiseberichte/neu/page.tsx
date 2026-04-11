import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { destinations } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";
import NewTravelReportForm from "@/components/community/NewTravelReportForm";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ destination?: string }>;
}

export const metadata: Metadata = {
  title: "Reisebericht schreiben – Teile deine Erfahrungen",
  description: "Schreibe einen Reisebericht und teile deine Highlights, Tipps und Bewertungen mit der Urlaubfinder365-Community.",
  robots: { index: false, follow: false },
};

export default async function NeuerReiseberichtPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const preselectedSlug = sp.destination ?? "";

  // Liste aller verfügbaren Destinations für das Dropdown (rich + catalog, dedupliziert)
  const allDests = [
    ...destinations.map((d) => ({ slug: d.slug, name: d.name, country: d.country })),
    ...CATALOG.filter((c) => !destinations.find((d) => d.slug === c.slug)).map((c) => ({
      slug: c.slug,
      name: c.name,
      country: c.country,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name, "de"));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link href="/community/" className="hover:text-gray-700">Community</Link>
            <span>/</span>
            <Link href="/community/reiseberichte/" className="hover:text-gray-700">Reiseberichte</Link>
            <span>/</span>
            <span className="text-gray-700">Neuer Bericht</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Schreibe deinen Reisebericht
          </h1>
          <p className="text-gray-600 text-sm">
            Teile deine Erfahrungen mit der Community. Dein Bericht wird nach kurzer
            redaktioneller Prüfung veröffentlicht.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <NewTravelReportForm destinations={allDests} preselectedSlug={preselectedSlug} />
      </div>
    </div>
  );
}
