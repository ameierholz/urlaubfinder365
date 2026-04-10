"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, PackageSearch, CalendarCheck, Banknote, LogOut, ShieldCheck, Megaphone, Search, MapPin, Newspaper, Flame, Code } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard/",    icon: LayoutDashboard, label: "Übersicht" },
  { href: "/admin/anbieter/",     icon: Users,            label: "Anbieter" },
  { href: "/admin/buchungen/",    icon: CalendarCheck,    label: "Buchungen" },
  { href: "/admin/auszahlungen/", icon: Banknote,         label: "Auszahlungen" },
  { href: "/admin/angebote/",     icon: PackageSearch,    label: "Angebote" },
  { href: "/admin/werbung/",      icon: Megaphone,        label: "Anbieter-Werbung" },
  { href: "/admin/werbeplaetze/", icon: Code,             label: "Ad-Code-Slots" },
  { href: "/admin/seo/",          icon: Search,           label: "SEO" },
  { href: "/admin/destinations/", icon: MapPin,           label: "Destinations" },
  { href: "/admin/magazin/",      icon: Newspaper,        label: "Magazin" },
  { href: "/admin/sponsored-deals/", icon: Flame,         label: "Sponsored" },
];

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const path   = usePathname();
  const router = useRouter();

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

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
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
