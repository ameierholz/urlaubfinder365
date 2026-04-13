"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, ExternalLink, CheckCircle2, Circle, Clock,
  XCircle, Globe, Copy, Check, Filter,
} from "lucide-react";

// ─── Status ──────────────────────────────────────────────────────────────────
type Status = "offen" | "eingetragen" | "wartend" | "abgelehnt";

const STATUS_CFG: Record<Status, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  offen:       { label: "Offen",       icon: Circle,       color: "text-gray-400",   bg: "bg-gray-800" },
  eingetragen: { label: "Eingetragen", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-900/30" },
  wartend:     { label: "Wartend",     icon: Clock,        color: "text-amber-400",   bg: "bg-amber-900/30" },
  abgelehnt:   { label: "Abgelehnt",   icon: XCircle,      color: "text-red-400",     bg: "bg-red-900/30" },
};

// ─── Verzeichnis-Daten ───────────────────────────────────────────────────────
interface Verzeichnis {
  name: string;
  url: string;
  kategorie: "allgemein" | "reise" | "startup" | "regional" | "branche" | "bewertung";
  da: string;          // Domain Authority Schätzung
  dofollow: boolean;
  kostenlos: boolean;
  notiz: string;
}

const KATEGORIEN = {
  allgemein: "Allgemein",
  reise: "Reise & Tourismus",
  startup: "Startup & Tech",
  regional: "Regional / DACH",
  branche: "Branchenverzeichnis",
  bewertung: "Bewertungsportal",
};

