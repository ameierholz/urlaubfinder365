/**
 * RightSidebar – universelle Sidebar für alle Seiten.
 * Server Component · Standard-Breite: w-72 (288px)
 */

import Link from "next/link";
import AdBanner from "@/components/ui/AdBanner";
import SponsoredAnbieter from "@/components/marktplatz/SponsoredAnbieter";
import SponsoredAngebote from "@/components/marktplatz/SponsoredAngebote";
import LocalPartnersWidget from "@/components/marktplatz/LocalPartnersWidget";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";

export interface ExtrasBox {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  accentColor?: string;
}

interface Props {
  extrasBox?: ExtrasBox;
  seoLinks?: { label: string; href: string }[];
  seoLinksTitle?: string;
  adPlacementKey?: string;
}

const DEFAULT_AD_KEY = "6e805e1e43279dbf742fa3dca2efc442";

export default function RightSidebar({ extrasBox, seoLinks, seoLinksTitle, adPlacementKey }: Props) {
  const accent = extrasBox?.accentColor ?? "bg-[#1db682]";

  return (
    <div className="space-y-4">

      {/* ── Hauptkarte ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* 1 · Destination-Hero */}
        {extrasBox && (
          <>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={extrasBox.image}
                alt={extrasBox.title}
                className="w-full h-44 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[10px] text-white/60 font-semibold uppercase tracking-widest mb-0.5">
                  {extrasBox.eyebrow}
                </p>
                <p className="text-base font-black text-white leading-tight drop-shadow-sm">
                  {extrasBox.title}
                </p>
              </div>
            </div>
            <div className="px-4 py-4 border-b border-gray-100">
              <p className="text-[12px] text-gray-500 leading-relaxed mb-3">{extrasBox.description}</p>
              <Link
                href={extrasBox.href}
                className={`block text-center ${accent} hover:opacity-90 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-opacity`}
              >
                {extrasBox.ctaLabel}
              </Link>
            </div>
          </>
        )}

        {/* 2 · SEO-Links */}
        {seoLinks && seoLinks.length > 0 && (
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              {seoLinksTitle ?? "Weitere Links"}
            </p>
            <ul className="space-y-2">
              {seoLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#1db682] transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3 · Empfohlene Anbieter */}
        <div className="border-b border-gray-100">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Empfohlene Anbieter</p>
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">Anzeige</span>
          </div>
          <Suspense fallback={null}>
            <SponsoredAnbieter compact />
          </Suspense>
          <div className="px-4 py-2.5">
            <Link href="/werbepartner/" className="block text-center text-[11px] text-[#6991d8] font-semibold hover:underline">
              Spotlight buchen →
            </Link>
          </div>
        </div>

        {/* 4 · Empfohlene Angebote */}
        <div className="border-b border-gray-100">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Empfohlene Angebote</p>
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">Anzeige</span>
          </div>
          <div className="px-4 pb-3">
            <Suspense fallback={null}>
              <SponsoredAngebote context={{ type: "homepage" }} variant="sidebar" maxItems={2} />
            </Suspense>
          </div>
        </div>

        {/* 5 · Lokale Partner */}
        <div>
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Lokale Partner</p>
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">Anzeige</span>
          </div>
          <Suspense fallback={null}>
            <LocalPartnersWidget compact />
          </Suspense>
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-[11px] text-gray-400">Werbeplatz frei · ab 49 €/Mo.</p>
            <Link href="/werbepartner/" className="text-[11px] text-[#1db682] font-semibold hover:underline whitespace-nowrap">
              Hier werben →
            </Link>
          </div>
        </div>

      </div>

      {/* ── KI-Reiseplaner Promo ─────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=300&q=75&fit=crop&auto=format"
          alt="KI Reiseplaner"
          className="w-full h-36 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#1db682]/90 to-[#6991d8]/85" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          <Sparkles className="w-5 h-5 text-white/80 mb-2" />
          <p className="text-sm font-black text-white leading-tight mb-1">
            KI-Urlaubsplaner
          </p>
          <p className="text-[11px] text-white/75 leading-snug mb-3">
            Dein perfekter Reiseplan in Sekunden – kostenlos & personalisiert.
          </p>
          <Link
            href="/ki-reiseplaner/"
            className="bg-white text-[#1db682] text-xs font-black px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors"
          >
            Jetzt ausprobieren →
          </Link>
        </div>
      </div>

      {/* ── AdBanner ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <p className="text-[10px] text-gray-400 text-center py-1.5 uppercase tracking-widest font-semibold border-b border-gray-100">
          Anzeige
        </p>
        <AdBanner
          placementKey={adPlacementKey ?? DEFAULT_AD_KEY}
          height={280}
        />
      </div>

    </div>
  );
}
