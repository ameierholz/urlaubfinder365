import Link from "next/link";
import { Sun, Mail, Phone } from "lucide-react";
import { destinations } from "@/lib/destinations";

export default function Footer() {
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
            <p className="text-sm text-gray-400 leading-relaxed">
              Dein Reiseportal für Pauschalreisen, Last-Minute Angebote und hilfreiche Reiseführer.
            </p>
          </div>

          {/* Urlaubsziele */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Urlaubsziele</p>
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
                  Alle Angebote
                </Link>
              </li>
            </ul>
          </div>

          {/* Ratgeber */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Ratgeber</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/urlaubsguides/" className="hover:text-white transition-colors">Alle Reiseführer</Link></li>
              <li><Link href="/urlaubsarten/pauschalreisen/" className="hover:text-white transition-colors">Pauschalreisen</Link></li>
              <li><Link href="/urlaubsarten/all-inclusive-urlaub/" className="hover:text-white transition-colors">All Inclusive</Link></li>
              <li><Link href="/urlaubsarten/fruhbucher-urlaub/" className="hover:text-white transition-colors">Frühbucher</Link></li>
              <li><Link href="/kreuzfahrten/" className="hover:text-white transition-colors">Kreuzfahrten</Link></li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Kontakt</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sand-400" />
                <a href="mailto:info@urlaubfinder365.de" className="hover:text-white transition-colors">
                  info@urlaubfinder365.de
                </a>
              </li>
            </ul>
            <div className="mt-6 space-y-1 text-xs text-gray-500">
              <Link href="/impressum/" className="block hover:text-gray-300">Impressum</Link>
              <Link href="/datenschutz/" className="block hover:text-gray-300">Datenschutz</Link>
              <Link href="/agb/" className="block hover:text-gray-300">AGB</Link>
              <Link href="/presse/" className="block hover:text-gray-300">Presse & Partner</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Urlaubfinder365.de – Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
