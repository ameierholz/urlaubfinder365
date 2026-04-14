import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";

import JsonLd from "@/components/seo/JsonLd";
import { SeoTextBlocks } from "@/components/seo/seo-text-blocks";
export const metadata: Metadata = {
  title: "Urlaubsmagazin – Reisetipps, Spartipps & mehr | Urlaubfinder365",
  description:
    "Reisetipps, Spartipps, Insider-Guides und Inspiration für deinen nächsten Urlaub. Das Urlaubsmagazin von Urlaubfinder365.",
  alternates: { canonical: "https://www.urlaubfinder365.de/magazin/" },
  openGraph: {
    title: "Urlaubsmagazin | Urlaubfinder365",
    description: "Reisetipps, Spartipps und Inspiration für deinen nächsten Urlaub.",
    url: "https://www.urlaubfinder365.de/magazin/",
    type: "website",
  },
};

interface Category { id: string; name: string; slug: string }
interface Article {
  id: string; title: string; slug: string; excerpt: string;
  cover_image: string; published_at: string | null;
  magazin_categories: { name: string; slug: string } | null;
}

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
}

export default async function MagazinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServer();
  const [{ data: articles }, { data: categories }] = await Promise.all([
    supabase.from("magazin_articles" as never)
      .select("id, title, slug, excerpt, cover_image, published_at, magazin_categories(name, slug)")
      .eq("status", "veroeffentlicht")
      .order("published_at", { ascending: false }) as unknown as Promise<{ data: Article[] | null }>,
    supabase.from("magazin_categories" as never)
      .select("id, name, slug")
      .order("name") as unknown as Promise<{ data: Category[] | null }>,
  ]);

  const all = articles ?? [];
  const hero = all[0];
  const featured = all.slice(1, 3);
  const mid = all.slice(3, 7);
  const rest = all.slice(7);

  // Kategorien mit Artikelanzahl
  const catCounts = new Map<string, number>();
  for (const a of all) {
    const cat = a.magazin_categories?.slug;
    if (cat) catCounts.set(cat, (catCounts.get(cat) ?? 0) + 1);
  }

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Blog", name: "Urlaubsmagazin", url: "https://www.urlaubfinder365.de/magazin/" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Magazin", item: "https://www.urlaubfinder365.de/magazin/" },
    ]},
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #0d1f35 0%, #1a3a5c 50%, #0d6e8c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-[#1db682]" />
            <span className="text-[#1db682] text-xs font-bold uppercase tracking-widest">Urlaubsmagazin</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-3">
            Reisetipps &<br /><span className="text-[#1db682]">Inspiration</span>
          </h1>
          <p className="text-white/60 text-lg max-w-lg">
            {all.length} Artikel zu Reisetipps, Spartricks, Reiserecht und den schönsten Zielen der Welt.
          </p>
        </div>
      </section>

      {/* Kategorie-Filter */}
      {(categories ?? []).length > 0 && (
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            <Link href="/magazin/" className="shrink-0 text-xs font-bold px-4 py-1.5 rounded-full bg-[#1db682] text-white">
              Alle ({all.length})
            </Link>
            {(categories ?? []).map((cat) => (
              <Link key={cat.id} href={`/magazin/kategorie/${cat.slug}/`}
                className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-[#1db682] hover:text-white transition-colors">
                {cat.name} {catCounts.get(cat.slug) ? `(${catCounts.get(cat.slug)})` : ""}
              </Link>
            ))}
          </div>
        </div>
      )}

      {all.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
          <p className="text-lg font-semibold">Noch keine Artikel veröffentlicht.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

          {/* ── AUFMACHER: Hero-Artikel + 2 Featured ── */}
          {hero && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Großer Aufmacher */}
              <Link href={`/magazin/${hero.slug}/`} className="lg:col-span-3 group relative rounded-2xl overflow-hidden bg-gray-900" style={{ minHeight: 380 }}>
                {hero.cover_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hero.cover_image} alt={hero.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {hero.magazin_categories?.name && (
                    <span className="inline-block bg-[#1db682] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide mb-3">
                      {hero.magazin_categories.name}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2 group-hover:text-[#1db682] transition-colors">
                    {hero.title}
                  </h2>
                  {hero.excerpt && <p className="text-white/70 text-sm line-clamp-2">{hero.excerpt}</p>}
                  <p className="text-white/40 text-xs mt-3">{fmtDate(hero.published_at)}</p>
                </div>
              </Link>

              {/* 2 Featured rechts */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {featured.map((a) => (
                  <Link key={a.id} href={`/magazin/${a.slug}/`} className="group flex-1 relative rounded-2xl overflow-hidden bg-gray-900" style={{ minHeight: 180 }}>
                    {a.cover_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.cover_image} alt={a.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {a.magazin_categories?.name && (
                        <span className="inline-block bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase mb-2">
                          {a.magazin_categories.name}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#1db682] transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                      <p className="text-white/40 text-[10px] mt-1.5">{fmtDate(a.published_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── MITTLERE KACHELN: 4 Artikel ── */}
          {mid.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {mid.map((a) => (
                <Link key={a.id} href={`/magazin/${a.slug}/`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                  {a.cover_image && (
                    <div className="relative h-36 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.cover_image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      {a.magazin_categories?.name && (
                        <span className="absolute top-2 left-2 bg-[#1db682] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {a.magazin_categories.name}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-3.5">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#1db682] transition-colors line-clamp-2 mb-1">{a.title}</h3>
                    {a.excerpt && <p className="text-xs text-gray-500 line-clamp-2">{a.excerpt}</p>}
                    <p className="text-[10px] text-gray-400 mt-2">{fmtDate(a.published_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ── REST: Liste mit kleinen Thumbnails ── */}
          {rest.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Weitere Artikel</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rest.map((a) => (
                  <Link key={a.id} href={`/magazin/${a.slug}/`} className="group flex gap-4 bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md transition-all">
                    {a.cover_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.cover_image} alt={a.title} className="w-20 h-20 rounded-lg object-cover shrink-0" loading="lazy" />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      {a.magazin_categories?.name && (
                        <span className="text-[9px] text-[#1db682] font-bold uppercase tracking-wide">{a.magazin_categories.name}</span>
                      )}
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#1db682] transition-colors line-clamp-2">{a.title}</h3>
                      <p className="text-[10px] text-gray-400 mt-1">{fmtDate(a.published_at)}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1db682] shrink-0 self-center transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