const VERZEICHNISSE: Verzeichnis[] = [
  // ── Allgemeine Webverzeichnisse ──
  { name: "DMOZ / Curlie", url: "https://curlie.org/", kategorie: "allgemein", da: "91", dofollow: false, kostenlos: true, notiz: "Ehrenamtlich kuratiert, Eintrag unter Recreation/Travel" },
  { name: "Webwiki", url: "https://www.webwiki.de/", kategorie: "allgemein", da: "52", dofollow: true, kostenlos: true, notiz: "Automatischer Eintrag, manuell verifizieren" },
  { name: "Hotfrog", url: "https://www.hotfrog.de/", kategorie: "allgemein", da: "48", dofollow: true, kostenlos: true, notiz: "Branchenverzeichnis, kostenloser Basiseintrag" },
  { name: "Gelbe Seiten", url: "https://www.gelbeseiten.de/", kategorie: "allgemein", da: "67", dofollow: false, kostenlos: true, notiz: "Nur mit Geschäftsadresse, nofollow aber Brand-Signal" },
  { name: "11880.com", url: "https://www.11880.com/", kategorie: "allgemein", da: "55", dofollow: false, kostenlos: true, notiz: "Telefonbuch-Verzeichnis, kostenloser Basiseintrag" },

  // ── Reise & Tourismus ──
  { name: "Reiselinks.de", url: "https://www.reiselinks.de/", kategorie: "reise", da: "42", dofollow: true, kostenlos: true, notiz: "Großes deutsches Reise-Linkverzeichnis" },
  { name: "Reiseverzeichnis.com", url: "https://www.reiseverzeichnis.com/", kategorie: "reise", da: "28", dofollow: true, kostenlos: true, notiz: "Reise-Webkatalog, Eintrag unter Reiseportale" },
  { name: "Urlaubswerk.de", url: "https://www.urlaubswerk.de/", kategorie: "reise", da: "18", dofollow: true, kostenlos: true, notiz: "Kleines Reiseverzeichnis, schnelle Freischaltung" },
  { name: "Travel-Webkatalog", url: "https://www.travel-webkatalog.de/", kategorie: "reise", da: "15", dofollow: true, kostenlos: true, notiz: "Thematischer Webkatalog Reise" },
  { name: "Reise-Katalog.de", url: "https://www.reise-katalog.de/", kategorie: "reise", da: "20", dofollow: true, kostenlos: true, notiz: "Verzeichnis für Reiseseiten" },
  { name: "Touristik-Links.de", url: "https://www.touristik-links.de/", kategorie: "reise", da: "22", dofollow: true, kostenlos: true, notiz: "Touristik-Branchenverzeichnis" },
  { name: "Ferien-Netzwerk.de", url: "https://www.ferien-netzwerk.de/", kategorie: "reise", da: "16", dofollow: true, kostenlos: true, notiz: "Ferienwohnungs- & Reiseportal-Verzeichnis" },

  // ── Startup & Tech ──
  { name: "deutsche-startups.de", url: "https://www.deutsche-startups.de/", kategorie: "startup", da: "62", dofollow: true, kostenlos: true, notiz: "Startup-Datenbank, PR-Beitrag möglich" },
  { name: "Startbase", url: "https://www.startbase.de/", kategorie: "startup", da: "45", dofollow: true, kostenlos: true, notiz: "Startup-Plattform von Börse Stuttgart" },
  { name: "Crunchbase", url: "https://www.crunchbase.com/", kategorie: "startup", da: "91", dofollow: true, kostenlos: true, notiz: "Internationales Startup-Verzeichnis, hohe DA" },
  { name: "Product Hunt", url: "https://www.producthunt.com/", kategorie: "startup", da: "90", dofollow: true, kostenlos: true, notiz: "Launch-Plattform, ideal für Feature-Launches" },
  { name: "BetaList", url: "https://betalist.com/", kategorie: "startup", da: "58", dofollow: true, kostenlos: true, notiz: "Für Startups in der Beta-Phase" },

  // ── Regional / DACH ──
  { name: "meinestadt.de", url: "https://www.meinestadt.de/", kategorie: "regional", da: "70", dofollow: false, kostenlos: true, notiz: "Regionales Branchenverzeichnis, große Reichweite" },
  { name: "Stadtbranchenbuch", url: "https://www.stadtbranchenbuch.com/", kategorie: "regional", da: "40", dofollow: true, kostenlos: true, notiz: "Lokales Branchenverzeichnis" },
  { name: "Cylex", url: "https://www.cylex.de/", kategorie: "regional", da: "50", dofollow: true, kostenlos: true, notiz: "Firmeneintrag mit Öffnungszeiten etc." },
  { name: "GoLocal", url: "https://www.golocal.de/", kategorie: "regional", da: "48", dofollow: false, kostenlos: true, notiz: "Bewertungsportal + Brancheneintrag" },

  // ── Branchenverzeichnisse ──
  { name: "Wer liefert was (wlw)", url: "https://www.wlw.de/", kategorie: "branche", da: "65", dofollow: false, kostenlos: true, notiz: "B2B-Plattform, auch für Dienstleister" },
  { name: "Yelp Deutschland", url: "https://www.yelp.de/", kategorie: "branche", da: "93", dofollow: false, kostenlos: true, notiz: "Sehr hohe DA, nofollow aber starkes Brand-Signal" },
  { name: "Foursquare", url: "https://de.foursquare.com/", kategorie: "branche", da: "92", dofollow: false, kostenlos: true, notiz: "Location-basiert, hohe DA" },

  // ── Bewertungsportale ──
  { name: "Trustpilot", url: "https://www.trustpilot.com/", kategorie: "bewertung", da: "93", dofollow: true, kostenlos: true, notiz: "Profil bereits vorhanden? Bewertungen sammeln" },
  { name: "ProvenExpert", url: "https://www.provenexpert.com/", kategorie: "bewertung", da: "66", dofollow: true, kostenlos: true, notiz: "Deutsches Bewertungsportal, dofollow Profil-Link" },
  { name: "Google Business Profile", url: "https://business.google.com/", kategorie: "bewertung", da: "100", dofollow: false, kostenlos: true, notiz: "Pflicht! Knowledge Panel + Maps Eintrag" },
  { name: "Ausgezeichnet.org", url: "https://www.ausgezeichnet.org/", kategorie: "bewertung", da: "42", dofollow: true, kostenlos: false, notiz: "Gütesiegel + Bewertungen, kostenpflichtig" },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function VerzeichnissePage() {
  const [statusMap, setStatusMap] = useState<Record<string, Status>>({});
  const [filter, setFilter] = useState<string>("alle");
  const [copied, setCopied] = useState<string | null>(null);

  const getStatus = (name: string): Status => statusMap[name] ?? "offen";
  const setStatus = (name: string, s: Status) => setStatusMap((m) => ({ ...m, [name]: s }));

  const filtered = filter === "alle"
    ? VERZEICHNISSE
    : VERZEICHNISSE.filter((v) => v.kategorie === filter);

  const stats = {
    total: VERZEICHNISSE.length,
    eingetragen: Object.values(statusMap).filter((s) => s === "eingetragen").length,
    wartend: Object.values(statusMap).filter((s) => s === "wartend").length,
    offen: VERZEICHNISSE.length - Object.values(statusMap).filter((s) => s !== "offen").length,
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText("urlaubfinder365.de");
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/admin/seo/" className="hover:text-white transition-colors">SEO</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-teal-400">Branchenverzeichnisse</span>
          </div>
          <h1 className="text-2xl font-black text-white">Branchenverzeichnisse</h1>
          <p className="text-gray-500 text-sm mt-1">{stats.total} Verzeichnisse &middot; Backlinks durch Eintr&auml;ge aufbauen</p>
        </div>
      </div>

      {/* KPI-Karten */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Gesamt", value: stats.total, color: "text-white", bg: "bg-gray-800" },
          { label: "Eingetragen", value: stats.eingetragen, color: "text-emerald-400", bg: "bg-emerald-900/20" },
          { label: "Wartend", value: stats.wartend, color: "text-amber-400", bg: "bg-amber-900/20" },
          { label: "Offen", value: stats.offen, color: "text-gray-400", bg: "bg-gray-800" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter("alle")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filter === "alle" ? "bg-teal-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Alle ({VERZEICHNISSE.length})
          </button>
          {Object.entries(KATEGORIEN).map(([key, label]) => {
            const count = VERZEICHNISSE.filter((v) => v.kategorie === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filter === key ? "bg-teal-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabelle */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-5 py-3">Verzeichnis</th>
              <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-3">Kategorie</th>
              <th className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-3">DA</th>
              <th className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-3">Dofollow</th>
              <th className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-3">Kostenlos</th>
              <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-3">Status</th>
              <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest px-5 py-3">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((v) => {
              const status = getStatus(v.name);
              const cfg = STATUS_CFG[status];
              const StatusIcon = cfg.icon;
              return (
                <tr key={v.name} className="hover:bg-gray-800/40 transition-colors">
                  {/* Name + URL */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate">{v.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{v.notiz}</p>
                      </div>
                    </div>
                  </td>

                  {/* Kategorie */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-400">{KATEGORIEN[v.kategorie]}</span>
                  </td>

                  {/* DA */}
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-bold ${
                      Number(v.da) >= 60 ? "text-emerald-400" : Number(v.da) >= 40 ? "text-amber-400" : "text-gray-400"
                    }`}>{v.da}</span>
                  </td>

                  {/* Dofollow */}
                  <td className="px-4 py-3 text-center">
                    {v.dofollow
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      : <span className="text-[10px] text-gray-600">nofollow</span>
                    }
                  </td>

                  {/* Kostenlos */}
                  <td className="px-4 py-3 text-center">
                    {v.kostenlos
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      : <span className="text-[10px] text-gray-600">kostenpflichtig</span>
                    }
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <select
                      value={status}
                      onChange={(e) => setStatus(v.name, e.target.value as Status)}
                      className={`${cfg.bg} ${cfg.color} text-xs font-bold px-2.5 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-500`}
                    >
                      {Object.entries(STATUS_CFG).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Aktionen */}
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => copyUrl(v.url)}
                        className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                        title="URL kopieren"
                      >
                        {copied === v.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                      </button>
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                        title="Verzeichnis öffnen"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tipps */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-3">Tipps f&uuml;r den Eintrag</h3>
        <ul className="space-y-2 text-xs text-gray-400">
          <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" /> <span>Verwende &uuml;berall den gleichen Firmennamen: <strong className="text-white">Urlaubfinder365</strong></span></li>
          <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" /> <span>URL immer mit https://www.urlaubfinder365.de/ eintragen</span></li>
          <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" /> <span>Beschreibung variieren &mdash; nicht &uuml;berall den gleichen Text, sonst wertet Google ab</span></li>
          <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" /> <span>Dofollow-Links priorisieren &mdash; aber auch nofollow-Links sind wertvoll f&uuml;r Brand-Signale</span></li>
          <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" /> <span>Max. 3&ndash;5 Eintr&auml;ge pro Tag &mdash; langsam aufbauen wirkt nat&uuml;rlicher</span></li>
        </ul>
      </div>
    </div>
  );
}
