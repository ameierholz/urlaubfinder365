"use client";

import QRCodeSVG from "react-qr-code";
import { Printer, MapPin, Clock, Users, Calendar, BadgeCheck, CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface TicketDaten {
  buchungs_nummer: string;
  qr_token: string;
  kunden_name: string;
  datum: string;
  personen: number;
  gesamtpreis: number;
  status: string;
  created_at?: string;
  angebot: {
    titel: string;
    ziel: string | null;
    dauer: string | null;
    foto_url: string | null;
    treffpunkt: string | null;
    treffpunkt_hinweis: string | null;
  } | null;
  anbieter: {
    name: string;
    telefon: string | null;
    avatar_url: string | null;
    verifiziert: boolean;
  } | null;
}

interface Props {
  d: TicketDaten;
  compact?: boolean;
}

type DetailRow = { icon: React.ReactNode; label: string; value: string; sub?: string; highlight?: boolean };

export default function BuchungsTicket({ d, compact = false }: Props) {
  const titel = d.angebot?.titel ?? "Aktivitätsbuchung";
  const ziel   = d.angebot?.ziel ?? null;

  const rows: DetailRow[] = [
    { icon: <Calendar className="w-3.5 h-3.5 text-gray-400" />, label: "Termin",
      value: new Date(d.datum).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
    { icon: <Users className="w-3.5 h-3.5 text-gray-400" />, label: "Personen",
      value: `${d.personen} ${d.personen === 1 ? "Person" : "Personen"}` },
    ...(d.angebot?.dauer ? [{ icon: <Clock className="w-3.5 h-3.5 text-gray-400" />, label: "Dauer", value: d.angebot.dauer }] : []),
    ...(d.angebot?.treffpunkt ? [{
      icon: <MapPin className="w-3.5 h-3.5 text-gray-400" />, label: "Treffpunkt",
      value: d.angebot.treffpunkt, sub: d.angebot.treffpunkt_hinweis ?? undefined,
    }] : []),
    { icon: null, label: "Kunde", value: d.kunden_name },
    ...(d.created_at ? [{
      icon: <CalendarCheck className="w-3.5 h-3.5 text-gray-400" />, label: "Gebucht am",
      value: new Date(d.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }),
    }] : []),
    ...(d.anbieter ? [{
      icon: <BadgeCheck className="w-3.5 h-3.5 text-[#00838F]" />, label: "Anbieter",
      value: d.anbieter.name + (d.anbieter.verifiziert ? " ✓" : ""),
      sub: d.anbieter.telefon ?? undefined,
    }] : []),
    { icon: null, label: "Gesamt bezahlt", value: `${Number(d.gesamtpreis).toFixed(2)} €`, highlight: true },
  ];

  const ticket = (
    <div id="ticket" className="bg-white overflow-hidden print:shadow-none">

      {/* ── Logo-Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/urlaubfinder-logo.webp"
            alt="Urlaubfinder365"
            width={48}
            height={48}
            className="w-12 h-12 object-contain shrink-0"
            unoptimized
          />
          <div>
            <p className="font-black text-gray-900 text-base leading-tight">Urlaubfinder365</p>
            <p className="text-[10px] text-gray-400">urlaubfinder365.de</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Buchungs-Ticket</p>
          <p className="text-xs font-black text-gray-700 font-mono">{d.buchungs_nummer}</p>
        </div>
      </div>

      {/* ── Aktivitätsfoto + Titel ──────────────────────────── */}
      {d.angebot?.foto_url ? (
        <div className="relative h-36 w-full overflow-hidden">
          <Image src={d.angebot.foto_url} alt={titel} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-5 right-5">
            <p className="text-white font-black text-base leading-tight drop-shadow">{titel}</p>
            {ziel && <p className="text-white/75 text-xs flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{ziel}</p>}
          </div>
        </div>
      ) : (
        <div className="bg-[#00838F] px-5 py-4">
          <p className="text-white font-black text-base">{titel}</p>
          {ziel && <p className="text-white/75 text-xs flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{ziel}</p>}
        </div>
      )}

      {/* ── Status ──────────────────────────────────────────── */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2 flex items-center gap-2">
        <span className="text-emerald-600 text-sm">✅</span>
        <span className="text-emerald-700 font-bold text-xs">Buchung bestätigt &amp; bezahlt</span>
      </div>

      {/* ── Hauptinhalt ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row">

        {/* Linke Seite: Details */}
        <div className="flex-1 p-5 space-y-4">

          {/* Alle Details in einheitlicher Tabelle */}
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
            {rows.map((row, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5 bg-white">
                <div className="w-4 flex items-center justify-center mt-0.5 shrink-0">
                  {row.icon}
                </div>
                <span className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">{row.label}</span>
                <div className="flex-1">
                  <span className={`text-sm font-semibold ${row.highlight ? "text-[#00838F] font-black" : "text-gray-800"}`}>
                    {row.value}
                  </span>
                  {row.sub && <p className="text-xs text-gray-400 mt-0.5">{row.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rechte Seite: QR */}
        <div className="sm:w-44 bg-gray-50 flex flex-col items-center justify-center p-4 gap-2.5 border-t sm:border-t-0 sm:border-l border-gray-100">
          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-200">
            <QRCodeSVG value={d.qr_token} size={108} level="M" fgColor="#1a1a1a" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-wide">Buchungs-Token</p>
            <p className="text-[9px] text-gray-400 mt-0.5">Vom Anbieter zu scannen</p>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-2.5 flex items-center justify-between">
        <p className="text-[9px] text-gray-400">urlaubfinder365.de · Bitte dieses Ticket am Veranstaltungstag vorzeigen.</p>
        <p className="text-[9px] text-gray-400 font-mono">{d.buchungs_nummer}</p>
      </div>
    </div>
  );

  if (compact) return ticket;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 print:bg-white print:p-0">
      <div className="max-w-2xl mx-auto">
        <div className="shadow-lg rounded-3xl border border-gray-100 overflow-hidden print:shadow-none print:border-0 print:rounded-none">
          {ticket}
        </div>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors"
          >
            <Printer className="w-4 h-4" /> Ticket drucken / als PDF speichern
          </button>
          <Link
            href="/marktplatz/"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-2xl text-sm transition-colors"
          >
            Weitere Aktivitäten entdecken
          </Link>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3 print:hidden">
          Ticket jederzeit wieder öffnen: <strong>/buchung/ticket/{d.buchungs_nummer}</strong>
        </p>
      </div>
    </div>
  );
}
