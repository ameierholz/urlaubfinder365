"use client";

import Image from "next/image";
import { Ship, Anchor, ArrowRight, Waves, Plane, Compass, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const PARTNER_ID = "30412";
const DL = (params = "") =>
  `https://kreuzfahrten.travelsystem.de/de?p=2&subid=${PARTNER_ID}${params}`;

function openModal(url: string, title: string) {
  const w = window as typeof window & {
    ibeOpenBooking?: (u: string, t: string) => void;
  };
  if (w.ibeOpenBooking) {
    w.ibeOpenBooking(url, title);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// ─── Kreuzfahrt-Destinationen ─────────────────────────────────────────────────
const CRUISE_DEALS = [
  {
    id: "mittelmeer",
    title: "Mittelmeer",
    sub: "Barcelona · Rom · Athen · Istanbul",
    price: "ab 599 €",
    duration: "7–14 Nächte",
    badge: "Bestseller",
    badgeColor: "bg-sand-500",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    url: DL("&type=NS"),
    label: "Mittelmeer-Kreuzfahrt",
  },
  {
    id: "karibik",
    title: "Karibik",
    sub: "Bahamas · Jamaika · St. Maarten",
    price: "ab 1.299 €",
    duration: "7–21 Nächte",
    badge: "Traumziel",
    badgeColor: "bg-emerald-500",
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    url: DL("&type=NS"),
    label: "Karibik-Kreuzfahrt",
  },
  {
    id: "nordeuropa",
    title: "Nordeuropa & Fjorde",
    sub: "Norwegen · Island · Spitzbergen",
    price: "ab 799 €",
    duration: "7–14 Nächte",
    badge: "Erlebnis",
    badgeColor: "bg-sky-600",
    img: "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=800&q=80",
    url: DL("&type=NS"),
    label: "Nordeuropa-Kreuzfahrt",
  },
  {
    id: "fluss",
    title: "Flusskreuzfahrten",
    sub: "Rhein · Donau · Elbe · Nil",
    price: "ab 699 €",
    duration: "7–15 Nächte",
    badge: "Gemütlich",
    badgeColor: "bg-teal-600",
    img: "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=80",
    url: DL("&type=R"),
    label: "Flusskreuzfahrt",
  },
];

// ─── Kreuzfahrt-Typen (Schnellauswahl) ────────────────────────────────────────
const QUICK_TYPES = [
  { icon: Ship,    label: "Hochsee",        url: DL("&type=NS"),    title: "Hochseekreuzfahrten" },
  { icon: Plane,   label: "Inkl. Flug",     url: DL("&type=S"),     title: "Kreuzfahrt + Flug" },
  { icon: Waves,   label: "Fluss",          url: DL("&type=R"),     title: "Flusskreuzfahrten" },
  { icon: Compass, label: "Kombi",          url: DL("&type=KOMBI"), title: "Kreuzfahrt + Hotel" },
  { icon: Zap,     label: "Last-Minute",    url: DL("&sort=pauf"),  title: "Last-Minute Kreuzfahrten" },
  { icon: Anchor,  label: "Alle Angebote",  url: DL(),              title: "Alle Kreuzfahrten" },
];

export default function HomeCruiseSection() {
  const t = useTranslations("cruisePage");
  return (
    <section className="py-0 overflow-hidden">

      {/* ── Ocean Banner Header ────────────────────────────────────────────── */}
      <div
        className="relative"
        style={{
          background: "linear-gradient(135deg, #051e41 0%, #083160 40%, #0a5080 75%, #0e6f8c 100%)",
        }}
      >
        {/* Deko-Blasen */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-cyan-400/8" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-blue-300/5" style={{ transform: "translateY(-50%)" }} />
          <div className="absolute -bottom-16 left-1/3 w-64 h-64 rounded-full bg-cyan-500/8" />
        </div>

        {/* Wave-Top */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden h-8 opacity-20">
          <svg viewBox="0 0 1440 32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full block">
            <path d="M0,16 C360,32 1080,0 1440,16 L1440,0 L0,0 Z" fill="white" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">

            {/* LEFT – Ship Icon + Text */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="shrink-0 flex items-center justify-center w-20 h-20 rounded-full shadow-2xl shadow-cyan-500/30 relative"
                style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" }}>
                <Ship className="w-9 h-9 text-white" />
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 to-transparent" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-2">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                    {`⚓ Kreuzfahrten ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight whitespace-nowrap">
                  {t("bookCheap")}
                </h2>
                <p className="text-cyan-100/70 text-sm mt-1 hidden md:block">
                  {t("tagline")}
                </p>
              </div>
            </div>

            {/* MIDDLE – Quick-Type Chips */}
            <div className="flex-1 flex flex-wrap gap-2 justify-center">
              {QUICK_TYPES.map(({ icon: Icon, label, url, title }) => (
                <button
                  key={label}
                  onClick={() => openModal(url, title)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/15 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  <span className="text-xs font-medium text-white/85">{label}</span>
                </button>
              ))}
            </div>

            {/* RIGHT – CTA */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <Link
                href="/kreuzfahrten/"
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-white font-black px-6 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-0.5 duration-200 whitespace-nowrap"
              >
                {t("allCruises")} <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-white/40 text-xs">{t("directPrices")}</p>
            </div>
          </div>
        </div>

        {/* Wave-Bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden h-6 opacity-20">
          <svg viewBox="0 0 1440 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full block">
            <path d="M0,12 C480,24 960,0 1440,12 L1440,24 L0,24 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* ── Destination-Cards ─────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #e0f4fa 0%, #f0f9ff 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Label-Zeile */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2 bg-linear-to-r from-blue-800 to-cyan-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md shadow-cyan-500/20 uppercase tracking-wider">
              <Ship className="w-3 h-3" /> {t("allCruises")}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {t("offersFrom")}
            </p>
          </div>

          {/* 4 Destination Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CRUISE_DEALS.map((deal) => (
              <button
                key={deal.id}
                onClick={() => openModal(deal.url, deal.label)}
                className="group relative flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 bg-white text-left w-full cursor-pointer ring-0 hover:ring-2 hover:ring-cyan-400/60"
              >
                {/* Bild */}
                <div className="relative overflow-hidden" style={{ height: "185px" }}>
                  <Image
                    src={deal.img}
                    alt={`${deal.title} Kreuzfahrt`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Badge */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1 ${deal.badgeColor} text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md uppercase tracking-wider leading-none`}>
                    <Ship className="w-2.5 h-2.5" />
                    {deal.badge}
                  </div>

                  {/* Titel unten */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                      {deal.duration}
                    </p>
                    <h3 className="font-black text-lg leading-tight drop-shadow-md group-hover:text-cyan-200 transition-colors">
                      {deal.title}
                    </h3>
                    <p className="text-white/65 text-xs mt-1 line-clamp-1">{deal.sub}</p>
                  </div>
                </div>

                {/* Card-Body */}
                <div className="flex flex-col flex-1 bg-gray-900">
                  {/* Info-Zeile */}
                  <div className="px-4 pt-3 pb-3 flex items-center gap-3 border-b border-white/10">
                    <span className="flex items-center gap-1.5 text-gray-300 text-xs">
                      <Plane className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      {t("inclTransfer")}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-300 text-xs">
                      <Waves className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {t("fullBoard")}
                    </span>
                  </div>

                  {/* Preis + CTA */}
                  <div className="px-4 pt-3 pb-4 mt-auto flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
                        {t("perPerson")}
                      </p>
                      <p className="text-3xl font-black text-cyan-400 leading-none">{deal.price}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{t("fullBoardLabel")}</p>
                    </div>
                    <span className="shrink-0 bg-linear-to-r from-cyan-600 to-cyan-700 group-hover:from-cyan-500 group-hover:to-cyan-600 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/40 text-center leading-snug">
                      {t("checkOffer").split("\n")[0]}<br />{t("checkOffer").split("\n")[1]}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="text-center mt-6 sm:hidden">
            <Link
              href="/kreuzfahrten/"
              className="text-sm font-semibold text-cyan-600 flex items-center gap-1 justify-center"
            >
              Alle Kreuzfahrten entdecken <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
