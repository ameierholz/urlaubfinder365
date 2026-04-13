import type { Metadata } from "next";
import RightSidebar from "@/components/layout/RightSidebar";
import { ShieldCheck, Euro, Clock, Star, ExternalLink } from "lucide-react";
import VersicherungVergleich from "@/components/versicherung/VersicherungVergleich";
import { setRequestLocale } from "next-intl/server";
import { fetchPageSeoMeta } from "@/lib/seo-meta";

const FALLBACK_TITLE = "Reiseversicherung Vergleich 2025 – Günstig & sicher reisen";
const FALLBACK_DESC = "Reiseversicherung vergleichen & online abschließen ✓ Auslandskranken, Rücktritt, Gepäck & Kombipolicen ✓ Ab 9,80 € / Jahr ✓ Testsieger & Empfehlungen.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeoMeta("/reiseversicherung");
  const title = seo?.meta_title || FALLBACK_TITLE;
  const description = seo?.meta_description || FALLBACK_DESC;
  return {
    title,
    description,
    alternates: { canonical: "https://www.urlaubfinder365.de/reiseversicherung/" },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || "Alle Reiseversicherungen im Vergleich: Auslandskranken, Rücktritt, Gepäck & Kombi — jetzt günstig abschließen.",
      url: "https://www.urlaubfinder365.de/reiseversicherung/",
      type: "website",
      ...(seo?.og_image ? { images: [{ url: seo.og_image }] } : {}),
    },
  };
}

const STATS = [
  { icon: ShieldCheck, zahl: "5",         text: "Versicherungstypen" },
  { icon: Star,        zahl: "50+",        text: "Tarife im Vergleich" },
  { icon: Euro,        zahl: "ab 9,80 €",  text: "Preis pro Jahr" },
  { icon: Clock,       zahl: "2 Min.",      text: "Bis zum Abschluss" },
];

const ERV_URL = "https://www.travialinks.de/link/A-30412-0/A/erv";

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = await fetchPageSeoMeta("/reiseversicherung");
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero mit Hintergrundbild */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "420px" }}>
        {/* Hintergrundbild */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80&auto=format"
          alt="Reiseversicherung"
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0e4070]/90 via-[#1a5f9a]/80 to-[#0e4070]/85" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 py-16">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            🛡️ Reiseversicherung Vergleich 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Sicher reisen —<br />günstig versichert
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto leading-relaxed mb-8">
            Vergleiche Auslandskrankenversicherung, Reiserücktritt & Co. und finde den besten Tarif
            für deinen nächsten Urlaub. Ab 9,80 € pro Jahr bereits gut abgesichert.
          </p>

          {/* Haupt-CTA */}
          <a
            href={ERV_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 bg-white text-[#0e4070] font-black px-8 py-4 rounded-2xl text-base shadow-xl hover:bg-blue-50 transition-colors"
          >
            <ShieldCheck className="w-5 h-5" />
            Jetzt Reiseversicherung abschließen
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>
          <p className="text-white/60 text-xs mt-3">ERV – Europäische Reiseversicherung · Marktführer & Testsieger</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
            {STATS.map(({ icon: Icon, zahl, text }) => (
              <div key={text} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <Icon className="w-5 h-5 mx-auto mb-1 text-white/80" />
                <p className="text-xl font-black">{zahl}</p>
                <p className="text-xs text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Wichtigkeits-Banner */}
      <div className="bg-red-50 border-b border-red-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <p className="text-sm text-red-800">
            <strong>Wichtig:</strong> Die gesetzliche Krankenkasse zahlt im Ausland oft gar nicht.
            Ein Krankenhausaufenthalt in den USA kann <strong>50.000 € und mehr</strong> kosten.
            Eine Auslandskrankenversicherung ist für nur ca. 10 € / Jahr unverzichtbar.
          </p>
        </div>
      </div>

      {/* Hauptinhalt + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="xl:flex xl:gap-8 xl:items-start">
          <div className="flex-1 min-w-0">
            <VersicherungVergleich />
          </div>
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <RightSidebar
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&h=200&q=70&auto=format",
                  eyebrow: "Günstig buchen",
                  title: "Pauschalreise + Versicherung",
                  description: "Täglich tausende Pauschalreisen vergleichen – inkl. Versicherungsoptionen.",
                  href: "/guenstig-urlaub-buchen/",
                  ctaLabel: "Angebote vergleichen →",
                }}
                seoLinksTitle="🛡️ Mehr Infos"
                seoLinks={[
                  { href: "/reisewarnungen/", label: "Reisewarnungen" },
                  { href: "/visum-checker/",  label: "Visum-Checker" },
                  { href: "/urlaubsziele/",   label: "Urlaubsziele" },
                ]}
              />
            </div>
          </aside>
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
