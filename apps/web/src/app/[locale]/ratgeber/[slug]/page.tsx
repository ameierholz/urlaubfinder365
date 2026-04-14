import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { RATGEBER_ARTICLES, getRatgeberArticle } from "@/lib/ratgeber-data";
import { getAlternateUrls } from "@/i18n/routing";
import ThemeFAQAccordion from "@/components/ui/ThemeFAQAccordion";
import { fetchPageSeoMeta } from "@/lib/seo-meta";

import JsonLd from "@/components/seo/JsonLd";
const BASE_URL = "https://www.urlaubfinder365.de";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  // Nur Deutsch statisch generieren — alle anderen Locales werden on-demand
  // per ISR (revalidate=3600) generiert und gecacht.
  return RATGEBER_ARTICLES.map((a) => ({ locale: "de", slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getRatgeberArticle(slug);
  if (!article) return {};
  const seo = await fetchPageSeoMeta(`/ratgeber/${slug}`);
  const canonical = `${BASE_URL}/ratgeber/${article.slug}/`;
  return {
    title: seo?.meta_title || article.seoTitle,
    description: seo?.meta_description || article.seoDescription,
    alternates: { canonical, languages: getAlternateUrls(`/ratgeber/${article.slug}/`) },
    openGraph: {
      title: seo?.og_title || article.seoTitle,
      description: seo?.og_description || article.seoDescription,
      url: canonical,
      type: "article",
      images: [{ url: seo?.og_image || article.heroImage, width: 1920, height: 1080, alt: article.title }],
      publishedTime: article.updatedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

export const revalidate = 86400;

export default async function RatgeberArticlePage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const article = getRatgeberArticle(slug);
  if (!article) notFound();
  const seo = await fetchPageSeoMeta(`/ratgeber/${slug}`);

  const related = article.relatedSlugs
    .map(getRatgeberArticle)
    .filter((a): a is NonNullable<typeof a> => !!a);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Ratgeber",   item: `${BASE_URL}/ratgeber/` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${BASE_URL}/ratgeber/${article.slug}/` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    image: article.heroImage,
    datePublished: article.updatedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: "Urlaubfinder365" },
    publisher: {
      "@type": "Organization",
      name: "Urlaubfinder365",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/ratgeber/${article.slug}/` },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />

      {/* HERO */}
      <div className="relative overflow-hidden -mt-24 pt-24 min-h-[420px] flex items-end">
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)" }} />
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/ratgeber/" className="hover:text-white">Ratgeber</Link>
            <span>/</span>
            <span className="text-white/90">{article.category}</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-[#1db682]/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            📖 {article.category} · {article.readingTimeMin} Min. Lesezeit
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            {article.title}
          </h1>
          <p className="text-white/85 text-lg leading-relaxed">
            {article.lead}
          </p>
        </div>
      </div>

      {/* SEO Intro */}
      {seo?.seo_intro && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <p className="text-gray-600 text-base leading-relaxed">
            {seo.seo_intro}
          </p>
        </div>
      )}

      {/* SEO Middle */}
      {seo?.seo_middle && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
          {seo.seo_h2_middle && (
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{seo.seo_h2_middle}</h2>
          )}
          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
            {seo.seo_middle.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((block, i) => (
              <p key={i}>{block}</p>
            ))}
          </div>
        </div>
      )}

      {/* ARTICLE */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-xs text-gray-400 mb-6 pb-6 border-b border-gray-100">
          Zuletzt aktualisiert: {new Date(article.updatedAt).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
        </div>

        {article.sections.map((s, i) => (
          <section key={i} className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3 leading-tight">{s.heading}</h2>
            <p className="text-gray-700 text-base leading-relaxed">{s.body}</p>
          </section>
        ))}
      </article>

      {/* FAQ */}
      <div className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Häufig gestellte Fragen</h2>
          <ThemeFAQAccordion items={article.faqs.map((f) => ({ q: f.question, a: f.answer }))} accentColor="#1db682" />
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Weitere Ratgeber-Artikel</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/ratgeber/${r.slug}/`}
                className="group bg-white border border-gray-200 hover:border-[#1db682] hover:shadow-md rounded-xl p-5 transition-all"
              >
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{r.category}</p>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#1db682] leading-tight mb-2">
                  {r.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{r.lead}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SEO Bottom */}
      {seo?.seo_bottom && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl">
            {seo.seo_h2_bottom && (
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">{seo.seo_h2_bottom}</h2>
            )}
            <div className="text-gray-600 text-sm leading-relaxed space-y-3">
              {seo.seo_bottom.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-linear-to-br from-[#1db682] to-[#16a070] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bereit für deinen Urlaub?</h2>
            <p className="text-white/85 text-sm">Vergleiche jetzt tagesaktuelle Angebote und finde dein Traumziel.</p>
          </div>
          <Link href="/guenstig-urlaub-buchen/" className="bg-white text-[#1db682] font-semibold px-6 py-3 rounded-full hover:bg-white/95 transition-colors whitespace-nowrap">
            Angebote vergleichen →
          </Link>
        </div>
      </div>
    </div>
  );
}
