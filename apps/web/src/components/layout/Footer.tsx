import Link from "next/link";
import { Plane } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-sand-900 text-sand-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Plane className="h-6 w-6 text-primary-400" />
              <span className="text-lg font-bold text-white">
                Urlaubfinder365
              </span>
            </Link>
            <p className="text-sm">
              Dein Traumurlaub zum besten Preis. Vergleiche Angebote für
              über 250 Reiseziele weltweit.
            </p>
          </div>

          {/* Reiseziele */}
          <div>
            <h3 className="mb-3 font-semibold text-white">
              Beliebte Ziele
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/urlaubsziele/mallorca/" className="hover:text-primary-400">Mallorca</Link></li>
              <li><Link href="/urlaubsziele/antalya/" className="hover:text-primary-400">Antalya</Link></li>
              <li><Link href="/urlaubsziele/kreta/" className="hover:text-primary-400">Kreta</Link></li>
              <li><Link href="/urlaubsziele/hurghada/" className="hover:text-primary-400">Hurghada</Link></li>
              <li><Link href="/urlaubsziele/fuerteventura/" className="hover:text-primary-400">Fuerteventura</Link></li>
            </ul>
          </div>

          {/* Urlaubsarten */}
          <div>
            <h3 className="mb-3 font-semibold text-white">Urlaubsarten</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/last-minute/" className="hover:text-primary-400">Last Minute</Link></li>
              <li><Link href="/hotelsuche/" className="hover:text-primary-400">Hotels</Link></li>
              <li><Link href="/flugsuche/" className="hover:text-primary-400">Flüge</Link></li>
              <li><Link href="/urlaubsguides/" className="hover:text-primary-400">Reiseführer</Link></li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="mb-3 font-semibold text-white">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/impressum/" className="hover:text-primary-400">Impressum</Link></li>
              <li><Link href="/datenschutz/" className="hover:text-primary-400">Datenschutz</Link></li>
              <li><Link href="/agb/" className="hover:text-primary-400">AGB</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-sand-700 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Urlaubfinder365. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
