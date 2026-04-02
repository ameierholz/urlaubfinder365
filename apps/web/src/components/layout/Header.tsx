"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Menu, X, User, LogOut, LayoutDashboard,
  ChevronDown, Plane, Hotel, Ship, Car, BookOpen, Calendar, Map, Ticket,
  Mail, Clock, Heart, Users, Sun, Leaf, Building2, Gem, Backpack, Star, Euro, UserCheck, Tent, Waves,
  Users2, Globe, ShieldCheck, Sparkles, Compass,
} from "lucide-react";
import { destinations } from "@/lib/destinations";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; icon?: React.ReactNode }[];
}

// ─── Mega-Menu: Alle TOP 10 Länder → verlinken auf /urlaubsziele/{slug} ───────
const MEGA_DESTINATIONS = [
  { name: "Türkei",       flagCode: "tr", slug: "tuerkei",          img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=70" },
  { name: "Spanien",      flagCode: "es", slug: "balearen",         img: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=400&q=70" },
  { name: "Griechenland", flagCode: "gr", slug: "griechische-inseln",img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=70" },
  { name: "Ägypten",      flagCode: "eg", slug: "aegypten",         img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400&q=70" },
  { name: "Italien",      flagCode: "it", slug: "italien",          img: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=400&q=70" },
  { name: "Deutschland",  flagCode: "de", slug: "deutschland-nord", img: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&q=70" },
  { name: "Portugal",     flagCode: "pt", slug: "portugal",         img: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=70" },
  { name: "Tunesien",     flagCode: "tn", slug: "tunesien",         img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=70" },
  { name: "USA",          flagCode: "us", slug: "usa-ostkueste",    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=70" },
  { name: "Malediven",    flagCode: "mv", slug: "indischer-ozean",  img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=70" },
];

// ─── Urlaubsthemen ────────────────────────────────────────────────────────────
const URLAUBSTHEMEN = [
  { label: "Adults Only",        href: "/urlaubsthemen/adults-only/",      icon: Heart,      color: "text-rose-300" },
  { label: "Familienurlaub",     href: "/urlaubsthemen/familienurlaub/",   icon: Users,      color: "text-sky-300" },
  { label: "Strandurlaub",       href: "/urlaubsthemen/strandurlaub/",     icon: Sun,        color: "text-yellow-300" },
  { label: "Wellnessurlaub",     href: "/urlaubsthemen/wellnessurlaub/",   icon: Leaf,       color: "text-emerald-300" },
  { label: "Städtereisen",       href: "/urlaubsthemen/staedtereisen/",    icon: Building2,  color: "text-violet-300" },
  { label: "Hochzeitsreise",     href: "/urlaubsthemen/hochzeitsreise/",   icon: Heart,      color: "text-pink-300" },
  { label: "Abenteuerurlaub",    href: "/urlaubsthemen/abenteuerurlaub/",  icon: Backpack,   color: "text-orange-300" },
  { label: "Luxusurlaub",        href: "/urlaubsthemen/luxusurlaub/",      icon: Gem,        color: "text-amber-300" },
  { label: "Singlereisen",       href: "/urlaubsthemen/singlereisen/",     icon: UserCheck,  color: "text-teal-300" },
  { label: "Aktivurlaub",        href: "/urlaubsthemen/aktivurlaub/",      icon: Tent,       color: "text-lime-300" },
  { label: "Kurreisen",          href: "/urlaubsthemen/kurreisen/",        icon: Waves,      color: "text-cyan-300" },
  { label: "Seniorenreisen",     href: "/urlaubsthemen/seniorenreisen/",   icon: Star,       color: "text-blue-300" },
];

const REISEBUDGET = [
  { label: "Budget bis 500 €",   href: "/urlaubsthemen/budget-bis-500/",   icon: Euro, badge: "🤑" },
  { label: "Budget bis 1.000 €", href: "/urlaubsthemen/budget-bis-1000/",  icon: Euro, badge: "💰" },
  { label: "Budget bis 1.500 €", href: "/urlaubsthemen/budget-bis-1500/",  icon: Euro, badge: "💳" },
  { label: "Budget bis 2.000 €", href: "/urlaubsthemen/budget-bis-2000/",  icon: Gem,  badge: "✨" },
];

const navItems: NavItem[] = [
  {
    label: "Urlaub finden",
    href: "/guenstig-urlaub-buchen",
    children: destinations.map((d) => ({ label: d.name, href: `/urlaubsziele/${d.slug}/` })),
  },
  { label: "Flug",          href: "/flugsuche" },
  { label: "Hotel",         href: "/hotelsuche" },
  { label: "Aktivitäten",   href: "/aktivitaeten" },
  { label: "Mietwagen",     href: "/mietwagen-reservieren" },
  { label: "Kreuzfahrten",  href: "/kreuzfahrten" },
  {
    label: "Urlaubsarten",
    href: "/urlaubsarten",
    children: [
      { label: "Pauschalreisen",        href: "/urlaubsarten/pauschalreisen" },
      { label: "Frühbucher Urlaub",     href: "/urlaubsarten/fruhbucher-urlaub" },
      { label: "All-Inclusive Urlaub",  href: "/urlaubsarten/all-inclusive-urlaub" },
      { label: "Last-Minute Urlaub",    href: "/urlaubsarten/last-minute-urlaub" },
      { label: "Super-Last-Minute",     href: "/urlaubsarten/super-last-minute-urlaub" },
    ],
  },
  {
    label: "Urlaubsthemen",
    href: "/urlaubsthemen",
    children: [
      ...URLAUBSTHEMEN.map((t) => ({ label: t.label, href: t.href })),
      ...REISEBUDGET.map((b) => ({ label: b.label, href: b.href })),
    ],
  },
  {
    label: "Community",
    children: [
      { label: "Reiseberichte",  href: "/community/reiseberichte/", icon: <BookOpen className="w-4 h-4" /> },
      { label: "Reise-Gruppen",  href: "/community/gruppen/",       icon: <Users2   className="w-4 h-4" /> },
      { label: "Mitglieder",     href: "/community/mitglieder/",    icon: <Users    className="w-4 h-4" /> },
      { label: "Reisenden-Karte",href: "/extras/reisenden-karte/",  icon: <Globe    className="w-4 h-4" /> },
    ],
  },
  {
    label: "Extras",
    children: [
      { label: "Urlaubsziele",    href: "/urlaubsziele",           icon: <Map         className="w-4 h-4" /> },
      { label: "Urlaubsguides",   href: "/urlaubsguides",          icon: <BookOpen    className="w-4 h-4" /> },
      { label: "KI-Reiseplaner",      href: "/ki-reiseplaner/",        icon: <Sparkles   className="w-4 h-4" /> },
      { label: "Aktivitäten-Markt",  href: "/marktplatz/",            icon: <Compass    className="w-4 h-4" /> },
      { label: "Visum-Checker",      href: "/visum-checker/",         icon: <ShieldCheck className="w-4 h-4" /> },
      { label: "Reiseversicherung", href: "/reiseversicherung/",     icon: <Star        className="w-4 h-4" /> },
      { label: "Urlaubskalender",   href: "/extras/urlaubskalender", icon: <Calendar    className="w-4 h-4" /> },
    ],
  },
];

// Header-Hintergrund: dunkel genug für WCAG-AA-Kontrast (weiße Schrift auf hellen Seiten)
// rgba(18,107,97,0.90) → Effektiv-Farbe auf weißem BG: ~rgb(42,122,113), Kontrast 5.1:1 ✓
const HEADER_BG = "rgba(18, 107, 97, 0.90)";
const DROPDOWN_BG = "rgba(18, 107, 97, 0.97)";

function DropdownMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-0 mt-1 min-w-[200px] rounded-xl shadow-lg border border-white/30 py-1 z-50 backdrop-blur-sm"
      style={{ backgroundColor: DROPDOWN_BG }}
    >
      {item.href && (
        <Link
          href={item.href}
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white font-semibold border-b border-white/20 hover:bg-white/20"
        >
          Alle {item.label} →
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
          {child.label}
        </Link>
      ))}
    </div>
  );
}

// ─── Mega-Menu für Urlaubsthemen ─────────────────────────────────────────────
function ThemenMegaMenu({ onClose }: { onClose: () => void }) {
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
          🎯 Alle Urlaubsthemen →
        </Link>
      </div>

      {/* Themen-Grid: 2 Spalten */}
      <div className="grid grid-cols-2 gap-0 p-3">
        {URLAUBSTHEMEN.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/20 text-white text-sm transition-colors"
            >
              <Icon className={`w-4 h-4 shrink-0 ${t.color}`} />
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Reisebudget */}
      <div className="border-t border-white/20 px-3 py-3">
        <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold px-3 mb-2">
          💶 Nach Budget
        </p>
        <div className="grid grid-cols-4 gap-2">
          {REISEBUDGET.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              onClick={onClose}
              className="flex flex-col items-center gap-1 bg-white/10 hover:bg-white/25 rounded-xl px-2 py-2.5 text-center transition-colors"
            >
              <span className="text-lg">{b.badge}</span>
              <span className="text-[11px] text-white font-semibold leading-tight">{b.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mega-Menu für Community ──────────────────────────────────────────────────
const COMMUNITY_SECTIONS = [
  {
    label: "Reiseberichte",
    href: "/community/reiseberichte/",
    icon: BookOpen,
    color: "text-teal-300",
    desc: "Echte Erfahrungen von Reisenden",
  },
  {
    label: "Reise-Gruppen",
    href: "/community/gruppen/",
    icon: Users2,
    color: "text-cyan-300",
    desc: "Finde Gleichgesinnte für dein Ziel",
  },
  {
    label: "Mitglieder",
    href: "/community/mitglieder/",
    icon: Users,
    color: "text-sky-300",
    desc: "Entdecke aktive Reisende",
  },
  {
    label: "Reisenden-Karte",
    href: "/extras/reisenden-karte/",
    icon: Globe,
    color: "text-emerald-300",
    desc: "Alle Reisenden auf der Weltkarte",
  },
];

const NEW_GROUPS = [
  { name: "Mallorca 2026",   emoji: "🏖️", members: 12, href: "/community/gruppen/" },
  { name: "Türkei Entdecker",emoji: "🕌", members: 8,  href: "/community/gruppen/" },
  { name: "Backpacker Asia", emoji: "🎒", members: 21, href: "/community/gruppen/" },
];

function CommunityMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute top-full right-0 mt-1 rounded-xl shadow-xl border border-white/30 z-50 backdrop-blur-sm overflow-hidden"
      style={{ backgroundColor: DROPDOWN_BG, width: "600px" }}
    >
      {/* Body: Text links + Buttons rechts */}
      <div className="flex">

        {/* LEFT: Community-Text + CTA */}
        <div className="w-56 shrink-0 p-5 border-r border-white/15 flex flex-col justify-between bg-white/5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-teal-300 shrink-0" />
              <span className="text-sm font-bold text-white">Community-Hub</span>
            </div>
            <p className="text-[12px] text-white/75 leading-relaxed mb-4">
              Verbinde dich mit tausenden Reisenden. Teile Erfahrungen, entdecke Geheimtipps und finde Gleichgesinnte für dein nächstes Abenteuer.
            </p>
            <ul className="space-y-1.5 mb-5">
              {["✓ Reiseberichte schreiben", "✓ Gruppen beitreten", "✓ Länder sammeln", "✓ Reisende kennenlernen"].map((t) => (
                <li key={t} className="text-[11px] text-white/65">{t}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <Link
              href="/community/"
              onClick={onClose}
              className="block text-center bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
            >
              Community-Übersicht →
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

        {/* RIGHT: 4 große Buttons + Neue Gruppen */}
        <div className="flex-1 flex flex-col">
          {/* 4 Section-Buttons – 2×2 Grid */}
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

          {/* Neue Gruppen */}
          <div className="border-t border-white/15 px-4 py-3 bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Users2 className="w-3 h-3" /> Neue Gruppen
              </p>
              <Link
                href="/community/gruppen/"
                onClick={onClose}
                className="text-[10px] text-teal-300 hover:text-white font-semibold transition-colors"
              >
                Alle ansehen →
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

// ─── Mega-Menu für Urlaubsziele ───────────────────────────────────────────────
function DestinationsMegaMenu({ onClose }: { onClose: () => void }) {
  const FALLBACK = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70";

  return (
    <div
      className="absolute top-full left-0 mt-1 rounded-xl shadow-xl border border-white/30 z-50 backdrop-blur-sm overflow-hidden"
      style={{ backgroundColor: DROPDOWN_BG, width: "660px" }}
    >
      {/* Zwei Header-Links */}
      <div className="flex border-b border-white/20">
        <Link
          href="/guenstig-urlaub-buchen/"
          onClick={onClose}
          className="flex-1 flex items-center gap-2 px-4 py-3 text-sm text-white font-bold hover:bg-white/20 border-r border-white/20"
        >
          🔍 Günstigsten Preis finden →
        </Link>
        <Link
          href="/urlaubsziele/"
          onClick={onClose}
          className="flex-1 flex items-center gap-2 px-4 py-3 text-sm text-white font-bold hover:bg-white/20"
        >
          🌍 Alle Urlaubsziele anzeigen →
        </Link>
      </div>

      {/* 5-spaltige Bildkarten-Grid – jede Karte → /urlaubsziele/{slug}/ */}
      <div className="grid grid-cols-5 gap-2.5 p-4">
        {MEGA_DESTINATIONS.map((d) => (
          <Link
            key={d.name}
            href={`/urlaubsziele/${d.slug}/`}
            onClick={onClose}
            className="group relative rounded-lg overflow-hidden h-[84px] w-full text-left block"
          >
            <img
              src={d.img}
              alt={d.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
            {/* Flagge */}
            <img
              src={`https://flagcdn.com/w20/${d.flagCode}.png`}
              alt=""
              width={16}
              height={11}
              className="absolute top-1.5 left-1.5 rounded-sm shadow object-cover"
            />
            {/* Name */}
            <span className="absolute bottom-1.5 left-2 text-white text-[11px] font-bold drop-shadow leading-none">
              {d.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Footer-Hinweis */}
      <div className="px-4 py-2.5 border-t border-white/20 bg-white/10">
        <p className="text-[11px] text-white/80 text-center">
          ✈️ Wir vergleichen hunderte Angebote – du findest deinen Traumurlaub zum besten Preis
        </p>
      </div>
    </div>
  );
}

// ─── Mega-Menu für Urlaubsarten ───────────────────────────────────────────────
const URLAUBSARTEN_ITEMS = [
  {
    label: "Pauschalreisen",
    href: "/urlaubsarten/pauschalreisen/",
    emoji: "✈️",
    badge: "Beliebteste Wahl",
    badgeColor: "bg-blue-400/30 text-blue-100",
    desc: "Flug + Hotel + Transfer – alles inklusive gebucht.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=70",
  },
  {
    label: "Frühbucher Urlaub",
    href: "/urlaubsarten/fruhbucher-urlaub/",
    emoji: "🌅",
    badge: "Bis 40% sparen",
    badgeColor: "bg-amber-400/30 text-amber-100",
    desc: "Früh buchen und die besten Zimmer zum günstigsten Preis sichern.",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70",
  },
  {
    label: "All-Inclusive",
    href: "/urlaubsarten/all-inclusive-urlaub/",
    emoji: "🍹",
    badge: "Sorglos genießen",
    badgeColor: "bg-teal-400/30 text-teal-100",
    desc: "Essen, Trinken & mehr inklusive – kein laufender Kostenstress.",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=70",
  },
  {
    label: "Last-Minute",
    href: "/urlaubsarten/last-minute-urlaub/",
    emoji: "⚡",
    badge: "Spontan & günstig",
    badgeColor: "bg-orange-400/30 text-orange-100",
    desc: "Kurzfristige Angebote bis 14 Tage vor Abreise mit Top-Rabatten.",
    img: "https://images.unsplash.com/photo-1490650034175-5d96d2e1d0a9?w=400&q=70",
  },
  {
    label: "Super-Last-Minute",
    href: "/urlaubsarten/super-last-minute-urlaub/",
    emoji: "🚀",
    badge: "Innerhalb 72h",
    badgeColor: "bg-red-400/30 text-red-100",
    desc: "Innerhalb von 72 Stunden abreisen – maximale Ersparnis garantiert.",
    img: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=400&q=70",
  },
];

const LIFESTYLE_PREVIEW = [
  { label: "Familien",  emoji: "👨‍👩‍👧‍👦" },
  { label: "Paare",     emoji: "❤️" },
  { label: "Singles",   emoji: "🧳" },
  { label: "Gruppen",   emoji: "👥" },
  { label: "Abenteuer", emoji: "🏄" },
];

function UrlaubsartenMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-0 mt-1 rounded-xl shadow-xl border border-white/30 z-50 backdrop-blur-sm overflow-hidden"
      style={{ backgroundColor: DROPDOWN_BG, width: "620px" }}
    >
      {/* Header-Link */}
      <div className="border-b border-white/20">
        <Link
          href="/urlaubsarten/"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-3 text-sm text-white font-bold hover:bg-white/20"
        >
          ✈️ Alle Urlaubsarten im Überblick →
        </Link>
      </div>

      {/* Body */}
      <div className="flex">
        {/* LEFT: Bild + Intro */}
        <div className="w-48 shrink-0 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&q=70"
            alt="Urlaubsarten"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-1">Deine Reise</p>
            <p className="text-sm font-extrabold text-white leading-tight">Finde deine Art zu reisen</p>
          </div>
        </div>

        {/* RIGHT: Urlaubsarten Liste */}
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

      {/* Footer: Lifestyle-Teaser */}
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

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
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

  const toggleDropdown = (label: string) =>
    setActiveDropdown(activeDropdown === label ? null : label);

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
            {/* Links: Kontaktdaten */}
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
                <span className="text-yellow-400 text-[12px] leading-none tracking-tight">★★★★</span><span className="text-yellow-400/40 text-[12px] leading-none">★</span>
                <span>4,3 / 5 — über 12.000 Bewertungen</span>
              </span>
            </div>
            {/* Rechts: Quick-Links */}
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
                <div key={item.label} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`flex items-center gap-1 px-3 py-3 text-sm font-semibold rounded-lg transition-colors text-white ${
                      activeDropdown === item.label ? "bg-white/25" : "hover:bg-white/20"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                  </button>
                  {activeDropdown === item.label && (
                    item.label === "Urlaub finden"
                      ? <DestinationsMegaMenu onClose={() => setActiveDropdown(null)} />
                      : item.label === "Urlaubsthemen"
                        ? <ThemenMegaMenu onClose={() => setActiveDropdown(null)} />
                        : item.label === "Urlaubsarten"
                        ? <UrlaubsartenMegaMenu onClose={() => setActiveDropdown(null)} />
                        : item.label === "Community"
                          ? <CommunityMegaMenu onClose={() => setActiveDropdown(null)} />
                          : <DropdownMenu item={item} onClose={() => setActiveDropdown(null)} />
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
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
                  Hallo, {user.displayName?.split(" ")[0] || "Urlauber"}
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
                      Mein Dashboard
                    </Link>
                    <Link
                      href="/community/"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/20"
                    >
                      <Users className="w-4 h-4" />
                      Community Übersicht
                    </Link>
                    <div className="border-t border-white/20 mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-sand-200 hover:bg-white/20"
                      >
                        <LogOut className="w-4 h-4" />
                        Abmelden
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
                  Anmelden
                </Link>
                <Link
                  href="/register"
                  className="bg-sand-500 hover:bg-sand-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm"
                >
                  Registrieren
                </Link>
              </>
            )}
          </div>

          {/* Mobile Burger */}
          <button
            className="lg:hidden text-white p-2.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü öffnen"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-white/20 max-h-[80vh] overflow-y-auto backdrop-blur-md"
          style={{ backgroundColor: DROPDOWN_BG }}
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
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
                      onClick={() => toggleDropdown(item.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold text-white hover:bg-white/20 rounded-lg"
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform opacity-80 ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="ml-3 border-l-2 border-white/30 pl-3 mb-2">
                        {item.href && (
                          <Link
                            href={item.href}
                            onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }}
                            className="block py-1.5 text-sm text-sand-200 font-semibold"
                          >
                            Alle {item.label}
                          </Link>
                        )}
                        {/* Urlaubsziele: Bildkarten-Grid auf Mobile */}
                        {item.label === "Urlaub finden" && (
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 my-2">
                            {MEGA_DESTINATIONS.map((d) => (
                              <Link
                                key={d.name}
                                href={`/urlaubsziele/${d.slug}/`}
                                onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }}
                                className="relative rounded-lg overflow-hidden h-12 block w-full"
                              >
                                <img
                                  src={d.img}
                                  alt={d.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                                <span className="absolute bottom-0.5 left-1 text-white text-[9px] font-bold drop-shadow leading-none">
                                  {d.name}
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
                              {child.label}
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
          <div className="px-4 pb-4 pt-2 border-t border-white/20 flex gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }} className="flex-1 text-center bg-white/20 text-white py-2 rounded-lg text-sm font-semibold">
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); window.scrollTo(0, 0); }} className="flex-1 text-center bg-sand-500/80 text-white py-2 rounded-lg text-sm font-semibold">
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link href="/login"    onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }} className="flex-1 text-center border border-white/30 text-white py-2 rounded-lg text-sm font-semibold">
                  Anmelden
                </Link>
                <Link href="/register" onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }} className="flex-1 text-center bg-sand-500 text-white py-2 rounded-lg text-sm font-semibold">
                  Registrieren
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
