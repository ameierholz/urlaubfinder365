import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArtikelContent from "@/components/magazin/artikel-content";
import ArtikelCard from "@/components/magazin/artikel-card";

import JsonLd from "@/components/seo/JsonLd";
export const revalidate = 3600;

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  content: string;
  author_name: string;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  magazin_categories: { id: string; name: string; slug: string } | null;
}

interface RelatedArticle {
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

  const { data: article } = await supabase
    .from("magazin_articles" as never)
    .select("title, meta_title, meta_description, cover_image, published_at")
    .eq("slug", slug)
    .eq("status", "veroeffentlicht")
    .single() as { data: Pick<Article, "title" | "meta_title" | "meta_description" | "cover_image" | "published_at"> | null };

  if (!article) return {};

  const title = article.meta_title || article.title;
  const description = article.meta_description || "";

  return {
    title: `${title} | Urlaubsmagazin`,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.urlaubfinder365.de/magazin/${slug}/`,
      type: "article",
      publishedTime: article.published_at ?? undefined,
      images: article.cover_image
        ? [{ url: article.cover_image, width: 1200, height: 630, alt: title }]
        : [],
    },
    alternates: { canonical: `https://www.urlaubfinder365.de/magazin/${slug}/` },
  };
}

export default async function MagazinArtikelPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServer();

  const { data: article } = await supabase
    .from("magazin_articles" as never)
    .select("id, title, slug, excerpt, cover_image, content, author_name, published_at, meta_title, meta_description, magazin_categories(id, name, slug)")
    .eq("slug", slug)
    .eq("status", "veroeffentlicht")
    .single() as { data: Article | null };

  if (!article) notFound();

  // Verwandte Artikel aus derselben Kategorie
  const { data: related } = await supabase
    .from("magazin_articles" as never)
    .select("id, title, slug, excerpt, cover_image, published_at, magazin_categories(name, slug)")
    .eq("status", "veroeffentlicht")
    .eq("category_id", article.magazin_categories?.id ?? "")
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3) as { data: RelatedArticle[] | null };

  const fallback =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=630&fit=crop&q=80";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      image: article.cover_image || fallback,
      datePublished: article.published_at,
      author: { "@type": "Person", name: article.author_name || "Redaktion" },
      publisher: {
        "@type": "Organization",
        name: "Urlaubfinder365",
        url: "https://www.urlaubfinder365.de/",
      },
      url: `https://www.urlaubfinder365.de/magazin/${article.slug}/`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
        { "@type": "ListItem", position: 2, name: "Magazin", item: "https://www.urlaubfinder365.de/magazin/" },
        { "@type": "ListItem", position: 3, name: article.title, item: `https://www.urlaubfinder365.de/magazin/${article.slug}/` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto px-4 pt-6 pb-2 flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
        <Link href="/" className="hover:text-[#1db682] transition-colors">Startseite</Link>
        <span>/</span>
        <Link href="/magazin/" className="hover:text-[#1db682] transition-colors">Magazin</Link>
        {article.magazin_categories && (
          <>
            <span>/</span>
            <Link
              href={`/magazin/kategorie/${article.magazin_categories.slug}/`}
              className="hover:text-[#1db682] transition-colors"
            >
              {article.magazin_categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Hero / Cover */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={article.cover_image || fallback}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
          />
          {article.magazin_categories && (
            <span className="absolute top-4 left-4 bg-[#1db682] text-white text-xs font-bold px-3 py-1 rounded-full">
              {article.magazin_categories.name}
            </span>
          )}
        </div>
      </div>

      {/* Artikel-Header */}
      <header className="max-w-4xl mx-auto px-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-3">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-lg text-gray-500 leading-relaxed">{article.excerpt}</p>
        )}
        <div className="flex items-center gap-3 mt-4 text-sm text-gray-400">
          <span className="font-semibold text-gray-600">{article.author_name || "Redaktion"}</span>
          {article.published_at && (
            <>
              <span>·</span>
              <time dateTime={article.published_at}>
                {new Date(article.published_at).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 mb-16">
        <ArtikelContent content={article.content} />
      </main>

      {/* Verwandte Artikel */}
      {(related ?? []).length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Weitere Artikel</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(related ?? []).map((a) => (
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
          </div>
        </section>
      )}
    </>
  );
}
