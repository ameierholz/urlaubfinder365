import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Sun, Mail } from "lucide-react";
import { destinations } from "@/lib/destinations";
import TrustpilotWidget from "@/components/ui/TrustpilotWidget";

export default async function Footer() {
  const tFooter = await getTranslations("footer");
  const tNav    = await getTranslations("nav");

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Marke */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <Sun className="w-6 h-6 text-sand-400" />
              Urlaubfinder<span className="text-sand-400">365</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {tFooter("tagline2")}
            </p>
            <TrustpilotWidget theme="dark" />

            {/* Social Media Links */}
            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/urlaubfinder365/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/urlaubfinder365" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@urlaubfinder365" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors" aria-label="TikTok">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.81.05l-.38-.05z"/></svg>
              </a>
            </div>
          </div>

          {/* Urlaubsziele — Top 8 statt alle */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              {tFooter("destinationsHeading")}
            </p>
            <ul className="space-y-2 text-sm">
              {destinations.slice(0, 8).map((d) => (
                <li key={d.slug}>
                  <Link href={`/urlaubsziele/${d.slug}/`} className="hover:text-white transition-colors">
                    {d.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/urlaubsziele/" className="text-[#1db682] hover:text-white transition-colors font-semibold">
                  Alle Urlaubsziele →
                </Link>
              </li>
            </ul>
          </div>

          {/* Ratgeber */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              {tFooter("guidesHeading")}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ratgeber/" className="hover:text-white transition-colors">
                  Reise-Ratgeber
                </Link>
              </li>
              <li>
                <Link href="/reiseziele/" className="hover:text-white transition-colors">
                  Reiseziele nach Monat
                </Link>
              </li>
              <li>
                <Link href="/urlaubsguides/" className="hover:text-white transition-colors">
                  {tFooter("allGuides")}
                </Link>
              </li>
              <li>
                <Link href="/pauschalreisen/" className="hover:text-white transition-colors">
                  Pauschalreisen nach Land
                </Link>
              </li>
              <li>
                <Link href="/urlaubsarten/all-inclusive-urlaub/" className="hover:text-white transition-colors">
                  {tNav("allInclusive")}
                </Link>
              </li>
              <li>
                <Link href="/urlaubsarten/fruhbucher-urlaub/" className="hover:text-white transition-colors">
                  {tNav("fruehbucher")}
                </Link>
              </li>
              <li>
                <Link href="/kreuzfahrten/" className="hover:text-white transition-colors">
                  {tNav("kreuzfahrt")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              {tFooter("contactHeading")}
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sand-400" />
                <a href="mailto:info@urlaubfinder365.de" className="hover:text-white transition-colors">
                  info@urlaubfinder365.de
                </a>
              </li>
            </ul>
            <div className="mt-6 space-y-1 text-xs text-gray-500">
              <Link href="/impressum/"   className="block hover:text-gray-300">{tFooter("imprint")}</Link>
              <Link href="/datenschutz/" className="block hover:text-gray-300">{tFooter("privacy")}</Link>
              <Link href="/agb/"         className="block hover:text-gray-300">{tFooter("agb")}</Link>
              <Link href="/ueber-uns/"   className="block hover:text-gray-300">{tFooter("about")}</Link>
              <Link href="/presse/"      className="block hover:text-gray-300">{tFooter("press")}</Link>
              <Link href="/partner/"     className="block hover:text-gray-300">{tFooter("partner")}</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          {tFooter("copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
