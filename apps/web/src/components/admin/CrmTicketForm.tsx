"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

const TYP_OPTIONS = [
  { value: "intern",          label: "📝 Interne Notiz" },
  { value: "email_gesendet",  label: "📧 E-Mail gesendet" },
  { value: "anruf",           label: "📞 Anruf" },
  { value: "dokument",        label: "📄 Dokument geprüft" },
  { value: "auszahlung",      label: "💶 Auszahlung" },
  { value: "sonstiges",       label: "🔖 Sonstiges" },
];

const PRIO_OPTIONS = [
  { value: "niedrig",  label: "Niedrig",  cls: "text-gray-400" },
  { value: "normal",   label: "Normal",   cls: "text-blue-400" },
  { value: "hoch",     label: "Hoch",     cls: "text-amber-400" },
  { value: "dringend", label: "Dringend", cls: "text-red-400" },
];

export default function CrmTicketForm({ anbieterId }: { anbieterId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typ, setTyp] = useState("intern");
  const [prioritaet, setPrio] = useState("normal");
  const [betreff, setBetreff] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!betreff.trim() || !nachricht.trim()) return;
    setLoading(true);
    const supabase = createSupabaseBrowser();
    // @ts-expect-error — Supabase Insert-Typen für diese Tabelle noch nicht generiert
    await supabase.from("admin_crm_tickets").insert({
      anbieter_id: anbieterId,
      typ, prioritaet, betreff, nachricht,
      erstellt_von: "Admin",
    });
    setBetreff(""); setNachricht(""); setOpen(false);
    setLoading(false);
    router.refresh();
  };

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex items-center gap-2 bg-[#00838F] hover:bg-[#006d79] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
      <Send className="w-4 h-4" /> Eintrag erstellen
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
      <div className="flex gap-3">
        <select value={typ} onChange={e => setTyp(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-xl px-3 py-2 flex-1">
          {TYP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={prioritaet} onChange={e => setPrio(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-xl px-3 py-2">
          {PRIO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <input value={betreff} onChange={e => setBetreff(e.target.value)} placeholder="Betreff" required
        className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00838F]" />
      <textarea value={nachricht} onChange={e => setNachricht(e.target.value)} placeholder="Nachricht / Notiz..." required rows={4}
        className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00838F] resize-none" />
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-sm px-4 py-2 transition-colors">Abbrechen</button>
        <button type="submit" disabled={loading}
          className="bg-[#00838F] hover:bg-[#006d79] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
          {loading ? "Speichern…" : "Speichern"}
        </button>
      </div>
    </form>
  );
}
