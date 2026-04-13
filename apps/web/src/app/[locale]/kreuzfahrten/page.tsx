import type { Metadata } from "next";
import KreuzfahrtenContent from "@/components/cruise/KreuzfahrtenContent";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { fetchPageSeoMeta } from "@/lib/seo-meta";

import JsonLd from "@/components/seo/JsonLd";
export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeoMeta("/kreuzfahrten");
  const year = new Date().getFullYear();
  const next = year + 1;
  const title = seo?.meta_title || `🚢 Kreuzfahrten günstig buchen ${year}/${next}`;
  const description = seo?.meta_description || `Kreuzfahrten ${year}/${next} günstig buchen ✓ AIDA, TUI Cruises & MSC ✓ Mittelmeer, Karibik & Nordeuropa ✓ 30+ Reedereien vergleichen.`;
  return {
    title,
    description,
    keywords: ["Kreuzfahrten günstig buchen", "Kreuzfahrt Mittelmeer", "AIDA Kreuzfahrt", "TUI Cruises", "MSC Kreuzfahrt", "Flusskreuzfahrt", "Kreuzfahrt Karibik", "Kreuzfahrt Angebote", "Billige Kreuzfahrten"],
    alternates: { canonical: "https://www.urlaubfinder365.de/kreuzfahrten/" },
    openGraph: {
      title: seo?.og_title || `🚢 Kreuzfahrten günstig buchen ${year}/${next} | Urlaubfinder365`,
      description: seo?.og_description || description,
      url: "https://www.urlaubfinder365.de/kreuzfahrten/",
      type: "website",
      ...(seo?.og_image ? { images: [{ url: seo.og_image }] } : {}),
    },
  };
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kreuzfahrten günstig buchen",
    description: "Kreuzfahrten günstig buchen – Hochsee & Flussfahrten, Karibik & Mittelmeer, 30+ Reedereien.",
    url: "https://www.urlaubfinder365.de/kreuzfahrten/",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite",    item: "https://www.urlaubfinder365.de/" },
      { "@type": "ListItem", position: 2, name: "Kreuzfahrten",  item: "https://www.urlaubfinder365.de/kreuzfahrten/" },
    ],
  },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kreuzfahrtenPage");
  const seo = await fetchPageSeoMeta("/kreuzfahrten");
  return (
    <>
      <JsonLd data={jsonLd} />

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

      <KreuzfahrtenContent
        sidebar={
          <RightSidebar
            extrasBox={{
              image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=400&h=200&q=70&auto=format",
              eyebrow: t("sidebarEyebrow"),
              title: t("sidebarTitle"),
              description: t("sidebarDesc"),
              href: "/kreuzfahrten/",
              ctaLabel: t("sidebarCta"),
              accentColor: "bg-cyan-700",
            }}
            seoLinksTitle={t("seoLinksTitle")}
            seoLinks={[
              { href: "/urlaubsziele/griechenland/",    label: t("seoLinkMittelmeer") },
              { href: "/urlaubsziele/kanaren/",         label: t("seoLinkKanaren") },
              { href: "/urlaubsziele/skandinavien/",    label: t("seoLinkNorwegen") },
              { href: "/urlaubsziele/karibik/",         label: t("seoLinkKaribik") },
              { href: "/urlaubsarten/pauschalreisen/",  label: t("seoLinkPauschal") },
            ]}
          />
        }
      />

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
    </>
  );
}
