"use client";

import Link from "next/link";
import { TravelReport, PriceRange } from "@/types";
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Heart, MapPin } from "lucide-react";

const PRICE_LABELS: Record<PriceRange, string> = {
  budget: "💶 Budget",
  mittel: "💶💶 Mittel",
  premium: "💶💶💶 Premium",
  luxus: "💶💶💶💶 Luxus",
};

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= n ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
      ))}
    </span>
  );
}

interface Props {
  report: TravelReport;
  compact?: boolean;
}

export default function TravelReportCard({ report, compact }: Props) {
  const initials = report.displayName.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Link
      href={`/community/reiseberichte/${report.id}/`}
      className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Cover */}
      <div className="relative h-44 bg-linear-to-br from-teal-400 to-cyan-500 overflow-hidden">
        {report.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={report.coverImageUrl}
            alt={`${report.destination} – ${report.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {PRICE_LABELS[report.priceRange]}
          </span>
          {report.recommendation ? (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ThumbsUp className="w-2.5 h-2.5" /> Empfehlung
            </span>
          ) : (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ThumbsDown className="w-2.5 h-2.5" /> Nicht empfohlen
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute bottom-2.5 left-2.5">
          <Stars n={report.rating} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-center gap-1 text-xs text-teal-600 font-semibold">
          <MapPin className="w-3 h-3" />
          {report.destination}
        </div>

        <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">
          {report.title}
        </h3>

        {!compact && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {report.highlights}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center">
              {initials}
            </div>
            <span className="text-xs text-gray-600">{report.displayName}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-400">
            <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{report.likesCount}</span>
            <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" />{report.commentsCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
