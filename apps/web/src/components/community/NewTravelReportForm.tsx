"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Loader2, Star, AlertCircle, CheckCircle2 } from "lucide-react";

interface Destination {
  slug: string;
  name: string;
  country: string;
}

interface Props {
  destinations: Destination[];
  preselectedSlug?: string;
}

type PriceRange = "günstig" | "mittel" | "teuer";

const MAX_TITLE = 100;
const MIN_TITLE = 10;
const MAX_HIGHLIGHTS = 800;
const MIN_HIGHLIGHTS = 30;
const MAX_TIPS = 500;

export default function NewTravelReportForm({ destinations, preselectedSlug }: Props) {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  // Auth-State
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  // Form-State
  const initialDest = destinations.find((d) => d.slug === preselectedSlug);
  const [destinationSlug, setDestinationSlug] = useState(initialDest?.slug ?? "");
  const [title, setTitle] = useState("");
  const [highlights, setHighlights] = useState("");
  const [lowlights, setLowlights] = useState("");
  const [tips, setTips] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("mittel");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommendation, setRecommendation] = useState(true);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [visitedYear, setVisitedYear] = useState(new Date().getFullYear());
  const [visitedMonth, setVisitedMonth] = useState(new Date().getMonth() + 1);

  // UI-State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auth check
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const u = data.user;
      setUserId(u?.id ?? null);
      const meta = u?.user_metadata as Record<string, unknown> | undefined;
      const name =
        (meta?.display_name as string) ||
        (meta?.full_name as string) ||
        (meta?.name as string) ||
        u?.email?.split("@")[0] ||
        "";
      setDisplayName(name);
      setAuthChecked(true);
    });
    return () => {
      active = false;
    };
  }, [supabase]);

  const validate = useCallback((): string | null => {
    if (!destinationSlug) return "Bitte wähle ein Reiseziel aus.";
    if (title.trim().length < MIN_TITLE) return `Der Titel muss mindestens ${MIN_TITLE} Zeichen haben.`;
    if (title.trim().length > MAX_TITLE) return `Der Titel darf maximal ${MAX_TITLE} Zeichen haben.`;
    if (highlights.trim().length < MIN_HIGHLIGHTS) return `Die Highlights brauchen mindestens ${MIN_HIGHLIGHTS} Zeichen.`;
    if (highlights.trim().length > MAX_HIGHLIGHTS) return `Die Highlights dürfen maximal ${MAX_HIGHLIGHTS} Zeichen haben.`;
    if (rating < 1 || rating > 5) return "Bitte wähle eine Bewertung von 1 bis 5 Sternen.";
    if (coverImageUrl && !coverImageUrl.startsWith("https://")) {
      return "Die Bild-URL muss mit https:// beginnen.";
    }
    return null;
  }, [destinationSlug, title, highlights, rating, coverImageUrl]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!userId) {
        setError("Du musst eingeloggt sein, um einen Reisebericht zu schreiben.");
        return;
      }

      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return;
      }

      setSubmitting(true);

      const dest = destinations.find((d) => d.slug === destinationSlug);
      if (!dest) {
        setError("Reiseziel nicht gefunden.");
        setSubmitting(false);
        return;
      }

      const visitedAt = `${visitedYear}-${String(visitedMonth).padStart(2, "0")}`;

      try {
        const { error: insertError } = await supabase
          .from("travel_reports")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert({
            user_id: userId,
            display_name: displayName.trim() || "Reisender",
            destination: `${dest.name}, ${dest.country}`,
            country: dest.country,
            title: title.trim(),
            highlights: highlights.trim(),
            lowlights: lowlights.trim() || null,
            tips: tips.trim() || null,
            price_range: priceRange,
            rating,
            recommendation,
            cover_image_url: coverImageUrl.trim() || null,
            visited_at: visitedAt,
            is_published: false, // wartet auf redaktionelle Freigabe
            likes_count: 0,
            liked_by: [],
            comments_count: 0,
          } as never);

        if (insertError) throw insertError;

        setSuccess(true);
        setTimeout(() => {
          router.push("/community/reiseberichte/");
        }, 2500);
      } catch (err) {
        console.error("Reisebericht-Insert fehlgeschlagen:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Speichern fehlgeschlagen. Bitte versuche es erneut."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      userId,
      displayName,
      destinationSlug,
      destinations,
      title,
      highlights,
      lowlights,
      tips,
      priceRange,
      rating,
      recommendation,
      coverImageUrl,
      visitedYear,
      visitedMonth,
      validate,
      supabase,
      router,
    ]
  );

  // ── Auth-Loader ─────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── Nicht eingeloggt ────────────────────────────────────
  if (!userId) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Bitte zuerst einloggen
        </h2>
        <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
          Um einen Reisebericht zu schreiben, brauchst du ein Urlaubfinder365-Konto.
          Es ist kostenlos und dauert nur 30 Sekunden.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href={`/login?redirect=${encodeURIComponent("/community/reiseberichte/neu")}`}
            className="bg-[#1db682] hover:bg-[#16a070] text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Einloggen
          </Link>
          <Link
            href="/register"
            className="bg-white border-2 border-[#1db682] text-[#1db682] hover:bg-[#1db682]/5 font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Konto erstellen
          </Link>
        </div>
      </div>
    );
  }

  // ── Erfolgsmeldung ──────────────────────────────────────
  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vielen Dank für deinen Bericht!
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto mb-2">
          Dein Reisebericht wurde gespeichert und wartet auf eine kurze redaktionelle
          Prüfung. Sobald er freigegeben ist, erscheint er in der Community.
        </p>
        <p className="text-xs text-gray-400">Du wirst gleich weitergeleitet …</p>
      </div>
    );
  }

  // ── Formular ────────────────────────────────────────────
  const titleLength = title.length;
  const highlightsLength = highlights.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Reiseziel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <label className="block">
          <span className="text-sm font-bold text-gray-900 mb-1.5 block">
            Reiseziel <span className="text-rose-500">*</span>
          </span>
          <select
            value={destinationSlug}
            onChange={(e) => setDestinationSlug(e.target.value)}
            required
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#1db682] focus:ring-2 focus:ring-[#1db682]/20 outline-none"
          >
            <option value="">— Reiseziel wählen —</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name} ({d.country})
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Titel + Bewertung */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <label className="block">
          <span className="text-sm font-bold text-gray-900 mb-1.5 block">
            Titel deines Berichts <span className="text-rose-500">*</span>
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Traumurlaub auf Kreta im September"
            maxLength={MAX_TITLE}
            required
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#1db682] focus:ring-2 focus:ring-[#1db682]/20 outline-none"
          />
          <span className="text-xs text-gray-400 mt-1 block">
            {titleLength}/{MAX_TITLE} Zeichen (mindestens {MIN_TITLE})
          </span>
        </label>

        <div>
          <span className="text-sm font-bold text-gray-900 mb-2 block">
            Deine Gesamtbewertung <span className="text-rose-500">*</span>
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => {
              const filled = (hoverRating || rating) >= s;
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`${s} Sterne`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      filled ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                  />
                </button>
              );
            })}
            <span className="ml-3 text-sm text-gray-600">
              {rating} von 5 Sternen
            </span>
          </div>
        </div>
      </div>

      {/* Reisemonat */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <span className="text-sm font-bold text-gray-900 mb-2 block">
          Wann warst du dort?
        </span>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={visitedMonth}
            onChange={(e) => setVisitedMonth(Number(e.target.value))}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#1db682] focus:ring-2 focus:ring-[#1db682]/20 outline-none"
          >
            {[
              "Januar","Februar","März","April","Mai","Juni",
              "Juli","August","September","Oktober","November","Dezember"
            ].map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={visitedYear}
            onChange={(e) => setVisitedYear(Number(e.target.value))}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#1db682] focus:ring-2 focus:ring-[#1db682]/20 outline-none"
          >
            {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Highlights / Lowlights / Tipps */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <label className="block">
          <span className="text-sm font-bold text-gray-900 mb-1.5 block">
            ✨ Highlights – was war besonders gut? <span className="text-rose-500">*</span>
          </span>
          <textarea
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder="Strand, Hotel, Essen, Aktivitäten – erzähl uns was dich begeistert hat"
            maxLength={MAX_HIGHLIGHTS}
            rows={5}
            required
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#1db682] focus:ring-2 focus:ring-[#1db682]/20 outline-none resize-y"
          />
          <span className="text-xs text-gray-400 mt-1 block">
            {highlightsLength}/{MAX_HIGHLIGHTS} Zeichen (mindestens {MIN_HIGHLIGHTS})
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-gray-900 mb-1.5 block">
            ⚠️ Was war weniger gut? <span className="text-gray-400 font-normal">(optional)</span>
          </span>
          <textarea
            value={lowlights}
            onChange={(e) => setLowlights(e.target.value)}
            placeholder="Was hat gestört oder enttäuscht?"
            maxLength={500}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#1db682] focus:ring-2 focus:ring-[#1db682]/20 outline-none resize-y"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-gray-900 mb-1.5 block">
            💡 Tipps für andere Reisende <span className="text-gray-400 font-normal">(optional)</span>
          </span>
          <textarea
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="Insider-Tipps, Restaurant-Empfehlungen, beste Aktivitäten"
            maxLength={MAX_TIPS}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#1db682] focus:ring-2 focus:ring-[#1db682]/20 outline-none resize-y"
          />
        </label>
      </div>

      {/* Preisklasse + Empfehlung */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div>
          <span className="text-sm font-bold text-gray-900 mb-2 block">
            Preis-Leistung
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(["günstig", "mittel", "teuer"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriceRange(p)}
                className={`py-2.5 px-4 rounded-lg text-sm font-semibold border-2 transition-all ${
                  priceRange === p
                    ? "border-[#1db682] bg-[#1db682]/10 text-[#1db682]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {p === "günstig" ? "💰 Günstig" : p === "mittel" ? "💳 Mittel" : "✨ Teuer"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm font-bold text-gray-900 mb-2 block">
            Würdest du das Reiseziel weiterempfehlen?
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRecommendation(true)}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold border-2 transition-all ${
                recommendation
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              👍 Ja, empfehlenswert
            </button>
            <button
              type="button"
              onClick={() => setRecommendation(false)}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold border-2 transition-all ${
                !recommendation
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              👎 Eher nicht
            </button>
          </div>
        </div>
      </div>

      {/* Cover-Bild URL (optional, kein Upload um Storage zu vermeiden) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <label className="block">
          <span className="text-sm font-bold text-gray-900 mb-1.5 block">
            Cover-Bild URL <span className="text-gray-400 font-normal">(optional)</span>
          </span>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#1db682] focus:ring-2 focus:ring-[#1db682]/20 outline-none"
          />
          <span className="text-xs text-gray-400 mt-1 block">
            Direkte Bild-URL (z.B. von Unsplash). Wenn leer, nutzen wir ein Default-Bild.
          </span>
        </label>
      </div>

      {/* Display-Name */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <label className="block">
          <span className="text-sm font-bold text-gray-900 mb-1.5 block">
            Wie sollen wir dich nennen?
          </span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
            placeholder="Familie Müller / Sandra K. / Max"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#1db682] focus:ring-2 focus:ring-[#1db682]/20 outline-none"
          />
          <span className="text-xs text-gray-400 mt-1 block">
            Wird unter deinem Bericht angezeigt. Echter Name nicht nötig.
          </span>
        </label>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1db682] hover:bg-[#16a070] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Wird gespeichert …
            </>
          ) : (
            "Reisebericht veröffentlichen →"
          )}
        </button>
        <p className="text-xs text-gray-400 text-center mt-3">
          Mit dem Absenden bestätigst du, dass dein Bericht authentisch ist und gegen
          keine Rechte Dritter verstößt. Wir prüfen jeden Bericht vor der Veröffentlichung.
        </p>
      </div>
    </form>
  );
}
