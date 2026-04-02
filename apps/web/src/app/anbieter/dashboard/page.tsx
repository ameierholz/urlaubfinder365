import { createSupabaseServer } from "@/lib/supabase-server";
import { PackageSearch, CalendarCheck, TrendingUp, Euro, Plus, QrCode } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | Anbieter-Portal" };

export default async function AnbieterDashboardPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profilRaw } = await supabase
    .from("anbieter_profile")
    .select("id, name, status, verifiziert")
    .eq("user_id", user!.id)
    .maybeSingle();
  const profil = profilRaw as { id: string; name: string; status: string; verifiziert: boolean } | null;

  const [{ count: angeboteCount }, { count: buchungenCount }, { data: buchungenDaten }] = await Promise.all([
    supabase.from("angebote").select("*", { count: "exact", head: true }).eq("anbieter_id", profil?.id ?? ""),
    supabase.from("buchungen").select("*", { count: "exact", head: true }).eq("anbieter_id", profil?.id ?? "").neq("status", "storniert"),
    supabase.from("buchungen").select("auszahlungs_betrag, status, created_at, kunden_name, gesamtpreis, buchungs_nummer")
      .eq("anbieter_id", profil?.id ?? "")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const gesamtEinnahmen = (buchungenDaten ?? [])
    .filter((b: { status: string }) => b.status !== "storniert")
    .reduce((sum: number, b: { auszahlungs_betrag: number }) => sum + Number(b.auszahlungs_betrag), 0);

  const offeneBuchungen = (buchungenDaten ?? []).filter((b: { status: string }) => b.status === "ausstehend").length;

  const STATS = [
    { icon: PackageSearch, label: "Aktive Angebote", wert: angeboteCount ?? 0, farbe: "text-[#00838F]", bg: "bg-[#00838F]/10" },
    { icon: CalendarCheck,  label: "Buchungen gesamt", wert: buchungenCount ?? 0, farbe: "text-blue-600", bg: "bg-blue-50" },
    { icon: TrendingUp,     label: "Offene Buchungen", wert: offeneBuchungen, farbe: "text-amber-600", bg: "bg-amber-50" },
    { icon: Euro,           label: "Mein Anteil (85%)", wert: `${gesamtEinnahmen.toFixed(2)} €`, farbe: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Willkommen, {profil?.name.split(" ")[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Dein Anbieter-Dashboard — alles auf einen Blick.</p>
        </div>
        <Link
          href="/anbieter/angebote/neu/"
          className="flex items-center gap-2 bg-[#00838F] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#006d78] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Neues Angebot
        </Link>
      </div>

      {/* Status-Banner wenn noch nicht verifiziert */}
      {!profil?.verifiziert && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800">
          <strong>⏳ Dein Profil wird gerade geprüft.</strong> Sobald wir dein Konto freigeschaltet haben, können deine Angebote öffentlich angezeigt werden. Das dauert normalerweise 24–48 Stunden.
        </div>
      )}

      {/* Stat-Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, label, wert, farbe, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${farbe}`} />
            </div>
            <p className="text-2xl font-black text-gray-900">{wert}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/anbieter/angebote/neu/", icon: Plus,          label: "Angebot anlegen",    desc: "Neue Tour oder Aktivität erstellen" },
          { href: "/anbieter/buchungen/",    icon: CalendarCheck,  label: "Buchungen prüfen",   desc: "Neue Anfragen bestätigen" },
          { href: "/anbieter/scanner/",      icon: QrCode,         label: "QR-Code scannen",    desc: "Buchung vor Ort verifizieren" },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#00838F] hover:shadow-md transition-all group">
            <Icon className="w-6 h-6 text-[#00838F] mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-gray-900 text-sm">{label}</p>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Letzte Buchungen */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Letzte Buchungen</h2>
          <Link href="/anbieter/buchungen/" className="text-xs text-[#00838F] font-semibold hover:underline">
            Alle anzeigen →
          </Link>
        </div>
        {!buchungenDaten || buchungenDaten.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">
            Noch keine Buchungen vorhanden.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {buchungenDaten.map((b: { buchungs_nummer: string; kunden_name: string; gesamtpreis: number; status: string; created_at: string }) => (
              <div key={b.buchungs_nummer} className="px-6 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{b.kunden_name}</p>
                  <p className="text-xs text-gray-400">{b.buchungs_nummer} · {new Date(b.created_at).toLocaleDateString("de-DE")}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{Number(b.gesamtpreis).toFixed(2)} €</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.status === "abgeschlossen" ? "bg-emerald-100 text-emerald-700" :
                    b.status === "bestaetigt"   ? "bg-blue-100 text-blue-700" :
                    b.status === "storniert"    ? "bg-red-100 text-red-600" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {b.status === "abgeschlossen" ? "✅ Abgeschlossen" :
                     b.status === "bestaetigt"   ? "✓ Bestätigt" :
                     b.status === "storniert"    ? "✗ Storniert" : "⏳ Ausstehend"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
