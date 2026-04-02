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

export default function BuchungsTicket({ d, compact = false }: Props) {
  const titel = d.angebot?.titel ?? "Aktivitätsbuchung";
  const ziel   = d.angebot?.ziel ?? null;

  const ticket = (
    <div id="ticket" className="bg-white overflow-hidden print:shadow-none">

      {/* ── Logo-Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <Image
          src="/images/urlaubfinder-logo.webp"
          alt="Urlaubfinder365"
          width={120}
          height={40}
          className="h-9 w-auto object-contain"
          unoptimized
        />
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

          {/* Termin + Personen */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1 uppercase tracking-wide font-semibold">
                <Calendar className="w-3 h-3" /> Termin
              </div>
              <p className="font-black text-gray-900 text-sm">
                {new Date(d.datum).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-1 uppercase tracking-wide font-semibold">
                <Users className="w-3 h-3" /> Personen
              </div>
              <p className="font-black text-gray-900 text-sm">{d.personen} {d.personen === 1 ? "Person" : "Personen"}</p>
            </div>
          </div>

          {/* Dauer + Treffpunkt */}
          {(d.angebot?.dauer || d.angebot?.treffpunkt) && (
            <div className="space-y-2.5">
              {d.angebot.dauer && (
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Dauer</p>
                    <p className="font-semibold text-gray-800 text-sm">{d.angebot.dauer}</p>
                  </div>
                </div>
              )}
              {d.angebot.treffpunkt && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Treffpunkt</p>
                    <p className="font-semibold text-gray-800 text-sm">{d.angebot.treffpunkt}</p>
                    {d.angebot.treffpunkt_hinweis && (
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{d.angebot.treffpunkt_hinweis}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Kunde + Gebucht am */}
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
              <span className="text-gray-400 text-xs self-center">Kunde</span>
              <span className="font-semibold text-gray-800">{d.kunden_name}</span>
              {d.created_at && (
                <>
                  <span className="text-gray-400 text-xs flex items-center gap-1 self-center">
                    <CalendarCheck className="w-3 h-3" /> Gebucht am
                  </span>
                  <span className="font-semibold text-gray-800 text-sm">
                    {new Date(d.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Anbieter */}
          {d.anbieter && (
            <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3">
              {d.anbieter.avatar_url ? (
                <Image src={d.anbieter.avatar_url} alt={d.anbieter.name} width={32} height={32}
                  className="w-8 h-8 rounded-full object-cover shrink-0" unoptimized />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#00838F]/15 flex items-center justify-center text-xs font-black text-[#00838F] shrink-0">
                  {d.anbieter.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-800 truncate">{d.anbieter.name}</span>
                  {d.anbieter.verifiziert && <BadgeCheck className="w-3.5 h-3.5 text-[#00838F] shrink-0" />}
                </div>
                {d.anbieter.telefon && (
                  <a href={`tel:${d.anbieter.telefon}`} className="text-xs text-[#00838F]">{d.anbieter.telefon}</a>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-gray-400">Gesamt</p>
                <p className="font-black text-[#00838F] text-sm">{Number(d.gesamtpreis).toFixed(2)} €</p>
              </div>
            </div>
          )}

          {/* Preis-Fallback wenn kein Anbieter */}
          {!d.anbieter && (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-sm text-gray-500 font-semibold">Gesamt bezahlt</span>
              <span className="font-black text-[#00838F] text-sm">{Number(d.gesamtpreis).toFixed(2)} €</span>
            </div>
          )}
        </div>

        {/* Rechte Seite: QR */}
        <div className="sm:w-40 bg-gray-50 flex flex-col items-center justify-center p-4 gap-2 border-t sm:border-t-0 sm:border-l border-gray-100">
          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-200">
            <QRCodeSVG value={d.qr_token} size={100} level="M" fgColor="#1a1a1a" />
          </div>
          <p className="text-[9px] text-gray-400 text-center font-bold uppercase tracking-wide leading-tight">
            Scan zur<br />Verifizierung
          </p>
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
