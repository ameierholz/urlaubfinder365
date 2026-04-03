"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, PackageSearch, CalendarCheck,
  QrCode, TrendingUp, BadgeCheck, LogOut, Menu, X, UserCircle, Megaphone
} from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useT } from "@/context/AnbieterI18nContext";

type Sprache = "de" | "en" | "tr" | "es" | "fr" | "it" | "pl" | "ru" | "ar";

interface Props {
  profil: { id: string; name: string; status: string; verifiziert: boolean; avatar_url?: string | null };
}

export default function AnbieterNav({ profil }: Props) {
  const path    = usePathname();
  const router  = useRouter();
  const { t, sprache, setSprache } = useT();
  const [open, setOpen] = useState(false);

  const NAV = [
    { href: "/anbieter/dashboard/",  icon: LayoutDashboard, label: t.nav.dashboard },
    { href: "/anbieter/angebote/",   icon: PackageSearch,   label: t.nav.angebote },
    { href: "/anbieter/buchungen/",  icon: CalendarCheck,   label: t.nav.buchungen },
    { href: "/anbieter/scanner/",    icon: QrCode,          label: t.nav.scanner },
    { href: "/anbieter/einnahmen/",  icon: TrendingUp,      label: t.nav.einnahmen },
    { href: "/anbieter/werbeplatz/", icon: Megaphone,       label: t.nav.werbeplatz },
    { href: "/anbieter/profil/",     icon: UserCircle,      label: t.nav.profil },
  ];

  const SPRACHEN: { code: Sprache; flagCode: string; label: string }[] = [
    { code: "de", flagCode: "de", label: "DE" },
    { code: "en", flagCode: "gb", label: "EN" },
    { code: "tr", flagCode: "tr", label: "TR" },
    { code: "es", flagCode: "es", label: "ES" },
    { code: "fr", flagCode: "fr", label: "FR" },
    { code: "it", flagCode: "it", label: "IT" },
    { code: "pl", flagCode: "pl", label: "PL" },
    { code: "ru", flagCode: "ru", label: "RU" },
    { code: "ar", flagCode: "sa", label: "AR" },
  ];

  const handleLogout = async () => {
    const sb = createSupabaseBrowser();
    await sb.auth.signOut();
    router.push("/");
  };

  const NavLinks = () => (
    <>
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = path.startsWith(href.replace(/\/$/, ""));
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              active
                ? "bg-[#00838F] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </>
  );


  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-20 left-4 z-50 bg-white border border-gray-200 rounded-xl p-2 shadow-sm"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-100
        flex flex-col transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/marktplatz/" className="text-[#00838F] font-black text-sm">
            {t.nav.zuMarktplatz}
          </Link>
          <p className="text-xs font-bold text-gray-900 mt-3">{t.nav.portal}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00838F]/10 flex items-center justify-center text-[#00838F] font-black text-sm overflow-hidden shrink-0">
              {profil.avatar_url
                /* eslint-disable-next-line @next/next/no-img-element */
                ? <img src={profil.avatar_url} alt={profil.name} className="w-full h-full object-cover" />
                : profil.name.charAt(0).toUpperCase()
              }
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{profil.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {profil.verifiziert
                  ? <span className="text-[10px] text-emerald-600 flex items-center gap-0.5"><BadgeCheck className="w-3 h-3" /> {t.status.verifiziert}</span>
                  : <span className={`text-[10px] font-semibold ${profil.status === 'ausstehend' ? 'text-amber-600' : profil.status === 'gesperrt' ? 'text-red-600' : 'text-emerald-600'}`}>
                      {profil.status === 'ausstehend' ? t.status.ausstehend : profil.status === 'gesperrt' ? t.status.gesperrt : t.status.aktiv}
                    </span>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavLinks />
        </nav>

        {/* Language Switcher */}
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t.sprache.label}</p>
          <div className="grid grid-cols-3 gap-1.5">
            {SPRACHEN.map(({ code, flagCode, label }) => (
              <button
                key={code}
                onClick={() => setSprache(code)}
                title={t.sprache[code]}
                className={`flex flex-col items-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  sprache === code
                    ? "bg-[#00838F] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://flagcdn.com/w20/${flagCode}.png`}
                  srcSet={`https://flagcdn.com/w40/${flagCode}.png 2x`}
                  width={20}
                  height={15}
                  alt={label}
                  className="rounded-sm object-cover"
                />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" /> {t.nav.abmelden}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
