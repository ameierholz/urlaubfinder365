"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, PackageSearch, CalendarCheck, Banknote, LogOut,
  ShieldCheck, Megaphone, Search, MapPin, Newspaper, Flame, Code,
  FileText, Globe, ChevronDown,
} from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MAIN_NAV = [
  { href: "/admin/dashboard/",       icon: LayoutDashboard, label: "Übersicht" },
  { href: "/admin/anbieter/",        icon: Users,            label: "Anbieter" },
  { href: "/admin/buchungen/",       icon: CalendarCheck,    label: "Buchungen" },
  { href: "/admin/auszahlungen/",    icon: Banknote,         label: "Auszahlungen" },
  { href: "/admin/angebote/",        icon: PackageSearch,    label: "Angebote" },
  { href: "/admin/werbung/",         icon: Megaphone,        label: "Anbieter-Werbung" },
  { href: "/admin/werbeplaetze/",    icon: Code,             label: "Ad-Code-Slots" },
  { href: "/admin/sponsored-deals/", icon: Flame,            label: "Sponsored" },
];

const SEO_NAV = [
  { href: "/admin/seo/",          icon: FileText, label: "Pages" },
  { href: "/admin/destinations/", icon: MapPin,   label: "Destinations" },
  { href: "/admin/magazin/",      icon: Newspaper, label: "Magazin" },
];

const COMMAND_CENTER = [
  { href: "/admin/seo/dashboard/",   label: "🎯 Command Center" },
  { href: "/admin/seo/links/",       label: "🔗 Link-Audit" },
  { href: "/admin/seo/konkurrenz/",  label: "🏆 Konkurrenz" },
  { href: "/admin/seo/performance/", label: "📊 Performance" },
];

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const path   = usePathname();
  const router = useRouter();

  const isSeoActive = path.startsWith("/admin/seo") || path.startsWith("/admin/destinations") || path.startsWith("/admin/magazin");
  const [seoOpen, setSeoOpen] = useState(isSeoActive);

  const handleLogout = async () => {
    await createSupabaseBrowser().auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-[#00838F]" />
          <span className="text-white font-black text-sm">Admin</span>
        </div>
        <p className="text-gray-500 text-[10px] truncate">{userEmail}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Haupt-Navigation */}
        {MAIN_NAV.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href.replace(/\/$/, ""));
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active ? "bg-[#00838F] text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}>
              <Icon className="w-4 h-4 shrink-0" />{label}
            </Link>
          );
        })}

        {/* SEO-Gruppe */}
        <div className="pt-2">
          <button
            onClick={() => setSeoOpen((v) => !v)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isSeoActive ? "text-teal-300" : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 shrink-0" />
              SEO
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${seoOpen ? "rotate-180" : ""}`} />
          </button>

          {seoOpen && (
            <div className="mt-1 ml-3 pl-3 border-l border-gray-800 space-y-0.5">
              {SEO_NAV.map(({ href, icon: Icon, label }) => {
                const active = path.startsWith(href.replace(/\/$/, ""));
                return (
                  <Link key={href} href={href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active ? "bg-teal-900/50 text-teal-300" : "text-gray-500 hover:bg-gray-800 hover:text-white"
                    }`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />{label}
                  </Link>
                );
              })}

              {/* Command Center */}
              <div className="pt-1 pb-0.5">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-3 py-1">Command Center</p>
              </div>
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
          )}
        </div>
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
