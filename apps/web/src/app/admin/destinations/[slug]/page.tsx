import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DestinationSeoForm from "@/components/admin/destination-seo-form";
import { destinations } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";

interface Props {
  params: Promise<{ slug: string }>;
}

function findDestination(slug: string): { name: string; country: string } | null {
  const fromLib = destinations.find((d) => d.slug === slug);
  if (fromLib) return { name: fromLib.name, country: fromLib.country };

  const fromCatalog = CATALOG.find((c) => c.slug === slug);
  if (fromCatalog) return { name: fromCatalog.name, country: fromCatalog.country };

  return null;
}

export default async function DestinationSeoEditPage({ params }: Props) {
  const { slug } = await params;

  const destination = findDestination(slug);
  if (!destination) notFound();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("destination_seo_texts")
    .select("seo_intro, seo_middle, seo_bottom, seo_h2_middle, seo_h2_bottom")
    .eq("slug", slug)
    .maybeSingle();

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link href="/admin/dashboard" className="hover:text-gray-300 transition-colors">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/destinations" className="hover:text-gray-300 transition-colors">Destinations</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300 font-semibold">{destination.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-3 mb-8">
        <div className="p-2 bg-teal-900/30 rounded-lg mt-0.5">
          <MapPin className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">{destination.name}</h1>
          <p className="text-sm text-gray-500">{destination.country} · <span className="font-mono">{slug}</span></p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <DestinationSeoForm slug={slug} name={destination.name} country={destination.country} initial={data} />
      </div>

      {/* Back */}
      <div className="mt-6">
        <Link
          href="/admin/destinations"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Zurück zur Destinations-Übersicht
        </Link>
      </div>
    </div>
  );
}
