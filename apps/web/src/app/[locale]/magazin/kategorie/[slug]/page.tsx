import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ArtikelCard from "@/components/magazin/artikel-card";

import JsonLd from "@/components/seo/JsonLd";
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string | null;
  magazin_categories: { name: string; slug: string } | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data: cat } = await supabase
    .from("magazin_categories" as never)
    .select("name")
    .eq("slug", slug)
    .single() as { data: { name: string } | null };

  if (!cat) return {};

  return {
    title: `${cat.name} – Urlaubsmagazin | Urlaubfinder365`,
    description: `Alle Artikel der Kategorie „${cat.name}" im Urlaubsmagazin von Urlaubfinder365.`,
    alternates: { canonical: `https://www.urlaubfinder365.de/magazin/kategorie/${slug}/` },
    openGraph: {
      title: `${cat.name} – Urlaubsmagazin`,
      description: `Alle Artikel der Kategorie „${cat.name}" im Urlaubsmagazin von Urlaubfinder365.`,
      url: `https://www.urlaubfinder365.de/magazin/kategorie/${slug}/`,
      type: "website",
    },
  };
}

export default async function MagazinKategoriePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServer();

  const [{ data: category }, { data: allCategories }] = await Promise.all([
    supabase
      .from("magazin_categories" as never)
      .select("id, name, slug")
      .eq("slug", slug)
      .single() as unknown as Promise<{ data: Category | null }>,
    supabase
      .from("magazin_categories" as never)
      .select("id, name, slug")
      .order("name") as unknown as Promise<{ data: Category[] | null }>,
  ]);

  if (!category) notFound();

  const { data: articles } = await supabase
    .from("magazin_articles" as never)
    .select("id, title, slug, excerpt, cover_image, published_at, magazin_categories(name, slug)")
    .eq("status", "veroeffentlicht")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false }) as { data: Article[] | null };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Magazin", item: "https://www.urlaubfinder365.de/magazin/" },
      { "@type": "ListItem", position: 3, name: category.name, item: `https://www.urlaubfinder365.de/magazin/kategorie/${slug}/` },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1db682] to-[#6991d8] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">
            Kategorie
          </p>
          <h1 className="text-4xl sm:text-5xl font-black">{category.name}</h1>
        </div>
      </section>

      {/* Kategorie-Filter */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <Link
            href="/magazin/"
            className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-[#1db682] hover:text-white transition-colors"
          >
            Alle
          </Link>
          {(allCategories ?? []).map((cat) => (
            <Link
              key={cat.id}
              href={`/magazin/kategorie/${cat.slug}/`}
              className={`shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                cat.slug === slug
                  ? "bg-[#1db682] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-[#1db682] hover:text-white"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Artikel-Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {(articles ?? []).length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold">
              Noch keine Artikel in dieser Kategorie.
            </p>
            <Link
              href="/magazin/"
              className="inline-block mt-4 text-sm text-[#1db682] hover:underline"
            >
              ← Zurück zum Magazin
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">
              {(articles ?? []).length} Artikel in „{category.name}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(articles ?? []).map((a) => (
                <ArtikelCard
                  key={a.id}
                  title={a.title}
                  slug={a.slug}
                  excerpt={a.excerpt}
                  cover_image={a.cover_image}
                  published_at={a.published_at}
                  category_name={a.magazin_categories?.name ?? ""}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
