import Link from "next/link";
import type { DestTravelReport } from "@/lib/destination-travel-reports";

interface Props {
  reports: DestTravelReport[];
  destinationName: string;
  destinationSlug: string;
}

export default function DestinationCommunityReports({
  reports,
  destinationName,
  destinationSlug,
}: Props) {
  const hasReports = reports.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
      <p className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2">
        Community-Reiseberichte
      </p>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
        Echte Erfahrungen aus {destinationName}
      </h2>

      {hasReports ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reports.map((r) => (
              <Link
                key={r.id}
                href={`/community/reiseberichte/${r.id}/`}
                className="group bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md rounded-2xl overflow-hidden transition-all flex flex-col"
              >
                {r.coverImageUrl ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.coverImageUrl}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-5xl opacity-40">📷</span>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex gap-0.5 text-amber-400 text-xs">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={s <= Math.round(r.rating) ? "text-amber-400" : "text-gray-200"}>★</span>
                      ))}
                    </span>
                    {r.visitedAt && (
                      <span className="text-xs text-gray-400">
                        ·{" "}
                        {new Date(r.visitedAt + "-01").toLocaleDateString("de-DE", { month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 leading-tight mb-1 line-clamp-2">
                    {r.title}
                  </h3>
                  {r.highlights && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
                      {r.highlights}
                    </p>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">von {r.displayName}</span>
                    {r.likesCount > 0 && (
                      <span className="text-purple-500 font-semibold">♥ {r.likesCount}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href={`/community/reiseberichte/?destination=${destinationSlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline"
            >
              Alle {destinationName}-Reiseberichte ansehen →
            </Link>
          </div>
        </>
      ) : (
        <div className="bg-linear-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Noch keine Reiseberichte zu {destinationName}
          </h3>
          <p className="text-sm text-gray-600 max-w-lg mx-auto mb-5">
            Du warst in {destinationName}? Teile deine Highlights, Geheimtipps und
            Empfehlungen mit der Community.
          </p>
          <Link
            href={`/community/reiseberichte/neu?destination=${destinationSlug}`}
            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
          >
            Reisebericht schreiben →
          </Link>
        </div>
      )}
    </div>
  );
}
