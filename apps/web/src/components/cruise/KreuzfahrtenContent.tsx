"use client";

import Image from "next/image";
import Link from "next/link";
import PageNavBar from "@/components/ui/PageNavBar";
import {
  Ship, Anchor, Waves, Plane, Zap, Star, MapPin,
  Users, ChevronRight, Check, Compass, ArrowRight,
} from "lucide-react";
import CruiseWidget from "@/components/cruise/CruiseWidget";
import { useTranslations } from "next-intl";
import type React from "react";

const PARTNER_ID = "30412";
const DL = (params = "") =>
  `https://kreuzfahrten.travelsystem.de/de?p=2&subid=${PARTNER_ID}${params}`;

function openModal(url: string, title = "Kreuzfahrten buchen") {
  const w = window as typeof window & {
    ibeOpenBooking?: (u: string, t: string) => void;
  };
  if (w.ibeOpenBooking) {
    w.ibeOpenBooking(url, title);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// ─── Beliebte Reedereien (Markennamen nicht übersetzen) ───────────────────────
const REEDEREIEN = [
  { id: 1,  name: "AIDA Cruises",          color: "bg-red-600",    flag: "🇩🇪", tagKey: "reedereienTagBeliebt" },
  { id: 7,  name: "TUI Cruises",           color: "bg-blue-600",   flag: "🇩🇪", tagKey: "reedereienTagDeutsch" },
  { id: 15, name: "MSC Cruises",           color: "bg-sky-700",    flag: "🌍", tagKey: "" },
  { id: 11, name: "Royal Caribbean",       color: "bg-indigo-700", flag: "🌍", tagKey: "reedereienTagGroesteSchiffe" },
  { id: 10, name: "Norwegian Cruise Line", color: "bg-teal-700",   flag: "🌍", tagKey: "" },
  { id: 18, name: "Celebrity Cruises",     color: "bg-slate-700",  flag: "🌍", tagKey: "reedereienTagPremium" },
  { id: 14, name: "Costa Kreuzfahrten",    color: "bg-green-700",  flag: "🇮🇹", tagKey: "" },
  { id: 17, name: "Hapag-Lloyd Cruises",   color: "bg-amber-700",  flag: "🇩🇪", tagKey: "reedereienTagLuxus" },
  { id: 2,  name: "A-ROSA",               color: "bg-pink-700",   flag: "🇩🇪", tagKey: "reedereienTagFluss" },
  { id: 26, name: "Phoenix Seereisen",     color: "bg-sand-700",   flag: "🇩🇪", tagKey: "" },
  { id: 30, name: "Silversea",             color: "bg-gray-700",   flag: "🌍", tagKey: "reedereienTagUltraLuxus" },
  { id: 27, name: "Princess Cruises",      color: "bg-violet-700", flag: "🌍", tagKey: "" },
];

// ─── Wave SVG Divider ──────────────────────────────────────────────────────────
function WaveDivider({ flip = false, topColor = "#f9fafb", bottomColor = "#ffffff" }) {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ background: bottomColor }}>
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", transform: flip ? "scaleY(-1)" : undefined, background: topColor }}
      >
        <path
          d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}

