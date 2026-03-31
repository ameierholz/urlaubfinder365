import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Urlaubsguides — Reiseführer für jedes Ziel",
  description:
    "Ausführliche Reiseführer mit Insider-Tipps, Sehenswürdigkeiten und praktischen Infos für über 250 Reiseziele.",
};

export default function UrlaubsguidesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary-500" />
          <h1 className="text-3xl font-bold text-sand-900 md:text-4xl">
            Urlaubsguides
          </h1>
        </div>
        <p className="text-lg text-sand-600">
          Ausführliche Reiseführer mit Insider-Tipps, Sehenswürdigkeiten und
          praktischen Infos.
        </p>
      </div>

      <div className="rounded-2xl border border-sand-200 bg-white p-12 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12 text-sand-300" />
        <h2 className="mb-2 text-xl font-semibold text-sand-900">
          Guides in Arbeit
        </h2>
        <p className="mb-6 text-sand-600">
          Unsere Reiseführer werden gerade erstellt. Schau dir in der
          Zwischenzeit unsere Reiseziele an.
        </p>
        <Link
          href="/urlaubsziele/"
          className="inline-block rounded-full bg-primary-500 px-6 py-2.5 font-medium text-white transition hover:bg-primary-600"
        >
          Alle Reiseziele entdecken
        </Link>
      </div>
    </div>
  );
}
