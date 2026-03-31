"use client";

import { useEffect, useState } from "react";
import type { AppUser } from "@/context/AuthContext";
import type { TravelDocument, TravelDocumentType } from "@/types";
import { getTravelDocuments, saveTravelDocument, updateTravelDocument, deleteTravelDocument } from "@/lib/firestore";
import { FileText, Plus, X, Trash2, Eye, EyeOff, AlertTriangle, Edit2 } from "lucide-react";

interface Props { user: AppUser }

const DOC_TYPES: { type: TravelDocumentType; label: string; emoji: string }[] = [
  { type: "passport",   label: "Reisepass",        emoji: "🛂" },
  { type: "insurance",  label: "Versicherung",      emoji: "🏥" },
  { type: "visa",       label: "Visa",              emoji: "🪪" },
  { type: "vaccination",label: "Impfung",           emoji: "💉" },
  { type: "emergency",  label: "Notfallkontakt",    emoji: "📞" },
];

function daysUntilExpiry(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function fmtDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function expiryDates(doc: TravelDocument): string[] {
  return [doc.expiryDate, doc.insuranceExpiryDate, doc.visaExpiryDate].filter(Boolean) as string[];
}

function MaskField({ value, label }: { value?: string; label: string }) {
  const [visible, setVisible] = useState(false);
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-gray-800">
          {visible ? value : "••••••••"}
        </span>
        <button onClick={() => setVisible(!visible)} className="text-gray-400 hover:text-gray-600 transition-colors">
          {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

function PlainField({ value, label }: { value?: string; label: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

function ExpiryBadge({ dateStr }: { dateStr?: string }) {
  const days = daysUntilExpiry(dateStr);
  if (days === null) return null;
  if (days < 0) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
      <AlertTriangle className="w-3 h-3" /> Abgelaufen
    </span>
  );
  if (days <= 30) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
      <AlertTriangle className="w-3 h-3" /> Läuft in {days} Tagen ab
    </span>
  );
  if (days <= 60) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
      ⚠️ Läuft in {days} Tagen ab
    </span>
  );
  return (
    <span className="text-[10px] text-gray-400">Gültig bis {fmtDate(dateStr)}</span>
  );
}

const EMPTY_FORM: Omit<TravelDocument, "id" | "userId" | "createdAt" | "updatedAt"> = {
  documentType: "passport",
  label: "", passportNumber: "", expiryDate: "", issuedDate: "", nationality: "",
  insuranceProvider: "", policyNumber: "", insuranceExpiryDate: "", emergencyPhone: "",
  visaCountry: "", visaExpiryDate: "",
  vaccinationType: "", vaccinationDate: "",
  contactName: "", contactPhone: "", contactEmail: "", contactRelationship: "",
  notes: "",
};

export default function TravelDocumentsTab({ user }: Props) {
  const [docs, setDocs]         = useState<TravelDocument[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState({ ...EMPTY_FORM });

  useEffect(() => {
    setLoading(true);
    getTravelDocuments(user.uid)
      .then(setDocs)
      .catch(() => setError("Dokumente konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, [user.uid]);

  const set = (key: keyof typeof form, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const openNew = () => { setForm({ ...EMPTY_FORM }); setEditId(null); setShowForm(true); };
  const openEdit = (doc: TravelDocument) => {
    setForm({
      documentType: doc.documentType, label: doc.label ?? "",
      passportNumber: doc.passportNumber ?? "", expiryDate: doc.expiryDate ?? "",
      issuedDate: doc.issuedDate ?? "", nationality: doc.nationality ?? "",
      insuranceProvider: doc.insuranceProvider ?? "", policyNumber: doc.policyNumber ?? "",
      insuranceExpiryDate: doc.insuranceExpiryDate ?? "", emergencyPhone: doc.emergencyPhone ?? "",
      visaCountry: doc.visaCountry ?? "", visaExpiryDate: doc.visaExpiryDate ?? "",
      vaccinationType: doc.vaccinationType ?? "", vaccinationDate: doc.vaccinationDate ?? "",
      contactName: doc.contactName ?? "", contactPhone: doc.contactPhone ?? "",
      contactEmail: doc.contactEmail ?? "", contactRelationship: doc.contactRelationship ?? "",
      notes: doc.notes ?? "",
    });
    setEditId(doc.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // clean empty strings
      const clean = Object.fromEntries(
        Object.entries(form).filter(([, v]) => v !== "")
      ) as typeof form;
      if (editId) {
        await updateTravelDocument(user.uid, editId, clean);
        setDocs((prev) => prev.map((d) => d.id === editId ? { ...d, ...clean } : d));
      } else {
        const id = await saveTravelDocument(user.uid, clean);
        setDocs((prev) => [...prev, { ...clean, id, userId: user.uid, createdAt: new Date(), updatedAt: new Date() }]);
      }
      setShowForm(false);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    await deleteTravelDocument(user.uid, id);
  };

  // Bald ablaufende Dokumente
  const soonExpiring = docs.filter((d) => {
    const dates = expiryDates(d);
    return dates.some((date) => { const days = daysUntilExpiry(date); return days !== null && days <= 60; });
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Reisedokumente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#00838F]" /> Reisedokumente
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
            <FileText className="w-5 h-5 text-[#00838F]" />
            Reisedokumente
            {docs.length > 0 && <span className="text-sm font-normal text-gray-400">({docs.length})</span>}
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-500">
            <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">➕</span><span>Klicke <strong>„Dokument hinzufügen"</strong> und wähle den Typ: Reisepass, Versicherung, Visa, Impfung oder Notfallkontakt</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">⏰</span><span>Trage das <strong>Ablaufdatum</strong> ein – wir warnen dich automatisch wenn ein Dokument in unter 60 Tagen abläuft</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">🔒</span><span>Sensible Felder (Passnummer, Policennummer) sind <strong>standardmäßig versteckt</strong> – klicke das Auge-Icon um sie anzuzeigen</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">📞</span><span>Notfallkontakt hinterlegen: Name, Telefon, E-Mail und Verhältnis – für alle Fälle auf Reisen</span></li>
            <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">✏️</span><span>Dokumente jederzeit über das Stift-Icon bearbeiten oder über den Papierkorb löschen</span></li>
          </ul>
        </div>
        <button onClick={openNew}
          className="shrink-0 inline-flex items-center gap-1.5 bg-[#00838F] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#006E7A] transition-colors">
          <Plus className="w-4 h-4" /> Dokument hinzufügen
        </button>
      </div>

      {/* Ablauf-Warnung */}
      {soonExpiring.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Dokument läuft bald ab</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {soonExpiring.map((d) => DOC_TYPES.find((t) => t.type === d.documentType)?.label ?? d.documentType).join(", ")} – bitte rechtzeitig erneuern.
            </p>
          </div>
        </div>
      )}

      {/* Formular */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">{editId ? "Dokument bearbeiten" : "Neues Dokument hinzufügen"}</h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Typ */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Dokumenttyp</label>
              <div className="flex flex-wrap gap-2">
                {DOC_TYPES.map(({ type, label, emoji }) => (
                  <button key={type} type="button" onClick={() => set("documentType", type)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${form.documentType === type ? "bg-[#00838F] text-white border-[#00838F]" : "bg-white text-gray-600 border-gray-200 hover:border-[#00838F]"}`}>
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bezeichnung */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Bezeichnung (optional)</label>
              <input value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="z.B. Pass Mutter"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
            </div>

            {/* Reisepass */}
            {form.documentType === "passport" && (<>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Passnummer</label>
                <input value={form.passportNumber} onChange={(e) => set("passportNumber", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nationalität</label>
                <input value={form.nationality} onChange={(e) => set("nationality", e.target.value)} placeholder="z.B. Deutsch"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ausstellungsdatum</label>
                <input type="date" value={form.issuedDate} onChange={(e) => set("issuedDate", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ablaufdatum</label>
                <input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
            </>)}

            {/* Versicherung */}
            {form.documentType === "insurance" && (<>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Versicherungsanbieter</label>
                <input value={form.insuranceProvider} onChange={(e) => set("insuranceProvider", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Policennummer</label>
                <input value={form.policyNumber} onChange={(e) => set("policyNumber", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Gültig bis</label>
                <input type="date" value={form.insuranceExpiryDate} onChange={(e) => set("insuranceExpiryDate", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Notfallnummer (Versicherer)</label>
                <input value={form.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} placeholder="+49 800 …"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
            </>)}

            {/* Visa */}
            {form.documentType === "visa" && (<>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Land</label>
                <input value={form.visaCountry} onChange={(e) => set("visaCountry", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ablaufdatum</label>
                <input type="date" value={form.visaExpiryDate} onChange={(e) => set("visaExpiryDate", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
            </>)}

            {/* Impfung */}
            {form.documentType === "vaccination" && (<>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Art der Impfung</label>
                <input value={form.vaccinationType} onChange={(e) => set("vaccinationType", e.target.value)} placeholder="z.B. Gelbfieber, Hepatitis A"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Datum</label>
                <input type="date" value={form.vaccinationDate} onChange={(e) => set("vaccinationDate", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
            </>)}

            {/* Notfallkontakt */}
            {form.documentType === "emergency" && (<>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Name</label>
                <input value={form.contactName} onChange={(e) => set("contactName", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Telefon</label>
                <input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">E-Mail</label>
                <input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Beziehung</label>
                <input value={form.contactRelationship} onChange={(e) => set("contactRelationship", e.target.value)} placeholder="z.B. Partner, Elternteil"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F]" />
              </div>
            </>)}

            {/* Notizen (immer) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Notizen (optional)</label>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00838F] resize-none" />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 bg-[#00838F] hover:bg-[#006E7A] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50">
              {saving ? "Wird gespeichert…" : editId ? "Änderungen speichern" : "Dokument speichern"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Leerer State */}
      {docs.length === 0 && !showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 mb-2">Keine Dokumente gespeichert</h3>
          <p className="text-gray-400 text-sm mb-6">
            Speichere Pass, Versicherung & Notfallkontakte – alles griffbereit für deine Reise.
          </p>
          <button onClick={openNew}
            className="inline-block bg-[#00838F] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#006E7A] transition-colors">
            Erstes Dokument hinzufügen
          </button>
        </div>
      )}

      {/* Dokumenten-Grid nach Typ gruppiert */}
      {docs.length > 0 && DOC_TYPES.map(({ type, label, emoji }) => {
        const typeDocs = docs.filter((d) => d.documentType === type);
        if (typeDocs.length === 0) return null;
        return (
          <div key={type}>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span>{emoji}</span> {label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {typeDocs.map((doc) => {
                const allExpiry = expiryDates(doc);
                const firstExpiry = allExpiry[0];
                return (
                  <div key={doc.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {doc.label || label}
                        </p>
                        {firstExpiry && <ExpiryBadge dateStr={firstExpiry} />}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => openEdit(doc)}
                          className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#00838F]/10 flex items-center justify-center group transition-colors">
                          <Edit2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#00838F] transition-colors" />
                        </button>
                        <button onClick={() => handleDelete(doc.id)}
                          className="w-7 h-7 rounded-full bg-gray-50 hover:bg-red-50 flex items-center justify-center group transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-0">
                      {/* Reisepass */}
                      {type === "passport" && (<>
                        <MaskField value={doc.passportNumber} label="Passnummer" />
                        <PlainField value={doc.nationality} label="Nationalität" />
                        <PlainField value={fmtDate(doc.issuedDate)} label="Ausgestellt" />
                        <PlainField value={fmtDate(doc.expiryDate)} label="Gültig bis" />
                      </>)}
                      {/* Versicherung */}
                      {type === "insurance" && (<>
                        <PlainField value={doc.insuranceProvider} label="Anbieter" />
                        <MaskField value={doc.policyNumber} label="Policennummer" />
                        <PlainField value={fmtDate(doc.insuranceExpiryDate)} label="Gültig bis" />
                        <PlainField value={doc.emergencyPhone} label="Notfallnummer" />
                      </>)}
                      {/* Visa */}
                      {type === "visa" && (<>
                        <PlainField value={doc.visaCountry} label="Land" />
                        <PlainField value={fmtDate(doc.visaExpiryDate)} label="Gültig bis" />
                      </>)}
                      {/* Impfung */}
                      {type === "vaccination" && (<>
                        <PlainField value={doc.vaccinationType} label="Art" />
                        <PlainField value={fmtDate(doc.vaccinationDate)} label="Datum" />
                      </>)}
                      {/* Notfall */}
                      {type === "emergency" && (<>
                        <PlainField value={doc.contactName} label="Name" />
                        <PlainField value={doc.contactRelationship} label="Beziehung" />
                        <PlainField value={doc.contactPhone} label="Telefon" />
                        <PlainField value={doc.contactEmail} label="E-Mail" />
                      </>)}
                      {doc.notes && <PlainField value={doc.notes} label="Notizen" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
