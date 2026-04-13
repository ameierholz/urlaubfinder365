import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { RATGEBER_ARTICLES } from "@/lib/ratgeber-data";
import { getAlternateUrls } from "@/i18n/routing";
import { fetchPageSeoMeta } from "@/lib/seo-meta";

import JsonLd from "@/components/seo/JsonLd";
const BASE_URL = "https://www.urlaubfinder365.de";

const FALLBACK_TITLE = "Reise-Ratgeber & Tipps – Antworten auf die wichtigsten Fragen";
const FALLBACK_DESC = "Alles, was du vor und während der Reise wissen musst: Wann buchen, All Inclusive oder nicht, Pauschalreise vs. Einzelbuchung, Versicherungen und vieles mehr.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeoMeta("/ratgeber");
  const title = seo?.meta_title || FALLBACK_TITLE;
  const description = seo?.meta_description || FALLBACK_DESC;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/ratgeber/`,
      languages: getAlternateUrls("/ratgeber/"),
    },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: `${BASE_URL}/ratgeber/`,
      type: "website",
      ...(seo?.og_image ? { images: [{ url: seo.og_image }] } : {}),
    },
  };
}

export const revalidate = 86400;

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  "Buchung":         { emoji: "📅", color: "bg-sky-100 text-sky-700" },
  "Verpflegung":     { emoji: "🍽️", color: "bg-amber-100 text-amber-700" },
  "Preise":          { emoji: "💰", color: "bg-emerald-100 text-emerald-700" },
  "Planung":         { emoji: "🗺️", color: "bg-purple-100 text-purple-700" },
  "Sicherheit":      { emoji: "🛡️", color: "bg-rose-100 text-rose-700" },
  "Familie":         { emoji: "👨‍👩‍👧", color: "bg-pink-100 text-pink-700" },
  "Trends":          { emoji: "📈", color: "bg-indigo-100 text-indigo-700" },
  "Reisemittel":     { emoji: "✈️", color: "bg-cyan-100 text-cyan-700" },
  "Nachhaltigkeit":  { emoji: "🌱", color: "bg-lime-100 text-lime-700" },
};

export default async function RatgeberIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = await fetchPageSeoMeta("/ratgeber");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Ratgeber",   item: `${BASE_URL}/ratgeber/` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={breadcrumbSchema} />

      {/* HERO */}
      <div className="relative overflow-hidden -mt-24 pt-24 min-h-[380px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80&auto=format"
          alt="Reise-Ratgeber & Tipps"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)" }} />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white/90">Ratgeber</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-[#1db682]/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 shadow-lg">
            📚 Reise-Ratgeber
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            Reise-Ratgeber &amp; Tipps<br />
            <span className="text-emerald-200">Alles, was du wissen musst</span>
          </h1>
          <p className="text-white/85 text-lg max-w-2xl leading-relaxed">
            Ehrliche Antworten auf die wichtigsten Fragen rund um Buchung, Verpflegung, Preise,
            Planung und Sicherheit – von Reisenden für Reisende.
          </p>
        </div>
      </div>

      {/* SEO Intro */}
      {seo?.seo_intro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
            {seo.seo_intro}
          </p>
        </div>
      )}

      {/* SEO Middle */}
      {seo?.seo_middle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
          {seo.seo_h2_middle && (
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{seo.seo_h2_middle}</h2>
          )}
          <div className="text-gray-600 text-sm leading-relaxed max-w-3xl space-y-3">
            {seo.seo_middle.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((block, i) => (
              <p key={i}>{block}</p>
            ))}
          </div>
        </div>
      )}

      {/* ARTICLES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Alle Ratgeber-Artikel</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-2xl">
          {RATGEBER_ARTICLES.length} redaktionell aufbereitete Artikel zu den häufigsten Urlauberfragen.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RATGEBER_ARTICLES.map((a) => {
            const catMeta = CATEGORY_META[a.category] ?? { emoji: "📖", color: "bg-gray-100 text-gray-700" };
            return (
              <Link
                key={a.slug}
                href={`/ratgeber/${a.slug}/`}
                className="group bg-white border border-gray-200 hover:border-[#1db682] hover:shadow-lg rounded-2xl overflow-hidden transition-all flex flex-col"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={a.heroImage}
                    alt={a.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${catMeta.color}`}>
                      {catMeta.emoji} {a.category}
                    </span>
                    <span className="text-xs text-gray-400">· {a.readingTimeMin} Min. Lesezeit</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1db682] leading-tight mb-2">
                    {a.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">{a.lead}</p>
                  <span className="mt-3 text-[#1db682] text-sm font-semibold group-hover:underline">Artikel lesen →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SEO Bottom */}
      {seo?.seo_bottom && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
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
    </div>
  );
}
