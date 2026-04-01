import Link from "next/link";
import { MapPin } from "lucide-react";
import { destinations, destImg } from "@/lib/destinations";
import type { DestinationConfig } from "@/types";

interface Props {
  current: DestinationConfig;
}

export default function SimilarDestinations({ current }: Props) {
  const others = destinations.filter((d) => d.slug !== current.slug);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">
        Ähnliche Reiseziele
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {others.map((dest) => (
          <Link
            key={dest.slug}
            href={`/urlaubsziele/${dest.slug}/`}
            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={destImg(dest)}
              alt={dest.name}
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <div className="flex items-center gap-1.5 text-white">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="font-bold text-lg leading-tight">{dest.name}</span>
              </div>
              <p className="text-white/80 text-xs mt-0.5">{dest.country}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
