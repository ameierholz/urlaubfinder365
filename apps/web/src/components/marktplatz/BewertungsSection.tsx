"use client";

import { useState } from "react";
import { Star, Pencil, CheckCircle, AlertCircle } from "lucide-react";
import { useReviews } from "@/hooks/useMarktplatz";

function StarRow({
  value,
  onChange,
  readonly = false,
  size = "default",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "default";
}) {
  const [hovered, setHovered] = useState(0);
  const dim = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  const active = hovered || value;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            className={`${dim} transition-colors ${
              n <= active
                ? "fill-amber-400 stroke-amber-400"
                : "fill-none stroke-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial?: { bewertung: number; titel: string; inhalt: string };
  onSubmit: (bewertung: number, titel: string, inhalt: string) => Promise<void>;
  submitting: boolean;
}) {
  const [bewertung, setBewertung] = useState(initial?.bewertung ?? 0);
  const [titel, setTitel]         = useState(initial?.titel ?? "");
  const [inhalt, setInhalt]       = useState(initial?.inhalt ?? "");
  const [error, setError]         = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bewertung === 0) { setError("Bitte gib eine Sternbewertung ab."); return; }
    setError("");
    await onSubmit(bewertung, titel, inhalt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1">Deine Bewertung *</p>
        <StarRow value={bewertung} onChange={setBewertung} />
      </div>
      <div>
        <input
          type="text"
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          placeholder="Kurze Überschrift (optional)"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]"
        />
      </div>
      <div>
        <textarea
          value={inhalt}
          onChange={(e) => setInhalt(e.target.value)}
          placeholder="Erzähl anderen von deiner Erfahrung …"
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F] resize-none"
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 bg-[#00838F] hover:bg-[#006d78] disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
      >
        {submitting ? "Wird gespeichert …" : initial ? "Bewertung aktualisieren" : "Bewertung abschicken"}
      </button>
    </form>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

export default function BewertungsSection({ slug }: { slug: string }) {
  const { reviews, ownReview, loading, submitting, isLoggedIn, submitReview, avgBewertung } = useReviews(slug);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (bewertung: number, titel: string, inhalt: string) => {
    const ok = await submitReview(bewertung, titel, inhalt);
    if (ok) { setSuccess(true); setShowForm(false); setTimeout(() => setSuccess(false), 3000); }
  };

  if (loading) return <div className="h-20 animate-pulse bg-gray-100 rounded-2xl" />;

  return (
    <section className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-black text-gray-900">
            {avgBewertung ? avgBewertung.toFixed(1) : "–"}
          </p>
          <StarRow value={Math.round(avgBewertung ?? 0)} readonly size="sm" />
          <p className="text-xs text-gray-500 mt-1">{reviews.length} Bewertung{reviews.length !== 1 ? "en" : ""}</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((n) => {
            const count = reviews.filter((r) => r.bewertung === n).length;
            const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={n} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2">{n}</span>
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      {isLoggedIn ? (
        <>
          {success && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3 text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Bewertung gespeichert!
            </div>
          )}
          {ownReview && !showForm ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <StarRow value={ownReview.bewertung} readonly size="sm" />
                <button
                  onClick={() => setShowForm(true)}
                  className="text-xs text-[#00838F] flex items-center gap-1 hover:underline"
                >
                  <Pencil className="w-3 h-3" /> Bearbeiten
                </button>
              </div>
              {ownReview.titel && <p className="text-sm font-semibold text-gray-800">{ownReview.titel}</p>}
              {ownReview.inhalt && <p className="text-sm text-gray-600">{ownReview.inhalt}</p>}
              <p className="text-xs text-gray-400">{formatDate(ownReview.created_at)}</p>
            </div>
          ) : showForm || !ownReview ? (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <h4 className="font-bold text-gray-900 text-sm mb-4">
                {ownReview ? "Bewertung bearbeiten" : "Jetzt bewerten"}
              </h4>
              <ReviewForm
                initial={ownReview ? { bewertung: ownReview.bewertung, titel: ownReview.titel ?? "", inhalt: ownReview.inhalt ?? "" } : undefined}
                onSubmit={handleSubmit}
                submitting={submitting}
              />
              {ownReview && (
                <button onClick={() => setShowForm(false)} className="mt-2 text-xs text-gray-400 hover:underline w-full text-center">
                  Abbrechen
                </button>
              )}
            </div>
          ) : null}
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center">
          <p className="text-sm text-gray-600 mb-3">Melde dich an, um eine Bewertung zu schreiben.</p>
          <a
            href="/auth/login"
            className="inline-block px-5 py-2 bg-[#00838F] text-white text-sm font-bold rounded-xl hover:bg-[#006d78] transition-colors"
          >
            Anmelden
          </a>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 text-sm">Alle Bewertungen</h4>
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <StarRow value={r.bewertung} readonly size="sm" />
                <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
              </div>
              {r.titel && <p className="text-sm font-semibold text-gray-800">{r.titel}</p>}
              {r.inhalt && <p className="text-sm text-gray-600 leading-relaxed">{r.inhalt}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
