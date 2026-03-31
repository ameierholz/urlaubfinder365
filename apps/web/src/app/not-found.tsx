import Link from "next/link";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <MapPin className="mb-4 h-16 w-16 text-sand-300" />
      <h1 className="mb-2 text-4xl font-bold text-sand-900">
        Seite nicht gefunden
      </h1>
      <p className="mb-6 text-lg text-sand-600">
        Diese Seite existiert leider nicht. Vielleicht findest du dein
        Traumziel auf einer unserer anderen Seiten.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-primary-500 px-6 py-2.5 font-medium text-white transition hover:bg-primary-600"
        >
          Zur Startseite
        </Link>
        <Link
          href="/urlaubsziele/"
          className="rounded-full border border-sand-300 px-6 py-2.5 font-medium text-sand-700 transition hover:bg-sand-100"
        >
          Alle Reiseziele
        </Link>
      </div>
    </div>
  );
}
