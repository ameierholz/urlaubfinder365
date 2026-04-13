import Link from "next/link";
import type { DestinationReviewStats } from "@/lib/destination-reviews";

interface Props {
  stats: DestinationReviewStats;
  destinationName: string;
  destinationSlug: string;
}

function StarRow({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "text-xl" : size === "sm" ? "text-xs" : "text-sm";
  const full = Math.round(rating);
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`${sizeClass} ${s <= full ? "text-amber-400" : "text-gray-200"}`}>★</span>
      ))}
    </span>
  );
}

export default function DestinationReviewsSection({ stats, destinationName, destinationSlug }: Props) {
  if (stats.count === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Urlauber-Bewertungen</p>
          <h2 className="text-xl font-extrabold text-gray-900">
            Was sagen Reisende über {destinationName}?
          </h2>
        </div>
        <Link
          href={`/community/reiseberichte/?destination=${destinationSlug}`}
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline shrink-0"
        >
          Alle ansehen →
        </Link>
      </div>

      <div className="flex gap-5 items-stretch">
        {/* Kompakte Statistik-Box */}
        <div className="shrink-0 w-36 bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-gray-900 leading-none">{stats.average.toFixed(1)}</div>
          <StarRow rating={stats.average} size="md" />
          <p className="text-[10px] text-gray-500 mt-1.5 text-center">{stats.count} Bewertungen</p>
          <div className="w-full mt-3 space-y-1">
            {[5, 4, 3, 2, 1].map((n) => {
              const count = stats.distribution[n as 1 | 2 | 3 | 4 | 5];
              const pct = stats.count > 0 ? Math.round((count / stats.count) * 100) : 0;
              return (
                <div key={n} className="flex items-center gap-1 text-[10px]">
                  <span className="w-2 text-gray-500">{n}</span>
                  <span className="text-amber-400 text-[8px]">★</span>
                  <div className="flex-1 h-1 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizontaler Scroll mit max 3 Reviews */}
        <div className="flex-1 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mr-4 pr-4 sm:mr-0 sm:pr-0">
          {stats.recent.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className="min-w-[260px] sm:min-w-0 sm:flex-1 snap-start bg-white border border-gray-200 rounded-xl p-4 flex flex-col"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <StarRow rating={r.rating} size="sm" />
                <span className="text-[10px] text-gray-400 shrink-0">
                  {new Date(r.created_at).toLocaleDateString("de-DE", { month: "short", year: "numeric" })}
                </span>
              </div>
              {r.title && (
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{r.title}</h3>
              )}
              {r.content && (
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 flex-1">{r.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
