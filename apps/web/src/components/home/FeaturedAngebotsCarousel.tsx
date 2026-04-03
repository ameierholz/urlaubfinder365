"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, BadgeCheck, Zap } from "lucide-react";
import WerbeplatzbuchenModal from "./WerbeplatzbuchenModal";

const DEMO_ANGEBOTE = [
  {
    bild: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&h=220&q=75",
    titel: "Schnorchel-Tour",
    ort: "Hurghada, Ägypten",
    preis: 39,
    anbieter: "Red Sea Diving Co.",
    initials: "RS",
    avatarColor: "#0891b2",
    verifiziert: true,
  },
  {
    bild: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&h=220&q=75",
    titel: "Jeep Safari",
    ort: "Antalya, Türkei",
    preis: 55,
    anbieter: "Türkiye Adventures",
    initials: "TA",
    avatarColor: "#d97706",
    verifiziert: true,
  },
  {
    bild: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&h=220&q=75",
    titel: "Bootsfahrt Caldera",
    ort: "Santorini, Griechenland",
    preis: 89,
    anbieter: "Greek Sea Tours",
    initials: "GS",
    avatarColor: "#7c3aed",
    verifiziert: true,
  },
  {
    bild: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&h=220&q=75",
    titel: "Türkischer Kochkurs",
    ort: "Istanbul, Türkei",
    preis: 45,
    anbieter: "Istanbul Kitchen",
    initials: "IK",
    avatarColor: "#dc2626",
    verifiziert: false,
  },
  {
    bild: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&h=220&q=75",
    titel: "Quad-Tour Vulkan",
    ort: "Fuerteventura",
    preis: 65,
    anbieter: "Canary Rides",
    initials: "CR",
    avatarColor: "#16a34a",
    verifiziert: true,
  },
  {
    bild: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&h=220&q=75",
    titel: "Surfkurs Anfänger",
    ort: "Lanzarote",
    preis: 59,
    anbieter: "Atlantic Surf School",
    initials: "AS",
    avatarColor: "#0f6e5c",
    verifiziert: false,
  },
  {
    bild: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&h=220&q=75",
    titel: "Elefanten-Safari",
    ort: "Phuket, Thailand",
    preis: 79,
    anbieter: "Thai Nature Tours",
    initials: "TN",
    avatarColor: "#b45309",
    verifiziert: true,
  },
  {
    bild: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&h=220&q=75",
    titel: "Fahrrad-Tour Altstadt",
    ort: "Palma, Mallorca",
    preis: 29,
    anbieter: "Mallorca Bikes",
    initials: "MB",
    avatarColor: "#0369a1",
    verifiziert: true,
  },
];

const PER_PAGE = 4; // 2 Spalten × 2 Zeilen

export default function FeaturedAngebotsCarousel() {
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const totalPages = Math.ceil(DEMO_ANGEBOTE.length / PER_PAGE);
  const visible = DEMO_ANGEBOTE.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <>
    <WerbeplatzbuchenModal open={modalOpen} onClose={() => setModalOpen(false)} />
    <div className="lg:col-span-2 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-gray-800">Featured Angebote</span>
          <span className="bg-sand-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
            Sponsored
          </span>
        </div>
        <a href="/marktplatz/" className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-0.5">
          Alle <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Carousel */}
      <div className="relative flex-1 flex flex-col px-5 pb-4 min-h-0">

        {/* Prev-Button */}
        {page > 0 && (
          <button
            onClick={() => setPage((p) => p - 1)}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Zurück"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Next-Button */}
        {page < totalPages - 1 && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Weiter"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* 2×2 Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1 mx-6">
          {visible.map((item) => (
            <a
              key={item.titel}
              href="/marktplatz/"
              className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-teal-100 transition-all hover:-translate-y-0.5 duration-200"
            >
              {/* Bild */}
              <div className="relative w-full flex-1 min-h-17.5">
                <Image
                  src={item.bild}
                  alt={item.titel}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                {/* Dunkles Overlay unten für Avatar-Lesbarkeit */}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-black/30 to-transparent" />
                {/* Anbieter-Avatar */}
                <div
                  className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-md border-2 border-white z-10"
                  style={{ backgroundColor: item.avatarColor }}
                  title={item.anbieter}
                >
                  {item.initials}
                </div>
              </div>

              {/* Card Body */}
              <div className="px-3 py-2.5 bg-white shrink-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-[10px] text-gray-500 truncate leading-none">{item.anbieter}</span>
                  {item.verifiziert && (
                    <BadgeCheck className="w-3 h-3 text-teal-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs font-black text-gray-800 leading-tight truncate">{item.titel}</p>
                <p className="text-[10px] text-gray-400 truncate">{item.ort}</p>
                <p className="text-xs font-black text-teal-600 mt-1">ab {item.preis} €</p>
              </div>
            </a>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3 shrink-0">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === page ? "bg-teal-500 w-4" : "bg-gray-300 w-1.5"
              }`}
              aria-label={`Seite ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer – Werbeplatz CTA */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-50 shrink-0">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center justify-between gap-2 bg-teal-50 hover:bg-teal-100 border border-teal-100 rounded-2xl px-4 py-2.5 transition-colors group"
        >
          <div className="text-left">
            <p className="text-xs font-black text-teal-800">Werbeplatz buchen</p>
            <p className="text-[10px] text-teal-600">Mehr Sichtbarkeit für dein Angebot</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-teal-600 group-hover:bg-teal-700 flex items-center justify-center shrink-0 transition-colors">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
        </button>
      </div>
    </div>
    </>
  );
}
