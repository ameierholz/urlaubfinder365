"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import {
  Menu, X, User, LogOut, LayoutDashboard,
  ChevronDown, BookOpen, Calendar, Map, TrendingUp,
  Mail, Clock, Heart, Users, Sun, Leaf, Building2, Gem, Backpack, Star, Euro, UserCheck, Tent, Waves,
  Users2, Globe, ShieldCheck, ShieldAlert, Sparkles, Compass,
} from "lucide-react";
import { destinations } from "@/lib/destinations";

interface NavItem {
  id: string;
  label: string;
  href?: string;
  children?: { label: string; href: string; icon?: React.ReactNode; badge?: string }[];
}

// ─── Static data with translation keys ───────────────────────────────────────
const MEGA_DESTINATIONS_DATA = [
  { tKey: "tuerkei",      flagCode: "tr", slug: "tuerkei",           img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=70" },
  { tKey: "spanien",      flagCode: "es", slug: "balearen",          img: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=400&q=70" },
  { tKey: "griechenland", flagCode: "gr", slug: "griechische-inseln", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=70" },
  { tKey: "aegypten",     flagCode: "eg", slug: "aegypten",          img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400&q=70" },
  { tKey: "italien",      flagCode: "it", slug: "italien",           img: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=400&q=70" },
  { tKey: "deutschland",  flagCode: "de", slug: "deutschland-nord",  img: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&q=70" },
  { tKey: "portugal",     flagCode: "pt", slug: "portugal",          img: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=70" },
  { tKey: "tunesien",     flagCode: "tn", slug: "tunesien",          img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=70" },
  { tKey: "usa",          flagCode: "us", slug: "usa-ostkueste",     img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=70" },
  { tKey: "malediven",    flagCode: "mv", slug: "indischer-ozean",   img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=70" },
];

const URLAUBSTHEMEN_DATA = [
  { tKey: "adultsOnly",  href: "/urlaubsthemen/adults-only/",      icon: Heart,      color: "text-rose-300" },
  { tKey: "family",      href: "/urlaubsthemen/familienurlaub/",   icon: Users,      color: "text-sky-300" },
  { tKey: "beach",       href: "/urlaubsthemen/strandurlaub/",     icon: Sun,        color: "text-yellow-300" },
  { tKey: "wellness",    href: "/urlaubsthemen/wellnessurlaub/",   icon: Leaf,       color: "text-emerald-300" },
  { tKey: "city",        href: "/urlaubsthemen/staedtereisen/",    icon: Building2,  color: "text-violet-300" },
  { tKey: "honeymoon",   href: "/urlaubsthemen/hochzeitsreise/",   icon: Heart,      color: "text-pink-300" },
  { tKey: "adventure",   href: "/urlaubsthemen/abenteuerurlaub/",  icon: Backpack,   color: "text-orange-300" },
  { tKey: "luxury",      href: "/urlaubsthemen/luxusurlaub/",      icon: Gem,        color: "text-amber-300" },
  { tKey: "singles",     href: "/urlaubsthemen/singlereisen/",     icon: UserCheck,  color: "text-teal-300" },
  { tKey: "active",      href: "/urlaubsthemen/aktivurlaub/",      icon: Tent,       color: "text-lime-300" },
  { tKey: "spa",         href: "/urlaubsthemen/kurreisen/",        icon: Waves,      color: "text-cyan-300" },
  { tKey: "seniors",     href: "/urlaubsthemen/seniorenreisen/",   icon: Star,       color: "text-blue-300" },
];

const REISEBUDGET_DATA = [
  { tKey: "budget500",  href: "/urlaubsthemen/budget-bis-500/",   badge: "🤑" },
  { tKey: "budget1000", href: "/urlaubsthemen/budget-bis-1000/",  badge: "💰" },
  { tKey: "budget1500", href: "/urlaubsthemen/budget-bis-1500/",  badge: "💳" },
  { tKey: "budget2000", href: "/urlaubsthemen/budget-bis-2000/",  badge: "✨" },
];

const COMMUNITY_SECTIONS = [
  { label: "Urlaubsberichte",   href: "/community/reiseberichte/", icon: BookOpen, color: "text-teal-300",    desc: "Echte Erfahrungen von Reisenden" },
  { label: "Urlaubs-Gruppen",   href: "/community/gruppen/",       icon: Users2,   color: "text-cyan-300",    desc: "Finde Gleichgesinnte für dein Ziel" },
  { label: "Mitglieder",      href: "/community/mitglieder/",    icon: Users,    color: "text-sky-300",     desc: "Entdecke aktive Reisende" },
  { label: "Urlauber-Karte",  href: "/extras/reisenden-karte/",  icon: Globe,    color: "text-emerald-300", desc: "Alle Urlauber auf der Weltkarte" },
];

const NEW_GROUPS = [
  { name: "Mallorca 2026",    emoji: "🏖️", members: 12, href: "/community/gruppen/" },
  { name: "Türkei Entdecker", emoji: "🕌", members: 8,  href: "/community/gruppen/" },
  { name: "Backpacker Asia",  emoji: "🎒", members: 21, href: "/community/gruppen/" },
];

const URLAUBSARTEN_ITEMS = [
  {
    label: "Pauschalreisen",
    href:  "/urlaubsarten/pauschalreisen/",
    emoji: "✈️", badge: "Beliebteste Wahl", badgeColor: "bg-blue-400/30 text-blue-100",
    desc: "Flug + Hotel + Transfer – alles inklusive gebucht.",
    img:  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=70",
  },
  {
    label: "Frühbucher Urlaub",
    href:  "/urlaubsarten/fruhbucher-urlaub/",
    emoji: "🌅", badge: "Bis 40% sparen", badgeColor: "bg-amber-400/30 text-amber-100",
    desc: "Früh buchen und die besten Zimmer zum günstigsten Preis sichern.",
    img:  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70",
  },
  {
    label: "All-Inclusive",
    href:  "/urlaubsarten/all-inclusive-urlaub/",
    emoji: "🍹", badge: "Sorglos genießen", badgeColor: "bg-teal-400/30 text-teal-100",
    desc: "Essen, Trinken & mehr inklusive – kein laufender Kostenstress.",
    img:  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=70",
  },
  {
    label: "Last-Minute",
    href:  "/urlaubsarten/last-minute-urlaub/",
    emoji: "⚡", badge: "Spontan & günstig", badgeColor: "bg-orange-400/30 text-orange-100",
    desc: "Kurzfristige Angebote bis 14 Tage vor Abreise mit Top-Rabatten.",
    img:  "https://images.unsplash.com/photo-1490650034175-5d96d2e1d0a9?w=400&q=70",
  },
  {
    label: "Super-Last-Minute",
    href:  "/urlaubsarten/super-last-minute-urlaub/",
    emoji: "🚀", badge: "Innerhalb 72h", badgeColor: "bg-red-400/30 text-red-100",
    desc: "Innerhalb von 72 Stunden abreisen – maximale Ersparnis garantiert.",
    img:  "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=400&q=70",
  },
];

const LIFESTYLE_PREVIEW = [
  { label: "Familien",  emoji: "👨‍👩‍👧‍👦" },
  { label: "Paare",     emoji: "❤️" },
  { label: "Singles",   emoji: "🧳" },
  { label: "Gruppen",   emoji: "👥" },
  { label: "Abenteuer", emoji: "🏄" },
];

const HEADER_BG   = "rgba(18, 107, 97, 0.90)";
const DROPDOWN_BG = "rgba(18, 107, 97, 0.97)";

// ─── Dropdown (simple list) ───────────────────────────────────────────────────
function DropdownMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const t = useTranslations("nav");
  return (
    <div
      className="absolute top-full left-0 mt-1 min-w-50 rounded-xl shadow-lg border border-white/30 py-1 z-50 backdrop-blur-sm"
      style={{ backgroundColor: DROPDOWN_BG }}
    >
      {item.href && (
        <Link
          href={item.href}
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white font-semibold border-b border-white/20 hover:bg-white/20"
        >
          {t("viewAll", { label: item.label })}
        </Link>
      )}
      {item.children?.map((child) => (
        <Link
          key={child.href}
          href={child.href}
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/20"
        >
          {child.icon && <span className="opacity-80">{child.icon}</span>}
          <span className="flex-1">{child.label}</span>
          {child.badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white leading-none">
              {child.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

// ─── Mega-Menu: Urlaubsthemen ─────────────────────────────────────────────────
function ThemenMegaMenu({ onClose }: { onClose: () => void }) {
  const tThemes = useTranslations("themes");
  const tMega   = useTranslations("megaMenu");
  return (
    <div
      className="absolute top-full left-0 mt-1 rounded-xl shadow-xl border border-white/30 z-50 backdrop-blur-sm overflow-hidden"
      style={{ backgroundColor: DROPDOWN_BG, width: "480px" }}
    >
      <div className="border-b border-white/20">
        <Link
          href="/urlaubsthemen/"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-3 text-sm text-white font-bold hover:bg-white/20"
        >
          {tMega("allThemes")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-0 p-3">
        {URLAUBSTHEMEN_DATA.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/20 text-white text-sm transition-colors"
            >
              <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {tThemes(item.tKey as any)}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-white/20 px-3 py-3">
        <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold px-3 mb-2">
          {tMega("byBudget")}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {REISEBUDGET_DATA.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              onClick={onClose}
              className="flex flex-col items-center gap-1 bg-white/10 hover:bg-white/25 rounded-xl px-2 py-2.5 text-center transition-colors"
            >
              <span className="text-lg">{b.badge}</span>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <span className="text-[11px] text-white font-semibold leading-tight">{tThemes(b.tKey as any)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mega-Menu: Extras ───────────────────────────────────────────────────────
// Design: featured KI-strip oben + 3 kategorisierte Spalten + Footer-CTA
// Bewusst anders als Community (Panel+Grid) und alle anderen Menus.
const EXTRAS_GROUPS = [
  {
    label: "Planung",
    items: [
      { href: "/ki-reiseplaner/",         icon: Sparkles,  color: "text-purple-400",  label: "KI-Urlaubsplaner",  badge: "KI"  },
      { href: "/urlaubsguides/",          icon: BookOpen,  color: "text-blue-400",    label: "Urlaubsguides",     badge: null  },
      { href: "/extras/urlaubskalender/", icon: Calendar,  color: "text-pink-400",    label: "Urlaubskalender",   badge: null  },
      { href: "/preisentwicklung/",       icon: TrendingUp,color: "text-emerald-400", label: "Preisentwicklung",  badge: "NEU" },
    ],
  },
  {
    label: "Einreise & Schutz",
    items: [
      { href: "/visum-checker/",     icon: ShieldCheck, color: "text-teal-400",  label: "Visum-Checker",     badge: null },
      { href: "/reisewarnungen/",    icon: ShieldAlert, color: "text-red-400",   label: "Reisewarnungen",    badge: null },
      { href: "/reiseversicherung/", icon: Star,        color: "text-indigo-400",label: "Reiseversicherung", badge: null },
    ],
  },
  {
    label: "Entdecken",
    items: [
      { href: "/magazin/",               icon: BookOpen, color: "text-blue-400",   label: "Urlaubsmagazin", badge: "NEU" },
      { href: "/erlebnisse/",             icon: Compass, color: "text-orange-400", label: "Erlebnisse",     badge: null },
      { href: "/extras/reisenden-karte/", icon: Globe,   color: "text-cyan-400",   label: "Urlauber-Karte", badge: null },
    ],
  },
] as const;

function ExtrasMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute top-full right-0 mt-1 rounded-xl shadow-xl border border-white/30 z-50 backdrop-blur-sm overflow-hidden"
      style={{ backgroundColor: DROPDOWN_BG, width: "540px" }}
    >
      {/* Featured strip: KI-Urlaubsplaner */}
      <Link
        href="/ki-reiseplaner/"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 border-b border-white/15 bg-purple-500/15 hover:bg-purple-500/25 transition-colors group"
      >
        <div className="w-9 h-9 rounded-xl bg-purple-500/40 flex items-center justify-center shrink-0">
          <Sparkles className="w-4.5 h-4.5 text-purple-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">KI-Urlaubsplaner</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/80 text-white leading-none">KI</span>
          </div>
          <p className="text-[11px] text-white/55 leading-snug truncate">Dein Reiseplan in Sekunden – Powered by Claude AI</p>
        </div>
        <span className="text-white/35 group-hover:text-white/70 text-sm shrink-0 group-hover:translate-x-0.5 transition-transform">→</span>
      </Link>

      {/* 3 kategorie-spalten */}
      <div className="grid grid-cols-3 divide-x divide-white/10">
        {EXTRAS_GROUPS.map((group) => (
          <div key={group.label} className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-3 pb-2 border-b border-white/10">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/15 transition-colors group/item"
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${item.color}`} />
                    <span className="text-[13px] text-white/80 group-hover/item:text-white flex-1 leading-tight">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/70 text-white leading-none shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-white/15 px-4 py-2.5 flex items-center justify-between bg-white/5">
        <span className="text-[11px] text-white/40">9 kostenlose Tools für Urlauber</span>
        <Link
          href="/extras/"
          onClick={onClose}
          className="text-[12px] text-[#1db682] font-bold hover:text-[#25e09a] transition-colors"
        >
          Alle Extras ansehen →
        </Link>
      </div>
    </div>
  );
}

// ─── Mega-Menu: Community ─────────────────────────────────────────────────────
function CommunityMegaMenu({ onClose }: { onClose: () => void }) {
  const tMega = useTranslations("megaMenu");
  return (
    <div
      className="absolute top-full right-0 mt-1 rounded-xl shadow-xl border border-white/30 z-50 backdrop-blur-sm overflow-hidden"
      style={{ backgroundColor: DROPDOWN_BG, width: "600px" }}
    >
      <div className="flex">
        <div className="w-56 shrink-0 p-5 border-r border-white/15 flex flex-col justify-between bg-white/5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-teal-300 shrink-0" />
              <span className="text-sm font-bold text-white">{tMega("communityHub")}</span>
            </div>
            <p className="text-[12px] text-white/75 leading-relaxed mb-4">
              {tMega("communityDesc")}
            </p>
            <ul className="space-y-1.5 mb-5">
              {["✓ Urlaubsberichte schreiben", "✓ Gruppen beitreten", "✓ Länder sammeln", "✓ Reisende kennenlernen"].map((item) => (
                <li key={item} className="text-[11px] text-white/65">{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <Link
              href="/community/"
              onClick={onClose}
              className="block text-center bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
            >
              {tMega("toCommunity")}
            </Link>
            <Link
              href="/register/"
              onClick={onClose}
              className="block text-center bg-teal-500/70 hover:bg-teal-500/90 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
            >
              Kostenlos mitmachen →
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-2 p-4">
            {COMMUNITY_SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={onClose}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/22 border border-white/15 hover:border-white/30 rounded-xl px-4 py-3.5 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                    <Icon className={`w-4.5 h-4.5 ${s.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-tight">{s.label}</p>
                    <p className="text-[10px] text-white/50 leading-snug mt-0.5 truncate">{s.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-white/15 px-4 py-3 bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Users2 className="w-3 h-3" /> {tMega("currentGroups")}
              </p>
              <Link
                href="/community/gruppen/"
                onClick={onClose}
                className="text-[10px] text-teal-300 hover:text-white font-semibold transition-colors"
              >
                {tMega("allReports")} →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {NEW_GROUPS.map((g) => (
                <Link
                  key={g.name}
                  href={g.href}
                  onClick={onClose}
                  className="flex flex-col items-center gap-1 bg-white/8 hover:bg-white/18 rounded-xl py-2.5 px-2 text-center transition-colors border border-white/10 hover:border-white/25"
                >
                  <span className="text-xl leading-none">{g.emoji}</span>
                  <p className="text-[11px] text-white font-semibold leading-tight line-clamp-1">{g.name}</p>
                  <p className="text-[10px] text-white/45">{g.members} Mitglieder</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mega-Menu: Urlaubsziele ──────────────────────────────────────────────────
function DestinationsMegaMenu({ onClose }: { onClose: () => void }) {
  const tCountries = useTranslations("countries");
  const tMega      = useTranslations("megaMenu");
  const FALLBACK   = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70";

  return (
    <div
      className="absolute top-full left-0 mt-1 rounded-xl shadow-xl border border-white/30 z-50 backdrop-blur-sm overflow-hidden"
      style={{ backgroundColor: DROPDOWN_BG, width: "660px" }}
    >
      <div className="flex border-b border-white/20">
        <Link
          href="/guenstig-urlaub-buchen/"
          onClick={onClose}
          className="flex-1 flex items-center gap-2 px-4 py-3 text-sm text-white font-bold hover:bg-white/20 border-r border-white/20"
        >
          🔍 {tMega("findBestPrice")}
        </Link>
        <Link
          href="/urlaubsziele/"
          onClick={onClose}
          className="flex-1 flex items-center gap-2 px-4 py-3 text-sm text-white font-bold hover:bg-white/20"
        >
          🌍 {tMega("allDestinations")}
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-2.5 p-4">
        {MEGA_DESTINATIONS_DATA.map((d) => {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          const name = tCountries(d.tKey as any);
          return (
            <Link
              key={d.tKey}
              href={`/urlaubsziele/${d.slug}/`}
              onClick={onClose}
              className="group relative rounded-lg overflow-hidden h-21 w-full text-left block"
            >
              <img
                src={d.img}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
              <img
                src={`https://flagcdn.com/w20/${d.flagCode}.png`}
                alt=""
                width={16}
                height={11}
                className="absolute top-1.5 left-1.5 rounded-sm shadow object-cover"
              />
              <span className="absolute bottom-1.5 left-2 text-white text-[11px] font-bold drop-shadow leading-none">
                {name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="px-4 py-2.5 border-t border-white/20 bg-white/10">
        <p className="text-[11px] text-white/80 text-center">
          ✈️ {tMega("compareHint")}
        </p>
      </div>
    </div>
  );
}

// ─── Mega-Menu: Urlaubsarten ──────────────────────────────────────────────────
function UrlaubsartenMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-0 mt-1 rounded-xl shadow-xl border border-white/30 z-50 backdrop-blur-sm overflow-hidden"
      style={{ backgroundColor: DROPDOWN_BG, width: "620px" }}
    >
      <div className="border-b border-white/20">
        <Link
          href="/urlaubsarten/"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-3 text-sm text-white font-bold hover:bg-white/20"
        >
          ✈️ Alle Urlaubsarten im Überblick →
        </Link>
      </div>

      <div className="flex">
        <div className="w-48 shrink-0 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&q=70"
            alt="Urlaubsarten"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-1">Dein Urlaub</p>
            <p className="text-sm font-extrabold text-white leading-tight">Finde deine Art zu verreisen</p>
          </div>
        </div>

        <div className="flex-1 py-2">
          {URLAUBSARTEN_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/15 transition-colors group"
            >
              <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-white">{item.label}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-white/60 leading-snug">{item.desc}</p>
              </div>
              <span className="text-white/40 group-hover:text-white/80 transition-colors text-sm mt-0.5">→</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-white/20 px-4 py-3 bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">Dein Lifestyle, deine Wahl!</p>
            <div className="flex gap-3">
              {LIFESTYLE_PREVIEW.map((l) => (
                <span key={l.label} className="flex items-center gap-1 text-[11px] text-white/70">
                  <span>{l.emoji}</span>{l.label}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/urlaubsarten/#lifestyle"
            onClick={onClose}
            className="text-[11px] text-white/70 hover:text-white font-semibold transition-colors whitespace-nowrap"
          >
            Entdecken →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export default function Header() {
  const { user, logout } = useAuth();
  const t          = useTranslations("nav");
  const tCountries = useTranslations("countries");
  const tThemes    = useTranslations("themes");

  const [mobileOpen, setMobileOpen]         = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen]     = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleDropdown = (id: string) =>
    setActiveDropdown(activeDropdown === id ? null : id);

  const navItems: NavItem[] = [
    {
      id: "urlaubFinden",
      label: t("urlaubFinden"),
      href: "/guenstig-urlaub-buchen",
      children: destinations.map((d) => ({ label: d.name, href: `/urlaubsziele/${d.slug}/` })),
    },
    { id: "flug",        label: t("flug"),        href: "/flugsuche" },
    { id: "hotel",       label: t("hotel"),       href: "/hotelsuche" },
    { id: "mietwagen",   label: t("mietwagen"),   href: "/mietwagen-reservieren" },
    { id: "kreuzfahrt",  label: t("kreuzfahrt"),  href: "/kreuzfahrten" },
    { id: "marktplatz",  label: t("aktivitaeten"), href: "/aktivitaeten/" },
    {
      id: "urlaubsarten",
      label: t("urlaubsarten"),
      href: "/urlaubsarten",
      children: [
        { label: t("pauschalreisen"),           href: "/urlaubsarten/pauschalreisen" },
        { label: `${t("fruehbucher")} Urlaub`,  href: "/urlaubsarten/fruhbucher-urlaub" },
        { label: `${t("allInclusive")} Urlaub`, href: "/urlaubsarten/all-inclusive-urlaub" },
        { label: `${t("lastMinute")} Urlaub`,   href: "/urlaubsarten/last-minute-urlaub" },
        { label: "Super-Last-Minute",           href: "/urlaubsarten/super-last-minute-urlaub" },
      ],
    },
    {
      id: "urlaubsthemen",
      label: t("urlaubsthemen"),
      href: "/urlaubsthemen",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: [
        ...URLAUBSTHEMEN_DATA.map((item) => ({ label: tThemes(item.tKey as any), href: item.href })),
        ...REISEBUDGET_DATA.map((item)  => ({ label: tThemes(item.tKey as any), href: item.href })),
      ],
    },
    {
      id: "community",
      label: t("community"),
      children: [
        { label: "Urlaubsberichte",   href: "/community/reiseberichte/", icon: <BookOpen className="w-4 h-4" /> },
        { label: "Urlaubs-Gruppen",   href: "/community/gruppen/",       icon: <Users2   className="w-4 h-4" /> },
        { label: "Mitglieder",      href: "/community/mitglieder/",    icon: <Users    className="w-4 h-4" /> },
        { label: "Urlauber-Karte",   href: "/extras/reisenden-karte/",  icon: <Globe    className="w-4 h-4" /> },
      ],
    },
    {
      id: "extras",
      label: t("extras"),
      href: "/extras/",
      children: [
        { label: "Preisentwicklung",  href: "/preisentwicklung/",  icon: <TrendingUp   className="w-4 h-4 text-emerald-400" />, badge: "NEU" },
        { label: "Reisewarnungen",    href: "/reisewarnungen/",    icon: <ShieldAlert  className="w-4 h-4 text-red-400" /> },
        { label: t("urlaubsguides"),    href: "/urlaubsguides",          icon: <BookOpen     className="w-4 h-4" /> },
        { label: "KI-Urlaubsplaner",      href: "/ki-reiseplaner/",        icon: <Sparkles     className="w-4 h-4" /> },
        { label: "Erlebnisse",             href: "/erlebnisse/",          icon: <Compass      className="w-4 h-4" /> },
        { label: "Visum-Checker",       href: "/visum-checker/",         icon: <ShieldCheck  className="w-4 h-4" /> },
        { label: "Reiseversicherung",   href: "/reiseversicherung/",     icon: <Star         className="w-4 h-4" /> },
        { label: "Urlaubskalender",     href: "/extras/urlaubskalender", icon: <Calendar     className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 backdrop-blur-md border-b border-white/30 shadow-sm"
      style={{ backgroundColor: HEADER_BG }}
    >
      {/* ── Kontakt & Service-Bar (nur Desktop) ───────────────────────── */}
      <div className="hidden lg:block border-b border-white/15">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center gap-4 text-white/75 text-[11px]">
              <a
                href="mailto:support@urlaubfinder365.de"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Mail className="w-3 h-3 shrink-0" />
                support@urlaubfinder365.de
              </a>
              <span className="text-white/30">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 shrink-0" />
                Mo–Fr 9–18 Uhr
              </span>
              <span className="text-white/30">·</span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-400 text-[12px] leading-none tracking-tight">★★★★</span>
                <span className="text-yellow-400/40 text-[12px] leading-none">★</span>
                <span>4,3 / 5 — über 12.000 Bewertungen</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/70 text-[11px]">
              <a href="/datenschutz/" className="hover:text-white transition-colors">Datenschutz</a>
              <span className="text-white/30">·</span>
              <a href="/impressum/" className="hover:text-white transition-colors">Impressum</a>
              <span className="text-white/30">·</span>
              <a href="/agb/" className="hover:text-white transition-colors">AGB</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Haupt-Navigation ──────────────────────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/urlaubfinder-logo.webp"
              alt="Urlaubfinder365"
              width={72}
              height={72}
              className="h-16 w-auto"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className={`flex items-center gap-1 px-3 py-3 text-sm font-semibold rounded-lg transition-colors text-white ${
                      activeDropdown === item.id ? "bg-white/25" : "hover:bg-white/20"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.id ? "rotate-180" : ""}`} />
                  </button>
                  {activeDropdown === item.id && (
                    item.id === "urlaubFinden"
                      ? <DestinationsMegaMenu  onClose={() => setActiveDropdown(null)} />
                      : item.id === "urlaubsthemen"
                        ? <ThemenMegaMenu      onClose={() => setActiveDropdown(null)} />
                        : item.id === "urlaubsarten"
                          ? <UrlaubsartenMegaMenu onClose={() => setActiveDropdown(null)} />
                          : item.id === "community"
                            ? <CommunityMegaMenu onClose={() => setActiveDropdown(null)} />
                            : item.id === "extras"
                              ? <ExtrasMegaMenu onClose={() => setActiveDropdown(null)} />
                              : <DropdownMenu item={item} onClose={() => setActiveDropdown(null)} />
                  )}
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.href!}
                  className="px-3 py-3 text-sm font-semibold text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Auth Bereich */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/20 text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {t("hello")}, {user.displayName?.split(" ")[0] || t("traveler")}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-lg border border-white/20 py-1 backdrop-blur-sm"
                    style={{ backgroundColor: DROPDOWN_BG }}
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/20"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t("myDashboard")}
                    </Link>
                    {user.rolle === "anbieter" && (
                      <Link
                        href="/anbieter/dashboard/"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/20"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        {t("myProviderPortal")}
                      </Link>
                    )}
                    <Link
                      href="/community/"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/20"
                    >
                      <Users className="w-4 h-4" />
                      {t("communityOverview")}
                    </Link>
                    <div className="border-t border-white/20 mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-sand-200 hover:bg-white/20"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("abmelden")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-white font-semibold px-3 py-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {t("anmelden")}
                </Link>
                <Link
                  href="/register"
                  className="bg-sand-500 hover:bg-sand-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm"
                >
                  {t("registrieren")}
                </Link>
              </>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile Burger */}
          <button
            className="lg:hidden text-white p-2.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("openMenu")}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-white/20 backdrop-blur-md flex flex-col max-h-[80vh]"
          style={{ backgroundColor: DROPDOWN_BG }}
        >
          {/* Scrollbarer Nav-Bereich */}
          <div className="overflow-y-auto flex-1">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.href && !item.children && (
                  <Link
                    href={item.href}
                    onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }}
                    className="block px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/20 rounded-lg"
                  >
                    {item.label}
                  </Link>
                )}
                {item.children && (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold text-white hover:bg-white/20 rounded-lg"
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform opacity-80 ${activeDropdown === item.id ? "rotate-180" : ""}`} />
                    </button>
                    {activeDropdown === item.id && (
                      <div className="ml-3 border-l-2 border-white/30 pl-3 mb-2">
                        {item.href && (
                          <Link
                            href={item.href}
                            onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }}
                            className="block py-1.5 text-sm text-sand-200 font-semibold"
                          >
                            {t("viewAll", { label: item.label })}
                          </Link>
                        )}
                        {/* Urlaubsziele: Bildkarten-Grid auf Mobile */}
                        {item.id === "urlaubFinden" && (
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 my-2">
                            {MEGA_DESTINATIONS_DATA.map((d) => (
                              <Link
                                key={d.tKey}
                                href={`/urlaubsziele/${d.slug}/`}
                                onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }}
                                className="relative rounded-lg overflow-hidden h-12 block w-full"
                              >
                                <img
                                  src={d.img}
                                  alt={d.tKey}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                                <span className="absolute bottom-0.5 left-1 text-white text-[9px] font-bold drop-shadow leading-none">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {tCountries(d.tKey as any)}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                        <div className="space-y-0.5">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }}
                              className="flex items-center gap-2 py-1.5 text-sm text-white/90 hover:text-white"
                            >
                              {child.icon && <span className="opacity-70">{child.icon}</span>}
                              <span className="flex-1">{child.label}</span>
                              {child.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white leading-none">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          </div>{/* end scrollable nav */}

          {/* Sprache — mobile */}
          <div className="px-4 pt-3 pb-2 border-t border-white/20 flex items-center gap-3">
            <span className="text-xs text-white/50 font-medium">{t("sprache")}</span>
            <LanguageSwitcher />
          </div>

          {/* Auth-Buttons — mobile */}
          <div className="px-4 pb-4 pt-2 flex gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }} className="flex-1 text-center bg-white/20 text-white py-2 rounded-lg text-sm font-semibold">
                  {t("dashboard")}
                </Link>
                {user?.rolle === "anbieter" && (
                  <Link href="/anbieter/dashboard/" onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }} className="flex-1 text-center bg-[#00838F]/80 text-white py-2 rounded-lg text-sm font-semibold">
                    {t("anbieterPortal")}
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); window.scrollTo(0, 0); }} className="flex-1 text-center bg-sand-500/80 text-white py-2 rounded-lg text-sm font-semibold">
                  {t("abmelden")}
                </button>
              </>
            ) : (
              <>
                <Link href="/login"    onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }} className="flex-1 text-center border border-white/30 text-white py-2 rounded-lg text-sm font-semibold">
                  {t("anmelden")}
                </Link>
                <Link href="/register" onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }} className="flex-1 text-center bg-sand-500 text-white py-2 rounded-lg text-sm font-semibold">
                  {t("registrieren")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
