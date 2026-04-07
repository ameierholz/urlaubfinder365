"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  variant?: "hero" | "inline" | "footer";
  firstName?: string;
  lastName?: string;
  userEmail?: string;
}

export default function NewsletterSignup({ variant = "inline", firstName, lastName, userEmail }: Props) {
  const t = useTranslations("newsletter");
  const [email, setEmail]         = useState(userEmail ?? "");
  const [vorname, setVorname]     = useState(firstName ?? "");
  const [nachname, setNachname]   = useState(lastName ?? "");
  const [consent, setConsent]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) { setError(t("errorConsent")); return; }
    if (!email.includes("@")) { setError(t("errorEmail")); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName: vorname, lastName: nachname, action: "subscribe" }),
      });
      if (res.ok) { setDone(true); } else { setError(t("errorFailed")); }
    } catch { setError(t("errorNetwork")); }
    finally { setLoading(false); }
  };

  if (done) {
    return (
      <div className={`flex items-center gap-3 ${variant === "hero" ? "text-white" : "text-emerald-700 bg-emerald-50 rounded-2xl p-4"}`}>
        <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <p className="font-bold">{t("successTitle")}</p>
          <p className="text-sm opacity-75">{t("successText")}</p>
        </div>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <form onSubmit={submit} className="space-y-3 pr-14 sm:pr-0">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            required
            className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00838F] hover:bg-[#006E7A] text-white font-bold px-5 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {t("subscribe")}
          </button>
        </div>
        <label className="flex items-start gap-3 text-white/80 text-xs cursor-pointer select-none text-left">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 w-5 h-5 shrink-0 accent-white cursor-pointer"
          />
          <span>
            {t.rich("consentHero", {
              privacyLink: (chunks) => <a href="/datenschutz/" className="underline hover:text-white">{chunks}</a>,
            })}
          </span>
        </label>
        {error && <p className="text-red-300 text-xs">{error}</p>}
      </form>
    );
  }

  // inline / footer
  return (
    <form onSubmit={submit} className="space-y-3">
      {!userEmail && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={vorname}
              onChange={(e) => setVorname(e.target.value)}
              placeholder={t("firstNamePlaceholder")}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]"
            />
            <input
              type="text"
              value={nachname}
              onChange={(e) => setNachname(e.target.value)}
              placeholder={t("lastNamePlaceholder")}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]"
            />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailRequiredPlaceholder")}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]"
          />
        </>
      )}
      {userEmail && (
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-gray-400" />
          {userEmail}
        </div>
      )}
      <label className="flex items-start gap-3 text-gray-500 text-xs cursor-pointer select-none">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-5 h-5 shrink-0 accent-[#00838F] cursor-pointer"
        />
        <span>
          {t.rich("consentInline", {
            privacyLink: (chunks) => <a href="/datenschutz/" className="text-[#00838F] hover:underline">{chunks}</a>,
          })}
        </span>
      </label>
      {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <button
        type="submit"
        disabled={loading || !consent}
        className="w-full bg-[#00838F] hover:bg-[#006E7A] disabled:opacity-40 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
        {t("submitFree")}
      </button>
    </form>
  );
}
