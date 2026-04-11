import Link from "next/link";
import type { DestinationReviewStats } from "@/lib/destination-reviews";

interface Props {
  stats: DestinationReviewStats;
  destinationName: string;
  destinationSlug: string;
}

function StarRow({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";
  const full = Math.round(rating);
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`${sizeClass} ${s <= full ? "text-amber-400" : "text-gray-200"}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function DestinationReviewsSection({
  stats,
  destinationName,
  destinationSlug,
}: Props) {
  const hasReviews = stats.count > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
      <p className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-2">
        Urlauber-Bewertungen
      </p>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
        Was sagen Reisende über {destinationName}?
      </h2>

      {hasReviews ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Average + Distribution */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="text-5xl font-black text-gray-900 leading-none mb-2">
              {stats.average.toFixed(1)}
            </div>
            <StarRow rating={stats.average} size="lg" />
            <p className="text-sm text-gray-500 mt-2">
              basierend auf {stats.count} Bewertung{stats.count !== 1 ? "en" : ""}
            </p>
            <div className="w-full mt-5 space-y-1.5">
              {[5, 4, 3, 2, 1].map((n) => {
                const count = stats.distribution[n as 1 | 2 | 3 | 4 | 5];
                const pct = stats.count > 0 ? Math.round((count / stats.count) * 100) : 0;
                return (
                  <div key={n} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-gray-600 font-semibold">{n}</span>
                    <span className="text-amber-400">★</span>
                    <div className="flex-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent reviews */}
          <div className="lg:col-span-2 space-y-4">
            {stats.recent.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-amber-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <StarRow rating={r.rating} size="sm" />
                  <span className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString("de-DE", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                {r.title && (
                  <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">
                    {r.title}
                  </h3>
                )}
                {r.content && (
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {r.content}
                  </p>
                )}
              </div>
            ))}
            <Link
              href={`/community/reiseberichte/?destination=${destinationSlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 hover:underline"
            >
              Alle Bewertungen ansehen →
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">✍️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Warst du schon in {destinationName}?
          </h3>
          <p className="text-sm text-gray-600 max-w-lg mx-auto mb-5">
            Teile deine Erfahrungen und hilf anderen Reisenden bei der Entscheidung.
            Noch gibt es keine Bewertungen für {destinationName} – sei die erste Stimme.
          </p>
          <Link
            href={`/community/reiseberichte/neu?destination=${destinationSlug}`}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
          >
            Bewertung schreiben →
          </Link>
        </div>
      )}
    </div>
  );
}
