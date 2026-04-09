import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface Article {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string;
  category_name: string;
}

export default async function MagazinTeaser() {
  let articles: Article[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data } = await supabase
      .from("magazin_articles")
      .select("slug, title, excerpt, cover_image, published_at, magazin_categories(name)")
      .eq("status", "veroeffentlicht")
      .order("published_at", { ascending: false })
      .limit(3) as unknown as {
        data: (Article & { magazin_categories: { name: string } | null })[] | null;
      };

    articles = (data ?? []).map((a) => ({
      ...a,
      category_name: a.magazin_categories?.name ?? "",
    }));
  } catch {
    return null;
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-12" style={{ backgroundColor: "rgba(238,206,161,0.12)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Newspaper className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Aus unserem Magazin</h2>
              <p className="text-xs text-gray-500 mt-0.5">Reisetipps, Spartricks & Inspiration</p>
            </div>
          </div>
          <Link
            href="/magazin/"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Alle Artikel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/magazin/${article.slug}/`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all"
            >
              {/* Cover Image */}
              {article.cover_image && (
                <div className="relative h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {article.category_name && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {article.category_name}
                    </span>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1.5">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-gray-400">
                    {new Date(article.published_at).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    Lesen →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-5 sm:hidden text-center">
          <Link
            href="/magazin/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600"
          >
            Alle Artikel ansehen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
