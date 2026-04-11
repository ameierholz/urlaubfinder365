import { createSupabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Euro, TrendingUp, Megaphone, Flame, Clock, CheckCircle,
  AlertCircle, ExternalLink, ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Vermarktung – Revenue-Übersicht | Admin",
};

function fmt(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

export default async function AdminVermarktungPage() {
  const supabase = await createSupabaseServer();

  const now   = new Date();
  const monat = now.toISOString().slice(0, 7); // "2026-04"

  const [
    { data: werbeplaetzeBuchungen },
    { data: buchungenMonat },
    { data: buchungenGesamt },
    { data: sponsoredDeals },
  ] = await Promise.all([
    supabase
      .from("werbeplaetze_buchungen")
      .select("id, status, preis_monatlich, preis_gesamt, paket, kontakt_firma, kontakt_name, created_at, naechste_zahlung_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("buchungen")
      .select("provision_betrag, gesamtpreis")
      .gte("created_at", `${monat}-01`)
      .neq("status", "storniert"),
    supabase
      .from("buchungen")
      .select("provision_betrag, gesamtpreis")
      .neq("status", "storniert"),
    supabase
      .from("sponsored_deals")
      .select("id, titel, status, impressionen, klicks, preis_monatlich")
      .eq("status", "aktiv"),
  ]);

  type WbRow = {
    id: string; status: string; preis_monatlich: number; preis_gesamt: number;
    paket: string; kontakt_firma: string | null; kontakt_name: string | null;
    created_at: string; naechste_zahlung_at: string | null;
  };
  const wb = (werbeplaetzeBuchungen ?? []) as WbRow[];

  // Werbeplatz-Kennzahlen
  const wpAktiv      = wb.filter(b => b.status === "aktiv");
  const wpAngefragt  = wb.filter(b => b.status === "angefragt");
  const wpBestaetigt = wb.filter(b => b.status === "bestaetigt");
  const mrr          = wpAktiv.reduce((s, b) => s + Number(b.preis_monatlich), 0);
  const wpPending    = [...wpAngefragt, ...wpBestaetigt];

  // Buchungs-Kennzahlen
  type BRow = { provision_betrag: number; gesamtpreis: number };
  const provisionMonat  = (buchungenMonat as BRow[] ?? []).reduce((s, b) => s + Number(b.provision_betrag), 0);
  const umsatzMonat     = (buchungenMonat as BRow[] ?? []).reduce((s, b) => s + Number(b.gesamtpreis), 0);
  const provisionGesamt = (buchungenGesamt as BRow[] ?? []).reduce((s, b) => s + Number(b.provision_betrag), 0);

  // Sponsored
  type SdRow = { id: string; titel: string; status: string; impressionen: number | null; klicks: number | null; preis_monatlich: number | null };
  const sd        = (sponsoredDeals as SdRow[] ?? []);
  const sdMrr     = sd.reduce((s, d) => s + Number(d.preis_monatlich ?? 0), 0);
  const sdImpr    = sd.reduce((s, d) => s + Number(d.impressionen ?? 0), 0);

  const gesamtMrr = mrr + sdMrr;

  const PAKET_LABEL: Record<string, string> = {
    stadt_unten:        "Stadtseite unten",
    stadt_oben:         "Stadtseite Top",
    kategorie:          "Kategorie-Seite",
    region:             "Region",
    homepage:           "Homepage",
    rundum:             "Rundum-Paket",
    anbieter_spotlight: "Anbieter-Spotlight",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">Vermarktung</p>
        <h1 className="text-2xl font-black text-white">Revenue-Übersicht</h1>
        <p className="text-gray-500 text-sm mt-1">Alle Einnahmequellen auf einen Blick</p>
      </div>

      {/* KPI-Karten */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Euro,
            label: "Gesamt MRR",
            value: fmt(gesamtMrr),
            sub: "Werbeplätze + Sponsored",
            color: "text-amber-400",
            bg: "bg-amber-900/20",
          },
          {
            icon: Megaphone,
            label: "Aktive Werbeplätze",
            value: wpAktiv.length,
            sub: `${fmt(mrr)}/Monat`,
            color: "text-blue-400",
            bg: "bg-blue-900/20",
          },
          {
            icon: TrendingUp,
            label: `Provision ${now.toLocaleString("de-DE", { month: "long" })}`,
            value: fmt(provisionMonat),
            sub: `Umsatz: ${fmt(umsatzMonat)}`,
            color: "text-emerald-400",
            bg: "bg-emerald-900/20",
          },
          {
            icon: Clock,
            label: "Ausstehend",
            value: wpPending.length,
            sub: wpPending.length > 0 ? "Werbeplätze warten" : "Alles bearbeitet",
            color: wpPending.length > 0 ? "text-red-400" : "text-gray-500",
            bg: wpPending.length > 0 ? "bg-red-900/20" : "bg-gray-800",
          },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs font-semibold text-gray-300 mt-0.5">{label}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Zweispaltig: Ausstehend + Einnahmen-Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Ausstehende Werbeplatz-Anfragen */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              {wpPending.length > 0
                ? <AlertCircle className="w-4 h-4 text-amber-400" />
                : <CheckCircle className="w-4 h-4 text-emerald-400" />
              }
              Ausstehende Anfragen
              {wpPending.length > 0 && (
                <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {wpPending.length}
                </span>
              )}
            </h2>
            <Link href="/admin/werbung/" className="text-xs text-[#00838F] hover:underline flex items-center gap-1">
              Alle <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {wpPending.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Keine offenen Anfragen</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {wpPending.map((b) => (
                <div key={b.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {b.kontakt_firma ?? b.kontakt_name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {PAKET_LABEL[b.paket] ?? b.paket} · {fmt(Number(b.preis_monatlich))}/Mo
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    b.status === "angefragt" ? "bg-amber-900/50 text-amber-300" : "bg-blue-900/50 text-blue-300"
                  }`}>
                    {b.status === "angefragt" ? "Neu" : "Bestätigt"}
                  </span>
                </div>
              ))}
              <div className="px-5 py-3">
                <Link href="/admin/werbung/"
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                  Jetzt bearbeiten <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Einnahmen-Streams */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white text-sm">Einnahmen-Streams</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {[
              {
                icon: "📊",
                label: "Marktplatz-Provision",
                detail: `${(buchungenGesamt as BRow[] ?? []).length} Buchungen gesamt`,
                value: fmt(provisionGesamt),
                href: "/admin/buchungen/",
                sub: `${fmt(provisionMonat)} diesen Monat`,
              },
              {
                icon: "📢",
                label: "Werbeplatz-Subscriptions",
                detail: `${wpAktiv.length} aktive Pakete`,
                value: fmt(mrr),
                href: "/admin/werbung/",
                sub: "monatlich wiederkehrend",
              },
              {
                icon: "🔥",
                label: "Sponsored Deals",
                detail: `${sd.length} aktiv · ${sdImpr.toLocaleString("de-DE")} Impressionen`,
                value: sdMrr > 0 ? fmt(sdMrr) : "–",
                href: "/admin/sponsored-deals/",
                sub: sdMrr > 0 ? "monatlich" : "Noch keine aktiven Deals",
              },
            ].map(({ icon, label, detail, value, href, sub }) => (
              <Link key={label} href={href}
                className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-gray-800/50 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white group-hover:text-[#00838F] transition-colors">{label}</p>
                    <p className="text-xs text-gray-500">{detail}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">{sub}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-white">{value}</p>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00838F] ml-auto mt-1 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Aktive Werbeplatz-Subscriptions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="font-bold text-white text-sm">
            Aktive Werbeplatz-Subscriptions
            <span className="ml-2 text-xs font-normal text-gray-500">{wpAktiv.length} aktiv</span>
          </h2>
          <Link href="/admin/werbung/" className="text-xs text-[#00838F] hover:underline flex items-center gap-1">
            Alle verwalten <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {wpAktiv.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-gray-500 text-sm">Noch keine aktiven Werbeplatz-Subscriptions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-5 py-2.5">Kunde</th>
                  <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-2.5">Paket</th>
                  <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-2.5">Preis/Mo</th>
                  <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest px-5 py-2.5">Nächste Zahlung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {wpAktiv.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-3 text-white font-medium">
                      {b.kontakt_firma ?? b.kontakt_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {PAKET_LABEL[b.paket] ?? b.paket}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-bold">
                      {fmt(Number(b.preis_monatlich))}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500 text-xs">
                      {b.naechste_zahlung_at
                        ? new Date(b.naechste_zahlung_at).toLocaleDateString("de-DE")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-700">
                  <td colSpan={2} className="px-5 py-3 text-xs font-bold text-gray-400">Gesamt MRR</td>
                  <td className="px-4 py-3 text-right font-black text-amber-400">{fmt(mrr)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/werbung/",         icon: "📢", label: "Werbeplatz-Buchungen verwalten" },
          { href: "/admin/werbeplaetze/",     icon: "🧩", label: "Ad-Code-Slots bearbeiten" },
          { href: "/admin/sponsored-deals/",  icon: "🔥", label: "Sponsored Deals anlegen" },
          { href: "/werbepartner/",           icon: "🌐", label: "Werbepartner-Seite ansehen", target: "_blank" },
        ].map(({ href, icon, label, target }) => (
          <Link key={href} href={href} target={target as "_blank" | undefined}
            className="bg-gray-900 border border-gray-800 hover:border-amber-500/40 rounded-xl p-4 text-center transition-all group">
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors leading-tight">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
