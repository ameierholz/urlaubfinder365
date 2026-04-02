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
  /** Im Modal: kein äußeres Padding, keine Buttons */
  compact?: boolean;
}

export default function BuchungsTicket({ d, compact = false }: Props) {
  const ticket = (
    <div
      id="ticket"
      className="bg-white rounded-3xl overflow-hidden print:shadow-none print:rounded-none"
      style={{ boxShadow: compact ? "none" : undefined }}
    >
      {/* ── Logo-Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Image
          src="/images/header_logo.webp"
          alt="Urlaubfinder365"
          width={160}
          height={36}
          className="h-8 w-auto"
          unoptimized
        />
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Buchungs-Ticket</p>
          <p className="text-xs font-black text-gray-700 font-mono">{d.buchungs_nummer}</p>
        </div>
      </div>

      {/* ── Aktivitätsfoto ──────────────────────────────────── */}
      {d.angebot?.foto_url ? (
        <div className="relative h-40 w-full overflow-hidden">
          <Image src={d.angebot.foto_url} alt={d.angebot.titel ?? ""} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
          <div className="absolute bottom-3 left-5 right-5">
            <p className="text-white font-black text-lg leading-tight drop-shadow">{d.angebot.titel}</p>
            {d.angebot.ziel && (
              <p className="text-white/75 text-xs flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {d.angebot.ziel}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#00838F] px-6 py-5">
          <p className="text-white font-black text-lg">{d.angebot?.titel ?? "Buchung"}</p>
          {d.angebot?.ziel && (
            <p className="text-white/75 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{d.angebot.ziel}</p>
          )}
        </div>
      )}

      {/* ── Status-Streifen ─────────────────────────────────── */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2.5 flex items-center gap-2">
        <span className="text-emerald-600">✅</span>
        <span className="text-emerald-700 font-bold text-xs">Buchung bestätigt &amp; bezahlt</span>
      </div>

      {/* ── Hauptinhalt ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row">

        {/* Linke Seite */}
        <div className="flex-1 p-5 space-y-4">

          {/* Was & Wann gebucht */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1 uppercase tracking-wide">
                <Calendar className="w-3 h-3" /> Termin
              </div>
              <p className="font-black text-gray-900 text-sm leading-snug">
                {new Date(d.datum).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1 uppercase tracking-wide">
                <Users className="w-3 h-3" /> Personen
              </div>
              <p className="font-black text-gray-900 text-sm">{d.personen} {d.personen === 1 ? "Person" : "Personen"}</p>
            </div>
          </div>

          {/* Dauer + Treffpunkt */}
          {(d.angebot?.dauer || d.angebot?.treffpunkt) && (
            <div className="space-y-2">
              {d.angebot.dauer && (
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Dauer</span>
                    <p className="font-semibold text-gray-800 text-sm">{d.angebot.dauer}</p>
                  </div>
                </div>
              )}
              {d.angebot.treffpunkt && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Treffpunkt</span>
                    <p className="font-semibold text-gray-800 text-sm">{d.angebot.treffpunkt}</p>
                    {d.angebot.treffpunkt_hinweis && (
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{d.angebot.treffpunkt_hinweis}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Kunde (nur Name) */}
          <div className="border-t border-gray-100 pt-3.5 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Kunde</span>
              <span className="font-semibold text-gray-800">{d.kunden_name}</span>
            </div>
            {d.created_at && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> Gebucht am</span>
                <span className="font-semibold text-gray-800 text-xs">
                  {new Date(d.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            )}
          </div>

          {/* Anbieter */}
          {d.anbieter && (
            <div className="flex items-center gap-2.5 bg-gray-50 rounded-2xl p-3">
              {d.anbieter.avatar_url ? (
                <Image src={d.anbieter.avatar_url} alt={d.anbieter.name} width={32} height={32}
                  className="w-8 h-8 rounded-full object-cover shrink-0" unoptimized />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                  {d.anbieter.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-800 truncate">{d.anbieter.name}</span>
                  {d.anbieter.verifiziert && <BadgeCheck className="w-3.5 h-3.5 text-[#00838F] shrink-0" />}
                </div>
                {d.anbieter.telefon && (
                  <a href={`tel:${d.anbieter.telefon}`} className="text-xs text-[#00838F] hover:underline">{d.anbieter.telefon}</a>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-gray-400">Gesamt</p>
                <p className="font-black text-[#00838F] text-sm">{Number(d.gesamtpreis).toFixed(2)} €</p>
              </div>
            </div>
          )}
        </div>

        {/* Rechte Seite: QR ──────────────────────────────────── */}
        <div className="sm:w-44 bg-gray-50 flex flex-col items-center justify-center p-5 gap-2.5 border-t sm:border-t-0 sm:border-l border-gray-100">
          <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-gray-200">
            <QRCodeSVG value={d.qr_token} size={110} level="M" fgColor="#1a1a1a" />
          </div>
          <p className="text-[10px] text-gray-400 text-center font-semibold uppercase tracking-wide leading-tight">
            Scan zur<br />Verifizierung
          </p>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex items-center justify-between">
        <p className="text-[9px] text-gray-400">urlaubfinder365.de · Bitte dieses Ticket am Veranstaltungstag vorzeigen.</p>
        <p className="text-[9px] text-gray-400">{d.buchungs_nummer}</p>
      </div>
    </div>
  );

  if (compact) return ticket;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 print:bg-white print:p-0">
      <div className="max-w-2xl mx-auto">
        <div className="shadow-lg rounded-3xl border border-gray-100 print:shadow-none print:border-0">
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
