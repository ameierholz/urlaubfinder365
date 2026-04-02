import { createSupabaseServer } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BadgeCheck, Mail, Phone, Globe, MapPin,
  FileText, Euro, CalendarCheck, MessageSquare, ExternalLink,
} from "lucide-react";
import AnbieterStatusButton from "@/components/admin/AnbieterStatusButton";
import CrmTicketForm from "@/components/admin/CrmTicketForm";
import CrmTicketStatusButton from "@/components/admin/CrmTicketStatusButton";
import EmailComposer from "@/components/admin/EmailComposer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Anbieter Details | Admin" };

const TYP_INFO: Record<string, { emoji: string; label: string }> = {
  intern:          { emoji: "📝", label: "Interne Notiz" },
  email_gesendet:  { emoji: "📧", label: "E-Mail gesendet" },
  email_empfangen: { emoji: "📨", label: "E-Mail empfangen" },
  anruf:           { emoji: "📞", label: "Anruf" },
  dokument:        { emoji: "📄", label: "Dokument" },
  auszahlung:      { emoji: "💶", label: "Auszahlung" },
  sonstiges:       { emoji: "🔖", label: "Sonstiges" },
};

const PRIO_CLS: Record<string, string> = {
  niedrig: "text-gray-500",
  normal:  "text-blue-400",
  hoch:    "text-amber-400",
  dringend:"text-red-400 font-bold",
};

interface Props { params: Promise<{ id: string }> }

