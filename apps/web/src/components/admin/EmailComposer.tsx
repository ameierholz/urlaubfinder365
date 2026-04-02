"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Mail, ExternalLink } from "lucide-react";

const VORLAGEN = [
  {
    label: "Willkommen",
    betreff: "Willkommen bei Urlaubfinder365!",
    text: (name: string) =>
      `Hallo ${name},\n\nwir freuen uns, Sie als Anbieter auf Urlaubfinder365 begrüßen zu dürfen.\n\nIhr Profil wurde erfolgreich aktiviert. Sie können ab sofort Angebote erstellen und Buchungen entgegennehmen.\n\nBei Fragen stehen wir Ihnen jederzeit zur Verfügung.\n\nMit freundlichen Grüßen\nDas Urlaubfinder365-Team`,
  },
  {
    label: "Dokumente anfordern",
    betreff: "Bitte senden Sie uns Ihre Unterlagen",
    text: (name: string) =>
      `Hallo ${name},\n\nfür die Freischaltung Ihres Anbieter-Kontos benötigen wir noch folgende Dokumente:\n\n• Gewerbeanmeldung oder Handelsregisterauszug\n• Kopie Ihres Personalausweises\n• Nachweis der Berufshaftpflichtversicherung (sofern zutreffend)\n\nBitte senden Sie diese per E-Mail an partner@urlaubfinder365.de.\n\nMit freundlichen Grüßen\nDas Urlaubfinder365-Team`,
  },
  {
    label: "Profil genehmigt",
    betreff: "Ihr Anbieter-Profil wurde genehmigt ✅",
    text: (name: string) =>
      `Hallo ${name},\n\nIhr Anbieter-Profil wurde erfolgreich geprüft und freigegeben.\n\nSie können sich jetzt unter https://www.urlaubfinder365.de/anbieter/ anmelden und Ihre Angebote verwalten.\n\nMit freundlichen Grüßen\nDas Urlaubfinder365-Team`,
  },
  {
    label: "Auszahlung erfolgt",
    betreff: "Ihre Auszahlung wurde veranlasst",
    text: (name: string) =>
      `Hallo ${name},\n\nwir haben Ihre Auszahlung heute veranlasst. Der Betrag sollte innerhalb von 1–3 Werktagen auf Ihrem Konto eingehen.\n\nBei Fragen zu Ihrer Abrechnung stehen wir Ihnen gerne zur Verfügung.\n\nMit freundlichen Grüßen\nDas Urlaubfinder365-Team`,
  },
];

export default function EmailComposer({
  anbieterId, anbieterEmail, anbieterName,
}: {
  anbieterId: string;
  anbieterEmail: string;
  anbieterName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [betreff, setBetreff] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [loading, setLoading] = useState(false);

  const applyVorlage = (v: typeof VORLAGEN[0]) => {
    setBetreff(v.betreff);
    setNachricht(v.text(anbieterName));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createSupabaseBrowser();
    // Als CRM-Ticket speichern
    await supabase.from("admin_crm_tickets").insert({
      anbieter_id: anbieterId,
      typ: "email_gesendet",
      prioritaet: "normal",
      betreff,
      nachricht,
      erstellt_von: "Admin",
    });
    // mailto öffnen (E-Mail-Client des Admins)
    const mailto = `mailto:${anbieterEmail}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(nachricht)}`;
    window.open(mailto, "_blank");
    setBetreff(""); setNachricht(""); setOpen(false);
    setLoading(false);
    router.refresh();
  };

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
      <Mail className="w-4 h-4" /> E-Mail schreiben
    </button>
  );

  return (
    <form onSubmit={handleSend} className="bg-gray-800 border border-blue-700/50 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Mail className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-bold text-white">E-Mail an {anbieterName}</span>
        <span className="text-xs text-gray-400">({anbieterEmail})</span>
      </div>

      {/* Vorlagen */}
      <div className="flex flex-wrap gap-2">
        {VORLAGEN.map(v => (
          <button key={v.label} type="button" onClick={() => applyVorlage(v)}
            className="text-[11px] px-2.5 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
            {v.label}
          </button>
        ))}
      </div>

      <input value={betreff} onChange={e => setBetreff(e.target.value)} placeholder="Betreff" required
        className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <textarea value={nachricht} onChange={e => setNachricht(e.target.value)} placeholder="E-Mail-Text…" required rows={8}
        className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono" />

      <p className="text-[11px] text-gray-500 flex items-center gap-1">
        <ExternalLink className="w-3 h-3" />
        Öffnet deinen E-Mail-Client und speichert die E-Mail als CRM-Eintrag.
      </p>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-sm px-4 py-2 transition-colors">Abbrechen</button>
        <button type="submit" disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors flex items-center gap-2">
          <Mail className="w-4 h-4" /> {loading ? "Senden…" : "Senden & speichern"}
        </button>
      </div>
    </form>
  );
}
