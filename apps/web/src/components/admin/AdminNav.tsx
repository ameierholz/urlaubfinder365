"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, PackageSearch, CalendarCheck, Banknote, LogOut,
  ShieldCheck, Megaphone, MapPin, Newspaper, Flame, Code,
  FileText, Globe, ChevronDown, TrendingUp, Euro, UserCog,
} from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MARKTPLATZ_NAV = [
  { href: "/admin/anbieter/",    icon: Users,         label: "Anbieter" },
  { href: "/admin/buchungen/",   icon: CalendarCheck, label: "Buchungen" },
  { href: "/admin/auszahlungen/",icon: Banknote,      label: "Auszahlungen" },
  { href: "/admin/angebote/",    icon: PackageSearch, label: "Angebote" },
];

const VERMARKTUNG_NAV = [
  { href: "/admin/vermarktung/",   icon: Euro,     label: "Revenue-Übersicht" },
  { href: "/admin/marketing/",     icon: Megaphone,label: "Marketing-Kalender" },
  { href: "/admin/werbung/",       icon: Megaphone,label: "Werbeplatz-Buchungen" },
  { href: "/admin/werbeplaetze/",  icon: Code,     label: "Ad-Code-Slots" },
  { href: "/admin/sponsored-deals/",icon: Flame,   label: "Sponsored Deals" },
];

const SEO_NAV = [
  { href: "/admin/seo/",          icon: FileText,  label: "Pages" },
  { href: "/admin/destinations/", icon: MapPin,    label: "Destinations" },
  { href: "/admin/magazin/",      icon: Newspaper, label: "Magazin" },
  { href: "/admin/ratgeber/",     icon: FileText,  label: "Ratgeber" },
];

const COMMAND_CENTER = [
  { href: "/admin/seo/dashboard/",      label: "🎯 Command Center" },
  { href: "/admin/seo/links/",          label: "🔗 Link-Audit" },
  { href: "/admin/seo/konkurrenz/",     label: "🏆 Konkurrenz" },
  { href: "/admin/seo/performance/",    label: "📊 Performance" },
  { href: "/admin/seo/verzeichnisse/",  label: "📂 Verzeichnisse" },
  { href: "/admin/seo/broken-links/",   label: "🔍 Broken-Link-Builder" },
  { href: "/admin/seo/outreach/",       label: "📧 Outreach" },
];

function NavGroup({
  icon: Icon,
  label,
  color,
  items,
  defaultOpen,
  extra,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  items: { href: string; icon: React.ElementType; label: string }[];
  defaultOpen: boolean;
  extra?: React.ReactNode;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="pt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          defaultOpen ? color : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 shrink-0" />
          {label}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-1 ml-3 pl-3 border-l border-gray-800 space-y-0.5">
          {items.map(({ href, icon: ItemIcon, label: itemLabel }) => {
            const active = path.startsWith(href.replace(/\/$/, ""));
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active ? "bg-gray-700 text-white" : "text-gray-500 hover:bg-gray-800 hover:text-white"
                }`}>
                <ItemIcon className="w-3.5 h-3.5 shrink-0" />{itemLabel}
              </Link>
            );
          })}
          {extra}
        </div>
      )}
    </div>
  );
}

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const path   = usePathname();
  const router = useRouter();

  const isMarktplatz   = ["/admin/anbieter", "/admin/buchungen", "/admin/auszahlungen", "/admin/angebote"].some(p => path.startsWith(p));
  const isVermarktung  = ["/admin/vermarktung", "/admin/werbung", "/admin/werbeplaetze", "/admin/sponsored-deals"].some(p => path.startsWith(p));
  const isSeo          = ["/admin/seo", "/admin/destinations", "/admin/magazin", "/admin/ratgeber"].some(p => path.startsWith(p));
  const isBenutzer     = path.startsWith("/admin/benutzer");

  const handleLogout = async () => {
    await createSupabaseBrowser().auth.signOut();
    router.push("/");
  };

  const dashActive = path.startsWith("/admin/dashboard");

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-[#00838F]" />
          <span className="text-white font-black text-sm">Admin</span>
        </div>
        <p className="text-gray-500 text-[10px] truncate">{userEmail}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {/* Dashboard */}
        <Link href="/admin/dashboard/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            dashActive ? "bg-[#00838F] text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}>
          <LayoutDashboard className="w-4 h-4 shrink-0" /> Übersicht
        </Link>

        {/* Marktplatz */}
        <NavGroup
          icon={TrendingUp}
          label="Marktplatz"
          color="text-blue-400"
          items={MARKTPLATZ_NAV}
          defaultOpen={isMarktplatz}
        />

        {/* Vermarktung */}
        <NavGroup
          icon={Euro}
          label="Vermarktung"
          color="text-amber-400"
          items={VERMARKTUNG_NAV}
          defaultOpen={isVermarktung}
        />

        {/* SEO */}
        <NavGroup
          icon={Globe}
          label="SEO"
          color="text-teal-300"
          items={SEO_NAV}
          defaultOpen={isSeo}
          extra={
            <div className="pt-1 pb-0.5 space-y-0.5">
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-3 py-1">Command Center</p>
              {COMMAND_CENTER.map(({ href, label }) => {
                const active = path === href.replace(/\/$/, "") || path === href;
                return (
                  <Link key={href} href={href}
                    className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active ? "bg-teal-900/50 text-teal-300" : "text-gray-600 hover:bg-gray-800 hover:text-gray-300"
                    }`}>
                    {label}
                  </Link>
                );
              })}
            </div>
          }
        />
      </nav>

      <div className="px-3 pb-4">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-900/30 hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4" /> Abmelden
        </button>
      </div>
    </aside>
  );
}