export default async function AnbieterDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const [
    { data: anbieter },
    { data: angebote },
    { data: buchungen },
    { data: auszahlungen },
    { data: tickets },
    { data: werbung },
  ] = await Promise.all([
    supabase.from("anbieter_profile").select("*").eq("id", id).single(),
    supabase.from("angebote").select("id, titel, status, preis, ziel, created_at").eq("anbieter_id", id).order("created_at", { ascending: false }),
    supabase.from("buchungen").select("id, buchungs_nummer, kunden_name, datum, gesamtpreis, auszahlungs_betrag, status, created_at").eq("anbieter_id", id).order("created_at", { ascending: false }),
    supabase.from("auszahlungen").select("id, betrag, status, referenz, created_at, ueberwiesen_at").eq("anbieter_id", id).order("created_at", { ascending: false }),
    supabase.from("admin_crm_tickets").select("*").eq("anbieter_id", id).order("created_at", { ascending: false }),
    supabase.from("werbeplaetze_buchungen").select("id, paket, status, preis_gesamt, created_at").eq("anbieter_id", id).order("created_at", { ascending: false }),
  ]);

  if (!anbieter) notFound();

  const gesamtumsatz = (buchungen ?? [])
    .filter((b: { status: string }) => b.status !== "storniert")
    .reduce((s: number, b: { auszahlungs_betrag: number }) => s + Number(b.auszahlungs_betrag), 0);

  const offeneTickets = (tickets ?? []).filter((t: { status: string }) => t.status !== "erledigt").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <Link href="/admin/anbieter/" className="text-gray-500 hover:text-white transition-colors mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-white">{anbieter.name}</h1>
            {anbieter.verifiziert && <BadgeCheck className="w-5 h-5 text-[#00838F]" />}
            <AnbieterStatusButton anbieterId={anbieter.id} currentStatus={anbieter.status} currentVerifiziert={anbieter.verifiziert} />
          </div>
          <p className="text-gray-500 text-sm mt-1">{anbieter.kategorie} · {anbieter.stadt ? `${anbieter.stadt}, ` : ""}{anbieter.land_name}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Angebote",       value: (angebote ?? []).length,       c: "text-blue-400" },
          { label: "Buchungen",      value: (buchungen ?? []).length,       c: "text-purple-400" },
          { label: "Auszahlungen",   value: `${gesamtumsatz.toFixed(0)} €`, c: "text-emerald-400" },
          { label: "Offene Tickets", value: offeneTickets,                  c: offeneTickets > 0 ? "text-amber-400" : "text-gray-500" },
        ].map(({ label, value, c }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className={`text-xl font-black ${c}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Linke Spalte: Profil-Daten ── */}
        <div className="space-y-4">

          {/* Kontakt */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <h2 className="font-bold text-white text-sm">Kontaktdaten</h2>
            {[
              { icon: Mail,    val: anbieter.email },
              { icon: Phone,   val: anbieter.telefon },
              { icon: Globe,   val: anbieter.webseite },
              { icon: MapPin,  val: [anbieter.strasse, anbieter.plz, anbieter.stadt, anbieter.land_name].filter(Boolean).join(", ") },
            ].map(({ icon: Icon, val }) => val ? (
              <div key={val} className="flex items-start gap-2 text-sm">
                <Icon className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span className="text-gray-300 break-all">{val}</span>
              </div>
            ) : null)}
          </div>

          {/* Bio & Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <h2 className="font-bold text-white text-sm">Profil</h2>
            {anbieter.bio && <p className="text-gray-400 text-sm leading-relaxed">{anbieter.bio}</p>}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {anbieter.erfahrung_jahre && (
                <div><span className="text-gray-500">Erfahrung</span><br /><span className="text-white">{anbieter.erfahrung_jahre} Jahre</span></div>
              )}
              {anbieter.sprachen?.length > 0 && (
                <div><span className="text-gray-500">Sprachen</span><br /><span className="text-white">{anbieter.sprachen.join(", ")}</span></div>
              )}
              {anbieter.instagram && (
                <div><span className="text-gray-500">Instagram</span><br /><span className="text-white">{anbieter.instagram}</span></div>
              )}
              {anbieter.tripadvisor && (
                <div><span className="text-gray-500">TripAdvisor</span><br /><span className="text-white">{anbieter.tripadvisor}</span></div>
              )}
            </div>
            <p className="text-[11px] text-gray-600">Registriert: {new Date(anbieter.created_at).toLocaleDateString("de-DE")}</p>
          </div>

          {/* Bankdaten */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
            <h2 className="font-bold text-white text-sm">Bankverbindung</h2>
            {anbieter.iban ? (
              <>
                <p className="text-sm text-gray-300 font-mono">{anbieter.iban}</p>
                {anbieter.bic && <p className="text-xs text-gray-500">BIC: {anbieter.bic}</p>}
                {anbieter.kontoinhaber && <p className="text-xs text-gray-500">Inhaber: {anbieter.kontoinhaber}</p>}
              </>
            ) : (
              <p className="text-sm text-amber-400">⚠️ Keine Bankdaten hinterlegt</p>
            )}
          </div>

          {/* Dokument */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" /> Dokumente
            </h2>
            {anbieter.dokument_url ? (
              <a href={anbieter.dokument_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <ExternalLink className="w-4 h-4" /> Dokument öffnen
              </a>
            ) : (
              <p className="text-sm text-gray-500">Kein Dokument hochgeladen</p>
            )}
          </div>
        </div>

        {/* ── Rechte Spalte: Aktivitäten ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* E-Mail + CRM Buttons */}
          <div className="flex flex-wrap gap-3">
            <EmailComposer anbieterId={anbieter.id} anbieterEmail={anbieter.email} anbieterName={anbieter.name} />
            <CrmTicketForm anbieterId={anbieter.id} />
          </div>

          {/* CRM Timeline */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00838F]" /> CRM-Verlauf
              </h2>
              {offeneTickets > 0 && (
                <span className="text-xs bg-amber-900/40 text-amber-400 px-2 py-0.5 rounded-full font-bold">{offeneTickets} offen</span>
              )}
            </div>
            <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
              {(tickets ?? []).length === 0 && (
                <p className="px-5 py-8 text-center text-gray-500 text-sm">Noch keine CRM-Einträge.</p>
              )}
              {(tickets ?? []).map((t: {
                id: string; typ: string; prioritaet: string; betreff: string; nachricht: string; status: string; erstellt_von?: string; created_at: string;
              }) => {
                const info = TYP_INFO[t.typ] ?? TYP_INFO.sonstiges;
                return (
                  <div key={t.id} className="px-5 py-4 space-y-1.5">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{info.emoji}</span>
                        <span className="text-sm font-semibold text-white">{t.betreff}</span>
                        <span className={`text-[10px] font-semibold ${PRIO_CLS[t.prioritaet]}`}>{t.prioritaet}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <CrmTicketStatusButton ticketId={t.id} currentStatus={t.status} />
                        <span className="text-[10px] text-gray-600">{new Date(t.created_at).toLocaleDateString("de-DE")}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 whitespace-pre-wrap leading-relaxed">{t.nachricht}</p>
                    {t.erstellt_von && <p className="text-[10px] text-gray-600">von {t.erstellt_von}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buchungen */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-purple-400" />
              <h2 className="font-bold text-white">Buchungen ({(buchungen ?? []).length})</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {(buchungen ?? []).length === 0 && <p className="px-5 py-6 text-center text-gray-500 text-sm">Keine Buchungen.</p>}
              {(buchungen ?? []).map((b: { id: string; buchungs_nummer: string; kunden_name: string; datum: string; gesamtpreis: number; auszahlungs_betrag: number; status: string }) => (
                <div key={b.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{b.kunden_name}</p>
                    <p className="text-xs text-gray-500">{b.buchungs_nummer} · {new Date(b.datum).toLocaleDateString("de-DE")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{Number(b.gesamtpreis).toFixed(2)} €</p>
                    <p className="text-xs text-emerald-400">{Number(b.auszahlungs_betrag).toFixed(2)} € an Anbieter</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auszahlungen */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
              <Euro className="w-4 h-4 text-emerald-400" />
              <h2 className="font-bold text-white">Auszahlungen ({(auszahlungen ?? []).length})</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {(auszahlungen ?? []).length === 0 && <p className="px-5 py-6 text-center text-gray-500 text-sm">Noch keine Auszahlungen.</p>}
              {(auszahlungen ?? []).map((a: { id: string; betrag: number; status: string; referenz?: string; created_at: string; ueberwiesen_at?: string }) => (
                <div key={a.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-emerald-400">{Number(a.betrag).toFixed(2)} €</p>
                    <p className="text-xs text-gray-500">
                      {new Date(a.created_at).toLocaleDateString("de-DE")}
                      {a.referenz && ` · ${a.referenz}`}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${a.status === "ueberwiesen" ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/40 text-amber-400"}`}>
                    {a.status === "ueberwiesen" ? "✅ Überwiesen" : "⏳ Offen"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Angebote */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="font-bold text-white">Angebote ({(angebote ?? []).length})</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {(angebote ?? []).length === 0 && <p className="px-5 py-6 text-center text-gray-500 text-sm">Keine Angebote.</p>}
              {(angebote ?? []).map((a: { id: string; titel: string; status: string; preis: number; ziel: string }) => (
                <Link key={a.id} href={`/admin/angebote/${a.id}/`}
                  className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-gray-800/50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-white">{a.titel}</p>
                    <p className="text-xs text-gray-500">{a.ziel} · {Number(a.preis).toFixed(0)} €</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.status === "aktiv" ? "bg-emerald-900/40 text-emerald-400" : "bg-gray-800 text-gray-400"}`}>
                    {a.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Werbeplätze */}
          {(werbung ?? []).length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <h2 className="font-bold text-white">Werbeplätze ({werbung!.length})</h2>
              </div>
              <div className="divide-y divide-gray-800">
                {werbung!.map((w: { id: string; paket: string; status: string; preis_gesamt: number; created_at: string }) => (
                  <div key={w.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{w.paket}</p>
                      <p className="text-xs text-gray-500">{new Date(w.created_at).toLocaleDateString("de-DE")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{Number(w.preis_gesamt).toFixed(0)} €</p>
                      <p className="text-xs text-gray-500">{w.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
