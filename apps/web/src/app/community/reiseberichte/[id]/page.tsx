"use client";

import { useState, useEffect, use } from "react";
import { getTravelReport, likeTravelReport } from "@/lib/supabase-db";
import { TravelReport } from "@/types";
import CommentSection from "@/components/community/CommentSection";
import { useAuth } from "@/context/AuthContext";
import {
  Star, ThumbsUp, ThumbsDown, Heart, MapPin, Calendar,
  CheckCircle2, XCircle, ArrowLeft, Loader2,
} from "lucide-react";
import Link from "next/link";

const PRICE_LABELS: Record<string, string> = {
  budget: "💶 Budget (< 500 €/P)", mittel: "💶💶 Mittel (500–1.200 €/P)",
  premium: "💶💶💶 Premium (1.200–2.500 €/P)", luxus: "💶💶💶💶 Luxus (> 2.500 €/P)",
};

function formatVisitedAt(ym: string) {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const months = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  return `${months[parseInt(m) - 1]} ${y}`;
}

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [report, setReport] = useState<TravelReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    getTravelReport(id).then((r) => {
      setReport(r);
      if (r && user) setLiked(r.likedBy?.includes(user.uid) ?? false);
    }).finally(() => setLoading(false));
  }, [id, user]);

  async function toggleLike() {
    if (!user || !report) return;
    await likeTravelReport(user.uid, report.id, liked);
    setLiked(!liked);
    setReport((r) => r ? { ...r, likesCount: r.likesCount + (liked ? -1 : 1) } : r);
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  if (!report) return <div className="text-center py-20 text-gray-400">Bericht nicht gefunden.</div>;

  const initials = (report.displayName ?? "?").split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Zurück */}
      <Link href="/community/reiseberichte/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Alle Reiseberichte
      </Link>

      {/* Cover */}
      {report.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={report.coverImageUrl} alt={report.destination}
          className="w-full h-56 sm:h-72 object-cover rounded-2xl mb-6"
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="flex items-center gap-1 text-sm text-teal-600 font-semibold">
            <MapPin className="w-3.5 h-3.5" />{report.destination}
          </span>
          {report.visitedAt && (
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <Calendar className="w-3.5 h-3.5" />{formatVisitedAt(report.visitedAt)}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight mb-3">{report.title}</h1>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            {[1,2,3,4,5].map((n) => (
              <Star key={n} className={`w-5 h-5 ${n <= report.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
            ))}
          </span>
          <span className="text-sm text-gray-500">{PRICE_LABELS[report.priceRange]}</span>
          {report.recommendation ? (
            <span className="flex items-center gap-1 text-sm text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Empfehlenswert
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm text-red-600 font-semibold bg-red-50 px-2.5 py-0.5 rounded-full">
              <XCircle className="w-3.5 h-3.5" /> Nicht empfohlen
            </span>
          )}
        </div>
      </div>

      {/* Autor */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
        <Link href={`/community/profil/${report.userId}/`}
          className="w-10 h-10 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center hover:bg-teal-600 transition-colors"
        >
          {initials}
        </Link>
        <div>
          <Link href={`/community/profil/${report.userId}/`} className="font-semibold text-sm text-gray-800 hover:text-teal-700">
            {report.displayName}
          </Link>
          <p className="text-xs text-gray-400">Reisender</p>
        </div>
        <button onClick={toggleLike} disabled={!user}
          className={`ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all ${
            liked ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 text-gray-500 hover:border-red-300"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          {report.likesCount}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Highlights */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <h2 className="font-bold text-emerald-700 mb-2 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" /> Highlights
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{report.highlights}</p>
        </div>

        {/* Lowlights */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <h2 className="font-bold text-orange-700 mb-2 flex items-center gap-2">
            <ThumbsDown className="w-4 h-4" /> Nicht so gut
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{report.lowlights}</p>
        </div>

        {/* Tipps */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h2 className="font-bold text-blue-700 mb-2">💡 Tipps für andere</h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{report.tips}</p>
        </div>
      </div>

      {/* Kommentare */}
      <CommentSection reportId={report.id} />

      {/* Weitere Berichte CTA */}
      <div className="mt-10 text-center">
        <Link href="/community/reiseberichte/"
          className="inline-flex items-center gap-2 text-sm text-teal-600 font-semibold hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Weitere Reiseberichte entdecken
        </Link>
      </div>
    </div>
  );
}
