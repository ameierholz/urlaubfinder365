import Link from "next/link";
import { Plane, Search, Heart, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Plane className="h-7 w-7 text-primary-500" />
          <span className="text-xl font-bold text-sand-900">
            Urlaub<span className="text-primary-500">finder</span>365
          </span>
        </Link>

        {/* Navigation — Desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/urlaubsziele/"
            className="text-sm font-medium text-sand-700 transition-colors hover:text-primary-600"
          >
            Urlaubsziele
          </Link>
          <Link
            href="/last-minute/"
            className="text-sm font-medium text-sand-700 transition-colors hover:text-primary-600"
          >
            Last Minute
          </Link>
          <Link
            href="/urlaubsguides/"
            className="text-sm font-medium text-sand-700 transition-colors hover:text-primary-600"
          >
            Reiseführer
          </Link>
          <Link
            href="/hotelsuche/"
            className="text-sm font-medium text-sand-700 transition-colors hover:text-primary-600"
          >
            Hotels
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Suchen"
            className="rounded-full p-2 text-sand-600 transition-colors hover:bg-sand-100"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/profil/favoriten/"
            aria-label="Favoriten"
            className="hidden rounded-full p-2 text-sand-600 transition-colors hover:bg-sand-100 sm:block"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <button
            aria-label="Menü öffnen"
            className="rounded-full p-2 text-sand-600 transition-colors hover:bg-sand-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
