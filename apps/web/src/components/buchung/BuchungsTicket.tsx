"use client";

import QRCodeSVG from "react-qr-code";
import { Printer, MapPin, Clock, Users, Calendar, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface TicketDaten {
  buchungs_nummer: string;
  qr_token: string;
  kunden_name: string;
  kunden_email: string;
  kunden_telefon: string | null;
  datum: string;
  personen: number;
  gesamtpreis: number;
  status: string;
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

export default function BuchungsTicket({ d }: { d: TicketDaten }) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 print:bg-white print:p-0 print:min-h-0">
      <div className="max-w-2xl mx-auto">

        {/* Ticket Card */}
        <div
          id="ticket"
          className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden print:shadow-none print:rounded-none print:border-0"
        >
          {/* Banner-Foto */}
          {d.angebot?.foto_url && (
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={d.angebot.foto_url}
                alt={d.angebot.titel ?? ""}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <p className="text-white font-black text-xl leading-tight drop-shadow">{d.angebot.titel}</p>
                {d.angebot.ziel && (
                  <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {d.angebot.ziel}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Kein Foto: einfacher Header */}
          {!d.angebot?.foto_url && (
            <div className="bg-[#00838F] px-6 py-6">
              <p className="text-white font-black text-xl">{d.angebot?.titel ?? "Buchung"}</p>
              {d.angebot?.ziel && (
                <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {d.angebot.ziel}
                </p>
              )}
            </div>
          )}

          {/* Status-Banner */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 flex items-center gap-2">
            <span className="text-emerald-600 text-lg">✅</span>
            <span className="text-emerald-700 font-bold text-sm">Buchung bestätigt &amp; bezahlt</span>
            <span className="ml-auto text-xs text-emerald-600 font-mono font-bold">{d.buchungs_nummer}</span>
          </div>

          {/* Hauptinhalt: Details + QR */}
          <div className="flex flex-col sm:flex-row gap-0">

            {/* Linke Seite: Details */}
            <div className="flex-1 p-6 space-y-4">

              {/* Termin */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <Calendar className="w-3 h-3" /> Datum
                  </div>
                  <p className="font-black text-gray-900 text-sm">
                    {new Date(d.datum).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <Users className="w-3 h-3" /> Personen
                  </div>
                  <p className="font-black text-gray-900 text-sm">{d.personen} {d.personen === 1 ? "Person" : "Personen"}</p>
                </div>
              </div>

              {/* Dauer + Treffpunkt */}
              {(d.angebot?.dauer || d.angebot?.treffpunkt) && (
                <div className="grid grid-cols-1 gap-2">
                  {d.angebot.dauer && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-gray-500 text-xs">Dauer</span>
                        <p className="font-semibold text-gray-800">{d.angebot.dauer}</p>
                      </div>
                    </div>
                  )}
                  {d.angebot.treffpunkt && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-gray-500 text-xs">Treffpunkt</span>
                        <p className="font-semibold text-gray-800">{d.angebot.treffpunkt}</p>
                        {d.angebot.treffpunkt_hinweis && (
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{d.angebot.treffpunkt_hinweis}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Kunde */}
              <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Kunde</span>
                  <span className="font-semibold text-gray-800">{d.kunden_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">E-Mail</span>
                  <span className="font-semibold text-gray-800 text-right break-all">{d.kunden_email}</span>
                </div>
                {d.kunden_telefon && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Telefon</span>
                    <span className="font-semibold text-gray-800">{d.kunden_telefon}</span>
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
                </div>
              )}

              {/* Preis */}
              <div className="flex items-center justify-between bg-[#00838F]/8 rounded-2xl px-4 py-3">
                <span className="text-sm text-gray-600 font-semibold">Gesamt bezahlt</span>
                <span className="text-lg font-black text-[#00838F]">{Number(d.gesamtpreis).toFixed(2)} €</span>
              </div>
            </div>

            {/* Rechte Seite: QR-Code */}
            <div className="sm:w-48 bg-gray-50 flex flex-col items-center justify-center p-6 gap-3 border-t sm:border-t-0 sm:border-l border-gray-100">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200">
                <QRCodeSVG
                  value={d.qr_token}
                  size={120}
                  level="M"
                  fgColor="#1a1a1a"
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Scan zur</p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Verifizierung</p>
                <p className="text-[9px] text-gray-300 mt-1 font-mono break-all leading-relaxed">{d.qr_token.substring(0, 8)}…</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-gray-300">urlaubfinder365.de · {d.buchungs_nummer}</p>
            <p className="text-[10px] text-gray-300">Bitte dieses Ticket am Veranstaltungstag vorzeigen</p>
          </div>
        </div>

        {/* Aktions-Buttons — werden beim Drucken ausgeblendet */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
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

        <p className="text-center text-xs text-gray-400 mt-4 print:hidden">
          Diese Seite jederzeit wieder aufrufen: <strong>/buchung/ticket/{d.buchungs_nummer}</strong>
        </p>
      </div>
    </div>
  );
}