export default function KreuzfahrtenContent({ sidebar }: { sidebar?: React.ReactNode }) {
  const t = useTranslations("kreuzfahrtenPage");
  const year = new Date().getFullYear();
  const next = year + 1;

  const CRUISE_TYPES = [
    {
      icon: Ship,
      title: t("typeHochseeTitle"),
      desc: t("typeHochseeDesc"),
      gradient: "from-blue-900 to-blue-700",
      href: DL("&type=NS"),
      label: t("typeHochseeLabel"),
    },
    {
      icon: Plane,
      title: t("typeFlugTitle"),
      desc: t("typeFlugDesc"),
      gradient: "from-sky-800 to-cyan-600",
      href: DL("&type=S"),
      label: t("typeFlugLabel"),
    },
    {
      icon: Waves,
      title: t("typeFlussTitle"),
      desc: t("typeFlussDesc"),
      gradient: "from-teal-800 to-emerald-600",
      href: DL("&type=R"),
      label: t("typeFlussLabel"),
    },
    {
      icon: Compass,
      title: t("typeHotelTitle"),
      desc: t("typeHotelDesc"),
      gradient: "from-indigo-800 to-purple-600",
      href: DL("&type=KOMBI"),
      label: t("typeHotelLabel"),
    },
    {
      icon: Zap,
      title: t("typeLastMinuteTitle"),
      desc: t("typeLastMinuteDesc"),
      gradient: "from-sand-700 to-red-600",
      href: DL("&sort=pauf&sdt=1"),
      label: t("typeLastMinuteLabel"),
    },
    {
      icon: Star,
      title: t("typeLuxusTitle"),
      desc: t("typeLuxusDesc"),
      gradient: "from-amber-700 to-yellow-600",
      href: DL("&cab=4"),
      label: t("typeLuxusLabel"),
    },
  ];

  const KABINEN = [
    {
      cab: 1,
      title: t("kabineInnenTitel"),
      price: t("kabineInnenPreis"),
      desc: t("kabineInnenDesc"),
      perks: [t("kabineInnenPerk1"), t("kabineInnenPerk2"), t("kabineInnenPerk3")],
      color: "border-gray-200",
      badge: t("kabineInnenBadge"),
      badgeColor: "bg-gray-100 text-gray-700",
    },
    {
      cab: 2,
      title: t("kabineAussenTitel"),
      price: t("kabineAussenPreis"),
      desc: t("kabineAussenDesc"),
      perks: [t("kabineAussenPerk1"), t("kabineAussenPerk2"), t("kabineAussenPerk3")],
      color: "border-blue-200",
      badge: t("kabineAussenBadge"),
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      cab: 3,
      title: t("kabineBalkonTitel"),
      price: t("kabineBalkonPreis"),
      desc: t("kabineBalkonDesc"),
      perks: [t("kabineBalkonPerk1"), t("kabineBalkonPerk2"), t("kabineBalkonPerk3")],
      color: "border-sky-300",
      badge: t("kabineBalkonBadge"),
      badgeColor: "bg-sky-100 text-sky-700",
    },
    {
      cab: 4,
      title: t("kabineSuiteTitel"),
      price: t("kabineSuitePreis"),
      desc: t("kabineSuiteDesc"),
      perks: [t("kabineSuitePerk1"), t("kabineSuitePerk2"), t("kabineSuitePerk3")],
      color: "border-amber-300",
      badge: t("kabineSuiteBadge"),
      badgeColor: "bg-amber-100 text-amber-700",
    },
  ];

  const DESTINATIONEN = [
    {
      title: t("destMittelmeerTitle"),
      sub: t("destMittelmeerSub"),
      img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80&auto=format",
      href: DL("&type=NS"),
      label: t("destMittelmeerLabel"),
    },
    {
      title: t("destKaribikTitle"),
      sub: t("destKaribikSub"),
      img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80&auto=format",
      href: DL("&type=NS"),
      label: t("destKaribikLabel"),
    },
    {
      title: t("destNordeuropaTitle"),
      sub: t("destNordeuropaSub"),
      img: "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=800&q=80&auto=format",
      href: DL("&type=NS"),
      label: t("destNordeuropaLabel"),
    },
    {
      title: t("destFlussTitle"),
      sub: t("destFlussSub"),
      img: "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=80&auto=format",
      href: DL("&type=R"),
      label: t("destFlussLabel"),
    },
  ];

  const SEO_TIPPS = [
    t("seoTipp1"),
    t("seoTipp2"),
    t("seoTipp3"),
    t("seoTipp4"),
    t("seoTipp5"),
  ];

  const SEO_FUER_WEN = [
    t("seoFuerWen1"),
    t("seoFuerWen2"),
    t("seoFuerWen3"),
    t("seoFuerWen4"),
    t("seoFuerWen5"),
  ];

  const FAQ = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
    { q: t("faqQ4"), a: t("faqA4") },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[380px] md:h-[440px] flex items-center overflow-hidden -mt-24 pt-24">
        {/* Background Image */}
        <Image
          src="/images/kreuzfahrten-hero.jpg"
          alt="Kreuzfahrtschiff auf dem Meer"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Ocean gradient overlay – dark left + subtle right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(5,30,65,0.90) 0%, rgba(5,40,80,0.75) 45%, rgba(0,60,100,0.45) 75%, rgba(0,80,120,0.20) 100%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">

            {/* Linke Spalte: Headline + Text + CTAs */}
            <div className="flex-1 min-w-0">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Ship className="w-4 h-4 text-cyan-300" />
                <span className="text-xs font-bold text-cyan-200 uppercase tracking-widest">
                  {t("heroEyebrow", { year, next })}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
                {t("heroTitle")}
                <br />
                <span className="text-cyan-300">{t("heroTitleAccent")}</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 max-w-xl drop-shadow">
                {t("heroDesc")}
              </p>

            </div>

            {/* Rechte Spalte: Trust-Chips */}
            <div className="hidden lg:flex flex-col gap-2.5 shrink-0 mt-6 lg:mt-0">
              {[
                { icon: Ship,  text: t("trustChip1") },
                { icon: Star,  text: t("trustChip2") },
                { icon: Users, text: t("trustChip3") },
                { icon: Waves, text: t("trustChip4") },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2.5 rounded-xl border border-white/15"
                >
                  <Icon className="w-4 h-4 shrink-0 text-cyan-300" />
                  {text}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Schnellnavigation ────────────────────────────────────────────────── */}
      <PageNavBar items={[
        { id: "kreuzfahrt-typen",      label: t("navTypen"),      emoji: "🚢" },
        { id: "kreuzfahrt-buchen",     label: t("navBuchen"),     emoji: "🔍" },
        { id: "kreuzfahrt-routen",     label: t("navRouten"),     emoji: "🌍" },
        { id: "kreuzfahrt-kabinen",    label: t("navKabinen"),    emoji: "🛏️" },
        { id: "kreuzfahrt-reedereien", label: t("navReedereien"), emoji: "⚓" },
      ]} />

      {/* ── Reisetypen ───────────────────────────────────────────────────────── */}
      <section id="kreuzfahrt-typen" className="bg-sky-50 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">
              {t("typenEyebrow")}
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              {t("typenTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CRUISE_TYPES.map(({ icon: Icon, title, desc, gradient, href, label }) => (
              <button
                key={title}
                onClick={() => openModal(href, label)}
                className={`group relative flex flex-col items-center text-center p-5 rounded-2xl bg-linear-to-br ${gradient} text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer w-full`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm leading-tight mb-1">{title}</h3>
                <p className="text-white/70 text-[11px] leading-snug">{desc}</p>
                <div className="mt-3 flex items-center gap-1 text-white/80 text-[11px] font-semibold">
                  {t("typeJetztSuchen")} <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider topColor="#f0f9ff" bottomColor="#ffffff" />

      {/* ── CruiseCompass Widget ──────────────────────────────────────────────── */}
      <section id="kreuzfahrt-buchen" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">
              {t("widgetEyebrow")}
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {t("widgetTitle")}
            </h2>
            <p className="text-gray-500 text-sm">
              {t("widgetDesc")}
            </p>
          </div>

          {/* Zweispalten: Widget + Sidebar */}
          <div className="xl:flex xl:items-start xl:gap-8">

            {/* Widget */}
            <div className="flex-1 min-w-0">
              <CruiseWidget />
            </div>

            {/* Sidebar (nur XL+, via prop von Server-Page) */}
            {sidebar && (
              <aside className="hidden xl:block w-64 shrink-0">
                <div className="sticky top-24">
                  {sidebar}
                </div>
              </aside>
            )}

          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider topColor="#ffffff" bottomColor="#f0f9ff" />

      {/* ── Beliebte Destinationen ────────────────────────────────────────────── */}
      <section id="kreuzfahrt-routen" className="bg-sky-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">
              {t("destinationenEyebrow")}
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              {t("destinationenTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DESTINATIONEN.map(({ title, sub, img, href, label }) => (
              <button
                key={title}
                onClick={() => openModal(href, label)}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left"
                style={{ height: "220px" }}
              >
                <Image
                  src={img}
                  alt={`Kreuzfahrt ${title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-black text-lg leading-tight">{title}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{sub}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-cyan-300 text-xs font-bold">
                    {t("destinationRoutenEntdecken")} <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider topColor="#f0f9ff" bottomColor="#ffffff" />

      {/* ── Kabinen-Ratgeber ──────────────────────────────────────────────────── */}
      <section id="kreuzfahrt-kabinen" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">
              {t("kabinenEyebrow")}
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {t("kabinenTitle")}
            </h2>
            <p className="text-gray-500 text-sm">
              {t("kabinenDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {KABINEN.map(({ cab, title, price, desc, perks, color, badge, badgeColor }) => (
              <button
                key={cab}
                onClick={() => openModal(DL(`&cab=${cab}`), `${title} – Kreuzfahrten`)}
                className={`group flex flex-col text-left rounded-2xl border-2 ${color} bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer w-full`}
              >
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{title}</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {badge}
                    </span>
                  </div>
                  <p className="text-cyan-600 font-black text-xl mb-2">{price}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{desc}</p>
                  <ul className="space-y-1.5 mt-auto">
                    {perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600">{t("kabinenAngebotenAnsehen")}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider topColor="#ffffff" bottomColor="#f0f9ff" />

      {/* ── Beliebte Reedereien ───────────────────────────────────────────────── */}
      <section id="kreuzfahrt-reedereien" className="bg-sky-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-2">
              {t("reedereienEyebrow")}
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              {t("reedereienTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {REEDEREIEN.map(({ id, name, color, flag, tagKey }) => (
              <button
                key={id}
                onClick={() => openModal(DL(`&red=${id}`), `${name} – Kreuzfahrten`)}
                className="group flex flex-col items-center text-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-gray-100 cursor-pointer w-full"
              >
                <div
                  className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-2 text-white text-lg`}
                >
                  {flag}
                </div>
                <span className="text-xs font-bold text-gray-800 leading-tight">{name}</span>
                {tagKey && (
                  <span className="mt-1 text-[9px] font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
                    {t(tagKey as Parameters<typeof t>[0])}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => openModal(DL(), t("reedereienTitle"))}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              <Anchor className="w-4 h-4" />
              {t("reedereienVergleichenBtn")}
            </button>
          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider topColor="#f0f9ff" bottomColor="#ffffff" />

      {/* ── SEO Text ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              {t("seoRatgeberTitle")}
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                  <Ship className="w-5 h-5 text-cyan-500" /> {t("seoHochseeFlussTitle")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  <strong>Hochseekreuzfahrten</strong> bringen dich zu fernen Küsten – von der Karibik
                  über das Mittelmeer bis zu den norwegischen Fjorden. Das Schiff selbst ist das Erlebnis
                  mit Pools, Restaurants und Entertainment.{" "}
                  <strong>Flusskreuzfahrten</strong> führen dich durch das Herz Europas: Rhein, Donau oder
                  Elbe – täglich neue Städte, immer von Bord aus erreichbar.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-500" /> {t("seoRoutenTitle")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Das <strong>Mittelmeer</strong> ist die meistgebuchte Kreuzfahrtregion: Barcelona, Rom,
                  Athen und Istanbul in einer Reise. Die <strong>Karibik</strong> punktet mit türkisblauem
                  Wasser und weißen Stränden. <strong>Nordeuropa</strong> begeistert mit Fjorden,
                  Polarlichtern und Metropolen wie London und Amsterdam.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-500" /> {t("seoTippsTitle")}
                </h3>
                <ul className="text-gray-600 text-sm space-y-1.5">
                  {SEO_TIPPS.map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-cyan-500" /> {t("seoFuerWenTitle")}
                </h3>
                <ul className="text-gray-600 text-sm space-y-1.5">
                  {SEO_FUER_WEN.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <h3 className="text-xl font-black text-gray-900 mb-5">
              {t("faqTitle")}
            </h3>
            <div className="space-y-4">
              {FAQ.map(({ q, a }) => (
                <div key={q} className="border border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                    <Compass className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    {q}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed pl-6">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Finaler CTA-Banner ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20">
        {/* Hintergrund – Ocean Deep */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #051e41 0%, #0a3060 50%, #0e4f7c 100%)",
          }}
        />
        {/* Decorative waves */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none opacity-20">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
            <path d="M0,40 C480,80 960,0 1440,40 L1440,0 L0,0 Z" fill="white" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
            <path d="M0,40 C480,0 960,80 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-cyan-400/30">
            <Anchor className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            {t("ctaTitle")}
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            {t("ctaDesc")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openModal(DL("&sort=pauf"), t("ctaBtnGuenstig"))}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-cyan-500/30 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              {t("ctaBtnGuenstig")}
            </button>
            <button
              onClick={() => openModal(DL(), t("ctaBtnAlle"))}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-bold px-8 py-3.5 rounded-xl border border-white/30 transition-colors cursor-pointer"
            >
              <Ship className="w-4 h-4" />
              {t("ctaBtnAlle")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
