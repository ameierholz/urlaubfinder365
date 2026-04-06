"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { AppUser } from "@/context/AuthContext";
import type { PriceAlert } from "@/types";
import { getPriceAlerts, createPriceAlert, updatePriceAlert, deletePriceAlert } from "@/lib/supabase-db";
import { Bell, BellOff, BellRing, Trash2, Plus, X } from "lucide-react";
import { CATALOG } from "@/data/catalog-regions";
import { usePushNotifications } from "@/hooks/use-push-notifications";

interface Props { user: AppUser }

// Nur Einträge mit ibeRegionId für sinnvolle Preisalarme
const DEST_OPTIONS = CATALOG
  .filter((e) => e.ibeRegionId)
  .sort((a, b) => a.name.localeCompare(b.name, "de"));

function formatDate(val: unknown): string {
  if (!val) return "";
  let date: Date;
  if (typeof val === "object" && val !== null && "toDate" in val) {
    date = (val as { toDate: () => Date }).toDate();
  } else {
    date = new Date(val as string);
  }
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const NIGHT_OPTIONS = [3, 5, 7, 10, 14];
const ADULT_OPTIONS = [1, 2, 3, 4];

export default function PriceAlertsTab({ user }: Props) {
  const t = useTranslations("dashboardPriceAlerts");
  const [alerts, setAlerts]     = useState<PriceAlert[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState("");

  const { state: pushState, subscribe: pushSubscribe, unsubscribe: pushUnsubscribe } = usePushNotifications();

  // Formular-State
  const [fDest, setFDest]     = useState(DEST_OPTIONS[0]?.slug ?? "");
  const [fPrice, setFPrice]   = useState<number | "">(800);
  const [fNights, setFNights] = useState(7);
  const [fAdults, setFAdults] = useState(2);

  useEffect(() => {
    setLoading(true);
    getPriceAlerts(user.uid)
      .then(setAlerts)
      .catch(() => setError(t("loadError")))
      .finally(() => setLoading(false));
  }, [user.uid]);

  const handleCreate = async () => {
    if (!fDest || !fPrice) return;
    const entry = DEST_OPTIONS.find((d) => d.slug === fDest);
    if (!entry) return;
    setSaving(true);
    setSaveError("");
    try {
      const id = await createPriceAlert(user.uid, {
        destination: fDest,
        destinationName: entry.name,
        maxPrice: Number(fPrice),
        adults: fAdults,
        nights: fNights,
        enabled: true,
      });
      setAlerts((prev) => [...prev, {
        id,
        userId: user.uid,
        destination: fDest,
        destinationName: entry.name,
        maxPrice: Number(fPrice),
        adults: fAdults,
        nights: fNights,
        enabled: true,
        createdAt: new Date(),
      }]);
      setShowForm(false);
      setFPrice(800);
      setFNights(7);
      setFAdults(2);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t("saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (alert: PriceAlert) => {
    const next = !alert.enabled;
    setAlerts((prev) => prev.map((a) => a.id === alert.id ? { ...a, enabled: next } : a));
    await updatePriceAlert(user.uid, alert.id, { enabled: next });
  };

  const handleDelete = async (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    await deletePriceAlert(user.uid, id);
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">{t("title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#00838F]" /> {t("title")}
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 text-sm font-semibold">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors">
            {t("reload")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">

    {/* Erklärung rechts */}
    <div className="order-first lg:order-last lg:w-64 shrink-0">
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 lg:sticky lg:top-28">
        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">{t("infoTitle")}</h3>
        <ul className="space-y-2.5 text-xs text-gray-600">
          <li className="flex items-start gap-2"><span className="shrink-0">🔔</span><span>{t("info1")}</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">📅</span><span>{t("info2")}</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">✅</span><span>{t("info3")}</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">🎯</span><span>{t("info4")}</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">🔕</span><span>{t("info5")}</span></li>
        </ul>
      </div>
    </div>

    <div className="flex-1 min-w-0 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-[#00838F]" />
            {t("title")}
            {alerts.length > 0 && (
              <span className="text-sm font-normal text-gray-400">({alerts.length})</span>
            )}
          </h2>
          <p className="text-sm text-gray-500">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Push-Toggle */}
          {pushState !== "unsupported" && (
            <button
              onClick={pushState === "granted" ? pushUnsubscribe : pushSubscribe}
              disabled={pushState === "loading" || pushState === "denied"}
              title={
                pushState === "granted" ? t("pushDeactivateTitle")
                : pushState === "denied" ? t("pushBlockedTitle")
                : t("pushActivateTitle")
              }
              className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-full border transition-colors disabled:opacity-50 ${
                pushState === "granted"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  : pushState === "denied"
                  ? "bg-red-50 border-red-200 text-red-500 cursor-not-allowed"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {pushState === "granted" ? <BellRing className="w-4 h-4" />
               : pushState === "denied" ? <BellOff className="w-4 h-4" />
               : <Bell className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {pushState === "granted" ? t("pushActive")
                 : pushState === "denied" ? t("pushBlocked")
                 : pushState === "loading" ? "…"
                 : t("pushActivate")}
              </span>
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="shrink-0 inline-flex items-center gap-1.5 bg-[#00838F] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#006E7A] transition-colors"
          >
            <Plus className="w-4 h-4" /> {t("newAlarm")}
          </button>
        </div>
      </div>

      {/* Formular */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">{t("formTitle")}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t("labelDestination")}</label>
              <select
                value={fDest}
                onChange={(e) => setFDest(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] bg-white"
              >
                {DEST_OPTIONS.map((d) => (
                  <option key={d.slug} value={d.slug}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t("labelMaxPrice")}</label>
              <input
                type="number"
                value={fPrice}
                onChange={(e) => setFPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="z.B. 800"
                min={100}
                max={9999}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t("labelDuration")}</label>
              <select
                value={fNights}
                onChange={(e) => setFNights(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] bg-white"
              >
                {NIGHT_OPTIONS.map((n) => (
                  <option key={n} value={n}>{t("nights", { n })}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t("labelPersons")}</label>
              <select
                value={fAdults}
                onChange={(e) => setFAdults(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] bg-white"
              >
                {ADULT_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n === 1 ? t("person", { n }) : t("persons", { n })}</option>
                ))}
              </select>
            </div>
          </div>
          {saveError && (
            <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {saveError}
            </p>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCreate}
              disabled={saving || !fDest || !fPrice}
              className="flex-1 bg-[#00838F] hover:bg-[#006E7A] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? t("saving") : t("createAlarm")}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Leerer State */}
      {alerts.length === 0 && !showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 mb-2">{t("emptyTitle")}</h3>
          <p className="text-gray-400 text-sm mb-6">
            {t("emptyDesc")}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block bg-[#00838F] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#006E7A] transition-colors"
          >
            {t("createFirst")}
          </button>
        </div>
      )}

      {/* Alarm-Liste */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">🏖️ {alert.destinationName}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t("createdAt", { date: formatDate(alert.createdAt) })}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(alert)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${alert.enabled ? "bg-[#00838F]" : "bg-gray-200"}`}
                    title={alert.enabled ? t("toggleActiveTitle") : t("toggleInactiveTitle")}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${alert.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 flex items-center justify-center group transition-colors"
                    title={t("deleteTitle")}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 bg-[#00838F]/8 text-[#00838F] text-xs font-semibold px-2.5 py-1 rounded-full">
                  💶 {t("upTo", { price: alert.maxPrice.toLocaleString("de-DE") })}
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  🌙 {t("nights", { n: alert.nights })}
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  👤 {alert.adults === 1 ? t("person", { n: alert.adults }) : t("persons", { n: alert.adults })}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${alert.enabled ? "text-emerald-600" : "text-gray-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${alert.enabled ? "bg-emerald-500" : "bg-gray-300"}`} />
                  {alert.enabled ? t("alarmActive") : t("alarmInactive")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
