import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import ArtikelCard from "@/components/magazin/artikel-card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Urlaubsmagazin – Reisetipps, Spartipps & mehr | Urlaubfinder365",
  description:
    "Reisetipps, Spartipps, Insider-Guides und Inspiration für deinen nächsten Urlaub. Das Urlaubsmagazin von Urlaubfinder365.",
  alternates: { canonical: "https://www.urlaubfinder365.de/magazin/" },
  openGraph: {
    title: "Urlaubsmagazin – Reisetipps, Spartipps & mehr | Urlaubfinder365",
    description:
      "Reisetipps, Spartipps, Insider-Guides und Inspiration für deinen nächsten Urlaub.",
    url: "https://www.urlaubfinder365.de/magazin/",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Urlaubsmagazin",
      },
    ],
  },
};

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

export default async function MagazinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServer();

  const [{ data: articles }, { data: categories }] = await Promise.all([
    supabase
      .from("magazin_articles" as never)
      .select("id, title, slug, excerpt, cover_image, published_at, magazin_categories(name, slug)")
      .eq("status", "veroeffentlicht")
      .order("published_at", { ascending: false }) as Promise<{ data: Article[] | null }>,
    supabase
      .from("magazin_categories" as never)
      .select("id, name, slug")
      .order("name") as Promise<{ data: Category[] | null }>,
  ]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Urlaubsmagazin – Urlaubfinder365",
      description:
        "Reisetipps, Spartipps, Insider-Guides und Inspiration für deinen nächsten Urlaub.",
      url: "https://www.urlaubfinder365.de/magazin/",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
        { "@type": "ListItem", position: 2, name: "Magazin", item: "https://www.urlaubfinder365.de/magazin/" },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1db682] to-[#6991d8] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-widest mb-3 opacity-80">
            Urlaubsmagazin
          </p>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Reisetipps, Inspirationen & Spartipps
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Alles, was du für deinen nächsten Traumurlaub wissen musst – von
            Insider-Guides bis zu den besten Reisedeals.
          </p>
        </div>
      </section>

      {/* Kategorie-Filter */}
      {(categories ?? []).length > 0 && (
        <section className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            <Link
              href="/magazin/"
              className="shrink-0 text-xs font-bold px-4 py-1.5 rounded-full bg-[#1db682] text-white"
            >
              Alle
            </Link>
            {(categories ?? []).map((cat) => (
              <Link
                key={cat.id}
                href={`/magazin/kategorie/${cat.slug}/`}
                className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-[#1db682] hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Artikel-Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {(articles ?? []).length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold">Noch keine Artikel veröffentlicht.</p>
            <p className="text-sm mt-2">Schau bald wieder vorbei!</p>
          </div>
        ) : (
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
        )}
      </section>
    </>
  );
}
