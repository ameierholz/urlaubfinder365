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
          </div>

          {/* Urlaubsziele */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              {tFooter("destinationsHeading")}
            </p>
            <ul className="space-y-2 text-sm">
              {destinations.map((d) => (
                <li key={d.slug}>
                  <Link href={`/urlaubsziele/${d.slug}/`} className="hover:text-white transition-colors">
                    {d.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guenstig-urlaub-buchen/" className="hover:text-white transition-colors">
                  {tFooter("allOffers")}
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
                <Link href="/urlaubsguides/" className="hover:text-white transition-colors">
                  {tFooter("allGuides")}
                </Link>
              </li>
              <li>
                <Link href="/urlaubsarten/pauschalreisen/" className="hover:text-white transition-colors">
                  {tNav("pauschalreisen")}
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
