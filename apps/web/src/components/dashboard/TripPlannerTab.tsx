"use client";

import { useEffect, useState } from "react";
import type { AppUser } from "@/context/AuthContext";
import type { TripPlan, SavedTrip, SavedActivity } from "@/types";
import {
  createTripPlan, getTripPlans, updateTripPlan, deleteTripPlan,
  getUserSavedTrips, getUserSavedActivities,
} from "@/lib/supabase-db";
import { Map, Plus, X, Trash2, ChevronDown, ChevronUp, Users, CalendarDays, Wallet, Globe, Lock } from "lucide-react";
import { CATALOG } from "@/data/catalog-regions";

interface Props { user: AppUser }

const DEST_OPTIONS = CATALOG
  .filter((e) => e.ibeRegionId)
  .sort((a, b) => a.name.localeCompare(b.name, "de"));

const STATUS_LABELS: Record<TripPlan["status"], { label: string; color: string }> = {
  planning:  { label: "In Planung",   color: "bg-gray-100 text-gray-600" },
  confirmed: { label: "Gebucht",      color: "bg-[#00838F]/10 text-[#00838F]" },
  completed: { label: "Abgeschlossen",color: "bg-blue-50 text-blue-600" },
};

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function fmtDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function TripPlannerTab({ user }: Props) {
  const [plans, setPlans]         = useState<TripPlan[]>([]);
  const [trips, setTrips]         = useState<SavedTrip[]>([]);
  const [activities, setActivities] = useState<SavedActivity[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [expanded, setExpanded]   = useState<string | null>(null);

  // Formular
  const [fTitle, setFTitle]       = useState("");
  const [fDest, setFDest]         = useState(DEST_OPTIONS[0]?.slug ?? "");
  const [fStart, setFStart]       = useState("");
  const [fEnd, setFEnd]           = useState("");
  const [fAdults, setFAdults]     = useState(2);
  const [fChildren, setFChildren] = useState(0);
  const [fBudget, setFBudget]     = useState<number | "">(1500);
  const [fNotes, setFNotes]       = useState("");
  const [fStatus, setFStatus]     = useState<TripPlan["status"]>("planning");
  const [fTripIds, setFTripIds]   = useState<string[]>([]);
  const [fActIds, setFActIds]     = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getTripPlans(user.uid),
      getUserSavedTrips(user.uid),
      getUserSavedActivities(user.uid),
    ])
      .then(([p, t, a]) => { setPlans(p); setTrips(t); setActivities(a); })
      .catch(() => setError("Reisepläne konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, [user.uid]);

  const resetForm = () => {
    setFTitle(""); setFDest(DEST_OPTIONS[0]?.slug ?? ""); setFStart(""); setFEnd("");
    setFAdults(2); setFChildren(0); setFBudget(1500); setFNotes("");
    setFStatus("planning"); setFTripIds([]); setFActIds([]);
  };

  const handleCreate = async () => {
    if (!fDest || !fStart || !fEnd) return;
    const entry = DEST_OPTIONS.find((d) => d.slug === fDest);
    if (!entry) return;
    setSaving(true);
    const title = fTitle || `Urlaub in ${entry.name}`;
    try {
      const id = await createTripPlan(user.uid, {
        title,
        destination: fDest,
        destinationName: entry.name,
        startDate: fStart,
        endDate: fEnd,
        adults: fAdults,
        children: fChildren,
        budget: Number(fBudget) || 0,
        notes: fNotes,
        status: fStatus,
        linkedTripIds: fTripIds,
        linkedActivityIds: fActIds,
      });
      setPlans((prev) => [...prev, {
        id, userId: user.uid, title,
        destination: fDest, destinationName: entry.name,
        startDate: fStart, endDate: fEnd,
        adults: fAdults, children: fChildren,
        budget: Number(fBudget) || 0,
        notes: fNotes, status: fStatus,
        linkedTripIds: fTripIds, linkedActivityIds: fActIds,
        createdAt: new Date(), updatedAt: new Date(),
      }]);
      setShowForm(false);
      resetForm();
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    await deleteTripPlan(user.uid, id);
  };

  const handleStatusChange = async (plan: TripPlan, status: TripPlan["status"]) => {
    setPlans((prev) => prev.map((p) => p.id === plan.id ? { ...p, status } : p));
    await updateTripPlan(user.uid, plan.id, { status });
  };

  const handleTogglePublic = async (plan: TripPlan) => {
    const isPublic = !((plan as unknown as Record<string, unknown>).isPublic);
    setPlans((prev) => prev.map((p) => p.id === plan.id ? { ...p, isPublic } as unknown as TripPlan : p));
    await updateTripPlan(user.uid, plan.id, { is_public: isPublic } as Partial<TripPlan>);
  };

  const toggleTripLink = (id: string) =>
    setFTripIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleActLink = (id: string) =>
    setFActIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Meine Reiseplanung</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Map className="w-5 h-5 text-[#00838F]" /> Meine Reiseplanung
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 text-sm font-semibold">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs bg-red-500 text-white px-4 py-2 rounded-full">Neu laden</button>
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
            <Map className="w-5 h-5 text-[#00838F]" />
            Meine Reiseplanung
            {plans.length > 0 && <span className="text-sm font-normal text-gray-400">({plans.length})</span>}
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-500">
            <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">➕</span><span>Klicke <strong>„Neuer Plan"</strong> – gib Reiseziel, Start-/Enddatum, Personenzahl und Budget an</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">📝</span><span>Trage Ideen, Notizen oder To-Dos direkt in den Plan ein (z.B. „Hotel checken", „Ausflüge vorbuchen")</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">🔗</span><span>Verknüpfe gespeicherte Pauschalreisen & Aktivitäten mit dem Plan – alles an einem Ort</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">📊</span><span>Status setzen: <strong>In Planung → Gebucht → Abgeschlossen</strong> – so behältst du den Überblick</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">✏️</span><span>Pläne jederzeit bearbeiten oder löschen – der Countdown zeigt dir wie viele Tage noch bis zur Abreise fehlen</span></li>
          </ul>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="shrink-0 inline-flex items-center gap-1.5 bg-[#00838F] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#006E7A] transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuer Plan
        </button>
      </div>

      {/* Formular */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Neuen Reiseplan erstellen</h3>
            <button onClick={() => { setShowForm(false); resetForm(); }}><X className="w-5 h-5 text-gray-400" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Titel */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Titel (optional)</label>
              <input type="text" value={fTitle} onChange={(e) => setFTitle(e.target.value)}
                placeholder="z.B. Sommerurlaub 2026"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]"
              />
            </div>
            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Reiseziel</label>
              <select value={fDest} onChange={(e) => setFDest(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] bg-white">
                {DEST_OPTIONS.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </div>
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
              <select value={fStatus} onChange={(e) => setFStatus(e.target.value as TripPlan["status"])}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] bg-white">
                <option value="planning">In Planung</option>
                <option value="confirmed">Gebucht</option>
                <option value="completed">Abgeschlossen</option>
              </select>
            </div>
            {/* Datum */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Abreise</label>
              <input type="date" value={fStart} onChange={(e) => setFStart(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Rückreise</label>
              <input type="date" value={fEnd} onChange={(e) => setFEnd(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
            </div>
            {/* Personen */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Erwachsene</label>
              <select value={fAdults} onChange={(e) => setFAdults(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] bg-white">
                {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Kinder</label>
              <select value={fChildren} onChange={(e) => setFChildren(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] bg-white">
                {[0,1,2,3,4].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Gesamtbudget (€)</label>
              <input type="number" value={fBudget} onChange={(e) => setFBudget(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="z.B. 2000" min={0}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
            </div>
            {/* Notizen */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Notizen</label>
              <textarea value={fNotes} onChange={(e) => setFNotes(e.target.value)}
                rows={2} placeholder="Hotel-Wünsche, Ausflüge, Tipps…"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] resize-none" />
            </div>

            {/* Gespeicherte Reisen verknüpfen */}
            {trips.length > 0 && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Gespeicherte Reise verknüpfen (optional)</label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto border border-gray-200 rounded-xl p-2">
                  {trips.map((t) => (
                    <label key={t.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1">
                      <input type="checkbox" checked={fTripIds.includes(t.id)} onChange={() => toggleTripLink(t.id)}
                        className="accent-[#00838F]" />
                      <span className="text-xs text-gray-700 truncate">{t.offer.hotel_name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Aktivitäten verknüpfen */}
            {activities.length > 0 && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Aktivitäten verknüpfen (optional)</label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto border border-gray-200 rounded-xl p-2">
                  {activities.map((a) => (
                    <label key={a.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1">
                      <input type="checkbox" checked={fActIds.includes(a.id)} onChange={() => toggleActLink(a.id)}
                        className="accent-[#00838F]" />
                      <span className="text-xs text-gray-700 truncate">{a.activity.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleCreate} disabled={saving || !fDest || !fStart || !fEnd}
              className="flex-1 bg-[#00838F] hover:bg-[#006E7A] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50">
              {saving ? "Wird gespeichert…" : "Reiseplan erstellen"}
            </button>
            <button onClick={() => { setShowForm(false); resetForm(); }}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Leerer State */}
      {plans.length === 0 && !showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <Map className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 mb-2">Noch keine Reisepläne</h3>
          <p className="text-gray-400 text-sm mb-6">Plane deinen nächsten Urlaub – mit Datum, Budget und deinen gespeicherten Angeboten.</p>
          <button onClick={() => setShowForm(true)}
            className="inline-block bg-[#00838F] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#006E7A] transition-colors">
            Ersten Reiseplan erstellen
          </button>
        </div>
      )}

      {/* Plan-Cards */}
      {plans.length > 0 && (
        <div className="space-y-4">
          {plans.sort((a, b) => (a.startDate > b.startDate ? 1 : -1)).map((plan) => {
            const days = daysUntil(plan.startDate);
            const isExpanded = expanded === plan.id;
            const linkedTrips = trips.filter((t) => (plan.linkedTripIds ?? []).includes(t.id));
            const linkedActs  = activities.filter((a) => (plan.linkedActivityIds ?? []).includes(a.id));
            const status = STATUS_LABELS[plan.status];

            return (
              <div key={plan.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {/* Card-Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-base">{plan.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#00838F] font-semibold mt-0.5">📍 {plan.destinationName}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : plan.id)}
                        className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>
                      <button
                        onClick={() => handleTogglePublic(plan)}
                        title={(plan as unknown as Record<string, unknown>).isPublic ? "Öffentlich – klicken zum Verbergen" : "Privat – klicken zum Teilen"}
                        className="w-7 h-7 rounded-full bg-gray-50 hover:bg-blue-50 flex items-center justify-center group transition-colors"
                      >
                        {(plan as unknown as Record<string, unknown>).isPublic
                          ? <Globe className="w-3.5 h-3.5 text-[#00838F]" />
                          : <Lock className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />}
                      </button>
                      <button onClick={() => handleDelete(plan.id)}
                        className="w-7 h-7 rounded-full bg-gray-50 hover:bg-red-50 flex items-center justify-center group transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>

                  {/* Meta-Chips */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      <CalendarDays className="w-3 h-3" /> {fmtDate(plan.startDate)} – {fmtDate(plan.endDate)}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      <Users className="w-3 h-3" /> {plan.adults + plan.children} {plan.adults + plan.children === 1 ? "Person" : "Personen"}
                    </span>
                    {plan.budget > 0 && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                        <Wallet className="w-3 h-3" /> {plan.budget.toLocaleString("de-DE")} €
                      </span>
                    )}
                    {days !== null && days >= 0 && plan.status !== "completed" && (
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${days <= 7 ? "bg-amber-50 text-amber-700" : "bg-[#00838F]/8 text-[#00838F]"}`}>
                        🗓 {days === 0 ? "Heute!" : `in ${days} Tagen`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Aufgeklappt: Details */}
                {isExpanded && (
                  <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
                    {/* Status ändern */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-semibold shrink-0">Status:</span>
                      <div className="flex gap-1.5">
                        {(["planning", "confirmed", "completed"] as TripPlan["status"][]).map((s) => (
                          <button key={s} onClick={() => handleStatusChange(plan, s)}
                            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${plan.status === s ? STATUS_LABELS[s].color : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {STATUS_LABELS[s].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notizen */}
                    {plan.notes && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Notizen</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{plan.notes}</p>
                      </div>
                    )}

                    {/* Verlinkte Reisen */}
                    {linkedTrips.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1.5">🏨 Verlinkte Reisen</p>
                        <div className="space-y-1">
                          {linkedTrips.map((t) => (
                            <div key={t.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                              <span className="text-xs text-gray-700 font-medium truncate">{t.offer.hotel_name}</span>
                              <span className="text-xs text-gray-400 ml-auto shrink-0">ab {t.offer.offer_price_total?.toLocaleString("de-DE")} €</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verlinkte Aktivitäten */}
                    {linkedActs.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1.5">🎟 Verlinkte Aktivitäten</p>
                        <div className="space-y-1">
                          {linkedActs.map((a) => (
                            <div key={a.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                              <span className="text-xs text-gray-700 font-medium truncate">{a.activity.title}</span>
                              {a.activity.price != null && (
                                <span className="text-xs text-gray-400 ml-auto shrink-0">ab {a.activity.price.toFixed(2).replace(".", ",")} €</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
