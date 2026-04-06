import { createSupabaseServer } from "@/lib/supabase-server";
import { Users, PackageSearch, CalendarCheck, Euro, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("adminPage.dashboard");
  return { title: t("title") };
}

export default async function AdminDashboardPage() {
  const t = await getTranslations("adminPage.dashboard");
  const supabase = await createSupabaseServer();

  const [
    { count: anbieterCount },
    { count: angeboteCount },
    { count: buchungenCount },
    { data: buchungenDaten },
    { data: offeneAuszahlungen },
  ] = await Promise.all([
    supabase.from("anbieter_profile").select("*", { count: "exact", head: true }),
    supabase.from("angebote").select("*", { count: "exact", head: true }).eq("status", "aktiv"),
    supabase.from("buchungen").select("*", { count: "exact", head: true }).neq("status", "storniert"),
    supabase.from("buchungen").select("gesamtpreis, provision_betrag, status, created_at, kunden_name, buchungs_nummer, anbieter_id").neq("status", "storniert").order("created_at", { ascending: false }).limit(8),
    supabase.from("auszahlungen").select("betrag, anbieter_id").eq("status", "offen"),
  ]);

  const gesamtumsatz  = (buchungenDaten ?? []).reduce((s: number, b: { gesamtpreis: number }) => s + Number(b.gesamtpreis), 0);
  const gesamtProvision = (buchungenDaten ?? []).reduce((s: number, b: { provision_betrag: number }) => s + Number(b.provision_betrag), 0);
  const offenBetrag   = (offeneAuszahlungen ?? []).reduce((s: number, a: { betrag: number }) => s + Number(a.betrag), 0);

  const STATS = [
    { icon: Users,        label: t("statProviders"),      wert: anbieterCount ?? 0,               c: "text-blue-400",    bg: "bg-blue-900/30" },
    { icon: PackageSearch,label: t("statActiveOffers"),    wert: angeboteCount ?? 0,               c: "text-emerald-400", bg: "bg-emerald-900/30" },
    { icon: CalendarCheck, label: t("statTotalBookings"),  wert: buchungenCount ?? 0,              c: "text-purple-400",  bg: "bg-purple-900/30" },
    { icon: Euro,         label: t("statRevenue"),         wert: `${gesamtumsatz.toFixed(2)} €`,   c: "text-amber-400",   bg: "bg-amber-900/30" },
    { icon: TrendingUp,   label: t("statProvision"),       wert: `${gesamtProvision.toFixed(2)} €`,c: "text-[#00838F]",   bg: "bg-[#00838F]/20" },
    { icon: Clock,        label: t("statOpenPayouts"),     wert: `${offenBetrag.toFixed(2)} €`,    c: "text-red-400",     bg: "bg-red-900/30" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">{t("heading")}</h1>
        <p className="text-gray-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map(({ icon: Icon, label, wert, c, bg }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${c}`} />
            </div>
            <p className="text-2xl font-black text-white">{wert}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Schnellzugriff */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/anbieter/",     label: t("actionApproveProviders"), desc: t("actionApproveDesc") },
          { href: "/admin/buchungen/",    label: t("actionManageBookings"),   desc: t("actionManageDesc") },
          { href: "/admin/auszahlungen/", label: t("actionPayouts"),          desc: t("actionPayoutsDesc") },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href}
            className="bg-gray-900 border border-gray-800 hover:border-[#00838F] rounded-2xl p-5 transition-all group">
            <p className="font-bold text-white text-sm group-hover:text-[#00838F] transition-colors">{label}</p>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Letzte Buchungen */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="font-bold text-white">{t("recentBookings")}</h2>
          <Link href="/admin/buchungen/" className="text-xs text-[#00838F] hover:underline">{t("all")}</Link>
        </div>
        <div className="divide-y divide-gray-800">
          {(buchungenDaten ?? []).map((b: { buchungs_nummer: string; kunden_name: string; gesamtpreis: number; provision_betrag: number; status: string; created_at: string }) => (
            <div key={b.buchungs_nummer} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{b.kunden_name}</p>
                <p className="text-xs text-gray-500">{b.buchungs_nummer} · {new Date(b.created_at).toLocaleDateString("de-DE")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{Number(b.gesamtpreis).toFixed(2)} €</p>
                <p className="text-xs text-[#00838F]">+{Number(b.provision_betrag).toFixed(2)} € {t("plusProvision")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
