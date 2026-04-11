import { createSupabaseServer } from "@/lib/supabase-server";
import {
  Users, PackageSearch, CalendarCheck, Euro, TrendingUp, Clock,
  Megaphone, Globe, FileText, Newspaper, AlertCircle, CheckCircle,
  ChevronRight, Flame, MapPin,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | Admin" };

function fmt(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function StatCard({
  icon: Icon, label, value, sub, color, bg, href,
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; color: string; bg: string; href?: string;
}) {
  const inner = (
    <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 h-full ${href ? "hover:border-gray-600 transition-colors group" : ""}`}>
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className={`text-xs font-semibold text-gray-300 mt-0.5 ${href ? "group-hover:text-white transition-colors" : ""}`}>{label}</p>
      {sub && <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : <div>{inner}</div>;
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServer();

  const now   = new Date();
  const monat = now.toISOString().slice(0, 7);

  const [
    { count: anbieterCount },
    { count: angeboteCount },
    { count: buchungenCount },
    { data: buchungenDaten },
    { data: buchungenMonat },
    { data: offeneAuszahlungen },
    { data: werbeplaetze },
    { count: seoMetaCount },
    { count: destSeoCount },
    { count: destGesamtCount },
    { count: magazinCount },
    { data: sponsoredAktiv },
  ] = await Promise.all([
    supabase.from("anbieter_profile").select("*", { count: "exact", head: true }),
    supabase.from("angebote").select("*", { count: "exact", head: true }).eq("status", "aktiv"),
    supabase.from("buchungen").select("*", { count: "exact", head: true }).neq("status", "storniert"),
    supabase.from("buchungen")
      .select("gesamtpreis, provision_betrag, status, created_at, kunden_name, buchungs_nummer")
      .neq("status", "storniert").order("created_at", { ascending: false }).limit(6),
    supabase.from("buchungen")
      .select("gesamtpreis, provision_betrag")
      .gte("created_at", `${monat}-01`).neq("status", "storniert"),
    supabase.from("auszahlungen").select("betrag").eq("status", "offen"),
    supabase.from("werbeplaetze_buchungen")
      .select("status, preis_monatlich, kontakt_firma, kontakt_name, paket"),
    supabase.from("page_seo_meta").select("*", { count: "exact", head: true }),
    supabase.from("destination_seo_texts").select("*", { count: "exact", head: true }),
    supabase.from("destinations").select("*", { count: "exact", head: true }),
    supabase.from("magazin_articles" as never).select("*", { count: "exact", head: true }).eq("status", "veroeffentlicht"),
    supabase.from("sponsored_deals").select("id, titel").eq("status", "aktiv"),
  ]);

  // Revenue
  type BRow = { gesamtpreis: number; provision_betrag: number };
  const provisionMonat  = (buchungenMonat  as BRow[] ?? []).reduce((s, b) => s + Number(b.provision_betrag), 0);
  const umsatzMonat     = (buchungenMonat  as BRow[] ?? []).reduce((s, b) => s + Number(b.gesamtpreis), 0);
  const offenBetrag     = (offeneAuszahlungen ?? []).reduce((s: number, a: { betrag: number }) => s + Number(a.betrag), 0);

  const wb         = (werbeplaetze ?? []) as Array<{ status: string; preis_monatlich: number; kontakt_firma: string | null; kontakt_name: string | null; paket: string }>;
  const wpAktiv    = wb.filter(b => b.status === "aktiv");
  const wpPending  = wb.filter(b => b.status === "angefragt" || b.status === "bestaetigt");
  const mrr        = wpAktiv.reduce((s, b) => s + Number(b.preis_monatlich), 0);
  const gesamtMrr  = mrr; // + sponsored wenn vorhanden

  // Content-Stand
  const seoAbdeckung = destGesamtCount ? Math.round(((destSeoCount ?? 0) / destGesamtCount) * 100) : 0;

  // Handlungsbedarf
  type ActionItem = { level: "critical" | "warn" | "ok"; label: string; href: string; count?: number };
  const actions: ActionItem[] = [];
  if (wpPending.length > 0)
    actions.push({ level: "critical", label: `${wpPending.length} Werbeplatz-Anfragen warten`, href: "/admin/werbung/", count: wpPending.length });
  if (offenBetrag > 0)
    actions.push({ level: "warn", label: `${fmt(offenBetrag)} Auszahlungen offen`, href: "/admin/auszahlungen/" });
  const destOhneSeo = (destGesamtCount ?? 0) - (destSeoCount ?? 0);
  if (destOhneSeo > 0)
    actions.push({ level: "warn", label: `${destOhneSeo} Destinations ohne SEO-Text`, href: "/admin/destinations/" });
  if ((magazinCount ?? 0) === 0)
    actions.push({ level: "warn", label: "Noch keine Magazin-Artikel veröffentlicht", href: "/admin/magazin/" });
  if (actions.length === 0)
    actions.push({ level: "ok", label: "Alles in Ordnung – keine offenen Aufgaben", href: "/admin/dashboard/" });

  const monatsname = now.toLocaleString("de-DE", { month: "long" });

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#00838F] mb-1">
          {now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="text-2xl font-black text-white">Command Center</h1>
        <p className="text-gray-500 text-sm mt-1">Gesamtübersicht aller Bereiche</p>
      </div>

      {/* Handlungsbedarf */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <h2 className="font-bold text-white text-sm">Handlungsbedarf</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {actions.map((a, i) => (
            <Link key={i} href={a.href}
              className="flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors group">
              <div className="flex items-center gap-3">
                {a.level === "critical"
                  ? <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  : a.level === "warn"
                  ? <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  : <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                }
                <span className={`text-sm font-medium ${a.level === "ok" ? "text-emerald-400" : "text-gray-300 group-hover:text-white"} transition-colors`}>
                  {a.label}
                </span>
              </div>
              {a.level !== "ok" && <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-300 transition-colors" />}
            </Link>
          ))}
        </div>
      </div>

      {/* KPIs: Revenue */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">Revenue</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={TrendingUp} label={`Provision ${monatsname}`} value={fmt(provisionMonat)}
            sub={`Umsatz: ${fmt(umsatzMonat)}`} color="text-emerald-400" bg="bg-emerald-900/20" href="/admin/buchungen/" />
          <StatCard icon={Megaphone} label="Werbeplatz MRR" value={fmt(gesamtMrr)}
            sub={`${wpAktiv.length} aktive Pakete`} color="text-amber-400" bg="bg-amber-900/20" href="/admin/vermarktung/" />
          <StatCard icon={Flame} label="Sponsored Deals" value={sponsoredAktiv?.length ?? 0}
            sub="aktiv" color="text-orange-400" bg="bg-orange-900/20" href="/admin/sponsored-deals/" />
          <StatCard icon={Clock} label="Offene Auszahlungen" value={fmt(offenBetrag)}
            sub={offenBetrag > 0 ? "ausstehend" : "alles bezahlt"}
            color={offenBetrag > 0 ? "text-red-400" : "text-gray-500"} bg={offenBetrag > 0 ? "bg-red-900/20" : "bg-gray-800"}
            href="/admin/auszahlungen/" />
        </div>
      </div>

      {/* KPIs: Marktplatz */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Marktplatz</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Anbieter" value={anbieterCount ?? 0}
            color="text-blue-400" bg="bg-blue-900/20" href="/admin/anbieter/" />
          <StatCard icon={PackageSearch} label="Aktive Angebote" value={angeboteCount ?? 0}
            color="text-purple-400" bg="bg-purple-900/20" href="/admin/angebote/" />
          <StatCard icon={CalendarCheck} label="Buchungen gesamt" value={buchungenCount ?? 0}
            color="text-teal-400" bg="bg-teal-900/20" href="/admin/buchungen/" />
          <StatCard icon={Euro} label={`Buchungen ${monatsname}`} value={(buchungenMonat as BRow[] ?? []).length}
            sub={`${fmt(umsatzMonat)} Umsatz`} color="text-amber-400" bg="bg-amber-900/20" href="/admin/buchungen/" />
        </div>
      </div>

      {/* KPIs: Content & SEO */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-3">Content & SEO</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={MapPin} label="Destinations mit SEO" value={`${destSeoCount ?? 0} / ${destGesamtCount ?? 0}`}
            sub={`${seoAbdeckung}% Abdeckung`}
            color={seoAbdeckung > 80 ? "text-green-400" : seoAbdeckung > 50 ? "text-yellow-400" : "text-red-400"}
            bg="bg-teal-900/20" href="/admin/destinations/" />
          <StatCard icon={Globe} label="Pages mit SEO-Daten" value={seoMetaCount ?? 0}
            sub="in page_seo_meta" color="text-teal-400" bg="bg-teal-900/20" href="/admin/seo/" />
          <StatCard icon={Newspaper} label="Magazin-Artikel" value={magazinCount ?? 0}
            sub="veröffentlicht" color="text-purple-400" bg="bg-purple-900/20" href="/admin/magazin/" />
          <StatCard icon={FileText} label="SEO-Abdeckung" value={`${seoAbdeckung}%`}
            sub="Destinations" color={seoAbdeckung > 80 ? "text-green-400" : "text-yellow-400"}
            bg="bg-gray-800" href="/admin/destinations/" />
        </div>
      </div>

      {/* Zwei Spalten: Letzte Buchungen + Schnellzugriff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Letzte Buchungen */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white text-sm">Letzte Buchungen</h2>
            <Link href="/admin/buchungen/" className="text-xs text-[#00838F] hover:underline flex items-center gap-1">
              Alle <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {(buchungenDaten ?? []).length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-500 text-sm">Noch keine Buchungen</div>
            ) : (
              (buchungenDaten ?? []).map((b: { buchungs_nummer: string; kunden_name: string; gesamtpreis: number; provision_betrag: number; created_at: string }) => (
                <div key={b.buchungs_nummer} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{b.kunden_name}</p>
                    <p className="text-xs text-gray-500">{b.buchungs_nummer} · {new Date(b.created_at).toLocaleDateString("de-DE")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{Number(b.gesamtpreis).toFixed(2)} €</p>
                    <p className="text-xs text-[#00838F]">+{Number(b.provision_betrag).toFixed(2)} € Provision</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Schnellzugriff */}
        <div className="space-y-3">
          <h2 className="font-bold text-white text-sm px-1">Schnellzugriff</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/vermarktung/",    icon: "💰", label: "Revenue-Übersicht",         color: "border-amber-800/40 hover:border-amber-600" },
              { href: "/admin/werbung/",         icon: "📢", label: "Werbeplatz-Buchungen",       color: "border-gray-800 hover:border-amber-600" },
              { href: "/admin/seo/dashboard/",   icon: "🎯", label: "SEO Command Center",         color: "border-teal-800/40 hover:border-teal-600" },
              { href: "/admin/destinations/",    icon: "🗺️", label: "Destinations-SEO",           color: "border-gray-800 hover:border-teal-600" },
              { href: "/admin/magazin/",         icon: "📰", label: "Magazin",                    color: "border-gray-800 hover:border-purple-600" },
              { href: "/admin/sponsored-deals/", icon: "🔥", label: "Sponsored Deals",            color: "border-gray-800 hover:border-orange-600" },
              { href: "/admin/anbieter/",        icon: "👥", label: "Anbieter",                   color: "border-gray-800 hover:border-blue-600" },
              { href: "/admin/auszahlungen/",    icon: "💳", label: "Auszahlungen",               color: "border-gray-800 hover:border-emerald-600" },
            ].map(({ href, icon, label, color }) => (
              <Link key={href} href={href}
                className={`bg-gray-900 border ${color} rounded-xl p-4 transition-all group flex items-center gap-3`}>
                <span className="text-xl">{icon}</span>
                <p className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors leading-tight">{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
