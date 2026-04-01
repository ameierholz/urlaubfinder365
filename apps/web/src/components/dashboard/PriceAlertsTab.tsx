"use client";

import { useEffect, useState } from "react";
import type { AppUser } from "@/context/AuthContext";
import type { PriceAlert } from "@/types";
import { getPriceAlerts, createPriceAlert, updatePriceAlert, deletePriceAlert } from "@/lib/supabase-db";
import { Bell, Trash2, Plus, X } from "lucide-react";
import { CATALOG } from "@/data/catalog-regions";

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
  const [alerts, setAlerts]     = useState<PriceAlert[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);

  // Formular-State
  const [fDest, setFDest]     = useState(DEST_OPTIONS[0]?.slug ?? "");
  const [fPrice, setFPrice]   = useState<number | "">(800);
  const [fNights, setFNights] = useState(7);
  const [fAdults, setFAdults] = useState(2);

  useEffect(() => {
    setLoading(true);
    getPriceAlerts(user.uid)
      .then(setAlerts)
      .catch(() => setError("Preisalarme konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, [user.uid]);

  const handleCreate = async () => {
    if (!fDest || !fPrice) return;
    const entry = DEST_OPTIONS.find((d) => d.slug === fDest);
    if (!entry) return;
    setSaving(true);
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
    } catch {
      // ignore
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
        <h2 className="text-xl font-bold text-gray-900">Meine Preisalarme</h2>
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
          <Bell className="w-5 h-5 text-[#00838F]" /> Meine Preisalarme
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 text-sm font-semibold">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors">
            Neu laden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-[#00838F]" />
            Meine Preisalarme
            {alerts.length > 0 && (
              <span className="text-sm font-normal text-gray-400">({alerts.length})</span>
            )}
          </h2>
          <p className="text-sm text-gray-500">Lege ein Reiseziel und dein maximales Budget fest – wir gleichen täglich aktuelle Angebote ab und zeigen dir Treffer direkt hier an.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="shrink-0 inline-flex items-center gap-1.5 bg-[#00838F] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#006E7A] transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuer Alarm
        </button>
      </div>

      {/* Formular */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Neuen Preisalarm anlegen</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Reiseziel</label>
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
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Max. Preis pro Person (€)</label>
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
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Reisedauer</label>
              <select
                value={fNights}
                onChange={(e) => setFNights(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] bg-white"
              >
                {NIGHT_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n} Nächte</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Personen</label>
              <select
                value={fAdults}
                onChange={(e) => setFAdults(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] bg-white"
              >
                {ADULT_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "Person" : "Personen"}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCreate}
              disabled={saving || !fDest || !fPrice}
              className="flex-1 bg-[#00838F] hover:bg-[#006E7A] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? "Wird gespeichert…" : "Preisalarm anlegen"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Leerer State */}
      {alerts.length === 0 && !showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 mb-2">Noch kein Preisalarm angelegt</h3>
          <p className="text-gray-400 text-sm mb-6">
            Lege einen Alarm an und wir informieren dich, sobald ein Angebot in deinen Preisrahmen fällt.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block bg-[#00838F] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#006E7A] transition-colors"
          >
            Ersten Preisalarm anlegen
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
                  <p className="text-[10px] text-gray-400 mt-0.5">Angelegt am {formatDate(alert.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(alert)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${alert.enabled ? "bg-[#00838F]" : "bg-gray-200"}`}
                    title={alert.enabled ? "Aktiv – klicken zum Deaktivieren" : "Inaktiv – klicken zum Aktivieren"}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${alert.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="w-7 h-7 rounded-full bg-gray-50 hover:bg-red-50 flex items-center justify-center group transition-colors"
                    title="Alarm löschen"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 bg-[#00838F]/8 text-[#00838F] text-xs font-semibold px-2.5 py-1 rounded-full">
                  💶 bis {alert.maxPrice.toLocaleString("de-DE")} € p.P.
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  🌙 {alert.nights} Nächte
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  👤 {alert.adults} {alert.adults === 1 ? "Person" : "Personen"}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${alert.enabled ? "text-emerald-600" : "text-gray-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${alert.enabled ? "bg-emerald-500" : "bg-gray-300"}`} />
                  {alert.enabled ? "Alarm aktiv" : "Alarm inaktiv"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
