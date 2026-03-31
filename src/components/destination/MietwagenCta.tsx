"use client";

import Link from "next/link";
import { Car, CheckCircle, ArrowRight } from "lucide-react";
import { useMemo } from "react";

const BENEFITS = [
  "Alle großen Anbieter im Vergleich",
  "Vollkasko & Diebstahlschutz inklusive",
  "Kostenlose Stornierung bis 24 h vor Abholung",
  "Direkt am Flughafen oder Hotel abholen",
];

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

interface Props {
  destination: string;
  carLocationKey?: string;
}

export default function MietwagenCta({ destination, carLocationKey }: Props) {
  const ctaHref = useMemo(() => {
    if (!carLocationKey) return "/mietwagen-reservieren/";
    const pickup = new Date();
    pickup.setDate(pickup.getDate() + 7);
    const dropoff = new Date(pickup);
    dropoff.setDate(dropoff.getDate() + 7);
    return (
      `/mietwagen-reservieren/?driver_age=35` +
      `&pckloc=${carLocationKey}` +
      `&pckdate=${formatDate(pickup)}` +
      `&drpdate=${formatDate(dropoff)}` +
      `&pcktime=12:00&drptime=10:00`
    );
  }, [carLocationKey]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sand-500 to-sand-400 text-white shadow-lg">
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-6 bottom-0 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 p-8 md:p-10">
          {/* Icon + Text */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 rounded-xl p-2.5">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold leading-tight">
                Mietwagen in {destination}
              </h2>
            </div>
            <p className="text-sand-100 text-sm mb-5 max-w-md">
              Erkunde {destination} flexibel auf eigene Faust. Jetzt Mietwagen vergleichen
              und direkt am Flughafen oder Hotel abholen.
            </p>
            <ul className="space-y-1.5">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-white/90">
                  <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-white text-sand-600 font-bold px-7 py-4 rounded-2xl shadow-md hover:bg-sand-50 transition-colors text-base whitespace-nowrap"
            >
              Jetzt Mietwagen buchen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
