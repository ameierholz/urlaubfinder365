import { createSupabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";
import WerbungStatusButton from "@/components/admin/WerbungStatusButton";
import WerbungPlacementForm from "@/components/admin/WerbungPlacementForm";
import AdSlotsContent from "@/components/admin/AdSlotsContent";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Werbeplatz-Verwaltung | Admin",
};

const PAKET_EMOJI: Record<string, string> = {
  stadt_unten:        "🌆",
  stadt_oben:         "🌆",
  kategorie:          "🏷️",
  region:             "🗺️",
  homepage:           "🏠",
  rundum:             "⭐",
  anbieter_spotlight: "👤",
};

const STATUS_CLS: Record<string, string> = {
  angefragt:   "bg-amber-100 text-amber-700",
  bestaetigt:  "bg-blue-100 text-blue-700",
  aktiv:       "bg-emerald-100 text-emerald-700",
  abgelaufen:  "bg-gray-100 text-gray-500",
  storniert:   "bg-red-100 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  angefragt:   "Neu / Angefragt",
  bestaetigt:  "Bestätigt",
  aktiv:       "Aktiv",
  abgelaufen:  "Abgelaufen",
  storniert:   "Storniert",
};

const PAKET_LABEL: Record<string, string> = {
  stadt_unten:        "Stadtseite unten",
  stadt_oben:         "Stadtseite Top",
  kategorie:          "Kategorie-Seite",
  region:             "Region",
  homepage:           "Homepage",
  rundum:             "Rundum-Paket",
  anbieter_spotlight: "Anbieter-Spotlight",
};

type PageProps = { searchParams: Promise<{ tab?: string }> };

export default async function AdminWerbungPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeTab = tab === "adslots" ? "adslots" : "buchungen";

  const supabase = await createSupabaseServer();
  const { data: buchungenRaw } = await supabase
    .from("werbeplaetze_buchungen")
    .select("*, anbieter_profile(name)")
    .order("created_at", { ascending: false });

  const buchungen = (buchungenRaw ?? []) as Array<{
    id: string; paket: string; zielseite: string | null;
    laufzeit_monate: number; preis_monatlich: number; preis_gesamt: number;
    status: string; admin_notiz: string | null; placement_info: string | null;
    starts_at: string | null; ends_at: string | null; created_at: string;
    kontakt_firma: string | null; kontakt_name: string | null;
    anbieter_profile: { name: string } | null;
  }>;

  const gesamt = buchungen.filter(b => b.status === "aktiv").reduce((s, b) => s + Number(b.preis_monatlich), 0);
  const offen  = buchungen.filter(b => b.status === "angefragt").length;
  const aktiv  = buchungen.filter(b => b.status === "aktiv").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Werbeplatz-Verwaltung</h1>
        <p className="text-gray-400 text-sm mt-1">Buchungen prüfen, freigeben und Ad-Code-Slots verwalten</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 p-1 rounded-xl w-fit">
        <Link href="/admin/werbung/"
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "buchungen" ? "bg-[#00838F] text-white" : "text-gray-400 hover:text-white"
          }`}>
          📋 Buchungen
          {offen > 0 && (
            <span className="ml-1.5 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
              {offen}
            </span>
          )}
        </Link>
        <Link href="/admin/werbung/?tab=adslots"
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "adslots" ? "bg-[#00838F] text-white" : "text-gray-400 hover:text-white"
          }`}>
          🧩 Ad-Code-Slots
        </Link>
      </div>

      {/* Tab-Inhalt: Buchungen */}
      {activeTab === "buchungen" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Offen / Angefragt", wert: offen,              c: "text-amber-400" },
              { label: "Aktiv",             wert: aktiv,              c: "text-emerald-400" },
              { label: "MRR (aktiv)",       wert: `${gesamt.toFixed(2)} €`, c: "text-[#00838F]" },
            ].map(({ label, wert, c }) => (
              <div key={label} className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <p className={`text-2xl font-black ${c}`}>{wert}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            {buchungen.length === 0 ? (
              <div className="p-16 text-center text-gray-500">
                <p className="text-4xl mb-3">📢</p>
                <p className="font-semibold">Noch keine Buchungen</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {buchungen.map((b) => {
                  const paketLabel = PAKET_LABEL[b.paket] ?? b.paket;
                  const paketEmoji = PAKET_EMOJI[b.paket] ?? "📌";
                  const kundenName = b.kontakt_firma ?? b.kontakt_name ?? b.anbieter_profile?.name ?? "—";
                  return (
                    <div key={b.id} className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="font-bold text-white text-sm">
                            {paketEmoji} {paketLabel}
                            {b.zielseite && <span className="text-gray-400 font-normal ml-1">→ {b.zielseite}</span>}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {kundenName} · {b.laufzeit_monate} {b.laufzeit_monate === 1 ? "Monat" : "Monate"} ·
                            {" "}{Number(b.preis_monatlich).toFixed(2)} €/Mo · <strong className="text-gray-300">{Number(b.preis_gesamt).toFixed(2)} € gesamt</strong>
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Angefragt: {new Date(b.created_at).toLocaleDateString("de-DE")}
                            {b.starts_at && ` · Aktiv: ${new Date(b.starts_at).toLocaleDateString("de-DE")} – ${b.ends_at ? new Date(b.ends_at).toLocaleDateString("de-DE") : "?"}`}
                          </p>
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_CLS[b.status] ?? "bg-gray-700 text-gray-300"}`}>
                          {STATUS_LABEL[b.status] ?? b.status}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 flex-wrap">
                        <WerbungPlacementForm id={b.id} currentPlacement={b.placement_info} currentNotiz={b.admin_notiz} />
                        <div className="flex gap-2 flex-wrap">
                          {b.status === "angefragt" && (
                            <WerbungStatusButton id={b.id} newStatus="bestaetigt" label="Bestätigen" cls="bg-blue-600 hover:bg-blue-700 text-white" />
                          )}
                          {b.status === "bestaetigt" && (
                            <WerbungStatusButton id={b.id} newStatus="aktiv" label="Aktivieren" cls="bg-emerald-600 hover:bg-emerald-700 text-white" />
                          )}
                          {(b.status === "angefragt" || b.status === "bestaetigt" || b.status === "aktiv") && (
                            <WerbungStatusButton id={b.id} newStatus="storniert" label="Stornieren" cls="bg-red-900/40 hover:bg-red-900/60 text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab-Inhalt: Ad-Code-Slots */}
      {activeTab === "adslots" && <AdSlotsContent />}
    </div>
  );
}
