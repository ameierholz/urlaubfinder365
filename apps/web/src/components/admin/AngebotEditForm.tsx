"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Save, Check } from "lucide-react";

interface Angebot {
  id: string;
  titel: string;
  kurzbeschreibung: string | null;
  beschreibung: string | null;
  kategorie: string | null;
  ziel: string | null;
  land: string | null;
  preis: number;
  preistyp: string;
  dauer: string | null;
  max_teilnehmer: number;
  treffpunkt: string | null;
  treffpunkt_hinweis: string | null;
  status: string;
  highlights: string[];
  inbegriffen: string[];
  nicht_inbegriffen: string[];
}

export default function AngebotEditForm({ angebot }: { angebot: Angebot }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...angebot });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Angebot, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createSupabaseBrowser();
    await supabase.from("angebote").update({
      titel: form.titel,
      kurzbeschreibung: form.kurzbeschreibung,
      beschreibung: form.beschreibung,
      kategorie: form.kategorie,
      ziel: form.ziel,
      land: form.land,
      preis: form.preis,
      preistyp: form.preistyp,
      dauer: form.dauer,
      max_teilnehmer: form.max_teilnehmer,
      treffpunkt: form.treffpunkt,
      treffpunkt_hinweis: form.treffpunkt_hinweis,
      status: form.status,
      highlights: form.highlights,
      inbegriffen: form.inbegriffen,
      nicht_inbegriffen: form.nicht_inbegriffen,
    }).eq("id", angebot.id);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  };

  const listField = (label: string, key: "highlights" | "inbegriffen" | "nicht_inbegriffen") => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
      <textarea
        value={(form[key] ?? []).join("\n")}
        onChange={e => set(key, e.target.value.split("\n").filter(Boolean))}
        rows={3} placeholder="Eine Zeile pro Eintrag"
        className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00838F] resize-none"
      />
    </div>
  );

  const input = (label: string, key: keyof Angebot, type = "text") => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={(form[key] as string | number) ?? ""}
        onChange={e => set(key, type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00838F]"
      />
    </div>
  );

  const textarea = (label: string, key: keyof Angebot, rows = 3) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
      <textarea
        value={(form[key] as string) ?? ""}
        onChange={e => set(key, e.target.value)}
        rows={rows}
        className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00838F] resize-none"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Status */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Status</label>
        <select value={form.status} onChange={e => set("status", e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00838F]">
          <option value="entwurf">Entwurf</option>
          <option value="aktiv">Aktiv</option>
          <option value="pausiert">Pausiert</option>
          <option value="archiviert">Archiviert</option>
        </select>
      </div>

      {input("Titel", "titel")}
      {textarea("Kurzbeschreibung", "kurzbeschreibung")}
      {textarea("Beschreibung (ausführlich)", "beschreibung", 6)}

      <div className="grid grid-cols-2 gap-4">
        {input("Ziel / Ort", "ziel")}
        {input("Land", "land")}
        {input("Kategorie", "kategorie")}
        {input("Dauer", "dauer")}
        {input("Preis (€)", "preis", "number")}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Preistyp</label>
          <select value={form.preistyp} onChange={e => set("preistyp", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00838F]">
            <option value="pro_person">Pro Person</option>
            <option value="pro_gruppe">Pro Gruppe</option>
            <option value="festpreis">Festpreis</option>
            <option value="auf_anfrage">Auf Anfrage</option>
          </select>
        </div>
        {input("Max. Teilnehmer", "max_teilnehmer", "number")}
      </div>

      {input("Treffpunkt", "treffpunkt")}
      {textarea("Treffpunkt-Hinweis", "treffpunkt_hinweis")}

      {listField("Highlights (je Zeile)", "highlights")}
      {listField("Inbegriffen (je Zeile)", "inbegriffen")}
      {listField("Nicht inbegriffen (je Zeile)", "nicht_inbegriffen")}

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading}
          className={`flex items-center gap-2 font-semibold text-sm px-6 py-2.5 rounded-xl transition-all ${saved ? "bg-emerald-600 text-white" : "bg-[#00838F] hover:bg-[#006d79] text-white"} disabled:opacity-50`}>
          {saved ? <><Check className="w-4 h-4" /> Gespeichert</> : <><Save className="w-4 h-4" /> {loading ? "Speichern…" : "Änderungen speichern"}</>}
        </button>
      </div>
    </form>
  );
}
