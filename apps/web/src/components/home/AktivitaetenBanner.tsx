import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";

const FeaturedAngebotsCarousel = dynamic(() => import("@/components/home/FeaturedAngebotsCarousel"));

export default function AktivitaetenBanner() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch min-h-[340px]">

          {/* LEFT – Erlebnisse/Tiqets Teaser (3/5) */}
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=600&h=400&q=50"
              alt="Erlebnisse & Touren weltweit buchen"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,131,143,0.90) 0%, rgba(0,79,90,0.85) 60%, rgba(29,182,130,0.80) 100%)" }} />

            <div className="relative px-8 py-9 flex flex-col h-full">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1 mb-4 w-fit">
                <span className="text-xs font-bold text-white uppercase tracking-widest">Erlebnisse & Touren</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                Unvergessliche Erlebnisse<br />an deinem Urlaubsziel
              </h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                Tickets für Sehenswürdigkeiten, Touren und Aktivitäten in über 40 Städten weltweit. Sofort buchbar, gratis stornierbar.
              </p>

              <div className="flex flex-wrap gap-3 mt-auto">
                <Link
                  href="/erlebnisse/"
                  className="inline-flex items-center gap-2 bg-white text-[#00838F] font-black px-6 py-3 rounded-2xl hover:bg-sand-50 transition-all shadow-lg hover:-translate-y-0.5 duration-200 text-sm"
                >
                  Erlebnisse entdecken <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/aktivitaeten/"
                  className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-bold px-6 py-3 rounded-2xl hover:bg-white/25 transition-all hover:-translate-y-0.5 duration-200 text-sm"
                >
                  Lokale Anbieter
                </Link>
              </div>

              <div className="flex gap-6 mt-6 pt-5 border-t border-white/20">
                {[
                  ["40+", "Städte"],
                  ["1000+", "Aktivitäten"],
                  ["Gratis", "Stornierung"],
                ].map(([val, label]) => (
                  <div key={label} className="text-center">
                    <div className="text-xl font-black text-white">{val}</div>
                    <div className="text-xs text-white/70">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT – Anbieter-Carousel (2/5) */}
          <FeaturedAngebotsCarousel />

        </div>
      </div>
    </section>
  );
}
