import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const GUIDES = [
  {
    slug: "reisefuehrer-antalya",
    dest: "Antalya",
    country: "Türkei",
    flag: "tr",
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=70&auto=format",
    teaser: "Strände, Ruinen & Top-Hotels an der türkischen Riviera",
  },
  {
    slug: "reisefuehrer-mallorca",
    dest: "Mallorca",
    country: "Spanien",
    flag: "es",
    img: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=70&auto=format",
    teaser: "Traumstrände, Serra de Tramuntana & Palmas Altstadt",
  },
  {
    slug: "reisefuehrer-kreta",
    dest: "Kreta",
    country: "Griechenland",
    flag: "gr",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=70&auto=format",
    teaser: "Samaria-Schlucht, Knossos & griechische Gastfreundschaft",
  },
  {
    slug: "reisefuehrer-hurghada",
    dest: "Hurghada",
    country: "Ägypten",
    flag: "eg",
    img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=70&auto=format",
    teaser: "Rotes Meer, Tauchen & Wüstenabenteuer in Ägypten",
  },
  {
    slug: "reisefuehrer-barcelona",
    dest: "Barcelona",
    country: "Spanien",
    flag: "es",
    img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=70&auto=format",
    teaser: "Gaudí, Tapas, Strände & katalanisches Nachtleben",
  },
];

export default function GuidesSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-14">

        {/* Header-Zeile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="h-8 w-1.5 rounded-full bg-sand-500" />
              <div className="h-8 w-1.5 rounded-full bg-sky-500" />
              <div className="h-8 w-1.5 rounded-full bg-violet-500" />
            </div>
            <div>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Dein Reisebegleiter</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Urlaubsguides</h2>
            </div>
          </div>
          <Link
            href="/urlaubsguides/"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-sand-500 text-white font-black px-5 py-2.5 rounded-2xl transition-all duration-200 text-sm shrink-0"
          >
            Alle Guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Guide-Kacheln als Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/urlaubsguides/${g.slug}/`}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ height: "clamp(180px, 22vw, 220px)" }}
            >
              <Image
                src={g.img}
                alt={`Urlaubsguide ${g.dest}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width:640px)50vw,(max-width:1024px)33vw,20vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
              {/* Flagge oben links */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                <img src={`https://flagcdn.com/16x12/${g.flag}.png`} alt={g.country} className="rounded-sm" width={16} height={12} loading="lazy" />
                <span className="text-white text-[10px] font-bold">{g.country}</span>
              </div>
              {/* Text unten */}
              <div className="absolute bottom-0 p-3">
                <h3 className="font-black text-lg text-white leading-tight" style={{ textShadow: "0 1px 6px rgba(0,0,0,.9)" }}>
                  {g.dest}
                </h3>
                <p className="text-white/70 text-[11px] mt-0.5 line-clamp-2 leading-snug" style={{ textShadow: "0 1px 3px rgba(0,0,0,.8)" }}>
                  {g.teaser}
                </p>
                <span className="mt-1.5 text-sand-400 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                  Guide lesen <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
