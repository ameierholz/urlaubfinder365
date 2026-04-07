"use client";

import { useState } from "react";
import { X, Check, Zap, Crown } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PAKET_IDS = ["starter", "featured", "premium"] as const;
const PAKET_PREISE: Record<string, string> = { starter: "99", featured: "199", premium: "349" };
const FEATURE_COUNTS: Record<string, number> = { starter: 3, featured: 4, premium: 4 };

export default function WerbeplatzbuchenModal({ open, onClose }: Props) {
  const t = useTranslations("werbeplatz");
  const [selectedPaket, setSelectedPaket] = useState<string>("featured");
  const [form, setForm] = useState({ name: "", firma: "", email: "", angebotUrl: "", nachricht: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const preis = PAKET_PREISE[selectedPaket];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout-werbeplatz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:       form.name,
          firma:      form.firma,
          email:      form.email,
          paket:      selectedPaket,
          angebotUrl: form.angebotUrl || undefined,
          nachricht:  form.nachricht  || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json() as { url: string };
      window.location.href = url; // → Stripe Checkout
    } catch {
      setError(t("errorStripe"));
      setLoading(false);
    }
  }

  function getFeatures(paketId: string): string[] {
    const count = FEATURE_COUNTS[paketId];
    const features: string[] = [];
    for (let i = 1; i <= count; i++) {
      features.push(t(`packages.${paketId}Feature${i}`));
    }
    return features;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {done ? (
          /* Erfolgs-Screen */
          <div className="flex flex-col items-center justify-center text-center px-8 py-16 gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">{t("successTitle")}</h2>
            <p className="text-gray-500 max-w-sm">
              {t("successText")}
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
            >
              {t("close")}
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              className="relative px-8 pt-8 pb-6 rounded-t-3xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0f6e5c 0%, #1db682 100%)" }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Zap className="w-3 h-3" /> {t("tagline")}
              </span>
              <h2 className="text-2xl font-black text-white mb-1">{t("title")}</h2>
              <p className="text-white/80 text-sm">{t("subtitle")}</p>
            </div>

            {/* Paket-Auswahl */}
            <div className="px-6 pt-5 pb-4 grid grid-cols-3 gap-3 border-b border-gray-100">
              {PAKET_IDS.map((id) => {
                const active = selectedPaket === id;
                const paketPreis = PAKET_PREISE[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedPaket(id)}
                    className={`relative flex flex-col rounded-2xl border-2 p-3 text-left transition-all ${
                      active
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    {id === "featured" && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-sand-400 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">
                        {t("popularBadge")}
                      </span>
                    )}
                    {id === "premium" && (
                      <Crown className="w-3.5 h-3.5 text-sand-500 mb-1" />
                    )}
                    <span className={`text-xs font-black mb-1 ${active ? "text-teal-700" : "text-gray-700"}`}>
                      {t(`packages.${id}Name`)}
                    </span>
                    <span className={`text-lg font-black leading-none ${active ? "text-teal-600" : "text-gray-800"}`}>
                      {paketPreis} €
                    </span>
                    <span className="text-[10px] text-gray-400">{t("perMonth")}</span>
                    <ul className="mt-2 space-y-1">
                      {getFeatures(id).map((f) => (
                        <li key={f} className="flex items-start gap-1">
                          <Check className={`w-3 h-3 mt-0.5 shrink-0 ${active ? "text-teal-500" : "text-gray-400"}`} />
                          <span className="text-[10px] text-gray-600 leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            {/* Formular */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("contactPerson")}</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Max Mustermann"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("company")}</label>
                  <input
                    required
                    value={form.firma}
                    onChange={(e) => setForm((f) => ({ ...f, firma: e.target.value }))}
                    placeholder="Meine Touren GmbH"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("emailLabel")}</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="info@meine-touren.de"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("offerUrl")}</label>
                <input
                  type="url"
                  value={form.angebotUrl}
                  onChange={(e) => setForm((f) => ({ ...f, angebotUrl: e.target.value }))}
                  placeholder="https://urlaubfinder365.de/marktplatz/mein-angebot"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{t("message")}</label>
                <textarea
                  rows={3}
                  value={form.nachricht}
                  onChange={(e) => setForm((f) => ({ ...f, nachricht: e.target.value }))}
                  placeholder={t("messagePlaceholder")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-colors text-sm"
              >
                {loading ? t("submitLoading") : t("submitButton", { price: preis })}
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                {t("paymentNote")}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
