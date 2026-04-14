import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Handshake, Megaphone, MapPin, Users, Globe, TrendingUp,
  CheckCircle2, ChevronRight, ShieldCheck, HeadphonesIcon,
  Languages, ArrowRight, Star, BadgeCheck, Euro,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { SeoTextBlocks } from "@/components/seo/seo-text-blocks";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("partnerHubPage");
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "https://www.urlaubfinder365.de/partner/" },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDesc"),
      url: "https://www.urlaubfinder365.de/partner/",
      type: "website",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Partner werden – Urlaubfinder365",
  description:
    "Zwei Wege zur Zusammenarbeit: Werbeplätze für Unternehmen oder Touren & Aktivitäten am Urlaubsziel listen.",
  url: "https://www.urlaubfinder365.de/partner/",
};

export default async function PartnerHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("partnerHubPage");

  const COMPARE_ROWS = [
    { label: t("compareRow1"), ad: t("compareRow1Ad"), provider: t("compareRow1Provider") },
    { label: t("compareRow2"), ad: t("compareRow2Ad"), provider: t("compareRow2Provider") },
    { label: t("compareRow3"), ad: t("compareRow3Ad"), provider: t("compareRow3Provider") },
    { label: t("compareRow4"), ad: t("compareRow4Ad"), provider: t("compareRow4Provider") },
    { label: t("compareRow5"), ad: t("compareRow5Ad"), provider: t("compareRow5Provider") },
    { label: t("compareRow6"), ad: t("compareRow6Ad"), provider: t("compareRow6Provider") },
  ];

  const FAQ = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
    { q: t("faq5q"), a: t("faq5a") },
  ];

  const TRUST = [
    { icon: Users,          title: t("trustFeature1"),     desc: t("trustFeature1Desc") },
    { icon: TrendingUp,     title: t("trustFeature2"),     desc: t("trustFeature2Desc") },
    { icon: ShieldCheck,    title: t("trustFeature3"),     desc: t("trustFeature3Desc") },
    { icon: HeadphonesIcon, title: t("trustFeature4"),     desc: t("trustFeature4Desc") },
  ];

  const STATS = [
    { value: t("stat1"), label: t("stat1Label"), icon: Users },
    { value: t("stat2"), label: t("stat2Label"), icon: MapPin },
    { value: t("stat3"), label: t("stat3Label"), icon: TrendingUp },
    { value: t("stat4"), label: t("stat4Label"), icon: Languages },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "400px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80&auto=format"
          alt={t("heroBadge")}
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#0f2027]/95 via-[#1a3a4a]/85 to-[#1db682]/50" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-20">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Handshake className="w-4 h-4 text-[#1db682]" /> {t("heroBadge")}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
            {t("heroTitle1")}{" "}
            <span className="text-[#a8f0d8]">{t("heroTitle2")}</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
            {t("heroDesc")}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#wege"
              className="inline-flex items-center gap-2 bg-[#1db682] hover:bg-[#18a270] text-white font-black px-8 py-4 rounded-2xl shadow-lg transition-colors"
            >
              {t("heroCtaOptions")} <ChevronRight className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${t("ctaEmail")}`}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl transition-colors"
            >
              {t("heroCtaContact")}
            </a>
          </div>
        </div>
      </section>

      {/* ── Zwei Wege ─────────────────────────────────────────────────────── */}
      <section id="wege" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">
              {t("pathsTitle")}
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              {t("pathsSubtitle")}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {t("pathsDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* ── Werbepartner-Karte ──────────────────────────────────────── */}
            <div className="group relative rounded-3xl border-2 border-[#1db682]/30 hover:border-[#1db682] bg-gradient-to-br from-[#1db682]/5 to-transparent p-8 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1db682]/10 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-[#1db682]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">{t("adTitle")}</h3>
                  <p className="text-xs text-gray-500 font-semibold">{t("adSubtitle")}</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {t("adDesc")}
              </p>

              <ul className="space-y-2.5 mb-6 flex-1">
                {[t("adFeature1"), t("adFeature2"), t("adFeature3"), t("adFeature4"), t("adFeature5")].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#1db682] shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>

              <div className="bg-[#1db682]/8 border border-[#1db682]/15 rounded-xl px-4 py-3 mb-6">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-bold text-[#1db682]">Ideal für:</span>{" "}
                  {t("adIdeal").replace("Ideal für: ", "")}
                </p>
              </div>

              <Link
                href="/werbepartner/"
                className="block text-center bg-[#1db682] hover:bg-[#18a270] text-white font-black px-6 py-4 rounded-2xl transition-colors text-sm"
              >
                {t("adCta")} <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
            </div>

            {/* ── Erlebnis-Anbieter-Karte ─────────────────────────────────── */}
            <div className="group relative rounded-3xl border-2 border-[#6991d8]/30 hover:border-[#6991d8] bg-gradient-to-br from-[#6991d8]/5 to-transparent p-8 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#6991d8]/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#6991d8]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">{t("providerTitle")}</h3>
                  <p className="text-xs text-gray-500 font-semibold">{t("providerSubtitle")}</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {t("providerDesc")}
              </p>

              <ul className="space-y-2.5 mb-6 flex-1">
                {[t("providerFeature1"), t("providerFeature2"), t("providerFeature3"), t("providerFeature4"), t("providerFeature5")].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#6991d8] shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>

              <div className="bg-[#6991d8]/8 border border-[#6991d8]/15 rounded-xl px-4 py-3 mb-6">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-bold text-[#6991d8]">Ideal für:</span>{" "}
                  {t("providerIdeal").replace("Ideal für: ", "")}
                </p>
              </div>

              <Link
                href="/marktplatz/anbieter-werden/"
                className="block text-center bg-[#6991d8] hover:bg-[#5a80c7] text-white font-black px-6 py-4 rounded-2xl transition-colors text-sm"
              >
                {t("providerCta")} <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* ── Preisübersicht ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">
              {t("pricingTitle")}
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              {t("pricingSubtitle")}
            </h2>
          </div>

          {/* ═══════ A) Werbepartner ═══════════════════════════════════════ */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-5 h-5 text-[#1db682]" />
              <h3 className="text-xl font-black text-gray-900">{t("pricingAdHeading")}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              {t("pricingAdNote")} &middot; Zielseite frei w&auml;hlbar (Stadt, Region oder Land)
            </p>

            {/* ── Alle Platzierungen als Tabelle ──────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-bold text-gray-700">Alle Werbeplatzierungen &amp; Formate</p>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { zone: "Content", pos: "Oben",  format: "Leaderboard",      size: "728 \u00d7 90 px",  price: "79",  color: "bg-[#1db682]", desc: "Prominent \u00fcber dem Content" },
                  { zone: "Content", pos: "Mitte", format: "In-Content-Banner", size: "468 \u00d7 120 px", price: "99",  color: "bg-blue-500",  desc: "Zwischen Abschnitten eingebettet" },
                  { zone: "Content", pos: "Unten", format: "Sponsored Karte",   size: "300 \u00d7 200 px", price: "49",  color: "bg-amber-500", desc: "Gesponserte Angebotskarte mit Bild + CTA" },
                  { zone: "Sidebar", pos: "Oben",  format: "Sidebar-Banner",    size: "250 \u00d7 160 px", price: "89",  color: "bg-purple-500", desc: "Klassischer Werbebanner in der Sidebar" },
                  { zone: "Sidebar", pos: "Mitte", format: "Angebotskarte",     size: "250 \u00d7 200 px", price: "69",  color: "bg-teal-500",  desc: "Sponsored Angebot mit Bild + Preis" },
                  { zone: "Sidebar", pos: "Unten", format: "Partner-Widget",    size: "250 \u00d7 80 px",  price: "49",  color: "bg-[#1db682]", desc: "Avatar + Name + Link im Lokale-Partner-Widget" },
                  { zone: "Bundle",  pos: "\u2014", format: "Rundum-Paket",      size: "Alle Formate",     price: "299", color: "bg-gray-800",  desc: "Content + Sidebar + Homepage-Carousel kombiniert" },
                ].map((slot) => (
                  <div key={slot.format} className="px-5 py-3 flex items-center gap-4">
                    <div className={`w-2 h-8 rounded-full ${slot.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-gray-900">{slot.format}</span>
                        <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{slot.zone} {slot.pos}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">{slot.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-gray-400">{slot.size}</p>
                      <p className="text-sm font-black text-gray-900">ab {slot.price} &euro;<span className="text-[10px] text-gray-400 font-normal">/Mo</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[11px] text-gray-400">
                Alle Preise zzgl. MwSt. &middot; Flexible Laufzeiten ab 1 Monat &middot; Rabatte: 3 Mo. &minus;5 % &middot; 6 Mo. &minus;10 % &middot; 12 Mo. &minus;15 % &middot; Werbematerial kostenlos
              </p>
              <Link
                href="/werbepartner/#pakete"
                className="inline-flex items-center gap-1.5 bg-[#1db682] hover:bg-[#18a270] text-white font-bold px-6 py-2.5 rounded-2xl transition-colors text-sm"
              >
                {t("pricingAdCta")} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ═══════ B) Erlebnis-Anbieter ═════════════════════════════════ */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-[#6991d8]" />
              <h3 className="text-xl font-black text-gray-900">{t("pricingProviderHeading")}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {t("pricingProviderNote")}
            </p>

            {/* Kostenlos-Listing-Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Euro className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-black text-emerald-700 text-sm">{t("pricingProviderFree")} — {t("pricingProviderFreeDesc")}</p>
                  <p className="text-xs text-emerald-600/70">{t("pricingProviderCommission")} {t("pricingProviderCommissionDesc")} · {t("pricingProviderVerified")} {t("pricingProviderVerifiedDesc")}</p>
                </div>
              </div>
              <Link
                href="/marktplatz/anbieter-werden/"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shrink-0"
              >
                {t("pricingProviderCta")} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Optionale Werbeplatz-Pakete für Anbieter */}
            <p className="text-xs font-bold text-[#6991d8] uppercase tracking-widest mb-1">Optional: Mehr Sichtbarkeit buchen</p>
            <p className="text-xs text-gray-400 mb-4">Profil oder einzelne Aktivitäten gezielt auf Zielseiten bewerben — wählbare Platzierung.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {/* Platzierungs-Pakete */}
              {[
                { icon: MapPin,  label: "Stadtseite",          position: "Auf einer Stadtseite deiner Wahl", preis: 49, badge: null as string | null, target: "Ort wählbar", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: MapPin,  label: "Stadtseite Top-Platz", position: "Immer ganz oben auf der Stadtseite", preis: 79, badge: "Beliebt", target: "Ort wählbar", color: "text-indigo-600", bg: "bg-indigo-50" },
                { icon: Users,   label: "Anbieter-Spotlight",  position: 'Sidebar \u201eEmpfohlene Anbieter\u201c', preis: 99, badge: null, target: "Alle Marktplatz-Seiten", color: "text-violet-600", bg: "bg-violet-50" },
                { icon: MapPin,  label: "Themenseite",         position: "Alle Seiten einer Aktivitätskategorie", preis: 99, badge: null, target: "Kategorie wählbar", color: "text-cyan-600", bg: "bg-cyan-50" },
                { icon: Globe,   label: "Regionspaket",        position: "Alle Seiten eines Landes / einer Region", preis: 149, badge: null, target: "Region wählbar", color: "text-teal-600", bg: "bg-teal-50" },
                { icon: MapPin,  label: "Rundum-Paket",        position: "Startseite + Kategorie + Region", preis: 299, badge: "Bestes P/L", target: "Alles kombiniert", color: "text-orange-600", bg: "bg-orange-50" },
              ].map((p) => (
                <div key={p.label} className={`relative rounded-xl border border-gray-200 ${p.bg} px-4 py-3 flex items-start gap-3`}>
                  {p.badge && (
                    <span className="absolute -top-2 right-3 bg-[#6991d8] text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                  )}
                  <div className={`w-8 h-8 rounded-lg ${p.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <p.icon className={`w-4 h-4 ${p.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-black text-gray-900">{p.label}</p>
                      <p className={`text-sm font-black ${p.color} shrink-0`}>{p.preis} €<span className="text-[10px] text-gray-400 font-normal">/Mo</span></p>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-snug">{p.position}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Zielseite: {p.target}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Homepage-Carousel */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Homepage Featured Carousel</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { icon: "⚡", label: "Homepage Starter",   preis: 99,  badge: null as string | null, desc: "Featured-Carousel auf der Startseite" },
                { icon: "⭐", label: "Homepage Featured",  preis: 199, badge: "Meiste Reichweite",   desc: "Prominente Platzierung + Sponsored-Badge" },
                { icon: "👑", label: "Homepage Premium",   preis: 349, badge: "Premium",              desc: "Top-Position + Newsletter + Account-Manager" },
              ].map((p) => (
                <div key={p.label} className="relative rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50/50 to-transparent px-4 py-3">
                  {p.badge && (
                    <span className="absolute -top-2 right-3 bg-amber-400 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                  )}
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <p className="text-xs font-black text-gray-900">{p.icon} {p.label}</p>
                    <p className="text-sm font-black text-amber-600 shrink-0">{p.preis} €<span className="text-[10px] text-gray-400 font-normal">/Mo</span></p>
                  </div>
                  <p className="text-[10px] text-gray-500">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[11px] text-gray-400">
                Listing kostenlos · Werbepakete optional · Laufzeitrabatte: 3 Mo. −10 % · 6 Mo. −15 % · 12 Mo. −20 %
              </p>
              <Link
                href="/anbieter/werbeplatz/"
                className="inline-flex items-center gap-1.5 bg-[#6991d8] hover:bg-[#5a80c7] text-white font-bold px-6 py-2.5 rounded-2xl transition-colors text-sm"
              >
                Alle Werbepakete für Anbieter <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vergleichstabelle ─────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">
              {t("compareTitle")}
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {t("compareSubtitle")}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-gray-200">
              <div className="px-5 py-4 font-bold text-xs text-gray-400 uppercase tracking-widest">
                {t("compareHeader1")}
              </div>
              <div className="px-5 py-4 text-center border-l border-gray-200">
                <div className="inline-flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-[#1db682]" />
                  <span className="font-bold text-sm text-gray-900">{t("compareHeader2")}</span>
                </div>
              </div>
              <div className="px-5 py-4 text-center border-l border-gray-200">
                <div className="inline-flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#6991d8]" />
                  <span className="font-bold text-sm text-gray-900">{t("compareHeader3")}</span>
                </div>
              </div>
            </div>

            {/* Rows */}
            {COMPARE_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 ${i < COMPARE_ROWS.length - 1 ? "border-b border-gray-100" : ""} ${i % 2 === 1 ? "bg-gray-50/50" : ""}`}
              >
                <div className="px-5 py-4 font-semibold text-sm text-gray-700">
                  {row.label}
                </div>
                <div className="px-5 py-4 text-sm text-gray-600 text-center border-l border-gray-100">
                  {row.ad}
                </div>
                <div className="px-5 py-4 text-sm text-gray-600 text-center border-l border-gray-100">
                  {row.provider}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats + Trust ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">
              {t("statsTitle")}
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {t("statsSubtitle")}
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center"
              >
                <Icon className="w-5 h-5 mx-auto mb-2 text-[#1db682]" />
                <p className="text-2xl font-black text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Trust Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="w-9 h-9 bg-[#1db682]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[#1db682]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1db682] mb-2">
              {t("faqTitle")}
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {t("faqSubtitle")}
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#0f2027] via-[#1a3a4a] to-[#1db682] rounded-3xl p-10 text-white">
            <Handshake className="w-10 h-10 mx-auto mb-4 text-[#a8f0d8]" />
            <h2 className="text-2xl font-black mb-3">{t("ctaTitle")}</h2>
            <p className="text-white/75 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
              {t("ctaDesc")}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
              <Link
                href="/werbepartner/"
                className="inline-flex items-center justify-center gap-2 bg-[#1db682] hover:bg-[#18a270] text-white font-black px-7 py-3.5 rounded-2xl transition-colors"
              >
                <Megaphone className="w-4 h-4" /> {t("ctaAd")}
              </Link>
              <Link
                href="/marktplatz/anbieter-werden/"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold px-7 py-3.5 rounded-2xl transition-colors"
              >
                <Globe className="w-4 h-4" /> {t("ctaProvider")}
              </Link>
            </div>

            <a
              href={`mailto:${t("ctaEmail")}`}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              {t("ctaContact")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
