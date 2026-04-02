"use client";

import QRCodeSVG from "react-qr-code";
import { Printer, MapPin, Clock, Users, Calendar, BadgeCheck, CalendarCheck, Link as LinkIcon } from "lucide-react";
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

type Row = { icon: React.ReactNode; label: string; value: string; sub?: string; highlight?: boolean };

interface Props {
  d: TicketDaten;
  compact?: boolean;
}

export default function BuchungsTicket({ d, compact = false }: Props) {
  const titel = d.angebot?.titel ?? "Aktivitätsbuchung";
  const ziel  = d.angebot?.ziel ?? null;

  const rows: Row[] = [
    {
      icon: <Calendar className="w-3.5 h-3.5" />,
      label: "Termin",
      value: new Date(d.datum).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    },
    {
      icon: <Users className="w-3.5 h-3.5" />,
      label: "Personen",
      value: `${d.personen} ${d.personen === 1 ? "Person" : "Personen"}`,
    },
    ...(d.angebot?.dauer ? [{
      icon: <Clock className="w-3.5 h-3.5" />,
      label: "Dauer",
      value: d.angebot.dauer,
    }] : []),
    ...(d.angebot?.treffpunkt ? [{
      icon: <MapPin className="w-3.5 h-3.5" />,
      label: "Treffpunkt",
      value: d.angebot.treffpunkt,
      sub: d.angebot.treffpunkt_hinweis ?? undefined,
    }] : []),
    { icon: null, label: "Kunde", value: d.kunden_name },
    ...(d.created_at ? [{
      icon: <CalendarCheck className="w-3.5 h-3.5" />,
      label: "Gebucht am",
      value: new Date(d.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }),
    }] : []),
    ...(d.anbieter ? [{
      icon: <BadgeCheck className="w-3.5 h-3.5 text-[#00838F]" />,
      label: "Anbieter",
      value: d.anbieter.name + (d.anbieter.verifiziert ? " ✓" : ""),
      sub: d.anbieter.telefon ?? undefined,
    }] : []),
    {
      icon: null,
      label: "Bezahlt",
      value: `${Number(d.gesamtpreis).toFixed(2)} €`,
      highlight: true,
    },
  ];

  const ticket = (
    <div id="ticket" className="bg-white overflow-hidden rounded-3xl print:rounded-none">

      {/* ── Header: Logo + Buchungsnummer ─────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 print:bg-gray-100">
        <div className="flex items-center gap-3">
          <Image
            src="/images/urlaubfinder-logo.webp"
            alt="Urlaubfinder365"
            width={48}
            height={48}
            className="w-11 h-11 object-contain shrink-0"
            unoptimized
          />
          <div>
            <p className="font-black text-white text-sm leading-tight print:text-gray-900">Urlaubfinder365</p>
            <p className="text-[10px] text-gray-400">urlaubfinder365.de</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Buchungs-Ticket</p>
          <p className="text-sm font-black text-white font-mono mt-0.5 print:text-gray-900">{d.buchungs_nummer}</p>
        </div>
      </div>

      {/* ── Aktivitätsbanner ─────────────────────────────── */}
      {d.angebot?.foto_url ? (
        <div className="relative h-40 w-full overflow-hidden">
          <Image src={d.angebot.foto_url} alt={titel} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <p className="text-white font-black text-xl leading-tight drop-shadow-lg">{titel}</p>
            {ziel && (
              <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> {ziel}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-linear-to-r from-[#00838F] to-[#005f6b] px-6 py-5">
          <p className="text-white font-black text-xl">{titel}</p>
          {ziel && (
            <p className="text-white/80 text-xs flex items-center gap-1 mt-1.5">
              <MapPin className="w-3 h-3" /> {ziel}
            </p>
          )}
        </div>
      )}

      {/* ── Status-Badge ──────────────────────────────────── */}
      <div className="flex items-center gap-2 bg-emerald-50 border-y border-emerald-100 px-6 py-2.5">
        <span className="text-base">✅</span>
        <span className="text-emerald-700 font-bold text-sm">Buchung bestätigt &amp; bezahlt</span>
      </div>

      {/* ── Detailtabelle ─────────────────────────────────── */}
      <div className="px-6 py-4">
        <div className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5">
              <div className="w-4 mt-0.5 shrink-0 text-gray-400">{row.icon}</div>
              <span className="text-xs text-gray-400 w-28 shrink-0 pt-px">{row.label}</span>
              <div>
                <span className={`text-sm font-semibold ${row.highlight ? "text-[#00838F] font-black text-base" : "text-gray-800"}`}>
                  {row.value}
                </span>
                {row.sub && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{row.sub}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Perforierte Trennlinie ────────────────────────── */}
      <div className="relative flex items-center px-4 py-1">
        <div className="absolute -left-3 w-6 h-6 rounded-full bg-gray-100 print:bg-white" />
        <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-4" />
        <div className="absolute -right-3 w-6 h-6 rounded-full bg-gray-100 print:bg-white" />
      </div>

      {/* ── QR + Token ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-6 px-6 py-5">

        {/* QR Code */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="bg-white p-3 rounded-2xl border-2 border-gray-200 shadow-sm">
            <QRCodeSVG value={d.qr_token} size={116} level="M" fgColor="#111827" />
          </div>
          <p className="text-[10px] text-gray-400 font-semibold text-center">QR-Code scannen</p>
        </div>

        {/* Token-Info */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs font-black text-gray-700 uppercase tracking-widest mb-1">Buchungs-Token</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Zeige diesen Code dem Anbieter zum Scannen — oder gib den Token manuell auf der Anbieterseite ein.
            </p>
          </div>

          {/* Token-Box */}
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">Token</p>
            <p className="font-mono text-xs text-gray-700 break-all leading-relaxed tracking-wide select-all">
              {d.qr_token}
            </p>
          </div>

          {/* Scanner-Link */}
          <div className="flex items-start gap-2 bg-[#00838F]/8 rounded-xl p-3">
            <LinkIcon className="w-3.5 h-3.5 text-[#00838F] mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-[#00838F] uppercase tracking-wide">Manuelle Eingabe</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono">urlaubfinder365.de/anbieter/scanner</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between">
        <p className="text-[9px] text-gray-400">Bitte dieses Ticket am Veranstaltungstag vorzeigen.</p>
        <p className="text-[9px] text-gray-400 font-mono">{d.buchungs_nummer}</p>
      </div>
    </div>
  );

  if (compact) return ticket;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 print:bg-white print:p-0">
      <div className="max-w-xl mx-auto">
        <div className="shadow-2xl rounded-3xl overflow-hidden border border-gray-200 print:shadow-none print:border-0 print:rounded-none">
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
          Ticket jederzeit wieder öffnen unter <strong>/buchung/ticket/{d.buchungs_nummer}</strong>
        </p>
      </div>
    </div>
  );
}
